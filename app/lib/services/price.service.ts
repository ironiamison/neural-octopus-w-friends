import { SOLANA_MEMECOINS } from '@/lib/constants/memecoins'
import { useDexStore } from '@/utils/dexscreener'

interface PriceData {
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  timestamp: number
  confidence: number
  sources: string[]
  poolAddress?: string
  poolSize?: number
}

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

class PriceService {
  private static instance: PriceService
  private priceCache: Map<string, PriceData>
  private orderBookCache: Map<string, OrderBook>
  private subscribers: Map<string, Set<(data: PriceData) => void>>
  private orderBookSubscribers: Map<string, Set<(data: OrderBook) => void>>
  private updateInterval: NodeJS.Timeout | null

  private constructor() {
    this.priceCache = new Map()
    this.orderBookCache = new Map()
    this.subscribers = new Map()
    this.orderBookSubscribers = new Map()
    this.updateInterval = null
    this.startUpdates()
  }

  public static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService()
    }
    return PriceService.instance
  }

  private async fetchDexScreenerPrice(mintAddress: string): Promise<PriceData | null> {
    try {
      const dexStore = useDexStore.getState()
      const pair = dexStore.pairs.find(p => p.baseToken.symbol === mintAddress)
      
      if (!pair) {
        await dexStore.fetchPairs()
        const updatedPair = dexStore.pairs.find(p => p.baseToken.symbol === mintAddress)
        if (!updatedPair) return null
        return {
          price: updatedPair.priceUsd || 0,
          change24h: updatedPair.priceChange24h || 0,
          volume24h: updatedPair.volume24h || 0,
          marketCap: updatedPair.fdv || 0,
          timestamp: Date.now(),
          confidence: 0.95,
          sources: ['dexscreener'],
          poolAddress: updatedPair.pairAddress,
          poolSize: updatedPair.liquidity
        }
      }
      
      return {
        price: pair.priceUsd || 0,
        change24h: pair.priceChange24h || 0,
        volume24h: pair.volume24h || 0,
        marketCap: pair.fdv || 0,
        timestamp: Date.now(),
        confidence: 0.95,
        sources: ['dexscreener'],
        poolAddress: pair.pairAddress,
        poolSize: pair.liquidity
      }
    } catch (error) {
      console.error('DexScreener price fetch error:', error)
      return null
    }
  }

  private async fetchOrderBook(mintAddress: string): Promise<OrderBook | null> {
    try {
      const dexStore = useDexStore.getState()
      const pair = dexStore.pairs.find(p => p.baseToken.symbol === mintAddress)
      if (!pair) return null

      const response = await fetch(`https://api.dexscreener.com/latest/dex/orderbook/${pair.pairAddress}`)
      if (!response.ok) throw new Error(`Orderbook API error: ${response.statusText}`)
      
      const data = await response.json()
      if (!data?.data) return null

      const processOrders = (orders: any[]): OrderBookEntry[] => {
        let total = 0
        return orders.map(order => {
          total += order.size
          return {
            price: order.price,
            size: order.size,
            total
          }
        })
      }

      return {
        bids: processOrders(data.data.bids || []),
        asks: processOrders(data.data.asks || []),
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('Orderbook fetch error:', error)
      return null
    }
  }

  private async updatePrices() {
    for (const coin of SOLANA_MEMECOINS) {
      const price = await this.fetchDexScreenerPrice(coin.mintAddress)
      if (!price) continue

      this.priceCache.set(coin.mintAddress, price)
      this.notifyPriceSubscribers(coin.mintAddress, price)

      // Update orderbook if needed
      if (coin.hasOrderBook) {
        const orderBook = await this.fetchOrderBook(coin.mintAddress)
        if (orderBook) {
          this.orderBookCache.set(coin.mintAddress, orderBook)
          this.notifyOrderBookSubscribers(coin.mintAddress, orderBook)
        }
      }
    }
  }

  private startUpdates() {
    if (this.updateInterval) return
    this.updateInterval = setInterval(() => this.updatePrices(), 2000)
  }

  private stopUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  private notifyPriceSubscribers(mintAddress: string, data: PriceData) {
    const subs = this.subscribers.get(mintAddress)
    if (subs) {
      subs.forEach(callback => callback(data))
    }
  }

  private notifyOrderBookSubscribers(mintAddress: string, data: OrderBook) {
    const subs = this.orderBookSubscribers.get(mintAddress)
    if (subs) {
      subs.forEach(callback => callback(data))
    }
  }

  public subscribeToPrices(mintAddress: string, callback: (data: PriceData) => void): () => void {
    if (!this.subscribers.has(mintAddress)) {
      this.subscribers.set(mintAddress, new Set())
    }
    this.subscribers.get(mintAddress)!.add(callback)

    // Send initial data if available
    const cachedPrice = this.priceCache.get(mintAddress)
    if (cachedPrice) {
      callback(cachedPrice)
    }

    return () => {
      const subs = this.subscribers.get(mintAddress)
      if (subs) {
        subs.delete(callback)
        if (subs.size === 0) {
          this.subscribers.delete(mintAddress)
        }
      }
    }
  }

  public subscribeToOrderBook(mintAddress: string, callback: (data: OrderBook) => void): () => void {
    if (!this.orderBookSubscribers.has(mintAddress)) {
      this.orderBookSubscribers.set(mintAddress, new Set())
    }
    this.orderBookSubscribers.get(mintAddress)!.add(callback)

    // Send initial data if available
    const cachedOrderBook = this.orderBookCache.get(mintAddress)
    if (cachedOrderBook) {
      callback(cachedOrderBook)
    }

    return () => {
      const subs = this.orderBookSubscribers.get(mintAddress)
      if (subs) {
        subs.delete(callback)
        if (subs.size === 0) {
          this.orderBookSubscribers.delete(mintAddress)
        }
      }
    }
  }

  public getLatestPrice(mintAddress: string): PriceData | null {
    return this.priceCache.get(mintAddress) || null
  }

  public getLatestOrderBook(mintAddress: string): OrderBook | null {
    return this.orderBookCache.get(mintAddress) || null
  }
}

export const priceService = PriceService.getInstance() 