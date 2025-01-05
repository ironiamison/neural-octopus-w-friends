import { PrismaClient, Prisma } from '@prisma/client';
import { ACHIEVEMENTS, XP_REWARDS, TRADING_LEVELS } from '../constants/trading';

const prisma = new PrismaClient();

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  type: 'MARKET' | 'LIMIT';
  side: 'LONG' | 'SHORT';
  size: number;
  leverage: number;
  entryPrice: number;
  exitPrice?: number;
  takeProfit?: number;
  stopLoss?: number;
  pnl?: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  openedAt: Date;
  closedAt?: Date;
}

export interface Position {
  id: string;
  userId: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  leverage: number;
  entryPrice: number;
  markPrice: number;
  liquidationPrice: number;
  unrealizedPnl: number;
  marginUsed: number;
  openedAt: Date;
}

export interface TradingStats {
  totalTrades: number;
  winningTrades: number;
  totalPnl: number;
  bestTrade: number;
  worstTrade: number;
  averageTrade: number;
  winRate: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface Achievement {
  id: string;
  type: string;
  name: string;
  description: string;
  xpReward: number;
  unlockedAt: Date;
}

export class TradingService {
  static async openPosition(userId: string, order: any): Promise<Position> {
    try {
      // Calculate required margin
      const requiredMargin = order.size / order.leverage;

      // Check user's balance
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const portfolio = await prisma.portfolio.findUnique({
        where: { userId }
      });

      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      if (portfolio.balance < requiredMargin) {
        throw new Error('Insufficient balance');
      }

      // Calculate liquidation price
      const liquidationPrice = order.side === 'LONG'
        ? order.price * (1 - 1 / order.leverage)
        : order.price * (1 + 1 / order.leverage);

      // Create position
      const position = await prisma.position.create({
        data: {
          userId,
          symbol: order.symbol,
          side: order.side,
          size: order.size,
          leverage: order.leverage,
          entryPrice: order.price,
          markPrice: order.price,
          liquidationPrice,
          unrealizedPnl: 0,
          marginUsed: requiredMargin
        }
      });

      // Update user's balance
      await prisma.portfolio.update({
        where: { userId },
        data: {
          balance: { decrement: requiredMargin }
        }
      });

      // Award XP for opening a position
      await this.awardXP(userId, XP_REWARDS.TRADE_COMPLETE);

      return position;
    } catch (error) {
      console.error('Error opening position:', error);
      throw error;
    }
  }

  static async closePosition(userId: string, positionId: string, exitPrice: number): Promise<void> {
    try {
      const position = await prisma.position.findUnique({
        where: { id: positionId }
      });

      if (!position) {
        throw new Error('Position not found');
      }

      if (position.userId !== userId) {
        throw new Error('Unauthorized');
      }

      // Calculate PnL
      const pnl = position.side === 'LONG'
        ? (exitPrice - position.entryPrice) * position.size * position.leverage
        : (position.entryPrice - exitPrice) * position.size * position.leverage;

      // Create trade record
      await prisma.trade.create({
        data: {
          userId,
          symbol: position.symbol,
          type: 'MARKET',
          side: position.side,
          size: position.size,
          leverage: position.leverage,
          entryPrice: position.entryPrice,
          exitPrice,
          pnl,
          status: 'CLOSED',
          closedAt: new Date()
        }
      });

      // Update user's balance and delete position
      await prisma.$transaction([
        prisma.portfolio.update({
          where: { userId },
          data: {
            balance: { increment: position.marginUsed + pnl }
          }
        }),
        prisma.position.delete({
          where: { id: positionId }
        })
      ]);

      // Award XP and check achievements
      if (pnl > 0) {
        await this.awardXP(userId, XP_REWARDS.PROFITABLE_TRADE);
      }
      await this.checkAchievements(userId);
    } catch (error) {
      console.error('Error closing position:', error);
      throw error;
    }
  }

  static async getTradingStats(userId: string): Promise<TradingStats> {
    try {
      const trades = await prisma.trade.findMany({
        where: {
          userId,
          status: 'CLOSED'
        }
      });

      const winningTrades = trades.filter(t => (t.pnl || 0) > 0);
      const totalPnl = trades.reduce((acc, t) => acc + (t.pnl || 0), 0);

      let currentStreak = 0;
      let maxStreak = 0;
      let lastWasWin = false;

      trades.forEach(trade => {
        const isWin = (trade.pnl || 0) > 0;
        if (isWin && lastWasWin) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else if (isWin) {
          currentStreak = 1;
          lastWasWin = true;
        } else {
          currentStreak = 0;
          lastWasWin = false;
        }
      });

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const currentLevel = this.calculateLevel(user.totalXp);
      const nextLevelXp = this.calculateXpForNextLevel(user.totalXp);

      return {
        totalTrades: trades.length,
        winningTrades: winningTrades.length,
        totalPnl,
        bestTrade: Math.max(...trades.map(t => t.pnl || 0)),
        worstTrade: Math.min(...trades.map(t => t.pnl || 0)),
        averageTrade: totalPnl / trades.length || 0,
        winRate: (winningTrades.length / trades.length) * 100 || 0,
        currentStreak,
        longestStreak: maxStreak,
        level: currentLevel,
        xp: user.totalXp,
        xpToNextLevel: nextLevelXp
      };
    } catch (error) {
      console.error('Error getting trading stats:', error);
      throw error;
    }
  }

  private static async awardXP(userId: string, amount: number): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const currentLevel = this.calculateLevel(user.totalXp);
      const newXP = user.totalXp + amount;
      const newLevel = this.calculateLevel(newXP);

      await prisma.user.update({
        where: { id: userId },
        data: {
          totalXp: newXP,
          currentLevel: newLevel
        }
      });

      if (newLevel > currentLevel) {
        // Handle level up rewards here
        console.log(`User ${userId} leveled up to ${newLevel}!`);
      }
    } catch (error) {
      console.error('Error awarding XP:', error);
      throw error;
    }
  }

  private static calculateLevel(xp: number): number {
    for (const level of TRADING_LEVELS) {
      if (xp < level.xpRequired) {
        return level.level - 1;
      }
    }
    return TRADING_LEVELS[TRADING_LEVELS.length - 1].level;
  }

  private static calculateXpForNextLevel(currentXP: number): number {
    const currentLevel = this.calculateLevel(currentXP);
    const nextLevel = TRADING_LEVELS.find(l => l.level === currentLevel + 1);
    return nextLevel ? nextLevel.xpRequired : currentXP;
  }

  private static async checkAchievements(userId: string): Promise<void> {
    try {
      const stats = await this.getTradingStats(userId);
      const existingAchievements = await prisma.achievement.findMany({
        where: { userId }
      });

      const unlockedTypes = new Set(existingAchievements.map(a => a.type));

      for (const achievement of ACHIEVEMENTS) {
        if (unlockedTypes.has(achievement.id)) continue;

        let achieved = false;
        switch (achievement.id) {
          case 'first_trade':
            achieved = stats.totalTrades >= 1;
            break;
          case 'profitable_trader':
            achieved = stats.winningTrades >= 10;
            break;
          case 'win_streak':
            achieved = stats.longestStreak >= 3;
            break;
          case 'high_roller':
            achieved = stats.bestTrade >= 1000;
            break;
          case 'comeback_kid':
            achieved = stats.worstTrade <= -5000 && stats.totalPnl > 0;
            break;
        }

        if (achieved) {
          await prisma.achievement.create({
            data: {
              userId,
              type: achievement.id,
              name: achievement.title,
              description: achievement.description,
              xpReward: achievement.xpReward
            }
          });

          await this.awardXP(userId, achievement.xpReward);
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  }
} 