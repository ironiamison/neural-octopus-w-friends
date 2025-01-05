'use client'

import { useState } from 'react'
import { Tab } from '@headlessui/react'

interface Position {
  pair: string
  type: 'LONG' | 'SHORT'
  amount: number
  leverage: number
  entryPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
  openTime: string
}

const mockPositions: Position[] = [
  {
    pair: 'BONK/SOL',
    type: 'LONG',
    amount: 1000,
    leverage: 10,
    entryPrice: 0.1234,
    currentPrice: 0.1334,
    pnl: 810,
    pnlPercent: 8.1,
    openTime: '2024-01-20T10:30:00Z'
  },
  {
    pair: 'WIF/SOL',
    type: 'SHORT',
    amount: 500,
    leverage: 5,
    entryPrice: 0.5678,
    currentPrice: 0.5234,
    pnl: 195,
    pnlPercent: 7.8,
    openTime: '2024-01-20T11:15:00Z'
  }
]

const mockHistory = [
  {
    pair: 'BONK/SOL',
    type: 'LONG',
    amount: 2000,
    leverage: 20,
    entryPrice: 0.1134,
    currentPrice: 0.1534,
    pnl: 7080,
    pnlPercent: 70.8,
    openTime: '2024-01-19T15:30:00Z'
  },
  {
    pair: 'WIF/SOL',
    type: 'LONG',
    amount: 1000,
    leverage: 10,
    entryPrice: 0.4678,
    currentPrice: 0.4234,
    pnl: -944,
    pnlPercent: -18.8,
    openTime: '2024-01-19T16:45:00Z'
  }
]

export default function Positions() {
  const [selectedTab, setSelectedTab] = useState(0)

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString()
  }

  const renderPosition = (position: Position, showCloseButton = false) => (
    <div key={position.openTime} className="bg-[#1E222D] rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className={`text-sm font-semibold px-2 py-1 rounded ${
            position.type === 'LONG' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
          }`}>
            {position.type}
          </span>
          <span className="font-bold">{position.pair}</span>
        </div>
        <div className="text-sm text-gray-400">
          {formatTime(position.openTime)}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-400">Size</p>
          <p className="font-medium">${position.amount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Leverage</p>
          <p className="font-medium">{position.leverage}x</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Entry Price</p>
          <p className="font-medium">${position.entryPrice.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Mark Price</p>
          <p className="font-medium">${position.currentPrice.toFixed(4)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">PnL (ROE%)</p>
          <p className={`font-bold ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${position.pnl.toLocaleString()} ({position.pnlPercent}%)
          </p>
        </div>
        {showCloseButton && (
          <button 
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
            onClick={() => {
              // Handle position close
              showAchievement('Profit Master', 'Close a position with over 50% ROE', 500)
            }}
          >
            Close Position
          </button>
        )}
      </div>
    </div>
  )

  const showAchievement = (title: string, description: string, xp: number) => {
    const notification = document.createElement('div')
    notification.className = 'fixed bottom-4 right-4 bg-[#1E222D] rounded-lg p-4 shadow-xl border border-purple-500/20 animate-slide-up'
    notification.innerHTML = `
      <div class="flex items-center gap-4">
        <div class="bg-purple-500 rounded-full p-2">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 class="font-bold text-white">${title}</h3>
          <p class="text-sm text-gray-400">${description}</p>
          <p class="text-sm text-purple-400">+${xp} XP</p>
        </div>
      </div>
    `
    document.body.appendChild(notification)
    setTimeout(() => notification.remove(), 5000)
  }

  return (
    <div className="bg-[#1E222D] rounded-lg p-4">
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-2 mb-6">
          <Tab className={({ selected }) => `
            flex-1 py-2.5 text-sm font-medium rounded-lg
            ${selected 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }
          `}>
            Positions ({mockPositions.length})
          </Tab>
          <Tab className={({ selected }) => `
            flex-1 py-2.5 text-sm font-medium rounded-lg
            ${selected 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }
          `}>
            History
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel className="space-y-4">
            {mockPositions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No active positions
              </div>
            ) : (
              mockPositions.map(position => renderPosition(position, true))
            )}
          </Tab.Panel>
          <Tab.Panel className="space-y-4">
            {mockHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No trading history
              </div>
            ) : (
              mockHistory.map(position => renderPosition(position))
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
} 