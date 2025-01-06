import { NextResponse } from 'next/server'
import { CacheService } from '@/lib/services/cache.service'

// Simulated price feed for demo purposes
// In production, this would connect to a real price feed
const TRADING_PAIRS = [
  'BONK/USDT',
  'WIF/USDT',
  'MYRO/USDT',
  'BOME/USDT',
  'JUP/USDT'
]

const PRICE_RANGES = {
  'BONK/USDT': { min: 0.00001, max: 0.00002 },
  'WIF/USDT': { min: 0.1, max: 0.2 },
  'MYRO/USDT': { min: 0.001, max: 0.002 },
  'BOME/USDT': { min: 0.0001, max: 0.0002 },
  'JUP/USDT': { min: 0.5, max: 0.6 }
}

function generatePrice(pair: string): number {
  const range = PRICE_RANGES[pair as keyof typeof PRICE_RANGES]
  if (!range) return 0

  const lastPrice = globalThis.prices?.[pair] || range.min
  const maxChange = lastPrice * 0.002 // 0.2% max change per update
  const change = (Math.random() - 0.5) * maxChange
  const newPrice = Math.max(range.min, Math.min(range.max, lastPrice + change))
  
  return Number(newPrice.toFixed(8))
}

// Store prices in global scope for persistence between requests
declare global {
  var prices: Record<string, number>
}

if (!globalThis.prices) {
  globalThis.prices = TRADING_PAIRS.reduce((acc, pair) => {
    acc[pair] = generatePrice(pair)
    return acc
  }, {} as Record<string, number>)
}

export async function GET() {
  try {
    // Try to get cached prices
    const cachedPrices = await CacheService.get<Record<string, number>>('latest_prices')
    
    if (cachedPrices) {
      return NextResponse.json(cachedPrices)
    }

    // Generate new prices
    const prices = TRADING_PAIRS.reduce((acc, pair) => {
      acc[pair] = generatePrice(pair)
      return acc
    }, {} as Record<string, number>)

    // Update global prices
    globalThis.prices = prices

    // Cache prices for 1 second
    await CacheService.set('latest_prices', prices, 1)

    return NextResponse.json(prices)
  } catch (error) {
    console.error('Error fetching prices:', error)
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 })
  }
} 