export interface TradingPair {
  name: string
  symbol: string
  mintAddress: string
  price: number
  change: string
  volume: string
  color: string
  hasOrderBook: boolean
  hasChart: boolean
  icon?: string
  poolSize?: number
  poolSource?: 'jupiter' | 'dexscreener'
  warning?: string
  tradingViewSymbol: string
}

export interface Position {
  id: string
  pair: TradingPair
  type: 'long' | 'short'
  size: number
  leverage: number
  entryPrice: number
  liquidationPrice: number
  pnl: number
  pnlPercentage: number
  timestamp: number
  stopLoss?: number
  takeProfit?: number
}

export interface Trade {
  id: string
  pair: TradingPair
  type: 'long' | 'short'
  size: number
  leverage: number
  entryPrice: number
  exitPrice: number
  pnl: number
  pnlPercentage: number
  timestamp: number
  status: 'open' | 'closed' | 'liquidated'
  xpEarned?: number
}

export interface UserStats {
  balance: number
  xp: number
  level: number
  trades: number
  winRate: number
  achievements?: Achievement[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  progress: number
  maxProgress: number
  completed: boolean
  reward: {
    type: 'xp' | 'badge' | 'title'
    value: number | string
  }
}

export interface OrderBookEntry {
  price: number
  size: number
  total: number
  source: 'jupiter'
}

export interface OrderBook {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
  spread: number
  lastUpdate: number
}

export interface PriceData {
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

export interface ChartData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
} 