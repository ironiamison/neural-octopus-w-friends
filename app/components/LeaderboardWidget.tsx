'use client'

import { useState } from 'react'
import { Flame } from 'lucide-react'

interface Trader {
  id: string
  username: string
  winRate: number
  pnl: number
  streak: number
}

export default function LeaderboardWidget() {
  const traders: Trader[] = [
    { id: '1', username: 'MemeKing', winRate: 78.5, pnl: 12450, streak: 7 },
    { id: '2', username: 'CryptoWhale', winRate: 72.3, pnl: 8920, streak: 4 },
    { id: '3', username: 'DiamondHands', winRate: 68.9, pnl: 6780, streak: 0 },
    { id: '4', username: 'MoonShot', winRate: 65.2, pnl: 5430, streak: 2 },
    { id: '5', username: 'HODLer', winRate: 62.8, pnl: 4210, streak: 1 }
  ]

  return (
    <div className="space-y-6">
      {/* Leaderboard Section */}
      <div className="bg-[#1E2128] rounded-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[32px] font-medium tracking-tight">Leaderboard</h2>
            <div className="bg-[#4A72FF] text-white px-5 py-2 rounded-full text-base font-medium">
              Rankings
            </div>
          </div>
        </div>

        <div className="space-y-[2px]">
          {traders.map((trader, index) => (
            <div
              key={trader.id}
              className="px-6 py-5 bg-[#1A1D24]"
            >
              <div className="flex items-center gap-5">
                <span className="text-[28px] font-bold text-[#4A4D57] w-8">{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[22px] font-medium">{trader.username}</span>
                    {trader.streak > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-5 h-5 text-[#FF9332]" />
                        <span className="text-[#FFB332] text-lg font-medium">{trader.streak}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-[#4BC17C] text-lg font-medium">{trader.winRate}%</div>
                </div>
                <div className="text-[#4A72FF] text-2xl font-medium">
                  ${trader.pnl.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Trading Section */}
      <div className="bg-[#1E2128] rounded-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[32px] font-medium tracking-tight">Social Trading</h2>
            <div className="flex gap-2">
              <button className="bg-[#4A72FF] text-white px-5 py-2 rounded-full text-base font-medium">
                All
              </button>
              <button className="text-[#8B8E9D] hover:text-white px-5 py-2 rounded-full text-base font-medium transition-colors">
                Following
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-[2px]">
          <div className="px-6 py-4 bg-[#1A1D24]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium">MemeKing</span>
                <span className="text-[#8B8E9D] text-sm">2m ago</span>
              </div>
              <button className="text-[#4A72FF] text-sm font-medium hover:text-[#6B8AFF] transition-colors">
                Follow
              </button>
            </div>
            <div className="text-[#8B8E9D] mb-1">Opened Long</div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A72FF]">BONK/USDT</span>
              <span className="text-[#4BC17C]">+450 USDT</span>
            </div>
          </div>

          <div className="px-6 py-4 bg-[#1A1D24]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium">CryptoWhale</span>
                <span className="text-[#8B8E9D] text-sm">5m ago</span>
              </div>
              <button className="text-[#4A72FF] text-sm font-medium hover:text-[#6B8AFF] transition-colors">
                Follow
              </button>
            </div>
            <div className="text-[#8B8E9D] mb-1">Closed Short</div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A72FF]">WIF/USDT</span>
              <span className="text-[#4BC17C]">+890 USDT</span>
            </div>
          </div>

          <div className="px-6 py-4 bg-[#1A1D24]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium">DiamondHands</span>
                <span className="text-[#8B8E9D] text-sm">12m ago</span>
              </div>
              <button className="text-[#4A72FF] text-sm font-medium hover:text-[#6B8AFF] transition-colors">
                Follow
              </button>
            </div>
            <div className="text-[#8B8E9D] mb-1">Opened Long</div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A72FF]">MYRO/USDT</span>
              <span className="text-[#8B8E9D]">-</span>
            </div>
          </div>

          <div className="px-6 py-4 bg-[#1A1D24]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium">MoonShot</span>
                <span className="text-[#8B8E9D] text-sm">15m ago</span>
              </div>
              <button className="text-[#4A72FF] text-sm font-medium hover:text-[#6B8AFF] transition-colors">
                Follow
              </button>
            </div>
            <div className="text-[#8B8E9D] mb-1">Added to Position</div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A72FF]">PEPE/USDT</span>
              <span className="text-[#8B8E9D]">-</span>
            </div>
          </div>

          <div className="px-6 py-4 bg-[#1A1D24]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium">HODLer</span>
                <span className="text-[#8B8E9D] text-sm">20m ago</span>
              </div>
              <button className="text-[#4A72FF] text-sm font-medium hover:text-[#6B8AFF] transition-colors">
                Follow
              </button>
            </div>
            <div className="text-[#8B8E9D] mb-1">Closed Long</div>
            <div className="flex items-center justify-between">
              <span className="text-[#4A72FF]">FLOKI/USDT</span>
              <span className="text-[#FF4976]">-120 USDT</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <button className="w-full text-[#8B8E9D] hover:text-white text-base font-medium transition-colors">
            View More
          </button>
        </div>
      </div>
    </div>
  )
} 