'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '../providers/WalletProvider'
import { ConnectWalletPrompt } from '../components/ConnectWalletPrompt'
import { motion } from 'framer-motion'
import { Trophy, Star, Sparkles, Crown, Target, Rocket, Bot, Medal, TrendingUp, DollarSign } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'

interface LeaderboardEntry {
  rank: number
  walletAddress: string
  username: string
  totalPnl: number
  winRate: number
  totalTrades: number
  bestTrade: number
  level: number
  xp: number
}

interface LeaderboardData {
  topTraders: LeaderboardEntry[]
  userRank?: LeaderboardEntry
  weeklyChampions: LeaderboardEntry[]
  aiChallenges: {
    id: string
    title: string
    description: string
    reward: string
    participants: number
    endsIn: string
  }[]
}

export default function LeaderboardPage() {
  const { isConnected, walletAddress } = useWallet()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<LeaderboardData | null>(null)

  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        const response = await fetch('/api/leaderboard')
        if (!response.ok) throw new Error('Failed to fetch leaderboard data')
        const leaderboardData = await response.json()
        setData(leaderboardData)
      } catch (error) {
        console.error('Error fetching leaderboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboardData()
  }, [])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-[#0D1117] to-black text-white p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <ConnectWalletPrompt 
            title="Global Leaderboards"
            description="Connect your wallet to compete with top traders and join AI trading challenges"
            features={[
              {
                title: "Weekly Tournaments",
                description: "Compete in weekly trading competitions with prize pools",
                icon: "🏆"
              },
              {
                title: "AI Challenges",
                description: "Test your skills against AI16Z in special events",
                icon: "🤖"
              },
              {
                title: "Global Rankings",
                description: "Climb the ranks and earn exclusive rewards",
                icon: "⭐"
              }
            ]}
          />

          {/* Live Leaderboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-transparent bg-clip-text">
                Live Trading Competition
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Real-time USDC rewards for top performers - Updated every minute
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Leaders */}
              <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500/20 p-3 rounded-xl">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Current Leaders</h3>
                      <p className="text-sm text-gray-400">Live Rankings</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-gray-400">2d 14h left</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#1E222D] rounded-xl border border-yellow-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-yellow-400">CryptoWhale</p>
                        <p className="text-sm text-gray-400">+892.45% (Live)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-yellow-400">25,000 USDC</p>
                      <p className="text-sm text-gray-400">Current Prize</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#1E222D] rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center">
                        <Medal className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">TradeNinja</p>
                        <p className="text-sm text-gray-400">+654.21% (Live)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">10,000 USDC</p>
                      <p className="text-sm text-gray-400">Current Prize</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#1E222D] rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
                        <Medal className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">AlphaHunter</p>
                        <p className="text-sm text-gray-400">+521.87% (Live)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">5,000 USDC</p>
                      <p className="text-sm text-gray-400">Current Prize</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prize Pool & Benefits */}
              <div className="space-y-6">
                <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-500/20 p-3 rounded-xl">
                      <DollarSign className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Live Prize Pool</h3>
                      <p className="text-sm text-gray-400">Real USDC Rewards</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                    50,000 USDC
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-gray-400">Live Prize Pool</span>
                  </div>
                </div>

                <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
                  <h3 className="font-semibold mb-4">Winner Benefits</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-400">Exclusive NFT Badge</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-400">Featured on Global Leaderboard</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-400">VIP Trading Benefits</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-500/20 p-3 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Current Volume</h3>
                      <p className="text-sm text-gray-400">24h Trading Volume</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    $12.5M USDC
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-gray-400">Live Updates</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-[1px] rounded-lg"
              >
                <div className="px-6 py-3 bg-[#1E222D] rounded-lg flex items-center gap-2 text-yellow-400 font-medium">
                  <Trophy className="w-4 h-4" />
                  <span>Connect Wallet to Start Competing</span>
                </div>
              </motion.div>
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
          <p className="text-gray-400">Loading leaderboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-[#0D1117] to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with User Rank */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-8 border border-gray-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">
                {data?.userRank?.rank || '?'}
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Global Rankings
                </h1>
                <p className="text-gray-400">Your current rank: #{data?.userRank?.rank || 'Not ranked'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-lg bg-[#1E222D] border border-gray-800">
                <span className="text-sm text-gray-400">Win Rate</span>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="font-semibold text-green-400">{data?.userRank?.winRate}%</span>
                </div>
              </div>
              <div className="px-4 py-2 rounded-lg bg-[#1E222D] border border-gray-800">
                <span className="text-sm text-gray-400">Level</span>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-yellow-400">{data?.userRank?.level}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Top Traders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-6">Top Traders</h3>
            <div className="space-y-4">
              {data?.topTraders.map((trader, index) => (
                <div
                  key={trader.walletAddress}
                  className="flex items-center justify-between p-4 bg-[#1E222D] rounded-xl border border-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{trader.username}</p>
                      <p className="text-sm text-gray-400">{trader.walletAddress.slice(0, 4)}...{trader.walletAddress.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-400">+{trader.totalPnl.toLocaleString()}%</p>
                    <p className="text-sm text-gray-400">{trader.totalTrades} trades</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Challenges & Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Weekly Champions */}
            <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-yellow-500/20 p-3 rounded-xl">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Weekly Champions</h3>
                  <p className="text-sm text-gray-400">Top performers this week</p>
                </div>
              </div>
              <div className="space-y-4">
                {data?.weeklyChampions.slice(0, 3).map((champion, index) => (
                  <div key={champion.walletAddress} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {index === 0 ? (
                        <Crown className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <Medal className="w-5 h-5 text-gray-400" />
                      )}
                      <span className={index === 0 ? 'text-yellow-400' : 'text-gray-400'}>
                        {champion.username}
                      </span>
                    </div>
                    <span className={index === 0 ? 'text-yellow-400' : 'text-gray-400'}>
                      +{champion.totalPnl.toLocaleString()}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Challenges */}
            <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-500/20 p-3 rounded-xl">
                  <Bot className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">AI Challenges</h3>
                  <p className="text-sm text-gray-400">Beat AI16Z to earn rewards</p>
                </div>
              </div>
              <div className="space-y-4">
                {data?.aiChallenges.map((challenge) => (
                  <div key={challenge.id} className="bg-[#1E222D] rounded-xl p-4 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-purple-400">{challenge.title}</span>
                      <span className="text-sm text-gray-400">{challenge.endsIn}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{challenge.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-400">{challenge.reward}</span>
                      <span className="text-gray-400">{challenge.participants} participants</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 