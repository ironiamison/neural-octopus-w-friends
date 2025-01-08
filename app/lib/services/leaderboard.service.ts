'use server';

import { cache } from 'react'
import { getRedisClient } from '@/lib/redis'

export interface Trader {
  username: string
  avatar: string
  winRate: number
  pnl: number
  trades: number
  streak: number
}

// Cache leaderboard data for 5 minutes
export const getTopTraders = cache(async (): Promise<Trader[]> => {
  const redis = getRedisClient();
  const cachedTraders = await redis.get('top_traders')
  if (cachedTraders) {
    return JSON.parse(cachedTraders) as Trader[]
  }

  // For now, return mock data until we have real data
  const traders: Trader[] = [
    {
      username: "CryptoWhale",
      avatar: "/placeholder.png",
      winRate: 92.5,
      pnl: 145890,
      trades: 234,
      streak: 12
    },
    {
      username: "DiamondHands",
      avatar: "/placeholder.png",
      winRate: 88.3,
      pnl: 98450,
      trades: 189,
      streak: 8
    },
    {
      username: "MoonShooter",
      avatar: "/placeholder.png",
      winRate: 85.7,
      pnl: 76540,
      trades: 156,
      streak: 6
    },
    {
      username: "AlphaTrader",
      avatar: "/placeholder.png",
      winRate: 83.2,
      pnl: 65230,
      trades: 142,
      streak: 5
    },
    {
      username: "SolanaKing",
      avatar: "/placeholder.png",
      winRate: 81.9,
      pnl: 54320,
      trades: 128,
      streak: 4
    },
    {
      username: "MemeWizard",
      avatar: "/placeholder.png",
      winRate: 79.5,
      pnl: 43210,
      trades: 115,
      streak: 3
    }
  ]

  await redis.set('top_traders', JSON.stringify(traders), { ex: 300 })
  return traders
}) 