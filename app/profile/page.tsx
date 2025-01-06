'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '../providers/WalletProvider'
import { ConnectWalletPrompt } from '../components/ConnectWalletPrompt'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import { motion } from 'framer-motion'
import { ChartBar, Trophy, BookOpen, Star, ArrowRight } from 'lucide-react'

interface UserStats {
  totalTrades: number
  winRate: number
  totalPnl: number
  achievements: Achievement[]
  learningProgress: LearningModule[]
}

interface Achievement {
  id: string
  title: string
  description: string
  progress: number
  total: number
  completed: boolean
}

interface LearningModule {
  id: string
  title: string
  progress: number
}

export default function ProfilePage() {
  const { isConnected, walletAddress } = useWallet()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserStats() {
      if (!walletAddress) return
      
      try {
        const response = await fetch(`/api/user/stats?address=${walletAddress}`)
        if (!response.ok) throw new Error('Failed to fetch user stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching user stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isConnected) {
      fetchUserStats()
    }
  }, [isConnected, walletAddress])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <ConnectWalletPrompt 
            title="Your Profile"
            description="Connect your wallet to access your personalized profile and trading statistics"
            features={[
              {
                title: "Trading Analytics",
                description: "View your trading performance and history",
                icon: "📊"
              },
              {
                title: "Achievement System",
                description: "Earn badges and track milestones",
                icon: "🏆"
              },
              {
                title: "Learning Hub",
                description: "Master trading with guided courses",
                icon: "📚"
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
            <h2 className="text-2xl font-bold text-center mb-8">Experience Our Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sample Profile Card */}
              <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F0B90B] to-purple-600 flex items-center justify-center text-lg font-bold">
                    OP
                  </div>
                  <div>
                    <h3 className="font-semibold">Pro Trader</h3>
                    <p className="text-sm text-gray-400">Level 8</p>
                  </div>
                </div>
                <div className="space-y-4 opacity-75">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Experience</span>
                    <span className="text-[#F0B90B]">8,450 XP</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full">
                    <div className="bg-[#F0B90B] h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>

              {/* Sample Achievements */}
              <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-500/20 p-3 rounded-xl">
                    <Trophy className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold">Achievements</h3>
                </div>
                <div className="space-y-4 opacity-75">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Diamond Hands</p>
                      <p className="text-sm text-gray-400">Hold winning trades</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Sharp Eye</p>
                      <p className="text-sm text-gray-400">Spot market trends</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Learning Progress */}
              <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#F0B90B]/20 p-3 rounded-xl">
                    <BookOpen className="w-6 h-6 text-[#F0B90B]" />
                  </div>
                  <h3 className="font-semibold">Learning Path</h3>
                </div>
                <div className="space-y-4 opacity-75">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Technical Analysis</span>
                      <span className="text-[#F0B90B]">80%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full">
                      <div className="bg-[#F0B90B] h-2 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Risk Management</span>
                      <span className="text-[#F0B90B]">65%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full">
                      <div className="bg-[#F0B90B] h-2 rounded-full" style={{ width: '65%' }} />
                    </div>
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
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E222D] rounded-xl p-8 border border-gray-800"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#F0B90B] to-purple-600 flex items-center justify-center text-2xl font-bold">
              {walletAddress?.slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
              </h1>
              <p className="text-gray-400">Joined 2 months ago</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <ChartBar className="w-5 h-5 text-[#F0B90B]" />
                  <h3 className="font-semibold">Trading Stats</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Trades</span>
                    <span className="font-semibold">{stats?.totalTrades || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="font-semibold text-green-500">{stats?.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total PnL</span>
                    <span className={`font-semibold ${(stats?.totalPnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {(stats?.totalPnl || 0) >= 0 ? '+' : ''}{(stats?.totalPnl || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-5 h-5 text-[#F0B90B]" />
                  <h3 className="font-semibold">Recent Achievements</h3>
                </div>
                <div className="space-y-4">
                  {stats?.achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Star className={`w-5 h-5 ${achievement.completed ? 'text-yellow-500' : 'text-gray-500'}`} />
                        <span>{achievement.title}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats?.achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1E222D] rounded-xl p-6 border border-gray-800"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#F0B90B]/20 flex items-center justify-center">
                        <Trophy className={`w-6 h-6 ${achievement.completed ? 'text-[#F0B90B]' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-[#F0B90B] h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(achievement.progress / achievement.total) * 100}%` }} 
                      />
                    </div>
                    <p className="text-right text-sm text-gray-400 mt-2">
                      {achievement.progress}/{achievement.total}
                    </p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="learning">
              <div className="space-y-6">
                <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-5 h-5 text-[#F0B90B]" />
                    <h3 className="font-semibold">Learning Progress</h3>
                  </div>
                  <div className="space-y-6">
                    {stats?.learningProgress.map((module) => (
                      <div key={module.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{module.title}</span>
                          <span className="text-gray-400">{module.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="bg-[#F0B90B] h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${module.progress}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold mb-4">Profile Settings</h3>
                <p className="text-gray-400">Coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
} 