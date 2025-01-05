'use client'

import { useState } from 'react'
import { Tab } from '@headlessui/react'

interface OrderBookProps {
  pair: string
}

interface Order {
  price: number
  size: number
  total: number
}

const mockAsks: Order[] = [
  { price: 0.1245, size: 50000, total: 6225 },
  { price: 0.1244, size: 75000, total: 9330 },
  { price: 0.1243, size: 100000, total: 12430 },
  { price: 0.1242, size: 25000, total: 3105 },
  { price: 0.1241, size: 80000, total: 9928 },
]

const mockBids: Order[] = [
  { price: 0.1240, size: 60000, total: 7440 },
  { price: 0.1239, size: 45000, total: 5575.5 },
  { price: 0.1238, size: 90000, total: 11142 },
  { price: 0.1237, size: 30000, total: 3711 },
  { price: 0.1236, size: 70000, total: 8652 },
]

interface Trade {
  price: number
  size: number
  side: 'buy' | 'sell'
  time: string
}

const mockTrades: Trade[] = [
  { price: 0.1242, size: 25000, side: 'buy', time: '2024-01-20T12:30:00Z' },
  { price: 0.1241, size: 15000, side: 'sell', time: '2024-01-20T12:29:45Z' },
  { price: 0.1243, size: 35000, side: 'buy', time: '2024-01-20T12:29:30Z' },
  { price: 0.1240, size: 20000, side: 'sell', time: '2024-01-20T12:29:15Z' },
  { price: 0.1242, size: 45000, side: 'buy', time: '2024-01-20T12:29:00Z' },
]

export default function OrderBook({ pair }: OrderBookProps) {
  const [selectedTab, setSelectedTab] = useState(0)

  const maxTotal = Math.max(
    ...mockAsks.map(order => order.total),
    ...mockBids.map(order => order.total)
  )

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString()
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
            Order Book
          </Tab>
          <Tab className={({ selected }) => `
            flex-1 py-2.5 text-sm font-medium rounded-lg
            ${selected 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }
          `}>
            Recent Trades
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <div className="space-y-4">
              {/* Asks */}
              <div className="space-y-1">
                {mockAsks.map((order) => (
                  <div 
                    key={order.price}
                    className="flex items-center text-sm relative"
                  >
                    <div 
                      className="absolute inset-0 bg-red-500/10"
                      style={{ width: `${(order.total / maxTotal) * 100}%` }}
                    />
                    <div className="relative grid grid-cols-3 w-full py-1">
                      <span className="text-red-500">${order.price.toFixed(4)}</span>
                      <span className="text-right text-gray-400">{order.size.toLocaleString()}</span>
                      <span className="text-right text-gray-400">${order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Price */}
              <div className="text-center py-2 border-y border-gray-800">
                <span className="text-2xl font-bold text-white">$0.1240</span>
                <span className="text-sm text-green-500 ml-2">+2.5%</span>
              </div>

              {/* Bids */}
              <div className="space-y-1">
                {mockBids.map((order) => (
                  <div 
                    key={order.price}
                    className="flex items-center text-sm relative"
                  >
                    <div 
                      className="absolute inset-0 bg-green-500/10"
                      style={{ width: `${(order.total / maxTotal) * 100}%` }}
                    />
                    <div className="relative grid grid-cols-3 w-full py-1">
                      <span className="text-green-500">${order.price.toFixed(4)}</span>
                      <span className="text-right text-gray-400">{order.size.toLocaleString()}</span>
                      <span className="text-right text-gray-400">${order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className="space-y-2">
              {mockTrades.map((trade) => (
                <div 
                  key={trade.time}
                  className="grid grid-cols-3 text-sm py-2"
                >
                  <span className={trade.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                    ${trade.price.toFixed(4)}
                  </span>
                  <span className="text-right text-gray-400">
                    {trade.size.toLocaleString()}
                  </span>
                  <span className="text-right text-gray-400">
                    {formatTime(trade.time)}
                  </span>
                </div>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
} 