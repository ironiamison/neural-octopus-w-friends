import axios from 'axios'

const BIRDEYE_API = 'https://public-api.birdeye.so/public'
const BIRDEYE_API_KEY = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || ''

export interface TokenPrice {
  timestamp: number
  price: number
  volume: number
}

// Always use Raydium SOL pair for any memecoin
function getRaydiumSolPair(symbol: string): string {
  // Extract base token symbol without USD/USDT suffix
  const baseSymbol = symbol.split('/')[0].toUpperCase()
  // Always use the SOL-{memecoin} pair from Raydium
  return `SOL-${baseSymbol}`
}

export async function getTokenPrices(symbol: string): Promise<TokenPrice[]> {
  try {
    const pairId = getRaydiumSolPair(symbol)
    const response = await axios.get(`${BIRDEYE_API}/trade_history`, {
      headers: {
        'x-api-key': BIRDEYE_API_KEY
      },
      params: {
        dex: 'raydium',
        pair_id: pairId,
        type: '1H',
        limit: 100
      }
    })
    
    // Transform price data
    return (response.data.data?.items || []).map((item: any) => ({
      timestamp: item.timestamp,
      price: parseFloat(item.price),
      volume: parseFloat(item.volume)
    }))
  } catch (error) {
    console.error('Error fetching token prices:', error)
    return []
  }
}

export async function getTokenInfo(symbol: string) {
  try {
    const pairId = getRaydiumSolPair(symbol)
    const response = await axios.get(`${BIRDEYE_API}/pair_info`, {
      headers: {
        'x-api-key': BIRDEYE_API_KEY
      },
      params: {
        dex: 'raydium',
        pair_id: pairId
      }
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching token info:', error)
    return null
  }
} 