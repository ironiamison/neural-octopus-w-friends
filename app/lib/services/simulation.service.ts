import { SOLANA_MEMECOINS } from '../constants/memecoins'
import { TradingError, ERROR_CODES, handleError } from '../utils/errorHandling'

interface SimulatedPrice {
  price: number
  timestamp: number
  volume: number
  open: number
  high: number
  low: number
  close: number
}

class SimulationService {
  private basePrice: { [key: string]: number } = {}
  private volatility: { [key: string]: number } = {}
  private trend: { [key: string]: number } = {}
  private lastUpdate: { [key: string]: number } = {}
  private readonly UPDATE_INTERVAL = 5 * 60 * 1000 // 5 minutes in milliseconds

  constructor() {
    try {
      // Initialize base prices and volatility for each token
      SOLANA_MEMECOINS.forEach(coin => {
        if (!coin.symbol) {
          throw new TradingError(
            `Invalid coin configuration: missing symbol`,
            ERROR_CODES.SIMULATION_ERROR,
            'high',
            'Failed to initialize price simulation'
          )
        }

        this.basePrice[coin.symbol] = Math.random() * 0.1
        this.volatility[coin.symbol] = 0.02 + Math.random() * 0.08
        this.trend[coin.symbol] = Math.random() * 2 - 1
        this.lastUpdate[coin.symbol] = Date.now()
      })
    } catch (err) {
      throw handleError(err, 'SimulationService:constructor')
    }
  }

  private validateSymbol(symbol: string): void {
    if (!symbol) {
      throw new TradingError(
        'Symbol is required',
        ERROR_CODES.SIMULATION_ERROR,
        'high',
        'Invalid trading pair symbol'
      )
    }

    if (!this.basePrice[symbol]) {
      throw new TradingError(
        `Unknown symbol: ${symbol}`,
        ERROR_CODES.SIMULATION_ERROR,
        'high',
        'Trading pair not supported'
      )
    }
  }

  private generateNextPrice(symbol: string): number {
    try {
      this.validateSymbol(symbol)

      const currentTime = Date.now()
      const timeSinceLastUpdate = currentTime - this.lastUpdate[symbol]

      // Only update price if enough time has passed
      if (timeSinceLastUpdate < this.UPDATE_INTERVAL) {
        return this.basePrice[symbol]
      }

      const currentPrice = this.basePrice[symbol]
      const vol = this.volatility[symbol]
      const trendFactor = this.trend[symbol]

      // Random walk with trend
      const change = (Math.random() - 0.5) * vol + trendFactor * vol * 0.1
      const newPrice = currentPrice * (1 + change)

      // Validate new price
      if (newPrice <= 0) {
        throw new TradingError(
          'Invalid price generated',
          ERROR_CODES.SIMULATION_ERROR,
          'medium',
          'Price simulation error'
        )
      }

      // Update state
      this.basePrice[symbol] = newPrice
      this.lastUpdate[symbol] = currentTime

      // Occasionally change trend
      if (Math.random() < 0.1) {
        this.trend[symbol] = Math.random() * 2 - 1
      }

      return newPrice
    } catch (err) {
      throw handleError(err, 'SimulationService:generateNextPrice')
    }
  }

  generatePriceData(symbol: string, count: number = 100): SimulatedPrice[] {
    try {
      this.validateSymbol(symbol)

      if (count <= 0 || count > 1000) {
        throw new TradingError(
          'Invalid count parameter',
          ERROR_CODES.SIMULATION_ERROR,
          'medium',
          'Invalid number of price points requested'
        )
      }

      const prices: SimulatedPrice[] = []
      const now = Math.floor(Date.now() / this.UPDATE_INTERVAL) * this.UPDATE_INTERVAL
      
      // Start from the earliest timestamp
      let currentTime = now - ((count - 1) * this.UPDATE_INTERVAL)

      for (let i = 0; i < count; i++) {
        const price = this.generateNextPrice(symbol)

        // Generate OHLC data with small random variations
        const variation = 0.005
        const open = price * (1 + (Math.random() - 0.5) * variation)
        const close = price
        const high = Math.max(open, close) * (1 + Math.random() * (variation / 2))
        const low = Math.min(open, close) * (1 - Math.random() * (variation / 2))
        const volume = price * (10000 + Math.random() * 90000)

        // Validate generated values
        if (high < low || low <= 0) {
          throw new TradingError(
            'Invalid OHLC data generated',
            ERROR_CODES.SIMULATION_ERROR,
            'medium',
            'Price simulation error'
          )
        }

        prices.push({
          price,
          timestamp: currentTime,
          volume,
          open,
          high,
          low,
          close
        })

        currentTime += this.UPDATE_INTERVAL
      }

      return prices
    } catch (err) {
      throw handleError(err, 'SimulationService:generatePriceData')
    }
  }

  generateOrderBook(symbol: string) {
    try {
      this.validateSymbol(symbol)

      const currentPrice = this.basePrice[symbol]
      const bids: [number, number][] = []
      const asks: [number, number][] = []

      // Generate 20 bids and asks
      for (let i = 0; i < 20; i++) {
        // Bids (buy orders) below current price
        const bidPrice = currentPrice * (1 - 0.0001 * (i + 1))
        const bidSize = 10000 + Math.random() * 90000

        // Asks (sell orders) above current price
        const askPrice = currentPrice * (1 + 0.0001 * (i + 1))
        const askSize = 10000 + Math.random() * 90000

        // Validate generated values
        if (bidPrice <= 0 || askPrice <= 0 || bidSize <= 0 || askSize <= 0) {
          throw new TradingError(
            'Invalid order book data generated',
            ERROR_CODES.SIMULATION_ERROR,
            'medium',
            'Order book simulation error'
          )
        }

        bids.push([bidPrice, bidSize])
        asks.push([askPrice, askSize])
      }

      return {
        bids: bids.sort((a, b) => b[0] - a[0]),
        asks: asks.sort((a, b) => a[0] - b[0])
      }
    } catch (err) {
      throw handleError(err, 'SimulationService:generateOrderBook')
    }
  }
}

export const simulationService = new SimulationService() 