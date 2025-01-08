'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/providers/WalletProvider'
import { motion } from 'framer-motion'
import { 
  Coins, 
  Trophy, 
  BookOpen, 
  TrendingUp,
  BarChart2,
  User,
  Loader2
} from 'lucide-react'
import type { UserData } from '@/lib/actions/user'

export default function UserProfile() {
  const { walletAddress } = useWallet()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchUserData = () => {
      if (!walletAddress) {
        setUserData(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      fetch(`/api/users?walletAddress=${walletAddress}`)
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || 'Failed to fetch user data')
          }
          return response.json() as Promise<UserData>
        })
        .then((data: UserData) => {
          if (mounted) {
            setUserData(data)
            setError(null)
            setLoading(false)
          }
        })
        .catch((error: Error) => {
          if (mounted) {
            console.error('Error fetching user data:', error)
            setError(error.message)
            setLoading(false)
          }
        })
    }

    fetchUserData()

    return () => {
      mounted = false
    }
  }, [walletAddress])

  if (!walletAddress) {
    return (
      <div className="px-4 py-3 text-sm text-gray-400">
        Connect your wallet to view profile
      </div>
    )
  }

  if (loading) {
    return (
      <div className="px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading profile...
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-3 text-sm text-red-400">
        Error: {error}
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="px-4 py-3 text-sm text-gray-400">
        No profile data found
      </div>
    )
  }

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
              {userData.winRate.toFixed(1)}% Win Rate
            </span>
          </div>
        </div>

        {/* PnL */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2A2D35]/50">
          <BarChart2 className="h-4 w-4 text-red-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-300">
              ${userData.totalPnl.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">
              Best: ${userData.bestTrade.toLocaleString()}
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