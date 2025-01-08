'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { priceService } from '@/lib/services/price.service'

interface OrderBookEntry {
  price: number
  size: number
  total: number
}

interface OrderBook {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
  timestamp: number
}

interface OrderBookProps {
  mintAddress: string
  data: OrderBook
  onPriceSelect?: (price: number) => void
}

export default function OrderBook({ mintAddress, data, onPriceSelect }: OrderBookProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  const maxTotal = Math.max(
    ...data.asks.map(ask => ask.total),
    ...data.bids.map(bid => bid.total)
  )

  return (
    <div className="h-full flex flex-col text-sm">
      {/* Asks (Sell Orders) */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <AnimatePresence>
          {data.asks.slice().reverse().map((ask, i) => (
            <motion.div
              key={`${ask.price}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-3 gap-2 px-2 py-1 cursor-pointer hover:bg-red-500/10"
              onClick={() => onPriceSelect?.(ask.price)}
            >
              <div className="text-red-400">${ask.price.toFixed(6)}</div>
              <div className="text-right">{ask.size.toFixed(2)}</div>
              <div className="relative">
                <div
                  className="absolute inset-0 bg-red-500/10"
                  style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                />
                <span className="relative z-10">{ask.total.toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Spread */}
      <div className="py-2 px-2 text-center bg-gray-800/30 border-y border-gray-700/50">
        Spread: ${((data.asks[0]?.price || 0) - (data.bids[0]?.price || 0)).toFixed(6)}
      </div>

      {/* Bids (Buy Orders) */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <AnimatePresence>
          {data.bids.map((bid, i) => (
            <motion.div
              key={`${bid.price}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-3 gap-2 px-2 py-1 cursor-pointer hover:bg-green-500/10"
              onClick={() => onPriceSelect?.(bid.price)}
            >
              <div className="text-green-400">${bid.price.toFixed(6)}</div>
              <div className="text-right">{bid.size.toFixed(2)}</div>
              <div className="relative">
                <div
                  className="absolute inset-0 bg-green-500/10"
                  style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                />
                <span className="relative z-10">{bid.total.toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
} 