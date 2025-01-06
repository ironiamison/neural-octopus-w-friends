'use client'

import { useState, useEffect, useMemo } from 'react'
import { Wallet, TrendingUp, TrendingDown, Clock, DollarSign, BarChart2, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react'
import { useAuthStore } from '../utils/auth'
import { useTradingStore } from '../utils/trading'
import { LoadingContainer } from '../components/ui/loading'
import { useWallet } from '../providers/WalletProvider'
import { motion, AnimatePresence } from 'framer-motion'
import ConnectPreview from '../components/ConnectPreview'

export default function PortfolioPage() {
  const { user } = useAuthStore()
  const { isConnected } = useWallet()
  const { positions, fetchPositions, closePosition } = useTradingStore()

  useEffect(() => {
    if (user?.id) {
      fetchPositions(user.id)
    }
  }, [user?.id])

  const portfolioStats = useMemo(() => {
    if (!user?.portfolio?.balance) return {
      totalValue: 0,
      availableBalance: 0,
      totalPnl: 0,
      dayChange: 0
    }

    const totalPnl = positions.reduce((acc, pos) => acc + (pos.pnl || 0), 0)
    const dayChange = positions.reduce((acc, pos) => {
      const posAge = Date.now() - new Date(pos.timestamp).getTime()
      return posAge <= 24 * 60 * 60 * 1000 ? acc + (pos.pnl || 0) : acc
    }, 0)

    return {
      totalValue: user.portfolio.balance + totalPnl,
      availableBalance: user.portfolio.balance,
      totalPnl,
      dayChange: dayChange > 0 ? (dayChange / user.portfolio.balance) * 100 : 0
    }
  }, [user, positions])

  if (!isConnected) {
    return <ConnectPreview type="portfolio" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
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

      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000" />
      
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{
          mask: 'radial-gradient(circle at center, transparent, black)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500/20 rounded-lg p-2">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-gray-400">Total Value</h3>
            </div>
            <p className="text-2xl font-bold">${portfolioStats.totalValue.toFixed(2)}</p>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500/20 rounded-lg p-2">
                <Wallet className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-gray-400">Available Balance</h3>
            </div>
            <p className="text-2xl font-bold">${portfolioStats.availableBalance.toFixed(2)}</p>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500/20 rounded-lg p-2">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-gray-400">Total PnL</h3>
            </div>
            <p className={`text-2xl font-bold ${portfolioStats.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${portfolioStats.totalPnl.toFixed(2)}
            </p>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-yellow-500/20 rounded-lg p-2">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-gray-400">24h Change</h3>
            </div>
            <p className={`text-2xl font-bold ${portfolioStats.dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolioStats.dayChange >= 0 ? '+' : ''}{portfolioStats.dayChange.toFixed(2)}%
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Open Positions
          </h2>

          <div className="space-y-4">
            <AnimatePresence>
              {positions.length > 0 ? (
                positions.map((position) => (
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
                        <span className={position.type === 'long' ? 'text-green-500' : 'text-red-500'}>
                          {position.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                        <span>Size: ${position.size.toFixed(2)}</span>
                        <span>Entry: ${position.entryPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <motion.span
                          animate={{ 
                            color: position.pnl >= 0 ? '#10B981' : '#EF4444',
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="font-mono"
                        >
                          P&L: ${position.pnl.toFixed(2)}
                        </motion.span>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 backdrop-blur-sm"
                            onClick={() => closePosition(position.id)}
                          >
                            Close
                          </motion.button>
                        </div>
                      </div>
                      {position.liquidationPrice && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-gray-400 flex gap-4"
                        >
                          <span className="flex items-center gap-1">
                            <ArrowDown className="w-3 h-3 text-red-400" />
                            Liq. Price: ${position.liquidationPrice.toFixed(8)}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No open positions
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 