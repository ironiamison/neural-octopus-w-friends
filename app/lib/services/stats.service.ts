'use server';

import { cache } from 'react'
import { get, set } from '@/lib/redis'
import { jupiterApi } from '@/lib/jupiter'
import type { AxiosResponse } from 'axios'

const REDIS_KEYS = {
  MARKET_STATS: 'market_stats',
  TRENDING_COINS: 'trending_coins',
  FEATURE_STATS: 'feature_stats'
} as const;

export interface MarketStats {
  tradingVolume24h: number
  activeTraders: number
  totalTrades: number
  executionRate: number
}

export interface TrendingCoin {
  symbol: string
  name: string
  price: number
  priceChange24h: number
  volume24h: number
  logoUrl: string
}

interface JupiterCoinData {
  symbol: string
  name: string
  price: number
  price_change_24h: number
  volume_24h: number
  logo_url: string
}

interface JupiterPriceResponse {
  data: Array<JupiterCoinData>
}

// Cache market stats for 5 minutes
export const getMarketStats = cache(async (): Promise<MarketStats> => {
  const cachedStats = await get(REDIS_KEYS.MARKET_STATS)
  if (cachedStats) {
    try {
      return JSON.parse(cachedStats) as MarketStats
    } catch (error) {
      console.error('Failed to parse cached market stats:', error)
    }
  }

  // Return mock data for now
  const stats: MarketStats = {
    tradingVolume24h: 1234567,
    activeTraders: 789,
    totalTrades: 12345,
    executionRate: 98.5
  }

  try {
    await set(REDIS_KEYS.MARKET_STATS, JSON.stringify(stats), { ex: 300 })
  } catch (error) {
    console.error('Failed to cache market stats:', error)
  }
  return stats
})

// Cache trending coins for 1 minute
export const getTrendingCoins = cache(async (): Promise<TrendingCoin[]> => {
  const cachedCoins = await get(REDIS_KEYS.TRENDING_COINS)
  if (cachedCoins) {
    try {
      return JSON.parse(cachedCoins) as TrendingCoin[]
    } catch (error) {
      console.error('Failed to parse cached trending coins:', error)
    }
  }

  // Return mock data for now
  const coins: TrendingCoin[] = [
    {
      symbol: "BONK",
      name: "Bonk",
      price: 0.00001234,
      priceChange24h: 15.6,
      volume24h: 1234567,
      logoUrl: "/coins/bonk.png"
    },
    {
      symbol: "WIF",
      name: "Wif",
      price: 0.00002345,
      priceChange24h: -5.2,
      volume24h: 987654,
      logoUrl: "/coins/wif.png"
    },
    {
      symbol: "MYRO",
      name: "Myro",
      price: 0.00003456,
      priceChange24h: 25.8,
      volume24h: 456789,
      logoUrl: "/coins/myro.png"
    }
  ]

  try {
    await set(REDIS_KEYS.TRENDING_COINS, JSON.stringify(coins), { ex: 60 })
  } catch (error) {
    console.error('Failed to cache trending coins:', error)
  }
  return coins
})

export interface FeatureStats {
  aiPredictions: {
    total: number
    accuracy: number
  }
  analytics: {
    activeUsers: number
    reportsGenerated: number
  }
  paperTrading: {
    totalUsers: number
    tradesExecuted: number
  }
}

// Cache feature stats for 1 hour
export const getFeatureStats = cache(async (): Promise<FeatureStats> => {
  const cachedStats = await get(REDIS_KEYS.FEATURE_STATS)
  if (cachedStats) {
    try {
      return JSON.parse(cachedStats) as FeatureStats
    } catch (error) {
      console.error('Failed to parse cached feature stats:', error)
    }
  }

  // Return mock data for now
  const stats: FeatureStats = {
    aiPredictions: {
      total: 5678,
      accuracy: 85.4
    },
    analytics: {
      activeUsers: 1234,
      reportsGenerated: 4567
    },
    paperTrading: {
      totalUsers: 3456,
      tradesExecuted: 23456
    }
  }

  try {
    await set(REDIS_KEYS.FEATURE_STATS, JSON.stringify(stats), { ex: 3600 })
  } catch (error) {
    console.error('Failed to cache feature stats:', error)
  }
  return stats
}) 