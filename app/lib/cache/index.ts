'use server';

import { getRedisClient } from '@/lib/redis'
import { PrismaClient, Prisma, User, Position, Trade, Achievement, Portfolio } from '@prisma/client'
import prisma from '@/lib/mongodb'

interface LeaderboardEntry {
  id: string
  username: string
  walletAddress: string
  totalXp: number
  currentLevel: number
  portfolio: Portfolio | null
  achievements: Achievement[]
}

interface TradingPair {
  symbol: string
  volume24h?: number
  price?: number
  change24h?: number
}

const CACHE_TTL = {
  LEADERBOARD: 60 * 5, // 5 minutes
  USER_PROFILE: 60 * 15, // 15 minutes
  ACHIEVEMENTS: 60 * 60, // 1 hour
  USER_STATS: 60 * 5, // 5 minutes
  TRADING_PAIRS: 60 * 1, // 1 minute
}

export async function cacheLeaderboard(timeframe: string, data: LeaderboardEntry[]) {
  const redis = getRedisClient();
  const key = `leaderboard:${timeframe}`;
  await redis.set(key, JSON.stringify(data), { ex: CACHE_TTL.LEADERBOARD });
}

export async function getCachedLeaderboard(timeframe: string): Promise<LeaderboardEntry[] | null> {
  const redis = getRedisClient();
  const key = `leaderboard:${timeframe}`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheUserProfile(userId: string, data: User & { portfolio: Portfolio | null }) {
  const redis = getRedisClient();
  const key = `user:${userId}:profile`;
  await redis.set(key, JSON.stringify(data), { ex: CACHE_TTL.USER_PROFILE });
}

export async function getCachedUserProfile(userId: string): Promise<(User & { portfolio: Portfolio | null }) | null> {
  const redis = getRedisClient();
  const key = `user:${userId}:profile`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheUserAchievements(userId: string, data: Achievement[]) {
  const redis = getRedisClient();
  const key = `user:${userId}:achievements`;
  await redis.set(key, JSON.stringify(data), { ex: CACHE_TTL.ACHIEVEMENTS });
}

export async function getCachedUserAchievements(userId: string): Promise<Achievement[] | null> {
  const redis = getRedisClient();
  const key = `user:${userId}:achievements`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheUserStats(userId: string, data: { trades: Trade[], positions: Position[] }) {
  const redis = getRedisClient();
  const key = `user:${userId}:stats`;
  await redis.set(key, JSON.stringify(data), { ex: CACHE_TTL.USER_STATS });
}

export async function getCachedUserStats(userId: string): Promise<{ trades: Trade[], positions: Position[] } | null> {
  const redis = getRedisClient();
  const key = `user:${userId}:stats`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheTradingPairs(data: TradingPair[]) {
  const redis = getRedisClient();
  await redis.set('trading:pairs', JSON.stringify(data), { ex: CACHE_TTL.TRADING_PAIRS });
}

export async function getCachedTradingPairs(): Promise<TradingPair[] | null> {
  const redis = getRedisClient();
  const cached = await redis.get('trading:pairs');
  return cached ? JSON.parse(cached) : null;
}

// Cache invalidation functions
export async function invalidateUserCache(userId: string) {
  const redis = getRedisClient();
  const keys = [
    `user:${userId}:profile`,
    `user:${userId}:achievements`,
    `user:${userId}:stats`,
  ];
  for (const key of keys) {
    await redis.del(key);
  }
}

export async function invalidateLeaderboardCache() {
  const redis = getRedisClient();
  const keys = ['leaderboard:all', 'leaderboard:monthly', 'leaderboard:weekly', 'leaderboard:daily'];
  for (const key of keys) {
    await redis.del(key);
  }
}

// Warm up cache functions
export async function warmUpLeaderboardCache() {
  const timeframes = ['all', 'monthly', 'weekly', 'daily'];
  
  for (const timeframe of timeframes) {
    const users = await prisma.user.findMany({
      take: 100,
      orderBy: {
        totalXp: 'desc'
      },
      include: {
        portfolio: true,
        achievements: true,
      },
    });
    
    const leaderboard = users.map(user => ({
      id: user.id,
      username: user.username,
      walletAddress: user.walletAddress,
      totalXp: user.totalXp,
      currentLevel: user.currentLevel,
      portfolio: user.portfolio,
      achievements: user.achievements,
    }));
    
    await cacheLeaderboard(timeframe, leaderboard);
  }
}

export async function warmUpTradingPairsCache() {
  const positions = await prisma.position.findMany({
    distinct: ['symbol'],
    select: {
      symbol: true,
    },
  });
  
  const pairs: TradingPair[] = positions.map(pos => ({
    symbol: pos.symbol,
  }));
  
  await cacheTradingPairs(pairs);
}

// Health check function
export async function checkCacheHealth() {
  const redis = getRedisClient();
  try {
    await redis.ping();
    return { status: 'healthy', message: 'Cache is operational' };
  } catch (error) {
    return { status: 'unhealthy', message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Memory management
export async function clearOldCache() {
  const redis = getRedisClient();
  const keys = await redis.keys('*');
  for (const key of keys) {
    const ttl = await redis.ttl(key);
    if (ttl <= 0) {
      await redis.del(key);
    }
  }
}

// Initialize cache system
export async function initializeCache() {
  try {
    await checkCacheHealth();
    await clearOldCache();
    await warmUpLeaderboardCache();
    await warmUpTradingPairsCache();
    console.log('Cache system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize cache system:', error);
  }
} 