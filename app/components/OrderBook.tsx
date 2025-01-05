'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ClientOnly from './ClientOnly'

interface Order {
  price: number
  size: number
  total: number
}

interface OrderBookProps {
  symbol: string
}

export default function OrderBook({ symbol }: OrderBookProps) {
  const [asks, setAsks] = useState<Order[]>([])
  const [bids, setBids] = useState<Order[]>([])
  const [spread, setSpread] = useState<number>(0)
  const [lastPrice, setLastPrice] = useState<number>(0)
  const [lastPriceDirection, setLastPriceDirection] = useState<'up' | 'down'>('up')

  // Generate mock data for demonstration
  useEffect(() => {
    const generateMockOrders = (basePrice: number, count: number, side: 'ask' | 'bid'): Order[] => {
      const orders: Order[] = []
      let total = 0
      const step = side === 'ask' ? 0.1 : -0.1
      let price = basePrice

      for (let i = 0; i < count; i++) {
        const size = Math.random() * 10 + 1
        total += size
        orders.push({
          price: Number(price.toFixed(2)),
          size: Number(size.toFixed(2)),
          total: Number(total.toFixed(2))
        })
        price += step
      }

      return side === 'ask' ? orders : orders.reverse()
    }

    const updateOrderBook = () => {
      const basePrice = 100 + Math.random() * 10
      const newAsks = generateMockOrders(basePrice + 0.1, 10, 'ask')
      const newBids = generateMockOrders(basePrice - 0.1, 10, 'bid')
      const newSpread = Number((newAsks[0].price - newBids[0].price).toFixed(2))
      const newLastPrice = basePrice

      setAsks(newAsks)
      setBids(newBids)
      setSpread(newSpread)
      setLastPriceDirection(newLastPrice > lastPrice ? 'up' : 'down')
      setLastPrice(newLastPrice)
    }

    // Initial update
    updateOrderBook()

    // Update every 500ms
    const interval = setInterval(updateOrderBook, 500)

    return () => clearInterval(interval)
  }, [lastPrice])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  return (
    <ClientOnly>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Order Book</h3>
          <div className="text-sm text-gray-400">
            Spread: <span className="text-white">${formatNumber(spread)}</span>
          </div>
        </div>

        {/* Headers */}
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 mb-2">
          <div>Price</div>
          <div className="text-right">Size</div>
          <div className="text-right">Total</div>
        </div>

        {/* Asks (Sells) */}
        <div className="space-y-1 mb-4">
          {asks.map((ask, index) => (
            <motion.div
              key={`ask-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-3 gap-4 text-sm relative"
            >
              <div
                className="absolute inset-0 bg-red-500/10"
                style={{ width: `${(ask.total / asks[asks.length - 1].total) * 100}%` }}
              />
              <div className="text-red-500 relative">${formatNumber(ask.price)}</div>
              <div className="text-right relative">{formatNumber(ask.size)}</div>
              <div className="text-right relative">{formatNumber(ask.total)}</div>
            </motion.div>
          ))}
        </div>

        {/* Last Price */}
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.2 }}
          className={`text-center py-2 mb-4 text-lg font-medium ${
            lastPriceDirection === 'up' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          ${formatNumber(lastPrice)}
        </motion.div>

        {/* Bids (Buys) */}
        <div className="space-y-1">
          {bids.map((bid, index) => (
            <motion.div
              key={`bid-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-3 gap-4 text-sm relative"
            >
              <div
                className="absolute inset-0 bg-green-500/10"
                style={{ width: `${(bid.total / bids[bids.length - 1].total) * 100}%` }}
              />
              <div className="text-green-500 relative">${formatNumber(bid.price)}</div>
              <div className="text-right relative">{formatNumber(bid.size)}</div>
              <div className="text-right relative">{formatNumber(bid.total)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </ClientOnly>
  )
} 