import { Redis } from 'ioredis';
import { PrismaClient } from '@prisma/client';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

const prisma = new PrismaClient();

const CACHE_TTL = {
  LEADERBOARD: 60 * 5, // 5 minutes
  USER_PROFILE: 60 * 15, // 15 minutes
  ACHIEVEMENTS: 60 * 60, // 1 hour
  USER_STATS: 60 * 5, // 5 minutes
  TRADING_PAIRS: 60 * 1, // 1 minute
};

export async function cacheLeaderboard(timeframe: string, data: any) {
  const key = `leaderboard:${timeframe}`;
  await redis.setex(key, CACHE_TTL.LEADERBOARD, JSON.stringify(data));
}

export async function getCachedLeaderboard(timeframe: string) {
  const key = `leaderboard:${timeframe}`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheUserProfile(userId: string, data: any) {
  const key = `user:${userId}:profile`;
  await redis.setex(key, CACHE_TTL.USER_PROFILE, JSON.stringify(data));
}

export async function getCachedUserProfile(userId: string) {
  const key = `user:${userId}:profile`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheUserAchievements(userId: string, data: any) {
  const key = `user:${userId}:achievements`;
  await redis.setex(key, CACHE_TTL.ACHIEVEMENTS, JSON.stringify(data));
}

export async function getCachedUserAchievements(userId: string) {
  const key = `user:${userId}:achievements`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheUserStats(userId: string, data: any) {
  const key = `user:${userId}:stats`;
  await redis.setex(key, CACHE_TTL.USER_STATS, JSON.stringify(data));
}

export async function getCachedUserStats(userId: string) {
  const key = `user:${userId}:stats`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function cacheTradingPairs(data: any) {
  await redis.setex('trading:pairs', CACHE_TTL.TRADING_PAIRS, JSON.stringify(data));
}

export async function getCachedTradingPairs() {
  const cached = await redis.get('trading:pairs');
  return cached ? JSON.parse(cached) : null;
}

// Cache invalidation functions
export async function invalidateUserCache(userId: string) {
  const keys = [
    `user:${userId}:profile`,
    `user:${userId}:achievements`,
    `user:${userId}:stats`,
  ];
  await redis.del(...keys);
}

export async function invalidateLeaderboardCache() {
  const keys = ['leaderboard:all', 'leaderboard:monthly', 'leaderboard:weekly', 'leaderboard:daily'];
  await redis.del(...keys);
}

// Warm up cache functions
export async function warmUpLeaderboardCache() {
  const timeframes = ['all', 'monthly', 'weekly', 'daily'];
  
  for (const timeframe of timeframes) {
    const data = await prisma.user.findMany({
      take: 100,
      orderBy: { rankPoints: 'desc' },
      include: {
        stats: true,
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });
    
    await cacheLeaderboard(timeframe, data);
  }
}

export async function warmUpTradingPairsCache() {
  const pairs = await prisma.trade.findMany({
    distinct: ['pair'],
    select: { pair: true },
  });
  
  await cacheTradingPairs(pairs);
}

// Health check function
export async function checkCacheHealth() {
  try {
    await redis.ping();
    return { status: 'healthy', message: 'Cache is operational' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
}

// Memory management
export async function clearOldCache() {
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