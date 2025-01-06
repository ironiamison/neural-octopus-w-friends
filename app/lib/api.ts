import { JUPITER_PRICE_API_URL } from './constants/api'

interface TokenPriceData {
  price: number
  open: number
  high: number
  low: number
  volume: number
}

export async function fetchTokenPrice(mintAddress: string): Promise<TokenPriceData | null> {
  try {
    const response = await fetch(`${JUPITER_PRICE_API_URL}/price?ids=${mintAddress}`)
    const data = await response.json()
    
    if (data && data.data && data.data[mintAddress]) {
      const priceData = data.data[mintAddress]
      return {
        price: priceData.price,
        open: priceData.price * (1 - Math.random() * 0.02), // Simulate OHLC data
        high: priceData.price * (1 + Math.random() * 0.02),
        low: priceData.price * (1 - Math.random() * 0.02),
        volume: priceData.volume24h || 0
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching token price:', error)
    return null
  }
} 