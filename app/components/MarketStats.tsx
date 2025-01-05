'use client'

import { LineChart, TrendingUp, DollarSign } from 'lucide-react'

export default function MarketStats() {
  return (
    <div className="bg-[#1C2127]/50 rounded-xl p-4 backdrop-blur-md border border-[#2A2D35]/50">
      <h2 className="text-lg font-semibold mb-4">Market Stats</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-[#2A2D35]/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">24h Volume</span>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold">$1.2M</div>
        </div>

        <div className="p-4 bg-[#2A2D35]/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Price Change</span>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-xl font-bold text-green-400">+5.2%</div>
        </div>

        <div className="p-4 bg-[#2A2D35]/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Market Cap</span>
            <LineChart className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold">$42.5M</div>
        </div>
      </div>
    </div>
  )
} 