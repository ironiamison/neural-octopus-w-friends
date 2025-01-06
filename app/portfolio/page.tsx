'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '../providers/WalletProvider'
import { ConnectWalletPrompt } from '../components/ConnectWalletPrompt'
import { motion } from 'framer-motion'
import { Bot, LineChart, Wallet, Shield, ChartBar, ArrowUpRight, ArrowDownRight, Sparkles, DollarSign, Eye, Twitter, Trophy, Medal, Star, Crown } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'

interface PortfolioData {
  totalValue: number
  availableBalance: number
  totalPnl: number
  dayChange: number
  positions: Position[]
  assets: Asset[]
  healthScore: number
  riskLevel: string
}

interface Position {
  id: string
  symbol: string
  type: 'LONG' | 'SHORT'
  size: number
  entryPrice: number
  currentPrice: number
  pnl: number
  timestamp: string
  leverage: number
}

interface Asset {
  symbol: string
  amount: number
  value: number
  change24h: number
}

export default function PortfolioPage() {
  const { isConnected, walletAddress } = useWallet()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<PortfolioData | null>(null)

  useEffect(() => {
    async function fetchPortfolioData() {
      if (!walletAddress) return
      
      try {
        const response = await fetch(`/api/portfolio?address=${walletAddress}`)
        if (!response.ok) throw new Error('Failed to fetch portfolio data')
        const portfolioData = await response.json()
        setData(portfolioData)
      } catch (error) {
        console.error('Error fetching portfolio data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isConnected) {
      fetchPortfolioData()
    }
  }, [isConnected, walletAddress])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-[#0D1117] to-black text-white p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <ConnectWalletPrompt 
            title="Smart Portfolio Analytics"
            description="Connect your wallet to unlock AI-powered portfolio insights and real-time analytics"
            features={[
              {
                title: "AI16Z Integration",
                description: "Coming soon: Get personalized trading insights powered by AI16Z",
                icon: "🤖"
              },
              {
                title: "Portfolio Health",
                description: "Monitor your portfolio health score and risk metrics in real-time",
                icon: "🛡️"
              },
              {
                title: "Smart Analytics",
                description: "Track performance with AI-enhanced analytics and predictions",
                icon: "📊"
              }
            ]}
          />

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Coming Soon with AI16Z
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Experience the future of portfolio management with AI-powered insights and automated strategies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800 hover:border-indigo-500/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-500/20 p-3 rounded-xl">
                    <Bot className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="font-semibold">AI Risk Analysis</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Advanced risk metrics and portfolio health monitoring powered by AI
                </p>
                <div className="mt-4 bg-[#1E222D] rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Risk Score</span>
                    <span className="text-green-400">95/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>

              <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-500/20 p-3 rounded-xl">
                    <LineChart className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold">Smart Predictions</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  AI-powered market predictions and portfolio optimization suggestions
                </p>
                <div className="mt-4 bg-[#1E222D] rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Predicted Growth</span>
                    <span className="text-green-400">+12.5%</span>
                  </div>
                  <div className="h-16 mt-2 flex items-end justify-between gap-1">
                    {[40, 65, 45, 50, 80, 75, 90].map((height, i) => (
                      <div
                        key={i}
                        className="w-full bg-gradient-to-t from-purple-500/20 to-purple-500/50 rounded-sm"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800 hover:border-pink-500/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-pink-500/20 p-3 rounded-xl">
                    <Sparkles className="w-6 h-6 text-pink-400" />
                  </div>
                  <h3 className="font-semibold">Portfolio Insights</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Get personalized insights and optimization suggestions from AI16Z
                </p>
                <div className="mt-4 space-y-3">
                  <div className="bg-[#1E222D] rounded-lg p-3 border border-pink-500/20">
                    <div className="flex items-center gap-2 text-sm text-pink-400 mb-1">
                      <Bot className="w-4 h-4" />
                      <span>AI16Z Suggestion</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      "Consider rebalancing your portfolio to reduce exposure to volatile assets"
                    </p>
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-[#0D1117] to-black text-white p-8 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading your portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-[#0D1117] to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Portfolio Header with AI Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-8 border border-gray-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">
                {walletAddress?.slice(0, 2)}
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                  AI Portfolio Manager
                </h1>
                <p className="text-gray-400">{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-lg bg-[#1E222D] border border-gray-800">
                <span className="text-sm text-gray-400">AI Health Score</span>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="font-semibold text-green-400">{data?.healthScore}%</span>
                </div>
              </div>
              <div className="px-4 py-2 rounded-lg bg-[#1E222D] border border-gray-800">
                <span className="text-sm text-gray-400">Risk Assessment</span>
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-indigo-400">{data?.riskLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Insights and Portfolio Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Portfolio Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Portfolio Value</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Value</span>
                  <span className="text-xl font-bold">${data?.totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Available Balance</span>
                  <span className="text-xl font-bold">${data?.availableBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">24h Change</span>
                  <span className={`text-xl font-bold ${(data?.dayChange || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(data?.dayChange || 0) >= 0 ? '+' : ''}{(data?.dayChange || 0).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
              <div className="space-y-3">
                {data?.assets.map((asset) => (
                  <div key={asset.symbol} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>{asset.symbol}</span>
                    </div>
                    <span className="text-gray-400">{((asset.value / (data?.totalValue || 1)) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Middle Column - AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <Bot className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI16Z Insights</h3>
                <p className="text-sm text-gray-400">Personalized portfolio recommendations</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#1E222D] rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-medium">Risk Alert</span>
                </div>
                <p className="text-sm text-gray-400">High concentration in volatile assets detected. Consider diversifying your portfolio.</p>
              </div>

              <div className="bg-[#1E222D] rounded-xl p-4 border border-indigo-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-indigo-400 font-medium">Opportunity</span>
                </div>
                <p className="text-sm text-gray-400">Market conditions suggest favorable entry points for stable assets.</p>
              </div>

              <div className="bg-[#1E222D] rounded-xl p-4 border border-pink-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <LineChart className="w-4 h-4 text-pink-400" />
                  <span className="text-pink-400 font-medium">Performance</span>
                </div>
                <p className="text-sm text-gray-400">Your portfolio outperforms 75% of similar traders this week.</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Portfolio Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Portfolio Health</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Diversification Score</span>
                    <span className="text-green-400">85/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Risk Management</span>
                    <span className="text-yellow-400">70/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Volatility Level</span>
                    <span className="text-orange-400">60/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Suggested Actions</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span>Increase stable asset allocation</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span>Review high-risk positions</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>Consider taking profits on +30% positions</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Recommendation Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-8 border border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-500/20 p-3 rounded-xl">
                <Eye className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                  AI-Powered Wallet Analysis
                </h2>
                <p className="text-gray-400">Coming Soon</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-indigo-400">In Development</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1E222D] rounded-xl p-6 border border-indigo-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-5 h-5 text-indigo-400" />
                <h3 className="font-medium">AI Analysis</h3>
              </div>
              <div className="relative h-24 overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <motion.div
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 flex items-center justify-center text-indigo-400"
                >
                  <p className="text-sm">Analyzing wallet patterns...</p>
                </motion.div>
              </div>
            </div>

            <div className="bg-[#1E222D] rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Twitter className="w-5 h-5 text-purple-400" />
                <h3 className="font-medium">Market Sentiment</h3>
              </div>
              <div className="relative h-24 overflow-hidden rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <motion.div
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 flex items-center justify-center text-purple-400"
                >
                  <p className="text-sm">Scanning social signals...</p>
                </motion.div>
              </div>
            </div>

            <div className="bg-[#1E222D] rounded-xl p-6 border border-pink-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <h3 className="font-medium">Smart Recommendations</h3>
              </div>
              <div className="relative h-24 overflow-hidden rounded-lg bg-gradient-to-r from-pink-500/10 to-indigo-500/10">
                <motion.div
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 flex items-center justify-center text-pink-400"
                >
                  <p className="text-sm">Generating insights...</p>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#1E222D] rounded-xl border border-indigo-500/20">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              </div>
              <div>
                <p className="text-sm text-gray-400">
                  Soon, our AI will analyze your wallet via Solscan, monitor market conditions, and scan social sentiment to provide personalized recommendations for your portfolio optimization.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 