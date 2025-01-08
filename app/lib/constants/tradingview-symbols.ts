// Map Solana memecoin addresses to their correct TradingView symbols
export const TRADINGVIEW_SYMBOL_MAP: { [key: string]: string } = {
  // Example mappings (update these with actual correct mappings)
  'BONK': 'BONKUSDT',  // Bonk
  'WIF': 'WIFUSDT',    // Wif
  'MYRO': 'MYROUSDT',  // Myro
  'BOME': 'BOMEUSDT',  // Book of Meme
  'SAMO': 'SAMOUSDT',  // Samoyedcoin
  'POPCAT': 'POPCATUSDT', // Popcat
  // Add more mappings as needed
}

// Function to get the correct TradingView symbol
export function getTradingViewSymbol(symbol: string): string | null {
  // Remove any USD suffix and convert to uppercase
  const baseSymbol = symbol.replace('/USD', '').toUpperCase()
  
  // Get the mapped symbol
  const tvSymbol = TRADINGVIEW_SYMBOL_MAP[baseSymbol]
  
  if (!tvSymbol) {
    console.warn(`No TradingView symbol mapping found for ${baseSymbol}`)
    return null
  }
  
  return tvSymbol
}

// Function to validate if a symbol is supported by TradingView
export function isTradingViewSymbolSupported(symbol: string): boolean {
  const baseSymbol = symbol.replace('/USD', '').toUpperCase()
  return baseSymbol in TRADINGVIEW_SYMBOL_MAP
}

// Function to get the exchange prefix for a symbol
export function getExchangePrefix(symbol: string): string {
  // For now, all pairs are on Binance, but this could be expanded
  // to support multiple exchanges based on the symbol
  return 'BINANCE:'
}

// Function to get the full TradingView symbol with exchange
export function getFullTradingViewSymbol(symbol: string): string | null {
  const tvSymbol = getTradingViewSymbol(symbol)
  if (!tvSymbol) return null
  
  const exchange = getExchangePrefix(symbol)
  return `${exchange}${tvSymbol}`
} 