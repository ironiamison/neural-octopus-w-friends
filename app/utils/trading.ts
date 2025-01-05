'use client'

import { create } from 'zustand'

interface Position {
  id: string
  pair: string
  type: 'long' | 'short'
  entryPrice: number
  size: number
  leverage: number
  margin: number
  liquidationPrice: number
  pnl: number
  pnlPercent: number
  timestamp: number
}

interface Trade {
  id: string
  pair: string
  type: 'long' | 'short'
  price: number
  size: number
  leverage: number
  timestamp: number
}

interface TradingStore {
  positions: Position[]
  trades: Trade[]
  isLoading: boolean
  error: string | null
  openPosition: (params: {
    pair: string
    type: 'long' | 'short'
    price: number
    size: number
    leverage: number
  }) => Promise<void>
  closePosition: (positionId: string) => Promise<void>
  updatePositions: () => void
}

export const useTradingStore = create<TradingStore>((set, get) => ({
  positions: [],
  trades: [],
  isLoading: false,
  error: null,

  openPosition: async ({ pair, type, price, size, leverage }) => {
    try {
      set({ isLoading: true, error: null })

      // Validate inputs
      if (size <= 0) throw new Error('Invalid size')
      if (leverage < 1 || leverage > 10) throw new Error('Invalid leverage')
      if (!pair) throw new Error('Invalid pair')

      const margin = size / leverage
      const liquidationPrice = type === 'long'
        ? price * (1 - 1 / leverage)
        : price * (1 + 1 / leverage)

      const position: Position = {
        id: Math.random().toString(36).substring(7),
        pair,
        type,
        entryPrice: price,
        size,
        leverage,
        margin,
        liquidationPrice,
        pnl: 0,
        pnlPercent: 0,
        timestamp: Date.now()
      }

      const trade: Trade = {
        id: Math.random().toString(36).substring(7),
        pair,
        type,
        price,
        size,
        leverage,
        timestamp: Date.now()
      }

      set(state => ({
        positions: [...state.positions, position],
        trades: [...state.trades, trade],
        isLoading: false
      }))

      // Start position updates
      get().updatePositions()
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  closePosition: async (positionId: string) => {
    try {
      set({ isLoading: true, error: null })

      const position = get().positions.find(p => p.id === positionId)
      if (!position) throw new Error('Position not found')

      const trade: Trade = {
        id: Math.random().toString(36).substring(7),
        pair: position.pair,
        type: position.type === 'long' ? 'short' : 'long',
        price: position.entryPrice * (1 + position.pnlPercent / 100),
        size: position.size,
        leverage: position.leverage,
        timestamp: Date.now()
      }

      set(state => ({
        positions: state.positions.filter(p => p.id !== positionId),
        trades: [...state.trades, trade],
        isLoading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  updatePositions: () => {
    const updatePnL = () => {
      set(state => ({
        positions: state.positions.map(position => {
          // Simulate price movement
          const priceChange = (Math.random() - 0.5) * 0.01
          const currentPrice = position.entryPrice * (1 + priceChange)
          
          // Calculate PnL
          const pnlPercent = position.type === 'long'
            ? ((currentPrice - position.entryPrice) / position.entryPrice) * 100 * position.leverage
            : ((position.entryPrice - currentPrice) / position.entryPrice) * 100 * position.leverage
          
          const pnl = (position.size * pnlPercent) / 100

          return {
            ...position,
            pnl,
            pnlPercent
          }
        })
      }))
    }

    // Update every 5 seconds
    const interval = setInterval(updatePnL, 5000)
    return () => clearInterval(interval)
  }
})) 