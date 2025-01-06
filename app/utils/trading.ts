'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Position {
  id: string
  userId: string
  pair: string
  type: 'long' | 'short'
  entryPrice: number
  currentPrice: number
  size: number
  leverage: number
  margin: number
  liquidationPrice: number
  pnl: number
  pnlPercent: number
  timestamp: number
  stopLoss?: number
  takeProfit?: number
  status: 'open' | 'closed'
}

export interface Trade {
  id: string
  userId: string
  pair: string
  type: 'long' | 'short'
  entryPrice: number
  exitPrice: number
  size: number
  leverage: number
  pnl: number
  timestamp: number
  fees: number
  slippage: number
  executionTime: number
  balanceAfter: number
  success: boolean
}

interface TradingState {
  positions: Position[]
  trades: Trade[]
  isLoading: boolean
  hasLoadedInitially: Record<string, boolean> // Track initial load per wallet
  error: string | null
  lastUpdate: number
  tradingStats: {
    totalTrades: number
    winningTrades: number
    totalPnl: number
    bestTrade: number
    worstTrade: number
    averageTrade: number
    winRate: number
    currentStreak: number
    longestStreak: number
  }
}

interface TradingActions {
  openPosition: (params: {
    userId: string
    pair: string
    type: 'long' | 'short'
    price: number
    size: number
    leverage: number
    stopLoss?: number
    takeProfit?: number
  }) => Promise<void>
  closePosition: (positionId: string, exitPrice: number) => Promise<void>
  updatePositions: (prices: Record<string, number>) => void
  fetchPositions: (userId: string) => Promise<void>
  fetchTrades: (userId: string) => Promise<void>
  startRealtimeUpdates: () => void
  stopRealtimeUpdates: () => void
  setHasLoadedInitially: (walletAddress: string) => void
}

type TradingStore = TradingState & TradingActions

let priceUpdateInterval: NodeJS.Timeout | null = null;

export const useTradingStore = create<TradingStore>()(
  persist(
    (set, get) => ({
      // State
      positions: [],
      trades: [],
      isLoading: false,
      hasLoadedInitially: {},
      error: null,
      lastUpdate: Date.now(),
      tradingStats: {
        totalTrades: 0,
        winningTrades: 0,
        totalPnl: 0,
        bestTrade: 0,
        worstTrade: 0,
        averageTrade: 0,
        winRate: 0,
        currentStreak: 0,
        longestStreak: 0
      },

      // Actions
      setHasLoadedInitially: (walletAddress: string) => {
        set(state => ({
          hasLoadedInitially: {
            ...state.hasLoadedInitially,
            [walletAddress]: true
          }
        }))
      },

      openPosition: async ({ userId, pair, type, price, size, leverage, stopLoss, takeProfit }) => {
        try {
          set({ isLoading: true, error: null })

          const response = await fetch('/api/trades', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': userId
            },
            body: JSON.stringify({
              symbol: pair,
              side: type.toUpperCase(),
              size,
              price,
              leverage,
              stopLoss,
              takeProfit
            })
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to open position')
          }

          const { position, profile } = await response.json()

          set(state => ({
            positions: [...state.positions, {
              ...position,
              pair: position.symbol,
              type: position.side.toLowerCase(),
              currentPrice: position.markPrice,
              margin: position.marginUsed,
              timestamp: new Date(position.openedAt).getTime()
            }],
            lastUpdate: Date.now(),
            isLoading: false
          }))

        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      closePosition: async (positionId: string, exitPrice: number) => {
        try {
          set({ isLoading: true, error: null })

          const position = get().positions.find(p => p.id === positionId)
          if (!position) throw new Error('Position not found')

          const response = await fetch(`/api/trades?positionId=${positionId}&userId=${position.userId}&exitPrice=${exitPrice}`, {
            method: 'DELETE'
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to close position')
          }

          const { trade, profile } = await response.json()

          set(state => ({
            positions: state.positions.filter(p => p.id !== positionId),
            trades: [...state.trades, {
              ...trade,
              pair: trade.symbol,
              type: trade.side.toLowerCase(),
              timestamp: new Date(trade.closedAt || trade.openedAt).getTime(),
              balanceAfter: profile.portfolio.balance
            }],
            lastUpdate: Date.now(),
            isLoading: false
          }))

        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      updatePositions: (prices: Record<string, number>) => {
        set(state => ({
          positions: state.positions.map(position => {
            const currentPrice = prices[position.pair]
            if (!currentPrice) return position
            
            const priceDiff = position.type === 'long'
              ? ((currentPrice - position.entryPrice) / position.entryPrice)
              : ((position.entryPrice - currentPrice) / position.entryPrice)
            
            const pnlPercent = priceDiff * 100 * position.leverage
            const pnl = (position.size * pnlPercent) / 100

            // Check for liquidation
            if (position.liquidationPrice) {
              const isLiquidated = position.type === 'long'
                ? currentPrice <= position.liquidationPrice
                : currentPrice >= position.liquidationPrice

              if (isLiquidated) {
                // Auto-close position at liquidation price
                get().closePosition(position.id, position.liquidationPrice)
                return position
              }
            }

            // Check for take profit and stop loss
            if (position.takeProfit && position.type === 'long' && currentPrice >= position.takeProfit) {
              get().closePosition(position.id, position.takeProfit)
              return position
            }
            if (position.takeProfit && position.type === 'short' && currentPrice <= position.takeProfit) {
              get().closePosition(position.id, position.takeProfit)
              return position
            }
            if (position.stopLoss && position.type === 'long' && currentPrice <= position.stopLoss) {
              get().closePosition(position.id, position.stopLoss)
              return position
            }
            if (position.stopLoss && position.type === 'short' && currentPrice >= position.stopLoss) {
              get().closePosition(position.id, position.stopLoss)
              return position
            }

            return {
              ...position,
              currentPrice,
              pnl,
              pnlPercent
            }
          }),
          lastUpdate: Date.now()
        }))
      },

      fetchPositions: async (userId: string) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await fetch(`/api/trades/positions?userId=${userId}`)
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to fetch positions')
          }
          
          const positions = await response.json()
          set({ 
            positions: positions.map((p: any) => ({
              ...p,
              pair: p.symbol,
              type: p.side.toLowerCase(),
              currentPrice: p.markPrice,
              margin: p.marginUsed,
              timestamp: new Date(p.openedAt).getTime()
            })),
            lastUpdate: Date.now(),
            isLoading: false 
          })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      fetchTrades: async (userId: string) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await fetch(`/api/trades?userId=${userId}`)
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to fetch trades')
          }
          
          const trades = await response.json()
          set({ 
            trades: trades.map((t: any) => ({
              ...t,
              pair: t.symbol,
              type: t.side.toLowerCase(),
              timestamp: new Date(t.closedAt || t.openedAt).getTime(),
              balanceAfter: t.balanceAfter
            })),
            lastUpdate: Date.now(),
            isLoading: false 
          })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      startRealtimeUpdates: () => {
        if (priceUpdateInterval) return;

        // Update prices every second
        priceUpdateInterval = setInterval(async () => {
          try {
            const response = await fetch('/api/prices');
            if (!response.ok) throw new Error('Failed to fetch prices');
            
            const prices = await response.json();
            get().updatePositions(prices);
          } catch (error) {
            console.error('Failed to update prices:', error);
          }
        }, 1000);
      },

      stopRealtimeUpdates: () => {
        if (priceUpdateInterval) {
          clearInterval(priceUpdateInterval);
          priceUpdateInterval = null;
        }
      }
    }),
    {
      name: 'trading-store',
      partialize: (state) => ({
        positions: state.positions,
        trades: state.trades,
        hasLoadedInitially: state.hasLoadedInitially,
        tradingStats: state.tradingStats
      })
    }
  )
) 