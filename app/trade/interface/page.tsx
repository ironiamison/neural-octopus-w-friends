'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, ArrowUp, ArrowDown, RefreshCcw, Clock, TrendingUp, DollarSign, Wallet, Star, Trophy, Sparkles, Loader2 } from 'lucide-react'
import TradingChart from '@/components/TradingChart'
import { useWallet } from '@/providers/WalletProvider'
import { Button } from '@/components/ui/button'
import { LoadingContainer } from '@/components/ui/loading'
import OrderBook from '@/components/OrderBook'
import { SOLANA_MEMECOINS } from '@/lib/constants/memecoins'
import { fetchTokenPrice } from '@/lib/api'

interface TradingPair {
  name: string
  symbol: string
  mintAddress: string
  price: number
  change: string
  volume: string
  color: string
  hasOrderBook: boolean
  hasChart: boolean
}

interface Position {
  id: number
  pair: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  timestamp: string
  size: number
  status: 'open' | 'closed'
  stopLoss?: number
  takeProfit?: number
  leverage: number
  initialMargin: number
  unrealizedPnL: number
  liquidationPrice: number
}

interface Trade {
  id: number
  pair: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  timestamp: string
}

interface UserStats {
  balance: number
  xp: number
  level: number
  trades: number
  winRate: number
}

interface Achievement {
  id: number
  title: string
  description: string
  icon: any
  timestamp: string
}

interface Challenge {
  id: number
  title: string
  description: string
  progress: number
  target: number
  reward: number
  expires: string
}

interface Badge {
  id: number
  name: string
  icon: any
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface Streak {
  current: number
  best: number
  multiplier: number
}

interface ChartData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

// Generate random price data
const generatePriceData = () => {
  const basePrice = 100 + Math.random() * 900
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: basePrice + Math.sin(i / 3) * 50 + Math.random() * 20
  }))
}

// Update trading pairs with real symbols
const tradingPairs = SOLANA_MEMECOINS.map(coin => ({
  name: `${coin.symbol}/USD`,
  symbol: coin.symbol,
  mintAddress: coin.mintAddress,
  price: 0,
  change: '0%',
  volume: '0',
  color: 'text-gray-500',
  hasOrderBook: coin.hasOrderBook,
  hasChart: coin.hasChart
}))

// Constants for margin calculations
const MAINTENANCE_MARGIN_RATE = 0.01 // 1%
const INITIAL_MARGIN_RATE = 0.1 // 10%
const TRADING_FEE_RATE = 0.001 // 0.1%

// Add LoadingSpinner component
const LoadingSpinner = () => (
  <Loader2 className="w-5 h-5 animate-spin" />
)

// Add balance context
const calculateTotalBalance = (balance: number, positions: Position[]) => {
  return positions.reduce((total, position) => {
    const currentPrice = tradingPairs.find(p => p.name === position.pair)?.price || position.price
    const pnl = position.type === 'buy'
      ? (currentPrice - position.price) * position.size
      : (position.price - currentPrice) * position.size
    return total + pnl
  }, balance)
}

export default function TradingInterface() {
  // Wallet connection is required to:
  // 1. Persist user's trading data for portfolio tracking
  // 2. Track achievements and XP for gamification
  // 3. Record trade history for leaderboards
  // 4. Save user's progress and stats
  const { walletAddress, isConnecting, connect } = useWallet()
  const [selectedPair, setSelectedPair] = React.useState<TradingPair>(tradingPairs[0])
  const [priceData, setPriceData] = React.useState(generatePriceData())
  const [orderType, setOrderType] = React.useState<'buy' | 'sell'>('buy')
  const [userStats, setUserStats] = React.useState<UserStats>({
    balance: 10000,
    xp: 1250,
    level: 5,
    trades: 23,
    winRate: 65
  })
  const [amount, setAmount] = React.useState('')
  const [positions, setPositions] = React.useState<Position[]>([])
  const [tradeHistory, setTradeHistory] = React.useState<Trade[]>([])
  const [error, setError] = React.useState('')
  const [showPositionModal, setShowPositionModal] = React.useState(false)
  const [selectedPosition, setSelectedPosition] = React.useState<Position | null>(null)
  const [showAchievement, setShowAchievement] = React.useState(false)
  const [achievement, setAchievement] = React.useState<Achievement | null>(null)
  const [showLevelUp, setShowLevelUp] = React.useState(false)
  const [challenges] = React.useState<Challenge[]>([
    {
      id: 1,
      title: "Volume Master",
      description: "Trade $10,000 in total volume",
      progress: 0,
      target: 10000,
      reward: 500,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      title: "Profitable Trader",
      description: "Close 3 profitable trades",
      progress: 0,
      target: 3,
      reward: 300,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  ])
  const [badges] = React.useState<Badge[]>([
    {
      id: 1,
      name: "Early Adopter",
      icon: Star,
      description: "One of the first traders",
      rarity: 'legendary'
    },
    {
      id: 2,
      name: "Diamond Hands",
      icon: Trophy,
      description: "Hold a position for over 24 hours",
      rarity: 'epic'
    }
  ])
  const [streak, setStreak] = React.useState<Streak>({
    current: 3,
    best: 5,
    multiplier: 1.3
  })
  const [leverage, setLeverage] = React.useState(1)

  // Add real-time balance calculation
  const [realTimeBalance, setRealTimeBalance] = useState(userStats.balance)

  // Update balance in real-time based on positions
  useEffect(() => {
    const interval = setInterval(() => {
      const newBalance = calculateTotalBalance(userStats.balance, positions)
      setRealTimeBalance(newBalance)
    }, 1000)

    return () => clearInterval(interval)
  }, [userStats.balance, positions])

  // Function to fetch real-time price data
  const fetchPriceData = async () => {
    try {
      // Fetch ticker data for all pairs at once
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr')
      const data = await response.json()
      
      // Update each trading pair with real data
      tradingPairs.forEach((pair) => {
        const ticker = data.find((t: any) => t.symbol === pair.symbol)
        if (ticker) {
          pair.price = parseFloat(ticker.lastPrice)
          pair.change = `${parseFloat(ticker.priceChangePercent).toFixed(2)}%`
          pair.color = parseFloat(ticker.priceChangePercent) >= 0 ? 'text-green-500' : 'text-red-500'
          pair.volume = `${(parseFloat(ticker.volume) / 1000000).toFixed(1)}M`
        }
      })

      // Force a re-render by creating a new object
      setSelectedPair({...tradingPairs.find(p => p.name === selectedPair.name)!})
    } catch (error) {
      console.error('Error fetching price data:', error)
    }
  }

  // Update real-time data more frequently
  useEffect(() => {
    // Initial fetch
    fetchPriceData()

    // Set up interval for real-time updates (every 2 seconds)
    const interval = setInterval(fetchPriceData, 2000)

    return () => clearInterval(interval)
  }, [])

  // Function to show achievement notification
  const triggerAchievement = (achievement: Achievement) => {
    setAchievement(achievement)
    setShowAchievement(true)
    setTimeout(() => setShowAchievement(false), 3000)
  }

  // Add state for selected price from order book
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)

  // Update price when order book price is selected
  const handlePriceSelect = (price: number) => {
    setSelectedPrice(price)
  }

  // Update handleTrade to use real order book prices
  const handleTrade = async () => {
    if (!walletAddress) {
      setError('Please connect your wallet to save your trading progress')
      return
    }

    const tradeAmount = parseFloat(amount)
    if (isNaN(tradeAmount) || tradeAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    const leveragedAmount = tradeAmount * leverage
    if (tradeAmount > userStats.balance) {
      setError('Insufficient margin')
      return
    }

    // Get the current price from order book or selected price
    const currentPrice = selectedPrice || selectedPair.price
    const slippage = 0.005 // 0.5% slippage tolerance

    // Calculate execution price with slippage
    const executionPrice = orderType === 'buy'
      ? currentPrice * (1 + slippage)  // Add slippage for buys
      : currentPrice * (1 - slippage)  // Subtract slippage for sells

    const newTrade = {
      pair: selectedPair.name,
      type: orderType,
      amount: leveragedAmount,
      price: executionPrice,
      timestamp: new Date().toISOString(),
      id: Date.now(),
      leverage
    }

    // Calculate position size based on real order book liquidity
    const positionSize = leveragedAmount / executionPrice

    // Create new position with real-time data
    const newPosition: Position = {
      ...newTrade,
      size: positionSize,
      status: 'open' as const,
      initialMargin: tradeAmount,
      unrealizedPnL: 0,
      liquidationPrice: calculateLiquidationPrice(tradeAmount, leverage, executionPrice, orderType)
    }

    // Update positions with new position
    setPositions(prev => [...prev, newPosition])

    // Update user stats
    setUserStats(prev => ({
      ...prev,
      balance: prev.balance - tradeAmount,
      trades: prev.trades + 1,
      xp: prev.xp + 100
    }))

    // Add to trade history
    setTradeHistory(prev => [newTrade, ...prev])
    
    // Reset states
    setAmount('')
    setError('')
    setSelectedPrice(null)

    // Check for achievements
    if (userStats.trades === 0) {
      triggerAchievement({
        id: 1,
        title: 'First Trade',
        description: 'Complete your first trade',
        icon: Star,
        timestamp: new Date().toISOString()
      })
    }

    // Apply streak multiplier to XP gain
    const xpGain = 100 * streak.multiplier
    setUserStats(prev => ({
      ...prev,
      xp: prev.xp + xpGain
    }))

    // Show XP gain notification
    triggerAchievement({
      id: Date.now(),
      title: "XP Gained",
      description: `+${xpGain.toFixed(0)} XP (${streak.multiplier}x multiplier)`,
      icon: Star,
      timestamp: new Date().toISOString()
    })
  }

  // Calculate P&L for positions
  const positionsWithPnL = positions.map(position => {
    const currentPrice = tradingPairs.find(p => p.name === position.pair)?.price || position.price
    const priceDiff = position.type === 'buy' 
      ? currentPrice - position.price 
      : position.price - currentPrice
    const unrealizedPnL = priceDiff * position.size
    const percentageChange = (priceDiff / position.price) * 100

    return {
      ...position,
      unrealizedPnL
    }
  })

  // Close position
  const handleClosePosition = (position: Position) => {
    const currentPrice = tradingPairs.find(p => p.name === position.pair)?.price || position.price
    const priceDiff = position.type === 'buy' 
      ? currentPrice - position.price 
      : position.price - currentPrice
    const realizedPnL = priceDiff * position.size

    // Update user stats
    setUserStats(prev => ({
      ...prev,
      balance: prev.balance + position.amount + realizedPnL,
      xp: prev.xp + Math.abs(Math.round(realizedPnL)), // XP based on trade size
      winRate: realizedPnL > 0 
        ? ((prev.winRate * prev.trades + 100) / (prev.trades + 1))
        : ((prev.winRate * prev.trades) / (prev.trades + 1))
    }))

    // Remove from open positions
    setPositions(prev => prev.filter(p => p.id !== position.id))

    // Add to trade history with result
    setTradeHistory(prev => [{
      ...position,
      type: position.type === 'buy' ? 'sell' : 'buy',
      price: currentPrice,
      amount: position.amount + realizedPnL,
      timestamp: new Date().toISOString(),
      id: Date.now()
    }, ...prev])
  }

  // Set stop-loss/take-profit
  const handleSetLimits = (position: Position, stopLoss?: number, takeProfit?: number) => {
    setPositions(prev => prev.map(p => 
      p.id === position.id 
        ? { ...p, stopLoss, takeProfit }
        : p
    ))
    setShowPositionModal(false)
    setSelectedPosition(null)
  }

  // Check for stop-loss/take-profit triggers
  React.useEffect(() => {
    positions.forEach(position => {
      const currentPrice = tradingPairs.find(p => p.name === position.pair)?.price || position.price
      
      if (position.stopLoss && (
        (position.type === 'buy' && currentPrice <= position.stopLoss) ||
        (position.type === 'sell' && currentPrice >= position.stopLoss)
      )) {
        handleClosePosition(position)
      }
      
      if (position.takeProfit && (
        (position.type === 'buy' && currentPrice >= position.takeProfit) ||
        (position.type === 'sell' && currentPrice <= position.takeProfit)
      )) {
        handleClosePosition(position)
      }
    })
  }, [tradingPairs])

  const calculateRank = (xp: number) => {
    const ranks = [
      { name: "Novice", threshold: 0, color: "text-gray-400" },
      { name: "Apprentice", threshold: 1000, color: "text-green-400" },
      { name: "Expert", threshold: 5000, color: "text-blue-400" },
      { name: "Master", threshold: 10000, color: "text-purple-400" },
      { name: "Legend", threshold: 50000, color: "text-yellow-400" }
    ]
    return ranks.reduce((acc, rank) => xp >= rank.threshold ? rank : acc)
  }

  const currentRank = calculateRank(userStats.xp)

  const calculateLiquidationPrice = (amount: number, leverage: number, entryPrice: number, type: 'buy' | 'sell'): number => {
    if (!amount || !leverage || !entryPrice) return 0
    
    const positionSize = amount * leverage
    const initialMargin = amount // In isolated margin, this is the collateral
    const maintenanceMargin = positionSize * MAINTENANCE_MARGIN_RATE
    const tradingFee = positionSize * TRADING_FEE_RATE
    
    // For isolated margin, liquidation occurs when: Equity = Initial Margin + Unrealized PnL = Maintenance Margin
    // Solving for liquidation price:
    if (type === 'buy') {
      // For longs: (liquidationPrice - entryPrice) * positionSize/entryPrice + initialMargin = maintenanceMargin
      return entryPrice * (1 - (initialMargin - maintenanceMargin - tradingFee) / positionSize)
    } else {
      // For shorts: (entryPrice - liquidationPrice) * positionSize/entryPrice + initialMargin = maintenanceMargin
      return entryPrice * (1 + (initialMargin - maintenanceMargin - tradingFee) / positionSize)
    }
  }

  const calculatePositionMetrics = (amount: string, leverage: number, entryPrice: number, type: 'buy' | 'sell') => {
    const parsedAmount = parseFloat(amount || '0')
    const positionSize = parsedAmount * leverage
    const initialMargin = parsedAmount // In isolated margin, this is the user's collateral
    const maintenanceMargin = positionSize * MAINTENANCE_MARGIN_RATE
    const tradingFee = positionSize * TRADING_FEE_RATE
    const liquidationPrice = calculateLiquidationPrice(parsedAmount, leverage, entryPrice, type)
    
    const maxPnL = type === 'buy' 
      ? (positionSize / entryPrice) * (entryPrice * 2 - liquidationPrice) // For longs
      : (positionSize / entryPrice) * (entryPrice - liquidationPrice) // For shorts
    
    return {
      positionSize,
      initialMargin,
      maintenanceMargin,
      tradingFee,
      liquidationPrice,
      maxPnL,
      maxLoss: initialMargin // In isolated margin, max loss is limited to initial margin
    }
  }

  // Function to check if pair is tradeable
  const isPairTradeable = (pair: TradingPair) => {
    return pair.hasOrderBook && pair.hasChart
  }

  // Function to handle pair selection
  const handlePairSelect = (pair: TradingPair) => {
    if (!isPairTradeable(pair)) {
      // Show error or notification that pair isn't available
      triggerAchievement({
        id: Date.now(),
        title: "Trading Unavailable",
        description: "This pair is not available for trading yet",
        icon: RefreshCcw,
        timestamp: new Date().toISOString()
      })
      return
    }
    setSelectedPair(pair)
  }

  // Add state for chart data
  const [chartData, setChartData] = useState<ChartData[]>([])
  
  // Add function to fetch and update chart data
  const updateChartData = async () => {
    if (!selectedPair?.mintAddress) return
    
    try {
      const priceData = await fetchTokenPrice(selectedPair.mintAddress)
      if (priceData) {
        const newCandle: ChartData = {
          time: new Date().toISOString(),
          open: priceData.open,
          high: priceData.high,
          low: priceData.low,
          close: priceData.price,
          volume: priceData.volume
        }
        
        setChartData(prev => {
          const newData = [...prev, newCandle]
          // Keep last 100 candles for performance
          return newData.slice(-100)
        })
      }
    } catch (error) {
      console.error('Error fetching price data:', error)
    }
  }

  // Update chart data periodically
  useEffect(() => {
    updateChartData()
    const interval = setInterval(updateChartData, 15000) // Update every 15 seconds
    return () => clearInterval(interval)
  }, [selectedPair])

  // Show wallet connection prompt if not connected
  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-7xl mx-auto px-4 py-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl font-bold tracking-tight">
              Connect Your Wallet to Start Trading
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Connect your wallet to track your trades, earn XP, unlock achievements, and compete on the leaderboards with up to 100x leverage
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={connect}
                disabled={isConnecting}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold relative overflow-hidden group"
              >
                {isConnecting ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.5, opacity: 0.2 }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="relative">Connect Wallet</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isConnecting) {
    return (
      <LoadingContainer>
        <div className="text-lg text-gray-400">Connecting to wallet...</div>
      </LoadingContainer>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute w-2 h-2 bg-blue-500 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: -10,
                opacity: 0.2
              }}
              animate={{
                y: window.innerHeight + 10,
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10
              }}
            />
          ))}
        </div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000" />
      
      {/* Animated grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{
          mask: 'radial-gradient(circle at center, transparent, black)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Add Balance Display */}
        <div className="mb-6 bg-gray-800/30 backdrop-blur-md rounded-xl p-4 border border-gray-700/50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-400">Total Balance</h3>
              <div className="text-2xl font-bold">
                ${realTimeBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-sm text-gray-400">Available Margin</h3>
              <div className="text-2xl font-bold">
                ${userStats.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Notification */}
        <AnimatePresence>
          {showAchievement && achievement && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="fixed top-4 right-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-md border border-yellow-500/50 rounded-lg p-4 shadow-lg z-50"
            >
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500/20 rounded-lg p-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h4 className="font-bold text-yellow-500">{achievement.title}</h4>
                  <p className="text-sm text-gray-300">{achievement.description}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Trading Pairs */}
          <div className="lg:col-span-1 bg-gray-800/30 backdrop-blur-md rounded-xl p-4 border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4">Solana Meme Coins</h2>
            <div className="space-y-4">
              {tradingPairs.map((pair) => (
                <button
                  key={pair.name}
                  onClick={() => handlePairSelect(pair)}
                  className={`w-full p-4 rounded-lg transition-all duration-200 ${
                    !isPairTradeable(pair)
                      ? 'bg-gray-800/50 opacity-50 cursor-not-allowed'
                      : selectedPair.name === pair.name
                      ? 'bg-gray-700/50 border-2 border-blue-500/50 shadow-lg shadow-blue-500/20'
                      : 'bg-gray-700/50 hover:bg-gray-700/80 border-2 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{pair.name}</span>
                      {!isPairTradeable(pair) && (
                        <span className="text-xs text-gray-500">(Coming Soon)</span>
                      )}
                    </div>
                    <span className={pair.color}>{pair.change}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                    <span>${pair.price.toFixed(6)}</span>
                    <span>Vol: {pair.volume}</span>
                  </div>
                  {isPairTradeable(pair) && (
                    <div className="flex gap-2 mt-2">
                      {pair.hasChart && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                          Chart
                        </span>
                      )}
                      {pair.hasOrderBook && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                          Order Book
                        </span>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chart and Trading Controls */}
          <div className="lg:col-span-3 space-y-6">
            {selectedPair.hasChart ? (
              /* Price Chart */
              <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPair.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl">${selectedPair.price.toFixed(6)}</span>
                      <span className={selectedPair.color}>
                        {selectedPair.change}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">1H</button>
                    <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600">24H</button>
                    <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">7D</button>
                  </div>
                </div>
                
                {/* TradingChart */}
                <div className="h-[400px] rounded-lg overflow-hidden">
                  <TradingChart 
                    symbol={selectedPair.symbol}
                    data={chartData}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <RefreshCcw className="w-8 h-8 mx-auto mb-2" />
                  <p>Chart coming soon</p>
                </div>
              </div>
            )}

            {/* Order Book and Trading Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedPair.hasOrderBook ? (
                <OrderBook 
                  mintAddress={selectedPair.mintAddress} 
                  className="h-[500px]"
                  onPriceSelect={handlePriceSelect}
                />
              ) : (
                <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <RefreshCcw className="w-8 h-8 mx-auto mb-2" />
                    <p>Order book coming soon</p>
                  </div>
                </div>
              )}

              {/* Trading Controls */}
              {isPairTradeable(selectedPair) ? (
                <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
                  {/* Buy/Sell Tabs */}
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => setOrderType('buy')}
                      className={`flex-1 py-4 rounded-lg font-semibold relative overflow-hidden group ${
                        orderType === 'buy'
                          ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/50'
                          : 'bg-gray-700/50 hover:bg-gray-700/80'
                      }`}
                    >
                      {orderType === 'buy' && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                      <div className="relative flex items-center justify-center gap-2">
                        <ArrowUp className={`w-5 h-5 ${orderType === 'buy' ? 'text-green-400' : 'text-gray-400'}`} />
                        <span className={orderType === 'buy' ? 'text-green-400' : 'text-gray-400'}>Long</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setOrderType('sell')}
                      className={`flex-1 py-4 rounded-lg font-semibold relative overflow-hidden group ${
                        orderType === 'sell'
                          ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/50'
                          : 'bg-gray-700/50 hover:bg-gray-700/80'
                      }`}
                    >
                      {orderType === 'sell' && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10"
                          initial={{ x: '100%' }}
                          animate={{ x: '-100%' }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                      <div className="relative flex items-center justify-center gap-2">
                        <ArrowDown className={`w-5 h-5 ${orderType === 'sell' ? 'text-red-400' : 'text-gray-400'}`} />
                        <span className={orderType === 'sell' ? 'text-red-400' : 'text-gray-400'}>Short</span>
                      </div>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Leverage Slider */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm text-gray-400">Leverage</label>
                        <span className={`text-sm font-mono ${leverage >= 50 ? 'text-red-400' : leverage >= 20 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {leverage}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={leverage}
                        onChange={(e) => setLeverage(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, 
                            ${leverage < 20 ? '#10B981' : leverage < 50 ? '#FBBF24' : '#EF4444'} 0%,
                            ${leverage < 20 ? '#10B981' : leverage < 50 ? '#FBBF24' : '#EF4444'} ${leverage}%,
                            #374151 ${leverage}%,
                            #374151 100%)`
                        }}
                      />
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>1x</span>
                        <span>20x</span>
                        <span>50x</span>
                        <span>100x</span>
                      </div>
                    </div>

                    {/* Amount Input with Position Size Calculator */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Amount</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => {
                            setAmount(e.target.value)
                            setError('')
                          }}
                          className="w-full bg-gray-700/50 rounded-lg py-3 px-4 text-white placeholder-gray-500 border border-gray-600/50 focus:border-blue-500/50 transition-colors"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          USD
                        </span>
                      </div>
                      {/* Position Size Info */}
                      <div className="mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                        {amount && leverage && selectedPair.price ? (
                          <>
                            {(() => {
                              const metrics = calculatePositionMetrics(amount, leverage, selectedPair.price, orderType)
                              return (
                                <>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Position Size:</span>
                                    <span className="text-white font-mono">${metrics.positionSize.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Initial Margin:</span>
                                    <span className="text-white font-mono">${metrics.initialMargin.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Maintenance Margin:</span>
                                    <span className="text-yellow-400 font-mono">${metrics.maintenanceMargin.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Trading Fee:</span>
                                    <span className="text-red-400 font-mono">${metrics.tradingFee.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Max Profit:</span>
                                    <span className="text-green-400 font-mono">${metrics.maxPnL.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Max Loss:</span>
                                    <span className="text-red-400 font-mono">${metrics.maxLoss.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Liquidation Price:</span>
                                    <span className="text-red-400 font-mono">
                                      ${metrics.liquidationPrice.toFixed(2)}
                                    </span>
                                  </div>
                                </>
                              )
                            })()}
                          </>
                        ) : (
                          <div className="text-center text-gray-400 text-sm py-2">
                            Enter amount to see position details
                          </div>
                        )}
                      </div>
                      {error && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                      )}
                    </div>

                    {/* Market Price */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Market Price</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={selectedPrice?.toFixed(6) || selectedPair.price.toFixed(6)}
                          className="w-full bg-gray-700/50 rounded-lg py-3 px-4 text-white border border-gray-600/50"
                          readOnly
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          USD
                        </span>
                      </div>
                    </div>

                    {/* Trade Button with Risk Level Indicator */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Risk Level:</span>
                        <span className={`text-sm ${
                          leverage >= 50 ? 'text-red-400' : leverage >= 20 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {leverage >= 50 ? 'High' : leverage >= 20 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                      <button 
                        onClick={handleTrade}
                        className={`w-full py-4 rounded-lg font-semibold relative overflow-hidden group ${
                          orderType === 'buy'
                            ? 'bg-gradient-to-r from-green-500 to-green-600'
                            : 'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1.5, opacity: 0.2 }}
                          transition={{ duration: 0.5 }}
                        />
                        <span className="relative">
                          {orderType === 'buy' ? 'Long' : 'Short'} {selectedPair.name.split('/')[0]} with {leverage}x
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <RefreshCcw className="w-8 h-8 mx-auto mb-2" />
                    <p>Trading coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Positions and History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Open Positions */}
          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold mb-4">Open Positions</h3>
            <div className="space-y-4">
              {positions.map(position => {
                const currentPrice = tradingPairs.find(p => p.name === position.pair)?.price || position.price
                const pnl = position.type === 'buy'
                  ? (currentPrice - position.price) * position.size
                  : (position.price - currentPrice) * position.size
                const pnlPercentage = (pnl / position.initialMargin) * 100

                return (
                  <div 
                    key={position.id}
                    className="bg-gray-700/50 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{position.pair}</span>
                      <span className={position.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                        {position.type === 'buy' ? 'LONG' : 'SHORT'} {position.leverage}x
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                      <span>Size: ${(position.size * currentPrice).toLocaleString()}</span>
                      <span>Entry: ${position.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-gray-400">PnL:</span>
                      <span className={pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                        ${pnl.toFixed(2)} ({pnlPercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                )
              })}
              {positions.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No open positions
                </p>
              )}
            </div>
          </div>

          {/* Trade History */}
          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold mb-4">Trade History</h3>
            <div className="space-y-4">
              {tradeHistory.map(trade => (
                <div 
                  key={trade.id}
                  className="bg-gray-700/50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{trade.pair}</span>
                    <span className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                      {trade.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                    <span>Amount: ${trade.amount.toFixed(2)}</span>
                    <span>Price: ${trade.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {tradeHistory.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No trade history
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 