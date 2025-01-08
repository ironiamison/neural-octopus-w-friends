'use server';

import prisma from '@/lib/mongodb';
import { getRedisValue, setRedisValue } from './redis';
import type { User, Trade, Achievement, Portfolio, Prisma } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';

export interface UserData {
  id: string;
  walletAddress: string;
  username: string;
  currentLevel: number;
  totalXp: number;
  portfolio: {
    balance: number;
  } | null;
  totalTrades: number;
  winningTrades: number;
  totalPnl: number;
  winRate: number;
  bestTrade: number;
  totalLessonsCompleted: number;
  achievements: Array<{
    name: string;
    unlockedAt: Date;
  }>;
}

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    portfolio: true;
    achievements: true;
    trades: true;
    positions: true;
  };
}>;

export async function getUserByWalletAddress(walletAddress: string): Promise<UserData | null> {
  try {
    if (!walletAddress) {
      console.error('No wallet address provided');
      return null;
    }

    // Try to get from cache first
    const cached = await getRedisValue(`user:${walletAddress}`);
    if (cached && typeof cached === 'string') {
      try {
        return JSON.parse(cached) as UserData;
      } catch (parseError) {
        console.error('Error parsing cached user data:', parseError);
        // Continue to fetch fresh data
      }
    }

    // If not in cache, fetch from database
    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        portfolio: true,
        achievements: true,
        trades: {
          where: {
            closedAt: {
              not: undefined
            }
          }
        },
        positions: {
          where: {
            status: 'closed'
          }
        }
      }
    }) as UserWithRelations | null;

    if (!user) {
      console.error('User not found:', walletAddress);
      return null;
    }

    // Calculate stats
    const trades = user.trades;
    const winningTrades = trades.filter((trade: Trade) => (trade.pnl || 0) > 0).length;
    const totalPnl = trades.reduce((sum: number, trade: Trade) => sum + (trade.pnl || 0), 0);
    const bestTrade = trades.length > 0 ? Math.max(...trades.map((trade: Trade) => trade.pnl || 0)) : 0;
    const winRate = trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;

    const userData: UserData = {
      id: user.id,
      walletAddress: user.walletAddress,
      username: user.username,
      currentLevel: user.currentLevel,
      totalXp: user.totalXp,
      portfolio: user.portfolio,
      totalTrades: trades.length,
      winningTrades,
      totalPnl,
      winRate,
      bestTrade,
      totalLessonsCompleted: 0, // TODO: Implement lessons system
      achievements: user.achievements.map((achievement: Achievement) => ({
        name: achievement.name,
        unlockedAt: achievement.unlockedAt
      }))
    };

    // Cache the result for 5 minutes
    try {
      await setRedisValue(`user:${walletAddress}`, JSON.stringify(userData), { ex: 300 });
    } catch (cacheError) {
      console.error('Error caching user data:', cacheError);
      // Continue even if caching fails
    }

    return userData;
  } catch (error) {
    console.error('Error in getUserByWalletAddress:', error);
    Sentry.captureException(error, {
      tags: {
        walletAddress,
        operation: 'getUserByWalletAddress'
      }
    });
    return null;
  }
} 