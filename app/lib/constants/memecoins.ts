export const SOLANA_MEMECOINS = [
  {
    symbol: 'BONK/USD',
    name: 'BONK',
    mintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    hasOrderBook: true,
    hasChart: true,
    description: 'The first Solana dog coin to reach $1B market cap',
    icon: '/icons/bonk.png'
  },
  {
    symbol: 'MYRO/USD',
    name: 'MYRO',
    mintAddress: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    hasOrderBook: true,
    hasChart: true,
    description: 'Community-driven Solana meme coin',
    icon: '/icons/myro.png'
  },
  {
    symbol: 'POPCAT/USD',
    name: 'POPCAT',
    mintAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    hasOrderBook: true,
    hasChart: true,
    description: 'Viral meme token on Solana',
    icon: '/icons/popcat.png'
  },
  {
    symbol: 'SAMO/USD',
    name: 'SAMO',
    mintAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    hasOrderBook: true,
    hasChart: true,
    description: 'Samoyed-themed community token',
    icon: '/icons/samo.png'
  },
  {
    symbol: 'DOGWIFHAT/USD',
    name: 'WIF',
    mintAddress: '8k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    hasOrderBook: true,
    hasChart: true,
    description: 'Dog with a hat meme token',
    icon: '/icons/wif.png'
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