'use client'

import { create } from 'zustand'

interface TokenInfo {
  symbol: string
  name: string
  image?: string
}

interface Pair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: TokenInfo
  quoteToken: TokenInfo
  priceUsd: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  fdv: number
  pairCreatedAt: number
  volatility24h: number
  tradingScore: number
}

interface DexStore {
  pairs: Pair[]
  selectedPair: Pair | null
  isLoading: boolean
  error: string | null
  fetchPairs: () => Promise<void>
  selectPair: (pair: Pair) => void
}

const MEME_TOKENS: Record<string, string> = {
  'BONK': '/tokens/bonk.png',
  'WIF': '/tokens/wif.png',
  'MYRO': '/tokens/myro.png',
  'BOME': '/tokens/meme.png',
  'POPCAT': '/tokens/popcat.png',
  'SLERF': '/tokens/slerf.png'
}

export const useDexStore = create<DexStore>((set) => ({
  pairs: [],
  selectedPair: null,
  isLoading: false,
  error: null,
  fetchPairs: async () => {
    try {
      set({ isLoading: true, error: null })
      
      // Fetch each token individually to ensure we get all pairs
      const allPairs: any[] = []
      const tokenSymbols = Object.keys(MEME_TOKENS)
      
      for (const token of tokenSymbols) {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/search/?q=${token}`)
        const data = await response.json()
        
        if (data.pairs) {
          // Filter for Solana/Raydium pairs with SOL or USDC
          const validPairs = data.pairs.filter((pair: any) => 
            pair.chainId === 'solana' &&
            pair.dexId === 'raydium' &&
            (pair.quoteToken?.symbol === 'SOL' || pair.quoteToken?.symbol === 'USDC') &&
            tokenSymbols.includes(pair.baseToken?.symbol?.toUpperCase())
          )
          allPairs.push(...validPairs)
        }
      }

      if (allPairs.length === 0) {
        throw new Error('No valid pairs found')
      }

      // Transform and sort pairs
      const transformedPairs = allPairs
        .map((pair: any) => ({
          chainId: pair.chainId,
          dexId: pair.dexId,
          url: pair.url,
          pairAddress: pair.pairAddress,
          baseToken: {
            symbol: pair.baseToken.symbol.toUpperCase(),
            name: pair.baseToken.name,
            image: MEME_TOKENS[pair.baseToken.symbol.toUpperCase()]
          },
          quoteToken: {
            symbol: pair.quoteToken.symbol,
            name: pair.quoteToken.name
          },
          priceUsd: parseFloat(pair.priceUsd || '0'),
          priceChange24h: parseFloat(pair.priceChange24h || '0'),
          volume24h: parseFloat(pair.volume24h || '0'),
          liquidity: parseFloat(pair.liquidity || '0'),
          fdv: parseFloat(pair.fdv || '0'),
          pairCreatedAt: pair.pairCreatedAt,
          volatility24h: Math.abs(parseFloat(pair.priceChange24h || '0')),
          tradingScore: calculateTradingScore(
            parseFloat(pair.volume24h || '0'),
            parseFloat(pair.liquidity || '0')
          )
        }))
        .sort((a, b) => b.volume24h - a.volume24h)

      set({
        pairs: transformedPairs,
        selectedPair: transformedPairs[0] || null,
        isLoading: false
      })
    } catch (error) {
      console.error('Error fetching pairs:', error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },
  selectPair: (pair) => set({ selectedPair: pair })
}))

function calculateTradingScore(volume24h: number, liquidity: number): number {
  const volumeScore = Math.min(volume24h / 1000000, 50) // Max 50 points for volume
  const liquidityScore = Math.min(liquidity / 1000000, 50) // Max 50 points for liquidity
  return Math.round(volumeScore + liquidityScore)
} 