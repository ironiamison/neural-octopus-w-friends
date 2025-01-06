'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, ArrowUp, ArrowDown, RefreshCcw, Clock, TrendingUp, DollarSign, Wallet, Star, Trophy, Sparkles } from 'lucide-react'
import TradingViewChart from '../../components/TradingViewChart'

interface TradingPair {
  name: string
  price: number
  change: string
  volume: string
  color: string
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
}

interface PositionWithPnL extends Position {
  unrealizedPnL: number
  percentageChange: number
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

// Generate random price data
const generatePriceData = () => {
  const basePrice = 100 + Math.random() * 900
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: basePrice + Math.sin(i / 3) * 50 + Math.random() * 20
  }))
}

// Update trading pairs with real symbols
const tradingPairs = [
  { name: 'BTC/USD', symbol: 'BTCUSDT', price: 0, change: '0%', volume: '0', color: 'text-gray-500' },
  { name: 'ETH/USD', symbol: 'ETHUSDT', price: 0, change: '0%', volume: '0', color: 'text-gray-500' },
  { name: 'SOL/USD', symbol: 'SOLUSDT', price: 0, change: '0%', volume: '0', color: 'text-gray-500' },
  { name: 'AVAX/USD', symbol: 'AVAXUSDT', price: 0, change: '0%', volume: '0', color: 'text-gray-500' },
]

export default function TradingInterface() {
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

  const handleTrade = () => {
    const tradeAmount = parseFloat(amount)
    if (isNaN(tradeAmount) || tradeAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (tradeAmount > userStats.balance) {
      setError('Insufficient balance')
      return
    }

    const newTrade = {
      pair: selectedPair.name,
      type: orderType,
      amount: tradeAmount,
      price: selectedPair.price,
      timestamp: new Date().toISOString(),
      id: Date.now()
    }

    // Update positions
    if (orderType === 'buy') {
      setPositions(prev => [...prev, {
        ...newTrade,
        size: tradeAmount / selectedPair.price,
        status: 'open'
      }])
      setUserStats(prev => ({
        ...prev,
        balance: prev.balance - tradeAmount,
        trades: prev.trades + 1,
        xp: prev.xp + 100
      }))
    } else {
      setPositions(prev => [...prev, {
        ...newTrade,
        size: tradeAmount / selectedPair.price,
        status: 'open'
      }])
      setUserStats(prev => ({
        ...prev,
        balance: prev.balance - tradeAmount,
        trades: prev.trades + 1,
        xp: prev.xp + 100
      }))
    }

    // Add to trade history
    setTradeHistory(prev => [newTrade, ...prev])
    setAmount('')
    setError('')

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
    if (tradeAmount >= 1000) {
      triggerAchievement({
        id: 2,
        title: 'Whale Alert',
        description: 'Place a trade worth $1,000 or more',
        icon: Wallet,
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
  const positionsWithPnL: PositionWithPnL[] = positions.map(position => {
    const currentPrice = tradingPairs.find(p => p.name === position.pair)?.price || position.price
    const priceDiff = position.type === 'buy' 
      ? currentPrice - position.price 
      : position.price - currentPrice
    const unrealizedPnL = priceDiff * position.size
    const percentageChange = (priceDiff / position.price) * 100

    return {
      ...position,
      unrealizedPnL,
      percentageChange
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

  const calculateLiquidationPrice = (amount: number, leverage: number, price: number, type: 'buy' | 'sell') => {
    const margin = amount * leverage
    const liquidationPrice = type === 'buy' ? price + margin : price - margin
    return liquidationPrice
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

        {/* Level Up Animation */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl font-bold text-yellow-500 mb-4"
                >
                  Level Up!
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl text-gray-300"
                >
                  You've reached level {userStats.level}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trading Pairs with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-gray-800/30 backdrop-blur-md rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/50 transition-colors"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <RefreshCcw className="w-5 h-5 text-blue-400" />
            </motion.span>
            Trading Pairs
          </h2>
          <div className="space-y-4">
            {tradingPairs.map((pair) => (
              <motion.button
                key={pair.name}
                onClick={() => setSelectedPair(pair)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-lg relative group overflow-hidden ${
                  selectedPair.name === pair.name 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'border-transparent'
                }`}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 group-hover:opacity-100 opacity-0 transition-opacity" />
                
                {/* Animated border */}
                <div className="absolute inset-0 p-[1px] rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 animate-gradient-xy">
                  <div className="h-full w-full bg-gray-800/90 backdrop-blur-md rounded-lg" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{pair.name}</span>
                    <motion.span 
                      animate={{ 
                        color: pair.change.startsWith('+') ? '#10B981' : '#EF4444',
                        y: pair.change.startsWith('+') ? [-1, 1] : [1, -1]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="font-mono"
                    >
                      {pair.change}
                    </motion.span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                    <span>${pair.price.toFixed(2)}</span>
                    <span>Vol: {pair.volume}</span>
                  </div>
                </div>
                </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Trading Interface with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* Price Chart with glow effect */}
          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 relative overflow-hidden group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute -inset-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-blue-500/50 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
            
            <div className="relative">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedPair.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl">${selectedPair.price.toFixed(2)}</span>
                    <span className={selectedPair.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
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
              
              {/* TradingView Chart */}
              <div className="h-[400px] rounded-lg overflow-hidden">
                <TradingViewChart 
                  symbol={selectedPair.name.replace('/', '')}
                  height={400}
                  positions={positions.map(pos => ({
                    id: pos.id,
                    price: pos.price,
                    type: pos.type,
                    timestamp: pos.timestamp
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Trading Controls with enhanced animations */}
          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            {/* Buy/Sell Tabs */}
            <motion.div 
              className="flex gap-4 mb-6"
              initial={false}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.98 }}
            >
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
            </motion.div>

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
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Position Size:</span>
                    <span className="text-white font-mono">${(parseFloat(amount || '0') * leverage).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Required Margin:</span>
                    <span className="text-white font-mono">${parseFloat(amount || '0').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Liquidation Price:</span>
                    <span className="text-red-400 font-mono">
                      ${calculateLiquidationPrice(parseFloat(amount || '0'), leverage, selectedPair.price, orderType).toFixed(2)}
                    </span>
                  </div>
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
                    value={selectedPair.price.toFixed(2)}
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

          {/* Positions and Trade History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Open Positions
              </h3>
              <div className="space-y-4">
                <AnimatePresence>
                  {positionsWithPnL.map(position => (
                    <motion.div 
                      key={position.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 backdrop-blur-md rounded-lg p-4 border border-gray-600/50 hover:border-blue-500/50 transition-colors relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{position.pair}</span>
                          <motion.span 
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={position.type === 'buy' ? 'text-green-500' : 'text-red-500'}
                          >
                            {position.type.toUpperCase()}
                          </motion.span>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                          <span>Size: {Number(position.size).toFixed(4)}</span>                                                                         
                          <span>Entry: ${position.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-sm">
                          <motion.span 
                            animate={{ 
                              color: position.unrealizedPnL >= 0 ? '#10B981' : '#EF4444',
                              scale: [1, 1.05, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="font-mono"
                          >
                            P&L: ${position.unrealizedPnL.toFixed(2)} ({position.percentageChange.toFixed(2)}%)
                          </motion.span>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedPosition(position)
                                setShowPositionModal(true)
                              }}
                              className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 backdrop-blur-sm"
                            >
                              Set Limits
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleClosePosition(position)}
                              className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 backdrop-blur-sm"
                            >
                              Close
                            </motion.button>
                          </div>
                        </div>
                        {(position.stopLoss || position.takeProfit) && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-gray-400 flex gap-4"
                          >
                            {position.stopLoss && (
                              <span className="flex items-center gap-1">
                                <ArrowDown className="w-3 h-3 text-red-400" />
                                SL: ${position.stopLoss.toFixed(2)}
                              </span>
                            )}
                            {position.takeProfit && (
                              <span className="flex items-center gap-1">
                                <ArrowUp className="w-3 h-3 text-green-400" />
                                TP: ${position.takeProfit.toFixed(2)}
                              </span>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {positions.length === 0 && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 text-center py-8"
                  >
                    No open positions
                  </motion.p>
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Trade History
              </h3>
              <div className="space-y-4">
                <AnimatePresence>
                  {tradeHistory.map(trade => (
                    <motion.div 
                      key={trade.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 backdrop-blur-md rounded-lg p-4 border border-gray-600/50 hover:border-blue-500/50 transition-colors relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{trade.pair}</span>
                          <span className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                            {trade.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                          <span>${trade.amount.toFixed(2)}</span>
                          <span>at ${trade.price.toFixed(2)}</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {new Date(trade.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {tradeHistory.length === 0 && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 text-center py-8"
                  >
                    No trade history
                  </motion.p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Position Settings Modal with enhanced animations */}
          <AnimatePresence>
            {showPositionModal && selectedPosition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={() => {
                  setShowPositionModal(false)
                  setSelectedPosition(null)
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-gray-800/90 backdrop-blur-md rounded-xl p-6 w-full max-w-md border border-gray-700/50"
                  onClick={e => e.stopPropagation()}
                >
                  <h3 className="text-xl font-semibold mb-4">Position Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Stop Loss</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Enter price"
                          className="w-full bg-gray-700/50 backdrop-blur-md rounded-lg py-2 px-3 text-white border border-gray-600/50 focus:border-blue-500/50 outline-none transition-colors"
                          defaultValue={selectedPosition.stopLoss}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            if (!isNaN(value)) {
                              handleSetLimits(selectedPosition, value, selectedPosition.takeProfit)
                            }
                          }}
                        />
                        <ArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Take Profit</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Enter price"
                          className="w-full bg-gray-700/50 backdrop-blur-md rounded-lg py-2 px-3 text-white border border-gray-600/50 focus:border-blue-500/50 outline-none transition-colors"
                          defaultValue={selectedPosition.takeProfit}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            if (!isNaN(value)) {
                              handleSetLimits(selectedPosition, selectedPosition.stopLoss, value)
                            }
                          }}
                        />
                        <ArrowUp className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowPositionModal(false)
                          setSelectedPosition(null)
                        }}
                        className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded backdrop-blur-md"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSetLimits(selectedPosition)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
                      >
                        Save
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Row */}
          <div className="mb-8">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/30 backdrop-blur-md rounded-xl p-4 border border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 rounded-lg p-2">
                    <DollarSign className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="text-lg font-bold">${userStats.balance.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/30 backdrop-blur-md rounded-xl p-4 border border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/20 rounded-lg p-2">
                    <Star className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-400">Level {userStats.level}</p>
                      <span className={`text-sm ${currentRank.color}`}>
                        {currentRank.name}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <motion.div 
                        className="bg-purple-500 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(userStats.xp % 1000) / 1000 * 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/30 backdrop-blur-md rounded-xl p-4 border border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-500/20 rounded-lg p-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Trading Streak</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">{streak.current} Days</p>
                      <span className="text-sm text-green-400">
                        {streak.multiplier}x XP
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/30 backdrop-blur-md rounded-xl p-4 border border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/20 rounded-lg p-2">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Win Rate</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">{userStats.winRate}%</p>
                      <span className="text-sm text-gray-400">
                        ({userStats.trades} trades)
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Challenges Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {challenges.map(challenge => (
                <motion.div
                  key={challenge.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800/30 backdrop-blur-md rounded-xl p-4 border border-gray-700/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{challenge.title}</h3>
                      <p className="text-sm text-gray-400">{challenge.description}</p>
                    </div>
                    <div className="bg-yellow-500/20 rounded-lg px-2 py-1">
                      <span className="text-sm text-yellow-500">+{challenge.reward} XP</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-yellow-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-400">
                      {challenge.progress} / {challenge.target}
                    </span>
                    <span className="text-sm text-gray-400">
                      {new Date(challenge.expires).toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Badges Section */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/30 backdrop-blur-md rounded-xl p-4 border border-gray-700/50"
            >
              <h3 className="font-semibold mb-4">Badges</h3>
              <div className="flex gap-4">
                {badges.map(badge => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ y: -2 }}
                    className="text-center"
                  >
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center mb-2
                      ${badge.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        badge.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                        badge.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                        'bg-gradient-to-r from-gray-500 to-gray-600'}
                    `}>
                      <badge.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-gray-400">{badge.name}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 