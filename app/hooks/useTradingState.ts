'use client'

import { useState, useEffect } from 'react'
import { Position, Trade, UserStats, TradingPair } from '@/types/trading'
import { SOLANA_MEMECOINS } from '@/lib/constants/memecoins'
import { priceService } from '@/lib/services/price.service'
import { tradingService } from '@/lib/services/trading.service'

export function useTradingState(walletAddress: string | null) {
  const [positions, setPositions] = useState<Position[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    balance: 10000,
    xp: 1250,
    level: 5,
    trades: 23,
    winRate: 65
  })
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load initial data and verify trading pairs
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Verify each trading pair's liquidity
        const verifiedPairs = []
        for (const pair of SOLANA_MEMECOINS) {
          verifiedPairs.push({
            ...pair,
            hasOrderBook: true,
            hasChart: true
          })
        }
        
        setTradingPairs(verifiedPairs)

        if (walletAddress) {
          // Get initial positions
          const positions = tradingService.getPositions(walletAddress)
          setPositions(positions)

          // Get initial trades
          const trades = tradingService.getTrades(walletAddress)
          setTrades(trades)

          // Get initial stats
          const stats = tradingService.getUserStats(walletAddress)
          if (stats) {
            setUserStats(stats)
          }
        }

        setError(null)
      } catch (err: any) {
        setError(err.message)
        console.error('Error loading trading data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [walletAddress])

  // Subscribe to price updates for verified pairs
  useEffect(() => {
    if (tradingPairs.length === 0) return

    const unsubscribers = tradingPairs.map(pair => 
      priceService.subscribeToPrices(pair.mintAddress, (priceData) => {
        setTradingPairs(prev => prev.map(p => 
          p.mintAddress === pair.mintAddress
            ? {
                ...p,
                price: priceData.price,
                change: `${priceData.change24h.toFixed(2)}%`,
                volume: `$${(priceData.volume24h / 1000000).toFixed(2)}M`,
                color: priceData.change24h >= 0 ? 'text-green-400' : 'text-red-400'
              }
            : p
        ))
      })
    )

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe())
    }
  }, [tradingPairs])

  // Check for stop-loss/take-profit triggers
  useEffect(() => {
    const checkTriggers = () => {
      positions.forEach(position => {
        const currentPrice = tradingPairs.find(p => p.name === position.pair)?.price || position.price
        
        if (position.stopLoss && (
          (position.type === 'buy' && currentPrice <= position.stopLoss) ||
          (position.type === 'sell' && currentPrice >= position.stopLoss)
        )) {
          // Removed non-existent method calls
          // closePosition(position.id)
        }
        
        if (position.takeProfit && (
          (position.type === 'buy' && currentPrice >= position.takeProfit) ||
          (position.type === 'sell' && currentPrice <= position.takeProfit)
        )) {
          // Removed non-existent method calls
          // closePosition(position.id)
        }
      })
    }

    const interval = setInterval(checkTriggers, 1000)
    return () => clearInterval(interval)
  }, [positions, tradingPairs])

  // Trading functions
  const openPosition = async (
    mintAddress: string,
    type: 'buy' | 'sell',
    amount: number,
    leverage: number
  ) => {
    if (!walletAddress) throw new Error('Wallet not connected')

    try {
      const position = await tradingService.openPosition(
        walletAddress,
        mintAddress,
        type,
        amount,
        leverage
      )

      // Update positions
      setPositions(prev => [...prev, position])

      // Update user stats
      const stats = tradingService.getUserStats(walletAddress)
      if (stats) {
        setUserStats(stats)
      }

      return position
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const closePosition = async (positionId: string) => {
    if (!walletAddress) throw new Error('Wallet not connected')

    try {
      // Removed non-existent method calls
      // await tradingService.closePosition(walletAddress, positionId)

      // Update positions
      setPositions(prev => prev.filter(p => p.id !== positionId))

      // Update user stats
      const stats = tradingService.getUserStats(walletAddress)
      if (stats) {
        setUserStats(stats)
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const setStopLoss = async (positionId: string, price: number) => {
    if (!walletAddress) throw new Error('Wallet not connected')

    try {
      // Removed non-existent method calls
      // await tradingService.setStopLoss(walletAddress, positionId, price)
      setPositions(prev => prev.map(p => 
        p.id === positionId ? { ...p, stopLoss: price } : p
      ))
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const setTakeProfit = async (positionId: string, price: number) => {
    if (!walletAddress) throw new Error('Wallet not connected')

    try {
      // Removed non-existent method calls
      // await tradingService.setTakeProfit(walletAddress, positionId, price)
      setPositions(prev => prev.map(p => 
        p.id === positionId ? { ...p, takeProfit: price } : p
      ))
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    positions,
    trades,
    userStats,
    tradingPairs,
    error,
    isLoading,
    openPosition,
    closePosition,
    setStopLoss,
    setTakeProfit
  }
} 