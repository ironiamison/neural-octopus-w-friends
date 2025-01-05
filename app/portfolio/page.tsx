'use client'

import { useState } from 'react'
import { Wallet, TrendingUp, TrendingDown, Clock, DollarSign, BarChart2, ArrowRight } from 'lucide-react'

interface Position {
  id: string
  pair: string
  type: 'long' | 'short'
  entryPrice: number
  currentPrice: number
  size: number
  pnl: number
  timestamp: string
  leverage: number
  liquidationPrice: number
}

interface Asset {
  symbol: string
  name: string
  balance: number
  value: number
  priceChange24h: number
}

const positions: Position[] = [
  {
    id: '1',
    pair: 'BONK/USD',
    type: 'long',
    entryPrice: 0.00001234,
    currentPrice: 0.00001456,
    size: 1000,
    pnl: 180.23,
    timestamp: '2024-02-10T14:30:00Z',
    leverage: 5,
    liquidationPrice: 0.00000987
  },
  {
    id: '2',
    pair: 'WIF/USD',
    type: 'short',
    entryPrice: 0.00000789,
    currentPrice: 0.00000654,
    size: 2000,
    pnl: 342.56,
    timestamp: '2024-02-09T16:45:00Z',
    leverage: 3,
    liquidationPrice: 0.00000912
  }
]

const assets: Asset[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: 15234.56,
    value: 15234.56,
    priceChange24h: 0
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    balance: 1234567.89,
    value: 15.67,
    priceChange24h: 12.34
  },
  {
    symbol: 'WIF',
    name: 'Wif',
    balance: 45678.90,
    value: 23.45,
    priceChange24h: -5.67
  }
]

const portfolioStats = {
  totalValue: 15273.68,
  totalPnL: 522.79,
  pnLChange24h: 8.45,
  availableBalance: 14750.89
}

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Portfolio</h1>
            <p className="text-gray-400 mt-2">Manage your positions and assets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1C2127]/50 rounded-xl p-6 backdrop-blur-md border border-[#2A2D35]/50">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <Wallet className="h-5 w-5" />
              <span>Total Value</span>
            </div>
            <div className="text-2xl font-bold">
              ${portfolioStats.totalValue.toFixed(2)}
            </div>
          </div>

          <div className="bg-[#1C2127]/50 rounded-xl p-6 backdrop-blur-md border border-[#2A2D35]/50">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <DollarSign className="h-5 w-5" />
              <span>Available Balance</span>
            </div>
            <div className="text-2xl font-bold">
              ${portfolioStats.availableBalance.toFixed(2)}
            </div>
          </div>

          <div className="bg-[#1C2127]/50 rounded-xl p-6 backdrop-blur-md border border-[#2A2D35]/50">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <BarChart2 className="h-5 w-5" />
              <span>Total P&L</span>
            </div>
            <div className={`text-2xl font-bold ${
              portfolioStats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              ${portfolioStats.totalPnL.toFixed(2)}
            </div>
          </div>

          <div className="bg-[#1C2127]/50 rounded-xl p-6 backdrop-blur-md border border-[#2A2D35]/50">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <Clock className="h-5 w-5" />
              <span>24h Change</span>
            </div>
            <div className={`text-2xl font-bold ${
              portfolioStats.pnLChange24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {portfolioStats.pnLChange24h >= 0 ? '+' : ''}{portfolioStats.pnLChange24h}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1C2127]/50 rounded-xl backdrop-blur-md border border-[#2A2D35]/50">
            <div className="p-4 border-b border-[#2A2D35]">
              <h2 className="font-bold">Open Positions</h2>
            </div>
            <div className="divide-y divide-[#2A2D35]">
              {positions.map(position => (
                <div key={position.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold">{position.pair}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          position.type === 'long'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {position.type.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-sm">{position.leverage}x</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(position.timestamp).toLocaleString()}</span>
                        </div>
                        <span>Size: ${position.size.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ${position.pnl.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {position.entryPrice.toFixed(8)} → {position.currentPrice.toFixed(8)}
                      </div>
                      <div className="text-xs text-gray-400">
                        Liq. Price: {position.liquidationPrice.toFixed(8)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {positions.length === 0 && (
                <div className="p-4 text-center text-gray-400">
                  No open positions
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#1C2127]/50 rounded-xl backdrop-blur-md border border-[#2A2D35]/50">
            <div className="p-4 border-b border-[#2A2D35]">
              <h2 className="font-bold">Assets</h2>
            </div>
            <div className="divide-y divide-[#2A2D35]">
              {assets.map(asset => (
                <div key={asset.symbol} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{asset.symbol}</span>
                        <span className="text-gray-400 text-sm">{asset.name}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {asset.balance.toLocaleString()} {asset.symbol}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${asset.value.toFixed(2)}</div>
                      <div className={`text-sm ${
                        asset.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h}%
                      </div>
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