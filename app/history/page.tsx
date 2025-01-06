'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '../providers/WalletProvider'
import { ConnectWalletPrompt } from '../components/ConnectWalletPrompt'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import { motion } from 'framer-motion'
import { TrendingUp, Trophy, DollarSign, Star, Clock, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Trade {
  id: string
  pair: string
  type: 'LONG' | 'SHORT'
  entryPrice: number
  exitPrice: number
  size: number
  pnl: number
  timestamp: string
  status: 'OPEN' | 'CLOSED'
}

interface TradingStats {
  totalTrades: number
  winRate: number
  totalPnl: number
  bestTrade: number
  openPositions: Trade[]
  closedTrades: Trade[]
}

export default function HistoryPage() {
  const { isConnected, walletAddress } = useWallet()
  const [stats, setStats] = useState<TradingStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTradingHistory() {
      if (!walletAddress) return
      
      try {
        const response = await fetch(`/api/trading/history?address=${walletAddress}`)
        if (!response.ok) throw new Error('Failed to fetch trading history')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching trading history:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isConnected) {
      fetchTradingHistory()
    }
  }, [isConnected, walletAddress])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <ConnectWalletPrompt 
            title="Trading History"
            description="Connect your wallet to access your complete trading history and performance analytics"
            features={[
              {
                title: "Real-time Performance",
                description: "Track your trades and PnL in real-time",
                icon: "⚡"
              },
              {
                title: "Advanced Analytics",
                description: "Deep insights into your trading patterns",
                icon: "📊"
              },
              {
                title: "Trade Timeline",
                description: "Visualize your entire trading journey",
                icon: "🗺️"
              }
            ]}
          />
          
          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 space-y-8"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Preview Our Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sample Stats */}
              <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#F0B90B]/20 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-[#F0B90B]" />
                  </div>
                  <h3 className="font-semibold">Performance Tracking</h3>
                </div>
                <div className="space-y-4 opacity-75">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-green-500">67.5%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full">
                    <div className="bg-[#F0B90B] h-2 rounded-full" style={{ width: '67.5%' }} />
                  </div>
                </div>
              </div>

              {/* Sample Trades */}
              <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-500/20 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold">Trade History</h3>
                </div>
                <div className="space-y-4 opacity-75">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="font-medium">PEPE/USDT</p>
                        <p className="text-sm text-gray-400">Long Position</p>
                      </div>
                    </div>
                    <span className="text-green-500">+$1,234</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-[#F0B90B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading your trading history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Wallet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E222D] rounded-xl p-8 border border-gray-800"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#F0B90B] to-purple-600 flex items-center justify-center text-xl font-bold">
              {walletAddress?.slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Trading History</h1>
              <p className="text-gray-400">{walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800 hover:border-[#F0B90B]/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#F0B90B]/20 rounded-xl p-3">
                <TrendingUp className="w-6 h-6 text-[#F0B90B]" />
              </div>
              <h3 className="text-gray-400">Total Trades</h3>
            </div>
            <p className="text-2xl font-bold">{stats?.totalTrades || 0}</p>
          </div>

          <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800 hover:border-[#F0B90B]/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500/20 rounded-xl p-3">
                <Trophy className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-gray-400">Win Rate</h3>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{stats?.winRate.toFixed(1)}%</p>
              <div className="w-full bg-gray-800 h-1.5 rounded-full">
                <div 
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${stats?.winRate || 0}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800 hover:border-[#F0B90B]/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#F0B90B]/20 rounded-xl p-3">
                <DollarSign className="w-6 h-6 text-[#F0B90B]" />
              </div>
              <h3 className="text-gray-400">Total PnL</h3>
            </div>
            <p className={`text-2xl font-bold ${(stats?.totalPnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {(stats?.totalPnl || 0) >= 0 ? '+' : ''}{(stats?.totalPnl || 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800 hover:border-[#F0B90B]/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500/20 rounded-xl p-3">
                <Star className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-gray-400">Best Trade</h3>
            </div>
            <p className="text-2xl font-bold text-green-500">+${stats?.bestTrade.toFixed(2)}</p>
          </div>
        </motion.div>

        {/* Trading History Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1E222D] rounded-xl p-6 border border-gray-800"
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Trades</TabsTrigger>
              <TabsTrigger value="open">Open Positions</TabsTrigger>
              <TabsTrigger value="closed">Closed Trades</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {[...(stats?.openPositions || []), ...(stats?.closedTrades || [])].map((trade) => (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1E222D]/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-[#F0B90B]/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {trade.type === 'LONG' ? (
                        <ArrowUpRight className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <h3 className="font-semibold">{trade.pair}</h3>
                        <p className="text-sm text-gray-400">
                          {trade.type} @ ${trade.entryPrice.toFixed(8)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(trade.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="open">
              <div className="space-y-4">
                {stats?.openPositions.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">
                    No open positions
                  </div>
                ) : (
                  stats?.openPositions.map((trade) => (
                    <motion.div
                      key={trade.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#1E222D]/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-[#F0B90B]/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <ArrowUpRight className="w-5 h-5 text-green-500" />
                          <div>
                            <h3 className="font-semibold">{trade.pair}</h3>
                            <p className="text-sm text-gray-400">
                              {trade.type} @ ${trade.entryPrice.toFixed(8)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(trade.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="closed">
              <div className="space-y-4">
                {stats?.closedTrades.map((trade) => (
                  <motion.div
                    key={trade.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1E222D]/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-[#F0B90B]/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <ArrowDownRight className="w-5 h-5 text-red-500" />
                        <div>
                          <h3 className="font-semibold">{trade.pair}</h3>
                          <p className="text-sm text-gray-400">
                            {trade.type} @ ${trade.entryPrice.toFixed(8)} → ${trade.exitPrice.toFixed(8)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(trade.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Trading Performance</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Chart placeholder
                  </div>
                </div>
                <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Win/Loss Ratio</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Chart placeholder
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
} 