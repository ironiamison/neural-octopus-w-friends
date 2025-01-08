import { Position, Trade, UserStats, TradingPair } from '@/types/trading'

interface OpenPositionParams {
  walletAddress: string
  pair: TradingPair
  type: 'long' | 'short'
  size: number
  leverage: number
  price: number
}

class TradingService {
  private static instance: TradingService
  private positions: Map<string, Position[]>
  private trades: Map<string, Trade[]>
  private userStats: Map<string, UserStats>

  private constructor() {
    this.positions = new Map()
    this.trades = new Map()
    this.userStats = new Map()
  }

  public static getInstance(): TradingService {
    if (!TradingService.instance) {
      TradingService.instance = new TradingService()
    }
    return TradingService.instance
  }

  public async openPosition(params: OpenPositionParams): Promise<Position> {
    const { walletAddress, pair, type, size, leverage, price } = params
    const liquidationPrice = this.calculateLiquidationPrice(type, price, leverage)

    const position: Position = {
      id: `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pair,
      type,
      size,
      leverage,
      entryPrice: price,
      liquidationPrice,
      pnl: 0,
      pnlPercentage: 0,
      timestamp: Date.now()
    }

    // Update user's positions
    const userPositions = this.positions.get(walletAddress) || []
    this.positions.set(walletAddress, [...userPositions, position])

    // Update user's stats
    const stats = this.userStats.get(walletAddress)
    if (stats) {
      stats.balance -= size // Deduct margin
      this.userStats.set(walletAddress, stats)
    }

    return position
  }

  public getPositions(walletAddress: string): Position[] {
    return this.positions.get(walletAddress) || []
  }

  public getTrades(walletAddress: string): Trade[] {
    return this.trades.get(walletAddress) || []
  }

  public getUserStats(walletAddress: string): UserStats {
    let stats = this.userStats.get(walletAddress)
    if (!stats) {
      stats = {
        balance: 10000, // Initial balance
        xp: 0,
        level: 1,
        trades: 0,
        winRate: 0
      }
      this.userStats.set(walletAddress, stats)
    }
    return stats
  }

  private calculateLiquidationPrice(
    type: 'long' | 'short',
    entryPrice: number,
    leverage: number
  ): number {
    const maintenanceMargin = 0.05 // 5%
    const liquidationThreshold = 1 - maintenanceMargin

    if (type === 'long') {
      return entryPrice * (1 - liquidationThreshold / leverage)
    } else {
      return entryPrice * (1 + liquidationThreshold / leverage)
    }
  }
}

export const tradingService = TradingService.getInstance() 