'use client'

import { useState } from 'react'

interface TraderActivity {
  id: number
  username: string
  action: string
  pair: string
  time: string
  profit?: number
}

const mockActivities: TraderActivity[] = [
  {
    id: 1,
    username: "MemeKing",
    action: "Opened Long",
    pair: "BONK/USDT",
    time: "2m ago",
    profit: 450
  },
  {
    id: 2,
    username: "CryptoWhale",
    action: "Closed Short",
    pair: "WIF/USDT",
    time: "5m ago",
    profit: 890
  },
  {
    id: 3,
    username: "DiamondHands",
    action: "Opened Long",
    pair: "MYRO/USDT",
    time: "12m ago"
  },
  {
    id: 4,
    username: "MoonShot",
    action: "Added to Position",
    pair: "PEPE/USDT",
    time: "15m ago"
  },
  {
    id: 5,
    username: "HODLer",
    action: "Closed Long",
    pair: "FLOKI/USDT",
    time: "20m ago",
    profit: -120
  }
]

export default function SocialTrading() {
  const [filter, setFilter] = useState<'all' | 'following'>('all')

  return (
    <div className="bg-[#1C2127]/50 rounded-xl p-4 backdrop-blur-md border border-[#2A2D35]/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Social Trading</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-[#2A2D35] text-gray-400 hover:bg-[#3A3D45]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('following')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'following'
                ? 'bg-blue-500 text-white'
                : 'bg-[#2A2D35] text-gray-400 hover:bg-[#3A3D45]'
            }`}
          >
            Following
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {mockActivities.map((activity) => (
          <div
            key={activity.id}
            className="p-3 bg-[#2A2D35] rounded-lg hover:bg-[#3A3D45] transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{activity.username}</span>
                <span className="text-gray-400 text-sm">{activity.time}</span>
              </div>
              <button className="text-blue-400 hover:text-blue-300 text-sm">
                Follow
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">{activity.action}</span>
                <span className="text-blue-400">{activity.pair}</span>
              </div>
              {activity.profit !== undefined && (
                <span className={activity.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {activity.profit >= 0 ? '+' : ''}{activity.profit} USDT
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-3 py-2 bg-[#2A2D35] hover:bg-[#3A3D45] text-white rounded-lg transition-colors">
        View More
      </button>
    </div>
  )
} 