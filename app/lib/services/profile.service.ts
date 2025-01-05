import prisma from '../mongodb';
import { Trade, User } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const XP_PER_LEVEL = 1000; // Base XP needed per level
const LEVEL_SCALING = 1.5;  // How much more XP each level needs

interface TradeWithPnL extends Omit<Trade, 'pnl'> {
  pnl?: number | null;
}

export class ProfileService {
  static async addXP(userId: string, amount: number): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new Error('User not found');

    const newXP = user.totalXp + amount;
    const newLevel = this.calculateLevel(newXP);
    const leveledUp = newLevel > user.currentLevel;

    await prisma.user.update({
      where: { id: userId },
      data: {
        totalXp: newXP,
        currentLevel: newLevel
      }
    });

    if (leveledUp) {
      // TODO: Implement level-up rewards
      console.log(`User ${userId} leveled up to ${newLevel}!`);
    }
  }

  static calculateLevel(xp: number): number {
    let level = 1;
    let xpNeeded = XP_PER_LEVEL;
    let totalXpNeeded = xpNeeded;

    while (xp >= totalXpNeeded) {
      level++;
      xpNeeded = Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_SCALING, level - 1));
      totalXpNeeded += xpNeeded;
    }

    return level;
  }

  static async updateTradingStats(userId: string, trade: TradeWithPnL): Promise<void> {
    const stats = await prisma.tradingStats.findUnique({
      where: { userId }
    });

    if (!stats) {
      // Create initial stats
      await prisma.tradingStats.create({
        data: {
          userId,
          totalTrades: 1,
          winningTrades: trade.pnl && trade.pnl > 0 ? 1 : 0,
          totalPnl: trade.pnl || 0,
          bestTrade: trade.pnl && trade.pnl > 0 ? trade.pnl : 0,
          worstTrade: trade.pnl && trade.pnl < 0 ? trade.pnl : 0,
          averageTrade: trade.pnl || 0,
          winRate: trade.pnl && trade.pnl > 0 ? 100 : 0,
          currentStreak: trade.pnl && trade.pnl > 0 ? 1 : 0,
          longestStreak: trade.pnl && trade.pnl > 0 ? 1 : 0
        }
      });
      return;
    }

    const isWin = trade.pnl && trade.pnl > 0;
    const newCurrentStreak = isWin ? stats.currentStreak + 1 : 0;
    const newLongestStreak = Math.max(stats.longestStreak, newCurrentStreak);

    await prisma.tradingStats.update({
      where: { userId },
      data: {
        totalTrades: stats.totalTrades + 1,
        winningTrades: isWin ? stats.winningTrades + 1 : stats.winningTrades,
        totalPnl: stats.totalPnl + (trade.pnl || 0),
        bestTrade: Math.max(stats.bestTrade, trade.pnl || 0),
        worstTrade: Math.min(stats.worstTrade, trade.pnl || 0),
        averageTrade: (stats.totalPnl + (trade.pnl || 0)) / (stats.totalTrades + 1),
        winRate: ((stats.winningTrades + (isWin ? 1 : 0)) / (stats.totalTrades + 1)) * 100,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak
      }
    });

    // Award XP based on performance
    let xpEarned = 0;
    if (isWin) {
      xpEarned += 50; // Base XP for winning trade
      if (trade.pnl && trade.pnl > 1000) xpEarned += 100; // Bonus for big wins
      if (newCurrentStreak > 2) xpEarned += 25 * newCurrentStreak; // Streak bonus
    }

    if (xpEarned > 0) {
      await this.addXP(userId, xpEarned);
    }
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolio: true,
        tradingStats: true,
        achievements: true,
        trades: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!user) throw new Error('User not found');

    const nextLevelXP = this.calculateXPForNextLevel(user.totalXp);

    return {
      ...user,
      nextLevelXP,
      xpProgress: (user.totalXp - this.calculateTotalXPForLevel(user.currentLevel)) / nextLevelXP * 100
    };
  }

  private static calculateXPForNextLevel(currentXP: number): number {
    const currentLevel = this.calculateLevel(currentXP);
    return Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_SCALING, currentLevel - 1));
  }

  private static calculateTotalXPForLevel(level: number): number {
    let totalXP = 0;
    for (let i = 1; i < level; i++) {
      totalXP += Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_SCALING, i - 1));
    }
    return totalXP;
  }
} 