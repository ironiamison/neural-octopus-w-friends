'use client'

import { useState, useEffect } from 'react'
import { Bot, Settings, TrendingUp, AlertTriangle, DollarSign, BarChart2, Clock } from 'lucide-react'

interface TradingBotConfig {
  strategy: string
  riskLevel: 'low' | 'medium' | 'high'
  maxPositions: number
  tokenPairs: string[]
  timeframe: string
}

interface BotStatus {
  isActive: boolean
  currentPositions: number
  profitLoss: number
  lastTrade: {
    pair: string
    type: 'buy' | 'sell'
    price: number
    timestamp: number
  }
  performance: {
    daily: number
    weekly: number
    monthly: number
  }
}

export default function TradingBot() {
  const [config, setConfig] = useState<TradingBotConfig>({
    strategy: 'momentum',
    riskLevel: 'medium',
    maxPositions: 5,
    tokenPairs: ['BONK/USDC', 'WIF/USDC'],
    timeframe: '4h'
  })

  const [status, setStatus] = useState<BotStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function initializeBot() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/trading/eliza', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        throw new Error('Failed to initialize trading bot')
      }

      const data = await response.json()
      setStatus(data.status)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status?.isActive) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch('/api/trading/eliza/status')
          if (response.ok) {
            const data = await response.json()
            setStatus(data.status)
          }
        } catch (error) {
          console.error('Error fetching bot status:', error)
        }
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [status?.isActive])

  return (
    <div className="bg-[#1E222D] rounded-lg border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bot className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Trading Bot</h2>
        </div>
        <button
          onClick={initializeBot}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            status?.isActive
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
          }`}
        >
          {status?.isActive ? 'Stop Bot' : 'Start Bot'}
        </button>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Strategy</label>
            <select
              value={config.strategy}
              onChange={(e) => setConfig({ ...config, strategy: e.target.value })}
              className="w-full bg-[#262B35] text-white rounded border border-gray-800 px-3 py-2"
            >
              <option value="momentum">Momentum</option>
              <option value="mean-reversion">Mean Reversion</option>
              <option value="breakout">Breakout</option>
              <option value="grid">Grid Trading</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Risk Level</label>
            <select
              value={config.riskLevel}
              onChange={(e) => setConfig({ ...config, riskLevel: e.target.value as any })}
              className="w-full bg-[#262B35] text-white rounded border border-gray-800 px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Max Positions</label>
            <input
              type="number"
              value={config.maxPositions}
              onChange={(e) => setConfig({ ...config, maxPositions: parseInt(e.target.value) })}
              className="w-full bg-[#262B35] text-white rounded border border-gray-800 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Timeframe</label>
            <select
              value={config.timeframe}
              onChange={(e) => setConfig({ ...config, timeframe: e.target.value })}
              className="w-full bg-[#262B35] text-white rounded border border-gray-800 px-3 py-2"
            >
              <option value="5m">5 minutes</option>
              <option value="15m">15 minutes</option>
              <option value="1h">1 hour</option>
              <option value="4h">4 hours</option>
              <option value="1d">1 day</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Display */}
      {status && (
        <div className="border-t border-gray-800 pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#262B35] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Positions</span>
                <BarChart2 className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {status.currentPositions}/{config.maxPositions}
              </div>
            </div>
            <div className="bg-[#262B35] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Profit/Loss</span>
                <DollarSign className="w-4 h-4 text-blue-400" />
              </div>
              <div className={`text-2xl font-bold ${
                status.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {status.profitLoss >= 0 ? '+' : ''}{status.profitLoss.toFixed(2)}%
              </div>
            </div>
            <div className="bg-[#262B35] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Last Trade</span>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-sm text-white">
                {status.lastTrade.pair} • {status.lastTrade.type.toUpperCase()}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(status.lastTrade.timestamp).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Performance</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`text-sm ${
                    status.performance.daily >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    24h: {status.performance.daily >= 0 ? '+' : ''}{status.performance.daily}%
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`text-sm ${
                    status.performance.weekly >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    7d: {status.performance.weekly >= 0 ? '+' : ''}{status.performance.weekly}%
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`text-sm ${
                    status.performance.monthly >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    30d: {status.performance.monthly >= 0 ? '+' : ''}{status.performance.monthly}%
                  </div>
                </div>
              </div>
            </div>
            {/* Add TradingView chart or custom chart component here */}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      )}
    </div>
  )
} 