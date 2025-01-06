export const SOLANA_MEMECOINS = [
  {
    name: 'BONK',
    symbol: 'BONK',
    mintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    image: '/tokens/bonk.png',
    description: 'The first Solana dog coin for the people',
    hasOrderBook: true,
    hasChart: true
  },
  {
    name: 'DOGWIFHAT',
    symbol: 'WIF',
    mintAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    image: '/tokens/wif.png',
    description: 'Dog with a hat. Simple as that.',
    hasOrderBook: true,
    hasChart: true
  },
  {
    name: 'MYRO',
    symbol: 'MYRO',
    mintAddress: 'HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4',
    image: '/tokens/myro.png',
    description: 'The Solana dog that barks at cats',
    hasOrderBook: true,
    hasChart: true
  },
  {
    name: 'POPCAT',
    symbol: 'POPCAT',
    mintAddress: 'G9GtD3uJDdpURr9eKogWUQmYqYSTxqzYAZwCJJshfiqK',
    image: '/tokens/popcat.png',
    description: 'Pop Cat on Solana',
    hasOrderBook: true,
    hasChart: true
  },
  {
    name: 'BABI',
    symbol: 'BABI',
    mintAddress: 'BABYqd6NxHtXkxVgS4yHvXg5rNECkGQBRqaGBjUi3Kf',
    image: '/tokens/babi.png',
    description: 'Baby Bonk on Solana',
    hasOrderBook: true,
    hasChart: true
  },
  {
    name: 'SLERF',
    symbol: 'SLERF',
    mintAddress: 'SLRFJd6rEEtxVbT1LKNxPGqZKr1UbL4AyEYbgNJANGG',
    image: '/tokens/slerf.png',
    description: 'Smurf Cat on Solana',
    hasOrderBook: true,
    hasChart: true
  }
]

export interface OrderBookEntry {
  price: number
  size: number
  total: number
  numOrders: number
  depth: number // Percentage of total depth
  type: 'bid' | 'ask'
}

export interface OrderBookState {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
  spread: number
  spreadPercentage: number
} 