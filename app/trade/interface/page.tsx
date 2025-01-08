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
import { getTokenPrices, TokenPrice } from '@/utils/api'
import { WalletStatus } from '@/components/WalletStatus'

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

// Add a utility function for date formatting
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toISOString().split('T')[0]
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
  const [chartError, setChartError] = useState<string | null>(null)

  // Add function to fetch and update chart data
  const updateChartData = async () => {
    if (!selectedPair?.symbol) return
    
    try {
      const prices = await getTokenPrices(selectedPair.symbol)
      if (prices && prices.length > 0) {
        // Ensure timestamps are unique and properly formatted
        const uniquePrices = prices.reduce((acc: ChartData[], price) => {
          const date = new Date(price.timestamp)
          const timeStr = date.toISOString().split('T')[0]
          
          // Only add if we don't already have this timestamp
          if (!acc.find(p => p.time === timeStr)) {
            acc.push({
              time: timeStr,
              open: price.open,
              high: price.high,
              low: price.low,
              close: price.close,
              volume: price.volume
            })
          }
          return acc
        }, [])
        
        setChartData(uniquePrices)
        setChartError(null)
      } else {
        setChartError('No price data available')
      }
    } catch (error) {
      console.error('Error fetching price data:', error)
      setChartError('Failed to load price data')
    }
  }

  // Add effect to update chart data periodically
  useEffect(() => {
    if (selectedPair?.symbol) {
      updateChartData()
      const interval = setInterval(updateChartData, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [selectedPair?.symbol])

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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-8">
        {/* Top Bar with Wallet and Stats */}
        <div className="flex justify-between items-center mb-8 bg-gray-800/30 backdrop-blur-md rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-4">
            <WalletStatus />
            <div className="h-6 w-px bg-gray-700" /> {/* Divider */}
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span>Balance: ${userStats.balance.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Level {userStats.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Win Rate: {userStats.winRate}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>XP: {userStats.xp}</span>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Trading Pairs List - Sidebar */}
          <div className="col-span-3 bg-gray-800/30 backdrop-blur-md rounded-xl border border-gray-700/50 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Trading Pairs</h2>
              <button
                onClick={() => updateChartData()}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {tradingPairs.map(pair => (
                <button
                  key={pair.name}
                  onClick={() => handlePairSelect(pair)}
                  className={`w-full p-3 rounded-lg transition-all duration-200 ${
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
                        <span className="text-xs text-gray-500">(Soon)</span>
                      )}
                    </div>
                    <span className={pair.color}>{pair.change}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                    <span>${pair.price.toFixed(6)}</span>
                    <span>Vol: {pair.volume}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chart and Trading Area */}
          <div className="col-span-6">
            {/* Chart */}
            <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{selectedPair.name} Chart</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    Last Update: {new Date().toLocaleTimeString()}
                  </span>
                  <button
                    onClick={() => updateChartData()}
                    className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {chartError ? (
                <div className="flex items-center justify-center h-[400px] text-red-400">
                  {chartError}
                </div>
              ) : chartData.length > 0 ? (
                <div className="h-[400px]">
                  <TradingChart symbol={selectedPair.symbol} data={chartData} />
                </div>
              ) : (
                <div className="h-[400px]">
                  <LoadingContainer />
                </div>
              )}
            </div>

            {/* Trading Controls */}
            <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Trading Controls</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOrderType('buy')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      orderType === 'buy'
                        ? 'bg-green-500/20 text-green-400'
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setOrderType('sell')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      orderType === 'sell'
                        ? 'bg-red-500/20 text-red-400'
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>
              {/* Trading Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Enter amount..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Leverage</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={leverage}
                    onChange={(e) => setLeverage(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>1x</span>
                    <span>{leverage}x</span>
                    <span>20x</span>
                  </div>
                </div>
                <button
                  onClick={handleTrade}
                  disabled={!amount || Number(amount) <= 0}
                  className={`w-full py-3 rounded-lg transition-colors ${
                    orderType === 'buy'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedPair.name}
                </button>
              </div>
            </div>
          </div>

          {/* Order Book and Positions */}
          <div className="col-span-3 space-y-6">
            {/* Order Book */}
            {selectedPair.hasOrderBook && (
              <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-4 border border-gray-700/50">
                <h2 className="text-lg font-semibold mb-4">Order Book</h2>
                <div className="h-[300px]">
                  <OrderBook mintAddress={selectedPair.mintAddress} onPriceSelect={handlePriceSelect} />
                </div>
              </div>
            )}

            {/* Open Positions */}
            <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-4 border border-gray-700/50">
              <h2 className="text-lg font-semibold mb-4">Open Positions</h2>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {positions.filter(p => p.status === 'open').map(position => (
                  <div
                    key={position.id}
                    className="bg-gray-700/50 rounded-lg p-3 border border-gray-600"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{position.pair}</span>
                      <span className={position.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                        {position.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span>${position.size.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Entry:</span>
                        <span>${position.price.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PnL:</span>
                        <span className={position.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}>
                          ${position.unrealizedPnL.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 