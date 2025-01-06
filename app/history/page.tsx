'use client'

import { useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, ArrowUp, ArrowDown, Clock, Trophy, Star, DollarSign, ArrowRight } from 'lucide-react'
import { useWallet } from '../providers/WalletProvider'
import { useAuthStore } from '../utils/auth'
import { useTradingStore } from '../utils/trading'

export default function HistoryPage() {
  const { isConnected } = useWallet()
  const { user } = useAuthStore()
  const { trades, fetchTrades } = useTradingStore()

  useEffect(() => {
    if (user?.id) {
      fetchTrades(user.id)
    }
  }, [user?.id])

  const tradingStats = useMemo(() => {
    if (!trades.length) return {
      totalTrades: 0,
      winningTrades: 0,
      totalPnl: 0,
      avgProfit: 0,
      avgLoss: 0,
      bestTrade: 0,
      worstTrade: 0,
      winRate: 0
    }

    const winningTrades = trades.filter(t => t.pnl > 0)
    const losingTrades = trades.filter(t => t.pnl < 0)
    const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0)
    const avgProfit = winningTrades.length > 0 
      ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length 
      : 0
    const avgLoss = losingTrades.length > 0
      ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0)) / losingTrades.length
      : 0
    const bestTrade = Math.max(...trades.map(t => t.pnl))
    const worstTrade = Math.min(...trades.map(t => t.pnl))
    const winRate = (winningTrades.length / trades.length) * 100

    return {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      totalPnl,
      avgProfit,
      avgLoss,
      bestTrade,
      worstTrade,
      winRate
    }
  }, [trades])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 backdrop-blur-md rounded-xl p-8 border border-gray-700/50 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400">Please connect your wallet to view your trading history</p>
          </motion.div>
        </div>
      </div>
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
        {/* Trading Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500/20 rounded-lg p-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-gray-400">Total Trades</h3>
            </div>
            <p className="text-2xl font-bold">{tradingStats.totalTrades}</p>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500/20 rounded-lg p-2">
                <Trophy className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-gray-400">Win Rate</h3>
            </div>
            <p className="text-2xl font-bold">{tradingStats.winRate.toFixed(1)}%</p>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500/20 rounded-lg p-2">
                <DollarSign className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-gray-400">Total PnL</h3>
            </div>
            <p className={`text-2xl font-bold ${tradingStats.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${tradingStats.totalPnl.toFixed(2)}
            </p>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-yellow-500/20 rounded-lg p-2">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-gray-400">Best Trade</h3>
            </div>
            <p className="text-2xl font-bold text-green-500">
              ${tradingStats.bestTrade.toFixed(2)}
            </p>
          </div>
        </motion.div>

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-gray-400 mb-2">Average Profit</h3>
            <p className="text-2xl font-bold text-green-500">${tradingStats.avgProfit.toFixed(2)}</p>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-gray-400 mb-2">Average Loss</h3>
            <p className="text-2xl font-bold text-red-500">${tradingStats.avgLoss.toFixed(2)}</p>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-gray-400 mb-2">Worst Trade</h3>
            <p className="text-2xl font-bold text-red-500">${tradingStats.worstTrade.toFixed(2)}</p>
          </div>
        </motion.div>

        {/* Trade History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Trade History
          </h2>

          <div className="space-y-4">
            <AnimatePresence>
              {trades.length > 0 ? (
                trades.map((trade) => (
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
                        <span className={trade.type === 'long' ? 'text-green-500' : 'text-red-500'}>
                          {trade.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                        <span>Size: ${trade.size.toFixed(2)}</span>
                        <div className="flex items-center gap-2">
                          <span>Entry: ${trade.entryPrice.toFixed(2)}</span>
                          <ArrowRight className="w-4 h-4" />
                          <span>Exit: ${trade.exitPrice.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <motion.span
                          animate={{ 
                            color: trade.pnl >= 0 ? '#10B981' : '#EF4444',
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="font-mono"
                        >
                          P&L: ${trade.pnl.toFixed(2)}
                        </motion.span>
                        <span className="text-sm text-gray-400">
                          {new Date(trade.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No trade history
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 