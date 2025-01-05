import { PrismaClient, Prisma } from '@prisma/client';
import {
  cacheLeaderboard,
  getCachedLeaderboard,
  invalidateLeaderboardCache,
} from '../cache';

const prisma = new PrismaClient();

export type TimeFrame = 'all' | 'monthly' | 'weekly' | 'daily';

export interface LeaderboardEntry {
  id: string;
  name: string | null;
  walletAddress: string;
  totalXp: number;
  rank: number;
  winRate: number;
  pnl: number;
  trades: number;
  achievements: number;
  currentLevel: number;
  streak: number;
  phantomProfile?: {
    displayName?: string | null;
    verified: boolean;
  };
}

export class LeaderboardService {
  static async getLeaderboard(timeframe: TimeFrame, page = 1, limit = 100): Promise<LeaderboardEntry[]> {
    try {
      // Try to get from cache first
      const cached = await getCachedLeaderboard(timeframe);
      if (cached) {
        return this.paginateResults(cached, page, limit);
      }

      // If not in cache, fetch from database with Phantom data
      const startDate = this.getStartDate(timeframe);

      // First, get users ordered by XP
      const users = await prisma.$queryRaw<Array<{
        id: string;
        name: string | null;
        walletAddress: string;
        totalXp: number;
        currentLevel: number;
        settings: string;
      }>>`
        SELECT id, name, "walletAddress", "totalXp", "currentLevel", settings
        FROM "User"
        ORDER BY "totalXp" DESC
        LIMIT ${limit}
        OFFSET ${(page - 1) * limit}
      `;

      // Then, get their stats in a separate query
      const userStats = await prisma.$queryRaw<Array<{
        userId: string;
        winRate: number;
        totalPnL: number;
        totalTrades: number;
        currentStreak: number;
      }>>`
        SELECT 
          "userId",
          "winRate",
          "totalPnL",
          "totalTrades",
          "currentStreak"
        FROM "UserStats"
        WHERE "userId" IN (${Prisma.join(users.map(u => u.id))})
      `;

      // Get achievement counts
      const achievements = await prisma.$queryRaw<Array<{
        userId: string;
        count: number;
      }>>`
        SELECT 
          "userId",
          COUNT(*) as count
        FROM "UserAchievement"
        WHERE "userId" IN (${Prisma.join(users.map(u => u.id))})
        GROUP BY "userId"
      `;

      // Create a map for quick lookups
      const statsMap = new Map(userStats.map(stat => [stat.userId, stat]));
      const achievementsMap = new Map(achievements.map(a => [a.userId, a.count]));

      const leaderboard = users.map((user, index) => {
        const stats = statsMap.get(user.id);
        const achievementCount = achievementsMap.get(user.id) || 0;
        const settings = JSON.parse(user.settings);
        const phantomProfile = settings.phantomProfile || { displayName: null, verified: false };

        return {
          id: user.id,
          name: user.name,
          walletAddress: user.walletAddress,
          totalXp: user.totalXp,
          rank: (page - 1) * limit + index + 1,
          winRate: stats?.winRate || 0,
          pnl: stats?.totalPnL || 0,
          trades: stats?.totalTrades || 0,
          achievements: Number(achievementCount),
          currentLevel: user.currentLevel,
          streak: stats?.currentStreak || 0,
          phantomProfile: {
            displayName: phantomProfile.displayName || user.name,
            verified: phantomProfile.verified
          }
        };
      });

      // Cache the results
      await cacheLeaderboard(timeframe, leaderboard);

      return leaderboard;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error('Failed to fetch leaderboard');
    }
  }

  static async updateUserStats(userId: string, tradeResult: {
    pnl: number;
    isWin: boolean;
    size: number;
  }): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        // Get user and stats in a single query
        const [user, stats] = await Promise.all([
          tx.$queryRaw<Array<{
            id: string;
            totalXp: number;
            currentLevel: number;
          }>>`
            SELECT id, "totalXp", "currentLevel"
            FROM "User"
            WHERE id = ${userId}
            LIMIT 1
          `,
          tx.$queryRaw<Array<{
            userId: string;
            totalTrades: number;
            winningTrades: number;
            currentStreak: number;
            bestStreak: number;
          }>>`
            SELECT *
            FROM "UserStats"
            WHERE "userId" = ${userId}
            LIMIT 1
          `
        ]);

        if (!user[0]) {
          throw new Error('User not found');
        }

        const currentUser = user[0];
        const currentStats = stats[0];

        // Create or update stats
        if (!currentStats) {
          await tx.$executeRaw`
            INSERT INTO "UserStats" (
              "userId", "totalTrades", "winningTrades", "totalPnL",
              "currentStreak", "bestStreak", "winRate"
            )
            VALUES (
              ${userId}, 1,
              ${tradeResult.isWin ? 1 : 0},
              ${tradeResult.pnl},
              ${tradeResult.isWin ? 1 : 0},
              ${tradeResult.isWin ? 1 : 0},
              ${tradeResult.isWin ? 100 : 0}
            )
          `;
        } else {
          const newStreak = tradeResult.isWin ? (currentStats.currentStreak + 1) : 0;
          const newBestStreak = Math.max(newStreak, currentStats.bestStreak);
          const newWinningTrades = currentStats.winningTrades + (tradeResult.isWin ? 1 : 0);
          const newTotalTrades = currentStats.totalTrades + 1;

          await tx.$executeRaw`
            UPDATE "UserStats"
            SET
              "totalTrades" = "totalTrades" + 1,
              "winningTrades" = ${newWinningTrades},
              "totalPnL" = "totalPnL" + ${tradeResult.pnl},
              "currentStreak" = ${newStreak},
              "bestStreak" = ${newBestStreak},
              "winRate" = ${(newWinningTrades / newTotalTrades) * 100}
            WHERE "userId" = ${userId}
          `;
        }

        // Calculate new XP and level
        const xpGained = this.calculateXPForTrade(tradeResult);
        const newTotalXp = currentUser.totalXp + xpGained;
        const shouldLevelUp = this.shouldLevelUp(newTotalXp, currentUser.currentLevel);
        
        // Update user XP and level
        await tx.$executeRaw`
          UPDATE "User"
          SET
            "totalXp" = ${newTotalXp},
            "currentLevel" = ${shouldLevelUp ? currentUser.currentLevel + 1 : currentUser.currentLevel}
          WHERE id = ${userId}
        `;
      });

      // Invalidate cache since rankings have changed
      await invalidateLeaderboardCache();
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw new Error('Failed to update user stats');
    }
  }

  private static calculateXPForTrade(tradeResult: {
    pnl: number;
    isWin: boolean;
    size: number;
  }): number {
    let xp = 0;
    
    // Base XP for completing a trade
    xp += 10;
    
    // Bonus XP for winning trade
    if (tradeResult.isWin) {
      xp += 25;
      
      // Additional XP based on PnL percentage
      const pnlPercentage = (tradeResult.pnl / tradeResult.size) * 100;
      xp += Math.floor(pnlPercentage * 2);
    }
    
    return xp;
  }

  private static shouldLevelUp(newXp: number, currentLevel: number): boolean {
    const xpRequiredForNextLevel = currentLevel * 1000; // Each level requires more XP
    return newXp >= xpRequiredForNextLevel;
  }

  private static getStartDate(timeframe: TimeFrame): Date | null {
    if (timeframe === 'all') return null;
    
    const now = new Date();
    switch (timeframe) {
      case 'daily':
        return new Date(now.setHours(0, 0, 0, 0));
      case 'weekly':
        return new Date(now.setDate(now.getDate() - 7));
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() - 1));
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