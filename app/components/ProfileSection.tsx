'use client'

import { useState, useEffect } from 'react'
import { LineChart, Wallet, History } from 'lucide-react'

interface PnLData {
  date: string
  pnl: number
  trades: number
}

const mockPnLData: PnLData[] = Array.from({ length: 7 }, (_, i) => ({
  date: 'Loading...',
  pnl: 0,
  trades: 0
}))

export default function ProfileSection() {
  const [pnlData, setPnlData] = useState(mockPnLData);

  useEffect(() => {
    setPnlData(Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      pnl: Math.random() * 2000 - 1000,
      trades: Math.floor(Math.random() * 20)
    })));
  }, []);

  const [view, setView] = useState<'daily' | 'weekly'>('daily')
  
  return (
    <div className="fixed top-14 right-0 w-80 h-[calc(100vh-3.5rem)] bg-[#1E2329] border-l border-[#2A2D35]">
      <div className="p-4 border-b border-[#2A2D35]">
        <h2 className="text-lg font-medium text-white">Trading Profile</h2>
      </div>

      <div className="p-4 border-b border-[#2A2D35]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#F0B90B]" />
            <span className="text-sm text-[#848E9C]">Balance</span>
          </div>
          <span className="text-white font-medium">$10,000.00</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#F0B90B]" />
            <span className="text-sm text-[#848E9C]">24h PnL</span>
          </div>
          <span className="text-[#02C076] font-medium">+$523.45</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LineChart className="w-4 h-4 text-[#F0B90B]" />
            <span className="text-sm text-white">PnL History</span>
          </div>
          <div className="flex gap-1">
            <button
              className={`px-2 py-1 text-xs rounded ${
                view === 'daily' 
                  ? 'bg-[#F0B90B] text-black' 
                  : 'text-[#848E9C] hover:text-white'
              }`}
              onClick={() => setView('daily')}
            >
              Daily
            </button>
            <button
              className={`px-2 py-1 text-xs rounded ${
                view === 'weekly' 
                  ? 'bg-[#F0B90B] text-black' 
                  : 'text-[#848E9C] hover:text-white'
              }`}
              onClick={() => setView('weekly')}
            >
              Weekly
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {pnlData.map((day) => (
            <div
              key={day.date}
              className="p-3 bg-[#2A2D35] rounded"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#848E9C]">{day.date}</span>
                <span className={`text-sm font-medium ${
                  day.pnl >= 0 ? 'text-[#02C076]' : 'text-[#F6465D]'
                }`}>
                  {day.pnl >= 0 ? '+' : ''}{day.pnl.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-[#848E9C]">
                {day.trades} trades
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 