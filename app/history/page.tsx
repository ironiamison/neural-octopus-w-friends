'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Clock, DollarSign, BarChart2, Calendar } from 'lucide-react'

interface Trade {
  id: string
  pair: string
  type: 'long' | 'short'
  entryPrice: number
  exitPrice: number
  size: number
  pnl: number
  timestamp: string
  leverage: number
}

const trades: Trade[] = [
  {
    id: '1',
    pair: 'BONK/USD',
    type: 'long',
    entryPrice: 0.00001234,
    exitPrice: 0.00001456,
    size: 1000,
    pnl: 180.23,
    timestamp: '2024-02-10T14:30:00Z',
    leverage: 5
  },
  {
    id: '2',
    pair: 'WIF/USD',
    type: 'short',
    entryPrice: 0.00000789,
    exitPrice: 0.00000654,
    size: 2000,
    pnl: 342.56,
    timestamp: '2024-02-09T16:45:00Z',
    leverage: 3
  },
  {
    id: '3',
    pair: 'MYRO/USD',
    type: 'long',
    entryPrice: 0.00002345,
    exitPrice: 0.00002123,
    size: 1500,
    pnl: -156.78,
    timestamp: '2024-02-08T09:15:00Z',
    leverage: 4
  }
]

const performanceStats = {
  totalTrades: 156,
  winRate: 64.2,
  avgProfit: 245.67,
  avgLoss: -123.45,
  bestTrade: 1234.56,
  worstTrade: -567.89,
  totalPnL: 15678.90
}

export default function HistoryPage() {
  const [timeframe, setTimeframe] = useState<'1d' | '1w' | '1m' | 'all'>('1w')

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Trading History</h1>
            <p className="text-gray-400 mt-2">View your past trades and performance metrics</p>
          </div>
          <div className="flex items-center gap-2">
            {(['1d', '1w', '1m', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeframe === period
                    ? 'bg-blue-500 text-white'
                    : 'bg-[#1C2127]/50 text-gray-400 hover:text-white'
                }`}
              >
                {period.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1C2127]/50 rounded-xl p-6 backdrop-blur-md border border-[#2A2D35]/50">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <BarChart2 className="h-5 w-5" />
              <span>Performance</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Trades</span>
                <span className="font-bold">{performanceStats.totalTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Win Rate</span>
                <span className="font-bold">{performanceStats.winRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total P&L</span>
                <span className={`font-bold ${
                  performanceStats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ${performanceStats.totalPnL.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1C2127]/50 rounded-xl p-6 backdrop-blur-md border border-[#2A2D35]/50">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <TrendingUp className="h-5 w-5" />
              <span>Average</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Avg. Profit</span>
                <span className="font-bold text-green-400">
                  ${performanceStats.avgProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg. Loss</span>
                <span className="font-bold text-red-400">
                  ${performanceStats.avgLoss.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Profit Factor</span>
                <span className="font-bold">
                  {Math.abs(performanceStats.avgProfit / performanceStats.avgLoss).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1C2127]/50 rounded-xl p-6 backdrop-blur-md border border-[#2A2D35]/50">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <DollarSign className="h-5 w-5" />
              <span>Best/Worst</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Best Trade</span>
                <span className="font-bold text-green-400">
                  ${performanceStats.bestTrade.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Worst Trade</span>
                <span className="font-bold text-red-400">
                  ${performanceStats.worstTrade.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1C2127]/50 rounded-xl backdrop-blur-md border border-[#2A2D35]/50">
          <div className="p-4 border-b border-[#2A2D35]">
            <h2 className="font-bold">Recent Trades</h2>
          </div>
          <div className="divide-y divide-[#2A2D35]">
            {trades.map(trade => (
              <div key={trade.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold">{trade.pair}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        trade.type === 'long'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.type.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm">{trade.leverage}x</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(trade.timestamp).toLocaleString()}</span>
                      </div>
                      <span>Size: ${trade.size.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${trade.pnl.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {trade.entryPrice.toFixed(8)} → {trade.exitPrice.toFixed(8)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 