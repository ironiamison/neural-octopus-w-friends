'use client'

// Known memecoin addresses
const MEME_ADDRESSES = {
  // New Hot Tokens
  'AI16Z': 'Ai16Z5bqJpHzwpEYX7XqZdWkqtPjG9CvDZKHEgXkGFLD',    // AI16Z
  'BOME': '5jqTNKoK4jQhvoKxr6rV8rGGgdLmRrPPvqyD9qBRoXwn',    // BOME
  'BONK': 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',    // BONK
  'WIF': 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',     // WIF
  'MYRO': 'HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4',    // MYRO
  'POPCAT': 'P0PCatYpv1xL8aDkHCahtUGFXG7NUbUhsweMJqgtpE3',   // POPCAT
  'SLERF': 'o1Gp7r4m38eRZn3qN5aXvHJHtxqm6oJMpASyxuoffhp',    // SLERF
  'SAMO': '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',    // SAMO
  'BOOK': 'BooKFc5A7SZcB7K2xqSqJvpBwY4YTxCpx9KXEfUrwffR',    // BOOK
  'CAPS': 'CAPSwtdqGqhGBnvnhQCf4nZnURPJNXdvKuXPUiJC7anj',    // CAPS
  'NEKO': 'NEKo3YVXZmJHVhYBUwshvVj5brqbxSUBFkDiD9iZqFhj',    // NEKO
  'CRECK': 'CRECKs3H4KQKDfvL6m4MQwzwQsP8cZgPVkD8DnLgcAVt',   // CRECK
  'GUAC': 'AZsHEMXd36Bj1EMNXhowJajpUXzrKcK57wW4ZGXVa7yR',    // GUAC
  'MNGO': 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',     // MNGO
  'FORGE': '6UeJYTqU6dJHZfPdkNUFNHR8FSjid2kKbJ1vxgLKhXvX',   // FORGE
  'CROWN': 'GmY9sZhvWEqhyVfiYGXKhYMnzGJhJE7NfQTf2TY4rSZF',   // CROWN
  'BERN': 'CkqWjejWK6eZxHY88aDsC5tYWGZ1TdyGwsZeHkrNZJxy',    // BERN
  'DGEN': 'DGENf9phQvPd5BN3qgQWNYwEALVth9WXCxedVJHNpovD',    // DGEN
  'JELLY': 'GePFQaZKHcWE5vpxHfviQtH5jgxokSs51Y5Q4zgBiMDs',   // JELLY
  'NANA': '6vaRn1RxjEaxpGqDJHqk7zGAZS18Vo6JKJxU8R2KWxYk'     // NANA
}

// Quote token addresses
const QUOTE_TOKENS = {
  'SOL': 'So11111111111111111111111111111111111111112',
  'USDC': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
}

// Token image sources
const TOKEN_IMAGES = {
  'AI16Z': 'https://arweave.net/WCMNR4N-4zKmkVcxcO2WImlr2XBAlSWOOKBRHLOWXLA',
  'BOME': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/5jqTNKoK4jQhvoKxr6rV8rGGgdLmRrPPvqyD9qBRoXwn/logo.png',
  'BONK': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png',
  'WIF': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm/logo.png',
  'MYRO': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4/logo.png',
  'POPCAT': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/P0PCatYpv1xL8aDkHCahtUGFXG7NUbUhsweMJqgtpE3/logo.png',
  'SLERF': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/o1Gp7r4m38eRZn3qN5aXvHJHtxqm6oJMpASyxuoffhp/logo.png',
  'SAMO': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU/logo.png',
  'BOOK': 'https://arweave.net/DU-7P-ChGh5gTfHsVBugA9beFB8s8CCGgqgQyKTEkqo',
  'CAPS': 'https://arweave.net/FwQRnvmglI6YIIXaF4T9H7ZZWqpGVZaouzz1fWUNLVA',
  'NEKO': 'https://arweave.net/LtqNvhYyHy3WONrS-yHFP8bv_GUZHvUmu3-q-0CUXBw',
  'CRECK': 'https://arweave.net/WCMNR4N-4zKmkVcxcO2WImlr2XBAlSWOOKBRHLOWXLA',
  'GUAC': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/AZsHEMXd36Bj1EMNXhowJajpUXzrKcK57wW4ZGXVa7yR/logo.png',
  'MNGO': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac/logo.png',
  'FORGE': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/6UeJYTqU6dJHZfPdkNUFNHR8FSjid2kKbJ1vxgLKhXvX/logo.png',
  'CROWN': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/GmY9sZhvWEqhyVfiYGXKhYMnzGJhJE7NfQTf2TY4rSZF/logo.png',
  'BERN': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/CkqWjejWK6eZxHY88aDsC5tYWGZ1TdyGwsZeHkrNZJxy/logo.png',
  'DGEN': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DGENf9phQvPd5BN3qgQWNYwEALVth9WXCxedVJHNpovD/logo.png',
  'JELLY': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/GePFQaZKHcWE5vpxHfviQtH5jgxokSs51Y5Q4zgBiMDs/logo.png',
  'NANA': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/6vaRn1RxjEaxpGqDJHqk7zGAZS18Vo6JKJxU8R2KWxYk/logo.png'
}

// Fallback image sources
const FALLBACK_SOURCES = [
  (address: string) => `https://cdn.birdeye.so/token/${address}/logo.png`,
  (address: string) => `https://ox.fun/token/${address}/logo.png`,
  (address: string) => `https://photon-sol.com/token/${address}/logo.png`
]

export interface MemeCoin {
  symbol: string
  dex: string
  liquidity: number
  price: number
  change24h: number
  volume24h: number
  pairAddress: string
  tokenAddress?: string
  marketCap: number
  image?: string
  holders: number
  supply: number
}

interface PairData {
  symbol: string
  address: string
  quoteSymbol: string
  data: {
    liquidity: number
    dex: string
    price: number
    priceChange24h: number
    volume24h: number
    pairAddress: string
    marketCap: number
  }
}

interface TokenData {
  symbol: string
  dex: string
  liquidity: number
  price: number
  change24h: number
  volume24h: number
  pairAddress: string
  tokenAddress: string
  marketCap: number
  image: string
  holders: number
  supply: number
}

// Helper function to get token address
export function getTokenAddress(symbol: string): string {
  return MEME_ADDRESSES[symbol as keyof typeof MEME_ADDRESSES] || ''
}

// Helper function to get token image
export async function getTokenImage(symbol: string, address: string): Promise<string> {
  // Try primary source
  const primaryImage = TOKEN_IMAGES[symbol as keyof typeof TOKEN_IMAGES]
  if (primaryImage) {
    try {
      const response = await fetch(primaryImage)
      if (response.ok) return primaryImage
    } catch (e) {
      console.warn(`Failed to load primary image for ${symbol}`)
    }
  }

  // Try fallback sources
  for (const getSource of FALLBACK_SOURCES) {
    try {
      const url = getSource(address)
      const response = await fetch(url)
      if (response.ok) return url
    } catch (e) {
      continue
    }
  }

  // Return default image if all sources fail
  return '/placeholder.png'
}

// API configuration
const BIRDEYE_API_KEY = '14655315ee674aa99400fbf50230931'
const BIRDEYE_BASE_URL = 'https://public-api.birdeye.so'

const fetchTokenData = async (address: string): Promise<any> => {
  try {
    const response = await fetch(`${BIRDEYE_BASE_URL}/public/token_metadata/solana?address=${address}`, {
      headers: {
        'X-API-KEY': BIRDEYE_API_KEY,
      }
    })
    if (!response.ok) throw new Error(`Failed to fetch price data: ${response.statusText}`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching token data:', error)
    return null
  }
}

const fetchTokenPrice = async (address: string): Promise<any> => {
  try {
    const response = await fetch(`${BIRDEYE_BASE_URL}/public/price?address=${address}`, {
      headers: {
        'X-API-KEY': BIRDEYE_API_KEY,
      }
    })
    if (!response.ok) throw new Error(`Failed to fetch price data: ${response.statusText}`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching price data:', error)
    return null
  }
}

const fetchTokenStats = async (address: string): Promise<any> => {
  try {
    const response = await fetch(`${BIRDEYE_BASE_URL}/public/token_stat/solana?address=${address}`, {
      headers: {
        'X-API-KEY': BIRDEYE_API_KEY,
      }
    })
    if (!response.ok) throw new Error(`Failed to fetch token stats: ${response.statusText}`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching token stats:', error)
    return null
  }
}

export async function getTopMemeCoins(): Promise<MemeCoin[]> {
  try {
    const tokenPromises = Object.entries(MEME_ADDRESSES).map(async ([symbol, address]) => {
      try {
        const [tokenData, priceData, tokenStats] = await Promise.all([
          fetchTokenData(address),
          fetchTokenPrice(address),
          fetchTokenStats(address)
        ])

        if (!tokenData || !priceData || !tokenStats) {
          console.warn(`No data found for ${symbol}`)
          return null
        }

        // Get token image
        const image = await getTokenImage(symbol, address)

        const result: TokenData = {
          symbol: `${symbol}/SOL`,
          dex: 'Raydium',
          liquidity: parseFloat(tokenStats.liquidity || '0'),
          price: parseFloat(priceData.value || '0'),
          change24h: parseFloat(priceData.priceChange24h || '0'),
          volume24h: parseFloat(tokenStats.volume24h || '0'),
          pairAddress: tokenData.id || '',
          tokenAddress: address,
          marketCap: parseFloat(tokenStats.mc || '0'),
          image,
          holders: parseInt(tokenStats.holderCount || '0'),
          supply: parseFloat(tokenStats.supply || '0')
        }

        return result
      } catch (error) {
        console.warn(`Failed to fetch data for ${symbol}:`, error)
        return null
      }
    })

    const results = await Promise.all(tokenPromises)
    const validResults = results.filter((result): result is TokenData => result !== null)

    if (validResults.length === 0) {
      console.warn('No active trading pairs found')
      return []
    }

    console.log('Fetched pairs:', validResults)
    return validResults.sort((a, b) => b.volume24h - a.volume24h)

  } catch (error) {
    console.error('Error fetching meme coins:', error)
    return []
  }
} 