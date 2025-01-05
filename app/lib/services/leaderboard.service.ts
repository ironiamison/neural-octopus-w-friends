import { PrismaClient } from '@prisma/client';
import {
  cacheLeaderboard,
  getCachedLeaderboard,
  invalidateLeaderboardCache,
} from '../cache';

const prisma = new PrismaClient();

export type TimeFrame = 'all' | 'monthly' | 'weekly' | 'daily';

export interface LeaderboardEntry {
  id: string;
  username: string;
  rankPoints: number;
  rank: number;
  winRate: number;
  pnl: number;
  trades: number;
  achievements: number;
  level: number;
  xp: number;
  streak: number;
}

export class LeaderboardService {
  static async getLeaderboard(timeframe: TimeFrame, page = 1, limit = 100): Promise<LeaderboardEntry[]> {
    try {
      // Try to get from cache first
      const cached = await getCachedLeaderboard(timeframe);
      if (cached) {
        return this.paginateResults(cached, page, limit);
      }

      // If not in cache, fetch from database
      const startDate = this.getStartDate(timeframe);
      const users = await prisma.user.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { rankPoints: 'desc' },
        include: {
          stats: true,
          achievements: {
            include: {
              achievement: true,
            },
          },
        },
        where: startDate ? {
          stats: {
            updatedAt: {
              gte: startDate,
            },
          },
        } : undefined,
      });

      const leaderboard = users.map((user, index) => ({
        id: user.id,
        username: user.username,
        rankPoints: user.rankPoints,
        rank: (page - 1) * limit + index + 1,
        winRate: user.stats?.winRate || 0,
        pnl: user.stats?.totalPnL || 0,
        trades: user.stats?.totalTrades || 0,
        achievements: user.achievements.length,
        level: user.level,
        xp: user.xp,
        streak: user.stats?.currentStreak || 0,
      }));

      // Cache the results
      await cacheLeaderboard(timeframe, leaderboard);

      return leaderboard;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error('Failed to fetch leaderboard');
    }
  }

  static async getUserRank(userId: string, timeframe: TimeFrame): Promise<number> {
    try {
      const startDate = this.getStartDate(timeframe);
      const userRank = await prisma.user.count({
        where: {
          rankPoints: {
            gt: (
              await prisma.user.findUnique({
                where: { id: userId },
                select: { rankPoints: true },
              })
            )?.rankPoints || 0,
          },
          ...(startDate && {
            stats: {
              updatedAt: {
                gte: startDate,
              },
            },
          }),
        },
      });

      return userRank + 1;
    } catch (error) {
      console.error('Error fetching user rank:', error);
      throw new Error('Failed to fetch user rank');
    }
  }

  static async updateRankPoints(userId: string, points: number): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { rankPoints: { increment: points } },
      });

      // Invalidate cache since rankings have changed
      await invalidateLeaderboardCache();
    } catch (error) {
      console.error('Error updating rank points:', error);
      throw new Error('Failed to update rank points');
    }
  }

  private static getStartDate(timeframe: TimeFrame): Date | null {
    const now = new Date();
    switch (timeframe) {
      case 'daily':
        return new Date(now.setHours(0, 0, 0, 0));
      case 'weekly':
        return new Date(now.setDate(now.getDate() - now.getDay()));
      case 'monthly':
        return new Date(now.setDate(1));
      default:
        return null;
    }
  }

  private static paginateResults(results: LeaderboardEntry[], page: number, limit: number): LeaderboardEntry[] {
    const start = (page - 1) * limit;
    const end = start + limit;
    return results.slice(start, end);
  }
} 