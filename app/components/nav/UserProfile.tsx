'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/app/providers/WalletProvider'
import { motion } from 'framer-motion'
import { 
  Coins, 
  Trophy, 
  BookOpen, 
  TrendingUp,
  BarChart2,
  Target,
  Clock,
  User
} from 'lucide-react'

interface UserData {
  id: string
  walletAddress: string
  username: string
  currentLevel: number
  totalXp: number
  portfolio: {
    balance: number
  }
  totalTrades: number
  winningTrades: number
  totalPnl: number
  winRate: number
  bestTrade: number
  worstTrade: number
  totalLessonsCompleted: number
  achievements: Array<{
    name: string
    unlockedAt: Date
  }>
}

export default function UserProfile() {
  const { walletAddress } = useWallet()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!walletAddress) {
        setUserData(null)
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/users?walletAddress=${walletAddress}`)
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
        } else {
          console.error('Failed to fetch user data')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [walletAddress])

  if (!userData || loading) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-3"
    >
      <div className="space-y-2">
        {/* Username */}
        {userData.username && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2A2D35]/50">
            <User className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">
              {userData.username}
            </span>
          </div>
        )}

        {/* Balance */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2A2D35]/50">
          <Coins className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-gray-300">
            ${userData.portfolio?.balance.toLocaleString()}
          </span>
        </div>

        {/* Level & XP */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2A2D35]/50">
          <Trophy className="h-4 w-4 text-yellow-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-300">
              Level {userData.currentLevel}
            </span>
            <span className="text-xs text-gray-500">
              {userData.totalXp.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Trading Stats */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2A2D35]/50">
          <TrendingUp className="h-4 w-4 text-blue-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-300">
              {userData.totalTrades} Trades
            </span>
            <span className="text-xs text-gray-500">
              {userData.winRate}% Win Rate
            </span>
          </div>
        </div>

        {/* PnL */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2A2D35]/50">
          <BarChart2 className="h-4 w-4 text-red-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-300">
              ${userData.totalPnl?.toLocaleString() || '0'}
            </span>
            <span className="text-xs text-gray-500">
              Best: ${userData.bestTrade?.toLocaleString() || '0'}
            </span>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2A2D35]/50">
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-300">
              {userData.totalLessonsCompleted} Lessons
            </span>
            <span className="text-xs text-gray-500">
              {userData.achievements.length} Achievements
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 