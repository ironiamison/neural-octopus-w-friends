import { simulationService } from '@/lib/services/simulation.service'
import { TradingError, ERROR_CODES, handleError } from '@/lib/utils/errorHandling'

export interface TokenPrice {
  timestamp: number
  price: number
  volume: number
  open: number
  high: number
  low: number
  close: number
}

export async function getTokenPrices(symbol: string): Promise<TokenPrice[]> {
  try {
    if (!symbol) {
      throw new TradingError(
        'Symbol is required',
        ERROR_CODES.PRICE_FETCH_FAILED,
        'high',
        'Trading pair symbol is required'
      )
    }

    const prices = await Promise.resolve(simulationService.generatePriceData(symbol))

    // Validate price data
    if (!prices || prices.length === 0) {
      throw new TradingError(
        'No price data available',
        ERROR_CODES.PRICE_FETCH_FAILED,
        'medium',
        'Price data is currently unavailable'
      )
    }

    // Validate price data format
    prices.forEach((price, index) => {
      if (!price.timestamp || !price.price || price.price <= 0) {
        throw new TradingError(
          `Invalid price data at index ${index}`,
          ERROR_CODES.PRICE_FETCH_FAILED,
          'high',
          'Invalid price data received'
        )
      }
    })

    // Ensure timestamps are unique and ascending
    const timestamps = new Set<number>()
    let prevTimestamp = 0
    prices.forEach((price, index) => {
      if (timestamps.has(price.timestamp)) {
        throw new TradingError(
          `Duplicate timestamp at index ${index}`,
          ERROR_CODES.PRICE_FETCH_FAILED,
          'medium',
          'Invalid price data sequence'
        )
      }
      if (price.timestamp < prevTimestamp) {
        throw new TradingError(
          `Non-ascending timestamp at index ${index}`,
          ERROR_CODES.PRICE_FETCH_FAILED,
          'medium',
          'Invalid price data sequence'
        )
      }
      timestamps.add(price.timestamp)
      prevTimestamp = price.timestamp
    })

    return prices
  } catch (err) {
    const error = handleError(err, 'getTokenPrices')
    // Show error toast
    ;(window as any).showToast?.({
      type: 'error',
      message: error.userMessage || 'Failed to fetch price data',
      duration: 5000
    })
    throw error
  }
}

export async function getOrderBook(symbol: string) {
  try {
    if (!symbol) {
      throw new TradingError(
        'Symbol is required',
        ERROR_CODES.PRICE_FETCH_FAILED,
        'high',
        'Trading pair symbol is required'
      )
    }

    const orderBook = await Promise.resolve(simulationService.generateOrderBook(symbol))

    // Validate order book data
    if (!orderBook || !orderBook.bids || !orderBook.asks) {
      throw new TradingError(
        'Invalid order book data',
        ERROR_CODES.PRICE_FETCH_FAILED,
        'medium',
        'Order book data is currently unavailable'
      )
    }

    // Validate bid/ask prices
    orderBook.bids.forEach((bid, index) => {
      if (bid[0] <= 0 || bid[1] <= 0) {
        throw new TradingError(
          `Invalid bid data at index ${index}`,
          ERROR_CODES.PRICE_FETCH_FAILED,
          'high',
          'Invalid order book data'
        )
      }
    })

    orderBook.asks.forEach((ask, index) => {
      if (ask[0] <= 0 || ask[1] <= 0) {
        throw new TradingError(
          `Invalid ask data at index ${index}`,
          ERROR_CODES.PRICE_FETCH_FAILED,
          'high',
          'Invalid order book data'
        )
      }
    })

    // Ensure bid/ask ordering is correct
    for (let i = 1; i < orderBook.bids.length; i++) {
      if (orderBook.bids[i][0] > orderBook.bids[i-1][0]) {
        throw new TradingError(
          'Bids not properly ordered',
          ERROR_CODES.PRICE_FETCH_FAILED,
          'medium',
          'Invalid order book data'
        )
      }
    }

    for (let i = 1; i < orderBook.asks.length; i++) {
      if (orderBook.asks[i][0] < orderBook.asks[i-1][0]) {
        throw new TradingError(
          'Asks not properly ordered',
          ERROR_CODES.PRICE_FETCH_FAILED,
          'medium',
          'Invalid order book data'
        )
      }
    }

    return orderBook
  } catch (err) {
    const error = handleError(err, 'getOrderBook')
    // Show error toast
    ;(window as any).showToast?.({
      type: 'error',
      message: error.userMessage || 'Failed to fetch order book data',
      duration: 5000
    })
    throw error
  }
} 