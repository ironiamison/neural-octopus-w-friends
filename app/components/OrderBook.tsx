'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { OrderBookEntry, OrderBookState } from '@/lib/constants/memecoins'
import { useConnection } from '@solana/wallet-adapter-react'
import { Connection } from '@solana/web3.js'

interface OrderBookProps {
  mintAddress: string
  className?: string
  onPriceSelect?: (price: number) => void
}

export default function OrderBook({ mintAddress, className = '', onPriceSelect }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<OrderBookState>({
    bids: [],
    asks: [],
    spread: 0,
    spreadPercentage: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const { connection } = useConnection()
  const wsRef = useRef<WebSocket | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (!mintAddress) return

    const connectWebSocket = () => {
      // Connect to Jupiter websocket for real-time order book data
      const ws = new WebSocket('wss://price.jup.ag/v4/ws')
      wsRef.current = ws

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'subscribe',
          tokens: [mintAddress]
        }))
      }

      ws.onmessage = (event) => {
        if (!mountedRef.current) return
        
        const data = JSON.parse(event.data)
        if (data.type === 'quote') {
          processQuoteData(data)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        reconnectWebSocket()
      }

      ws.onclose = () => {
        if (mountedRef.current) {
          reconnectWebSocket()
        }
      }
    }

    const reconnectWebSocket = () => {
      setTimeout(() => {
        if (mountedRef.current) {
          connectWebSocket()
        }
      }, 3000)
    }

    const processQuoteData = async (data: any) => {
      try {
        const { inAmount, outAmount, routes } = data
        if (!routes || routes.length === 0) return

        // Process routes to create order book entries
        const bids: OrderBookEntry[] = []
        const asks: OrderBookEntry[] = []
        let totalBidSize = 0
        let totalAskSize = 0

        routes.forEach((route: any) => {
          const marketInfos = route.marketInfos || []
          marketInfos.forEach((market: any) => {
            const price = Number(market.outAmount) / Number(market.inAmount)
            const size = Number(market.inAmount) / 1_000_000 // Convert from USDC decimals

            if (market.type === 'buy') {
              totalBidSize += size
              bids.push({
                price,
                size,
                total: totalBidSize,
                numOrders: route.numOrders || 1,
                depth: 0,
                type: 'bid'
              })
            } else {
              totalAskSize += size
              asks.push({
                price,
                size,
                total: totalAskSize,
                numOrders: route.numOrders || 1,
                depth: 0,
                type: 'ask'
              })
            }
          })
        })

        // Calculate depth percentages
        bids.forEach(bid => {
          bid.depth = (bid.total / totalBidSize) * 100
        })
        asks.forEach(ask => {
          ask.depth = (ask.total / totalAskSize) * 100
        })

        // Sort and limit entries
        bids.sort((a, b) => b.price - a.price)
        asks.sort((a, b) => a.price - b.price)

        const spread = asks[0]?.price - bids[0]?.price || 0
        const spreadPercentage = (spread / asks[0]?.price) * 100

        setOrderBook({
          bids: bids.slice(0, 12),
          asks: asks.slice(0, 12).reverse(),
          spread,
          spreadPercentage
        })
        setIsLoading(false)
      } catch (error) {
        console.error('Error processing quote data:', error)
      }
    }

    connectWebSocket()
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [mintAddress])

  const handlePriceClick = (price: number) => {
    if (onPriceSelect) {
      onPriceSelect(price)
    }
  }

  return (
    <div className={`bg-gray-800/30 backdrop-blur-md rounded-xl border border-gray-700/50 ${className}`}>
      <div className="p-4 border-b border-gray-700/50">
        <h3 className="text-lg font-semibold">Order Book</h3>
        <div className="flex justify-between text-sm text-gray-400 mt-1">
          <span>Spread: ${orderBook.spread.toFixed(6)}</span>
          <span>{orderBook.spreadPercentage.toFixed(2)}%</span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-4 text-xs text-gray-400 mb-2">
          <div>Price</div>
          <div className="text-right">Size</div>
          <div className="text-right">Total</div>
          <div className="text-right">Orders</div>
        </div>

        {/* Asks (Sells) */}
        <div className="space-y-1 mb-4">
          {orderBook.asks.map((ask, i) => (
            <motion.div
              key={`${ask.price}-${i}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-4 text-xs relative group cursor-pointer hover:bg-gray-700/30"
              onClick={() => handlePriceClick(ask.price)}
            >
              <div 
                className="absolute inset-0 bg-red-500/20" 
                style={{ width: `${ask.depth}%`, transition: 'width 0.3s ease-in-out' }} 
              />
              <div className="relative text-red-400 font-mono">${ask.price.toFixed(6)}</div>
              <div className="relative text-right font-mono">{ask.size.toFixed(2)}</div>
              <div className="relative text-right font-mono">{ask.total.toFixed(2)}</div>
              <div className="relative text-right text-gray-500">{ask.numOrders}</div>
              
              {/* Hover tooltip */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 rounded-lg p-2 invisible group-hover:visible z-10 whitespace-nowrap">
                <div className="text-xs">
                  <div>Price: ${ask.price.toFixed(6)}</div>
                  <div>Size: {ask.size.toFixed(2)} USDC</div>
                  <div>Total: {ask.total.toFixed(2)} USDC</div>
                  <div>Orders: {ask.numOrders}</div>
                  <div>Depth: {ask.depth.toFixed(2)}%</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Current Price */}
        <div className="text-center text-sm py-2 text-gray-400 border-y border-gray-700/50">
          {isLoading ? (
            <div className="animate-pulse">Loading...</div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-lg">
                ${((orderBook.asks[0]?.price + orderBook.bids[0]?.price) / 2 || 0).toFixed(6)}
              </span>
              <span className="text-xs text-gray-500">
                Vol: {orderBook.bids.reduce((acc, bid) => acc + bid.size, 0).toFixed(2)} USDC
              </span>
            </div>
          )}
        </div>

        {/* Bids (Buys) */}
        <div className="space-y-1 mt-4">
          {orderBook.bids.map((bid, i) => (
            <motion.div
              key={`${bid.price}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-4 text-xs relative group cursor-pointer hover:bg-gray-700/30"
              onClick={() => handlePriceClick(bid.price)}
            >
              <div 
                className="absolute inset-0 bg-green-500/20" 
                style={{ width: `${bid.depth}%`, transition: 'width 0.3s ease-in-out' }} 
              />
              <div className="relative text-green-400 font-mono">${bid.price.toFixed(6)}</div>
              <div className="relative text-right font-mono">{bid.size.toFixed(2)}</div>
              <div className="relative text-right font-mono">{bid.total.toFixed(2)}</div>
              <div className="relative text-right text-gray-500">{bid.numOrders}</div>

              {/* Hover tooltip */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 rounded-lg p-2 invisible group-hover:visible z-10 whitespace-nowrap">
                <div className="text-xs">
                  <div>Price: ${bid.price.toFixed(6)}</div>
                  <div>Size: {bid.size.toFixed(2)} USDC</div>
                  <div>Total: {bid.total.toFixed(2)} USDC</div>
                  <div>Orders: {bid.numOrders}</div>
                  <div>Depth: {bid.depth.toFixed(2)}%</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 