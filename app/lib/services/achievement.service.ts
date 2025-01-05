import { PrismaClient } from '@prisma/client';
import {
  cacheUserAchievements,
  getCachedUserAchievements,
  invalidateUserCache,
} from '../cache';

const prisma = new PrismaClient();

export type AchievementCategory =
  | 'trading'
  | 'learning'
  | 'social'
  | 'streak'
  | 'milestone'
  | 'special';

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  icon: string;
  target: number;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  progress: number;
  completed: boolean;
  completedAt?: Date;
  achievement: Achievement;
}

export class AchievementService {
  static async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    try {
      // Try to get from cache first
      const cached = await getCachedUserAchievements(userId);
      if (cached) {
        return cached;
      }

      // If not in cache, fetch from database
      const achievements = await prisma.userAchievement.findMany({
        where: { userId },
        include: {
          achievement: true,
        },
      });

      // Cache the results
      await cacheUserAchievements(userId, achievements);

      return achievements;
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      throw new Error('Failed to fetch user achievements');
    }
  }

  static async updateAchievementProgress(
    userId: string,
    achievementId: string,
    progress: number
  ): Promise<void> {
    try {
      const achievement = await prisma.achievement.findUnique({
        where: { id: achievementId },
      });

      if (!achievement) {
        throw new Error('Achievement not found');
      }

      const userAchievement = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId,
          },
        },
      });

      const completed = progress >= achievement.target;

      if (userAchievement) {
        await prisma.userAchievement.update({
          where: {
            userId_achievementId: {
              userId,
              achievementId,
            },
          },
          data: {
            progress,
            completed,
            completedAt: completed && !userAchievement.completed ? new Date() : undefined,
          },
        });
      } else {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId,
            progress,
            completed,
            completedAt: completed ? new Date() : undefined,
          },
        });
      }

      // If achievement is completed, update user's rank points
      if (completed && (!userAchievement || !userAchievement.completed)) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            rankPoints: { increment: achievement.points },
            xp: { increment: achievement.points * 10 }, // XP is 10x points
          },
        });
      }

      // Invalidate user cache since achievements have changed
      await invalidateUserCache(userId);
    } catch (error) {
      console.error('Error updating achievement progress:', error);
      throw new Error('Failed to update achievement progress');
    }
  }

  static async checkAchievements(userId: string): Promise<Achievement[]> {
    try {
      const unlockedAchievements: Achievement[] = [];
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          stats: true,
          achievements: {
            include: {
              achievement: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get all achievements that the user hasn't completed
      const achievements = await prisma.achievement.findMany({
        where: {
          NOT: {
            userAchievements: {
              some: {
                userId,
                completed: true,
              },
            },
          },
        },
      });

      for (const achievement of achievements) {
        let progress = 0;

        // Calculate progress based on achievement category and conditions
        switch (achievement.category) {
          case 'trading':
            progress = this.calculateTradingProgress(achievement, user);
            break;
          case 'learning':
            progress = this.calculateLearningProgress(achievement, user);
            break;
          case 'social':
            progress = this.calculateSocialProgress(achievement, user);
            break;
          case 'streak':
            progress = this.calculateStreakProgress(achievement, user);
            break;
          case 'milestone':
            progress = this.calculateMilestoneProgress(achievement, user);
            break;
        }

        // If progress has been made, update it
        if (progress > 0) {
          await this.updateAchievementProgress(userId, achievement.id, progress);
          if (progress >= achievement.target) {
            unlockedAchievements.push(achievement);
          }
        }
      }

      return unlockedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw new Error('Failed to check achievements');
    }
  }

  private static calculateTradingProgress(achievement: Achievement, user: any): number {
    const stats = user.stats;
    if (!stats) return 0;

    switch (achievement.name) {
      case 'First Trade':
        return stats.totalTrades > 0 ? 1 : 0;
      case 'Trading Novice':
        return Math.min(stats.totalTrades, 100);
      case 'Trading Master':
        return Math.min(stats.totalTrades, 1000);
      case 'Profitable Trader':
        return stats.totalPnL > 0 ? stats.profitableTrades : 0;
      case 'Win Streak':
        return stats.currentStreak;
      default:
        return 0;
    }
  }

  private static calculateLearningProgress(achievement: Achievement, user: any): number {
    switch (achievement.name) {
      case 'Learning Enthusiast':
        return user.completedLessons || 0;
      case 'Knowledge Seeker':
        return user.quizScore || 0;
      default:
        return 0;
    }
  }

  private static calculateSocialProgress(achievement: Achievement, user: any): number {
    switch (achievement.name) {
      case 'Community Member':
        return user.followers?.length || 0;
      case 'Helpful Trader':
        return user.posts?.length || 0;
      default:
        return 0;
    }
  }

  private static calculateStreakProgress(achievement: Achievement, user: any): number {
    const stats = user.stats;
    if (!stats) return 0;

    switch (achievement.name) {
      case 'Daily Trader':
        return stats.currentStreak;
      case 'Weekly Warrior':
        return Math.floor(stats.currentStreak / 7);
      default:
        return 0;
    }
  }

  private static calculateMilestoneProgress(achievement: Achievement, user: any): number {
    switch (achievement.name) {
      case 'Level Up':
        return user.level;
      case 'XP Milestone':
        return user.xp;
      default:
        return 0;
    }
  }
} 