import { TradingPair } from '@/types/trading'

export const SOLANA_MEMECOINS: TradingPair[] = [
  {
    name: 'BONK/USD',
    symbol: 'BONK',
    mintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    price: 0,
    change: '0%',
    volume: '0',
    color: 'text-gray-500',
    hasOrderBook: true,
    hasChart: true,
    tradingViewSymbol: 'BONKUSDT'
  },
  {
    name: 'WIF/USD',
    symbol: 'WIF',
    mintAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    price: 0,
    change: '0%',
    volume: '0',
    color: 'text-gray-500',
    hasOrderBook: true,
    hasChart: true,
    tradingViewSymbol: 'WIFUSDT'
  },
  {
    name: 'BOME/USD',
    symbol: 'BOME',
    mintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    price: 0,
    change: '0%',
    volume: '0',
    color: 'text-gray-500',
    hasOrderBook: false,
    hasChart: false,
    tradingViewSymbol: 'BOMEUSDT'
  }
]

export interface OrderBookEntry {
  price: number
  size: number
  total: number
  numOrders: number
  depth: number
  type: 'bid' | 'ask'
}

export interface OrderBookState {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
  spread: number
  spreadPercentage: number
} 