'use client'

import { useState } from 'react'
import { Trophy, Clock, Users, DollarSign, Flame } from 'lucide-react'

interface Competition {
  id: string
  name: string
  description: string
  prizePool: number
  participants: number
  endsIn: string
  requirements: string[]
}

interface Trader {
  id: string
  username: string
  winRate: number
  pnl: number
  streak: number
  rank: number
  change24h: number
}

export default function CompetePage() {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'completed'>('active')

  const competitions: Competition[] = [
    {
      id: '1',
      name: 'Weekly Meme Trading',
      description: 'Trade meme coins and compete for the highest returns in our weekly competition.',
      prizePool: 10000,
      participants: 1234,
      endsIn: '2d 14h',
      requirements: ['Minimum 100 USDT balance', 'At least 5 completed trades', 'Trade only meme coins']
    },
    {
      id: '2',
      name: 'Diamond Hands Challenge',
      description: 'Hold your positions for the longest time while maintaining profit.',
      prizePool: 25000,
      participants: 856,
      endsIn: '5d 8h',
      requirements: ['Minimum 500 USDT balance', 'Hold positions for at least 24h', 'No stop losses allowed']
    },
    {
      id: '3',
      name: 'Leverage Master',
      description: 'High-risk, high-reward competition using maximum leverage.',
      prizePool: 15000,
      participants: 967,
      endsIn: '3d 22h',
      requirements: ['Minimum 1000 USDT balance', 'Use minimum 10x leverage', 'Maximum 5 positions']
    }
  ]

  const traders: Trader[] = [
    { id: '1', username: 'MemeKing', winRate: 78.5, pnl: 12450, streak: 7, rank: 1, change24h: 2 },
    { id: '2', username: 'CryptoWhale', winRate: 72.3, pnl: 8920, streak: 4, rank: 2, change24h: -1 },
    { id: '3', username: 'DiamondHands', winRate: 68.9, pnl: 6780, streak: 0, rank: 3, change24h: 1 },
    { id: '4', username: 'MoonShot', winRate: 65.2, pnl: 5430, streak: 2, rank: 4, change24h: 0 },
    { id: '5', username: 'HODLer', winRate: 62.8, pnl: 4210, streak: 1, rank: 5, change24h: -2 }
  ]

  return (
    <div className="max-w-[1920px] mx-auto p-4 md:p-6 pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Competitions */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Competitions</h1>
            <div className="flex gap-2">
              {(['active', 'upcoming', 'completed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:bg-[#2A2D35]/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {competitions.map((competition) => (
              <div
                key={competition.id}
                className="bg-[#1C2127]/50 rounded-xl p-6 backdrop-blur-md border border-[#2A2D35]/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{competition.name}</h3>
                    <p className="text-gray-400 mb-4">{competition.description}</p>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-400">${competition.prizePool.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-400">{competition.participants.toLocaleString()} participants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-400">Ends in {competition.endsIn}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    Join Now
                  </button>
                </div>
                <div className="border-t border-[#2A2D35]/50 pt-4">
                  <h4 className="text-sm text-gray-400 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {competition.requirements.map((req, index) => (
                      <li key={index} className="text-gray-300">{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1C2127]/50 rounded-xl p-6 backdrop-blur-md border border-[#2A2D35]/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Top Traders</h2>
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="space-y-4">
              {traders.map((trader) => (
                <div
                  key={trader.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#2A2D35]/30"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-600">#{trader.rank}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{trader.username}</span>
                        {trader.streak > 0 && (
                          <div className="flex items-center gap-1">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span className="text-yellow-400">{trader.streak}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        Win Rate: <span className="text-green-400">{trader.winRate}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-400">${trader.pnl.toLocaleString()}</div>
                    <div className={`text-sm ${trader.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trader.change24h > 0 && '+'}
                      {trader.change24h} ranks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 