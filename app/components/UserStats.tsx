import React from 'react'
import { UserStats as UserStatsType } from '@/types/trading'
import { formatNumber } from '@/lib/utils/format'
import { Trophy, TrendingUp, Sparkles, DollarSign } from 'lucide-react'

interface UserStatsProps {
  stats: UserStatsType
}

export default function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-gray-400">Balance</span>
        </div>
        <span className="font-medium text-white">
          ${formatNumber(stats.balance)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-gray-400">Level</span>
        </div>
        <span className="font-medium text-white">
          {stats.level}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span className="text-gray-400">Win Rate</span>
        </div>
        <span className="font-medium text-white">
          {stats.winRate.toFixed(1)}%
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-gray-400">XP</span>
        </div>
        <span className="font-medium text-white">
          {formatNumber(stats.xp)}
        </span>
      </div>

      {stats.achievements && stats.achievements.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Achievements</h3>
          <div className="space-y-2">
            {stats.achievements.slice(0, 3).map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-2 bg-gray-700/50 rounded-lg p-2"
              >
                <img
                  src={achievement.icon}
                  alt={achievement.name}
                  className="w-6 h-6"
                />
                <div>
                  <div className="text-sm font-medium text-white">
                    {achievement.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 