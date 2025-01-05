import { PrismaClient } from '@prisma/client';

export interface UserSettings {
  notifications: boolean;
  theme: 'light' | 'dark';
  language: string;
}

export interface LearningStats {
  completedLessons: number;
  totalLessons: number;
  currentLevel: number;
  xp: number;
  xpToNextLevel: number;
  achievements: string[];
}

export interface TradingStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalTrades: number;
  successfulTrades: number;
  profitFactor: number;
  winRate: number;
  achievements: string[];
}

export interface UserProfile {
  id: string;
  walletAddress: string;
  username?: string;
  avatar?: string;
  bio?: string;
  settings: UserSettings;
  learningStats: LearningStats;
  tradingStats: TradingStats;
  createdAt: Date;
  updatedAt: Date;
}

class UserService {
  private prisma: PrismaClient;
  private defaultLearningStats: LearningStats = {
    completedLessons: 0,
    totalLessons: 50,
    currentLevel: 1,
    xp: 0,
    xpToNextLevel: 1000,
    achievements: []
  };

  private defaultTradingStats: TradingStats = {
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    totalTrades: 0,
    successfulTrades: 0,
    profitFactor: 0,
    winRate: 0,
    achievements: []
  };

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getOrCreateProfile(walletAddress: string): Promise<UserProfile> {
    try {
      const existingProfile = await this.getProfile(walletAddress);
      if (existingProfile) {
        return existingProfile;
      }

      // Create new profile if none exists
      const newProfile: Partial<UserProfile> = {
        walletAddress,
        settings: {
          notifications: true,
          theme: 'dark',
          language: 'en'
        },
        learningStats: this.defaultLearningStats,
        tradingStats: this.defaultTradingStats
      };

      return await this.createProfile(newProfile);
    } catch (error) {
      console.error('Error in getOrCreateProfile:', error);
      throw error;
    }
  }

  async getProfile(walletAddress: string): Promise<UserProfile | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { walletAddress }
      });

      if (!user) return null;

      return {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username || undefined,
        avatar: user.avatar || undefined,
        bio: user.bio || undefined,
        settings: user.settings as UserSettings,
        learningStats: user.learningStats as LearningStats,
        tradingStats: user.tradingStats as TradingStats,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  async createProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const user = await this.prisma.user.create({
        data: {
          walletAddress: profile.walletAddress!,
          username: profile.username,
          avatar: profile.avatar,
          bio: profile.bio,
          settings: profile.settings || {
            notifications: true,
            theme: 'dark',
            language: 'en'
          },
          learningStats: profile.learningStats || this.defaultLearningStats,
          tradingStats: profile.tradingStats || this.defaultTradingStats
        }
      });

      return {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username || undefined,
        avatar: user.avatar || undefined,
        bio: user.bio || undefined,
        settings: user.settings as UserSettings,
        learningStats: user.learningStats as LearningStats,
        tradingStats: user.tradingStats as TradingStats,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  async updateProfile(walletAddress: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const user = await this.prisma.user.update({
        where: { walletAddress },
        data: {
          username: updates.username,
          avatar: updates.avatar,
          bio: updates.bio,
          settings: updates.settings,
          learningStats: updates.learningStats,
          tradingStats: updates.tradingStats
        }
      });

      return {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username || undefined,
        avatar: user.avatar || undefined,
        bio: user.bio || undefined,
        settings: user.settings as UserSettings,
        learningStats: user.learningStats as LearningStats,
        tradingStats: user.tradingStats as TradingStats,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async updateLearningProgress(walletAddress: string, lessonId: string): Promise<LearningStats> {
    try {
      const profile = await this.getProfile(walletAddress);
      if (!profile) {
        throw new Error('Profile not found');
      }

      const stats = profile.learningStats;
      stats.completedLessons += 1;
      stats.xp += 100; // Base XP for completing a lesson

      // Level up if enough XP
      if (stats.xp >= stats.xpToNextLevel) {
        stats.currentLevel += 1;
        stats.xp = stats.xp - stats.xpToNextLevel;
        stats.xpToNextLevel = Math.floor(stats.xpToNextLevel * 1.5);
        stats.achievements.push(`Reached Level ${stats.currentLevel}!`);
      }

      await this.updateProfile(walletAddress, { learningStats: stats });
      return stats;
    } catch (error) {
      console.error('Error updating learning progress:', error);
      throw error;
    }
  }

  async updateTradingProgress(walletAddress: string, tradeResult: { successful: boolean; profitPercent: number }): Promise<TradingStats> {
    try {
      const profile = await this.getProfile(walletAddress);
      if (!profile) {
        throw new Error('Profile not found');
      }

      const stats = profile.tradingStats;
      stats.totalTrades += 1;
      if (tradeResult.successful) {
        stats.successfulTrades += 1;
        stats.xp += Math.floor(100 * (1 + tradeResult.profitPercent)); // More XP for more profitable trades
      }

      // Update win rate
      stats.winRate = (stats.successfulTrades / stats.totalTrades) * 100;

      // Update profit factor (simplified)
      stats.profitFactor = stats.winRate / (100 - stats.winRate);

      // Level up if enough XP
      if (stats.xp >= stats.xpToNextLevel) {
        stats.level += 1;
        stats.xp = stats.xp - stats.xpToNextLevel;
        stats.xpToNextLevel = Math.floor(stats.xpToNextLevel * 1.5);
        stats.achievements.push(`Reached Trading Level ${stats.level}!`);

        // Add milestone achievements
        if (stats.totalTrades === 10) {
          stats.achievements.push('First 10 Trades Completed!');
        } else if (stats.totalTrades === 100) {
          stats.achievements.push('Trading Century: 100 Trades!');
        }

        if (stats.winRate >= 60) {
          stats.achievements.push('High Performer: 60%+ Win Rate!');
        }
      }

      await this.updateProfile(walletAddress, { tradingStats: stats });
      return stats;
    } catch (error) {
      console.error('Error updating trading progress:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 