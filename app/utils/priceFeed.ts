'use client'

import { create } from 'zustand'
import { useTradingStore } from './paperTrading'

interface PriceFeed {
  symbol: string
  price: number
  timestamp: number
}

interface PriceStore {
  prices: Map<string, PriceFeed>
  isLoading: boolean
  error: string | null
  updatePrice: (symbol: string, price: number) => void
  startPriceFeed: () => void
  stopPriceFeed: () => void
}

// Valid token addresses for supported meme coins
const TOKEN_ADDRESSES = {
  'BONK': 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
  'WIF': '5tN42n9vMi6ubp67Uy4NnmM5DMZYN8aS8GeB3bEDHr6E',  // WIF
  'MYRO': 'HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4', // MYRO
  'BOME': '5JnZ667P3VcjDinkJFysWh2K2KtViy63FZ3oL5YghEhW'  // BOME
} as const;

// Validate token address
function isValidTokenAddress(address: string): boolean {
  return typeof address === 'string' && 
         address.length === 44 && // Solana addresses are 44 characters
         /^[A-Za-z0-9]+$/.test(address); // Only alphanumeric characters
}

export const usePriceStore = create<PriceStore>((set, get) => {
  let ws: WebSocket | null = null
  let updateInterval: NodeJS.Timeout | null = null

  const updatePositions = async () => {
    const prices = get().prices
    const tradingStore = useTradingStore.getState()

    for (const position of tradingStore.positions) {
      const priceFeed = prices.get(position.tokenAddress)
      if (priceFeed && isValidTokenAddress(position.tokenAddress)) {
        await tradingStore.updatePositions(priceFeed.price)
      }
    }
  }

  return {
    prices: new Map(),
    isLoading: false,
    error: null,

    updatePrice: (symbol: string, price: number) => {
      // Only update if it's a valid token address
      if (!isValidTokenAddress(symbol)) {
        console.warn('Invalid token address:', symbol);
        return;
      }

      set((state) => {
        const prices = new Map(state.prices)
        prices.set(symbol, {
          symbol,
          price,
          timestamp: Date.now()
        })
        return { prices }
      })
    },

    startPriceFeed: () => {
      if (ws) return

      try {
        ws = new WebSocket('wss://io.dexscreener.com/dex/screener/pairs/v3')

        if (!ws) return

        ws.onopen = () => {
          console.log('WebSocket connected')
          set({ isLoading: false, error: null })

          // Subscribe to price updates for supported tokens
          if (ws) {
            const validTokens = Object.values(TOKEN_ADDRESSES)
              .filter(isValidTokenAddress)
              .map(address => `uniswapv2_${address.toLowerCase()}`)

            ws.send(JSON.stringify({ ids: validTokens }))
          }
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.pairs) {
              data.pairs.forEach((pair: any) => {
                const address = pair.baseToken?.address
                if (address && isValidTokenAddress(address)) {
                  get().updatePrice(address, parseFloat(pair.priceUsd))
                }
              })
            }
          } catch (error) {
            console.error('Error processing price update:', error)
          }
        }

        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          set({ error: 'Failed to connect to price feed' })
        }

        ws.onclose = () => {
          console.log('WebSocket disconnected')
          ws = null
        }

        // Start position updates
        updateInterval = setInterval(updatePositions, 1000)

      } catch (error: any) {
        set({ error: error.message, isLoading: false })
      }
    },

    stopPriceFeed: () => {
      if (ws) {
        ws.close()
        ws = null
      }
      if (updateInterval) {
        clearInterval(updateInterval)
        updateInterval = null
      }
    }
  }
})

// Start price feed when the module loads
if (typeof window !== 'undefined') {
  usePriceStore.getState().startPriceFeed()
} 