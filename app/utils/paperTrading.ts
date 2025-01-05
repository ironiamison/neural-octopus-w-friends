'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PositionSide = 'long' | 'short'

export interface Position {
  id: string
  symbol: string
  side: PositionSide
  size: number
  entryPrice: number
  leverage: number
  timestamp: number
  pnl: number
  tokenAddress?: string
}

interface PaperTradingState {
  positions: Position[]
  openPosition: (position: Omit<Position, 'id' | 'timestamp' | 'pnl'>) => void
  closePosition: (id: string) => void
  updatePositions: (prices: Record<string, number>) => void
}

export const usePaperTrading = create<PaperTradingState>()(
  persist(
    (set) => ({
      positions: [],
      openPosition: (position) => set((state) => ({
        positions: [
          ...state.positions,
          {
            ...position,
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
            pnl: 0
          }
        ]
      })),
      closePosition: (id) => set((state) => ({
        positions: state.positions.filter((p) => p.id !== id)
      })),
      updatePositions: (prices) => set((state) => ({
        positions: state.positions.map((pos) => {
          const currentPrice = prices[pos.symbol]
          if (!currentPrice) return pos
          
          const priceDiff = currentPrice - pos.entryPrice
          const pnl = pos.side === 'long'
            ? (priceDiff / pos.entryPrice) * 100 * pos.leverage
            : (-priceDiff / pos.entryPrice) * 100 * pos.leverage
          
          return {
            ...pos,
            pnl
          }
        })
      }))
    }),
    {
      name: 'paper-trading-storage'
    }
  )
) 