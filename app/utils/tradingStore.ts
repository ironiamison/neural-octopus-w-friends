import create from 'zustand'

interface Position {
  symbol: string
  side: 'long' | 'short'
  size: number
  entryPrice: number
  leverage: number
  liquidationPrice: number
  margin: number
  pnl: number
}

interface TradingStore {
  positions: Position[]
  balance: number
  pnlHistory: {
    date: string
    pnl: number
    trades: number
  }[]
  addPosition: (position: Position) => void
  closePosition: (symbol: string) => void
  updatePnL: () => void
}

export const useTradingStore = create<TradingStore>((set, get) => ({
  positions: [],
  balance: 10000,
  pnlHistory: [],
  
  addPosition: (position) => 
    set((state) => ({
      positions: [...state.positions, position],
      balance: state.balance - position.margin
    })),
    
  closePosition: (symbol) =>
    set((state) => ({
      positions: state.positions.filter(p => p.symbol !== symbol),
      // Add PnL to balance when closing position
      balance: state.balance + (state.positions.find(p => p.symbol === symbol)?.pnl || 0)
    })),
    
  updatePnL: () => {
    // Update PnL calculations based on current prices
    // This would be called periodically with real price data
  }
})) 