import prisma from '@/lib/mongodb';
import { AuditService } from './audit.service';
import { XP_REWARDS } from '../constants/trading';

const MAX_LEVERAGE = 10;
const MIN_TRADE_SIZE = 10;
const MAX_TRADE_SIZE = 1000000;
const PRICE_PRECISION = 8;
const SIZE_PRECISION = 2;
const MAX_SLIPPAGE = 0.01; // 1%

interface OrderParams {
  userId: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  type: 'MARKET' | 'LIMIT';
  size: number;
  price?: number;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
  timeInForce?: 'GTC' | 'IOC' | 'FOK';
  postOnly?: boolean;
  reduceOnly?: boolean;
}

interface OrderValidation {
  isValid: boolean;
  errors: string[];
}

interface TradingAchievement {
  type: string;
  name: string;
  description: string;
  xpReward: number;
}

const TRADING_ACHIEVEMENTS: Record<string, TradingAchievement> = {
  FIRST_TRADE: {
    type: 'TRADING',
    name: 'First Steps',
    description: 'Complete your first trade',
    xpReward: 100
  },
  PROFITABLE_TRADE: {
    type: 'TRADING',
    name: 'Profitable Trader',
    description: 'Complete your first profitable trade',
    xpReward: 200
  },
  HIGH_LEVERAGE: {
    type: 'TRADING',
    name: 'Risk Taker',
    description: 'Complete a trade with maximum leverage',
    xpReward: 300
  },
  BIG_WIN: {
    type: 'TRADING',
    name: 'Big Winner',
    description: 'Make a profit of over 1000 USDT in a single trade',
    xpReward: 500
  }
};

export class TradingService {
  static async openPosition(params: OrderParams) {
    const traceId = Math.random().toString(36).substring(7);
    
    try {
      // Validate order parameters
      const validation = this.validateOrder(params);
      if (!validation.isValid) {
        throw new Error(`Invalid order: ${validation.errors.join(', ')}`);
      }

      // Check for sufficient margin
      const requiredMargin = this.calculateRequiredMargin(params);
      
      // Get current market price and validate slippage
      const marketPrice = await this.getCurrentPrice(params.symbol);
      if (params.type === 'MARKET') {
        const slippage = Math.abs(marketPrice - params.price!) / params.price!;
        if (slippage > MAX_SLIPPAGE) {
          throw new Error('Slippage exceeds maximum allowed');
        }
      }

      // Calculate liquidation price
      const liquidationPrice = this.calculateLiquidationPrice({
        entryPrice: params.price || marketPrice,
        leverage: params.leverage,
        side: params.side
      });

      // Create position
      const position = await prisma.position.create({
        data: {
          userId: params.userId,
          symbol: params.symbol,
          side: params.side,
          type: params.type,
          size: params.size,
          leverage: params.leverage,
          entryPrice: params.price || marketPrice,
          markPrice: marketPrice,
          liquidationPrice,
          stopLoss: params.stopLoss,
          takeProfit: params.takeProfit,
          marginUsed: requiredMargin,
          status: 'OPEN',
          timeInForce: params.timeInForce || 'GTC',
          unrealizedPnl: 0
        }
      });

      // Check for achievements
      await this.checkTradeAchievements(params.userId, {
        isFirstTrade: true,
        leverage: params.leverage
      });

      // Log trade and award XP
      await Promise.all([
        this.logTrade({
          traceId,
          userId: params.userId,
          action: 'OPEN_POSITION',
          position,
          params
        }),
        this.awardXP(params.userId, XP_REWARDS.TRADE_COMPLETE)
      ]);

      return position;

    } catch (error: any) {
      await this.logTrade({
        traceId,
        userId: params.userId,
        action: 'OPEN_POSITION',
        error: error.message,
        params
      });
      throw error;
    }
  }

  static async closePosition(userId: string, positionId: string, exitPrice: number) {
    const traceId = Math.random().toString(36).substring(7);
    
    try {
      // Get position
      const position = await prisma.position.findUnique({
        where: { id: positionId }
      });

      if (!position) throw new Error('Position not found');
      if (position.userId !== userId) throw new Error('Unauthorized');

      // Calculate final PnL
      const pnl = this.calculatePnL(position, exitPrice);
      const executionTime = Date.now() - position.openedAt.getTime();
      const slippage = Math.abs(exitPrice - position.markPrice) / position.markPrice;
      const fees = position.size * 0.001; // 0.1% trading fee

      // Create trade record
      const trade = await prisma.trade.create({
        data: {
          userId,
          symbol: position.symbol,
          type: position.type,
          side: position.side,
          size: position.size,
          leverage: position.leverage,
          entryPrice: position.entryPrice,
          exitPrice,
          pnl,
          status: 'CLOSED',
          openedAt: position.openedAt,
          closedAt: new Date()
        }
      });

      // Delete position
      await prisma.position.delete({
        where: { id: positionId }
      });

      // Update trading stats
      await this.updateTradingStats(userId, trade);

      // Check for achievements
      await this.checkTradeAchievements(userId, {
        pnl,
        isFirstTrade: false
      });

      // Log trade
      await this.logTrade({
        traceId,
        userId,
        action: 'CLOSE_POSITION',
        position,
        trade,
        exitPrice
      });

      // Award XP for profitable trade
      if (pnl > 0) {
        await this.awardXP(userId, XP_REWARDS.PROFITABLE_TRADE);
      }

      return trade;

    } catch (error: any) {
      await this.logTrade({
        traceId,
        userId,
        action: 'CLOSE_POSITION',
        error: error.message,
        positionId,
        exitPrice
      });
      throw error;
    }
  }

  private static async updateTradingStats(userId: string, trade: any) {
    const stats = await prisma.tradingStats.findUnique({
      where: { userId }
    });
    
    if (!stats) {
      // Create new stats record
      await prisma.tradingStats.create({
        data: {
          userId,
          totalTrades: 1,
          winningTrades: trade.pnl > 0 ? 1 : 0,
          totalPnl: trade.pnl,
          bestTrade: trade.pnl,
          worstTrade: trade.pnl,
          averageTrade: trade.pnl,
          winRate: trade.pnl > 0 ? 100 : 0,
          currentStreak: trade.pnl > 0 ? 1 : 0,
          longestStreak: trade.pnl > 0 ? 1 : 0
        }
      });
    } else {
      // Update existing stats
      const isWin = trade.pnl > 0;
      await prisma.tradingStats.update({
        where: { userId },
        data: {
          totalTrades: stats.totalTrades + 1,
          winningTrades: stats.winningTrades + (isWin ? 1 : 0),
          totalPnl: stats.totalPnl + trade.pnl,
          bestTrade: Math.max(stats.bestTrade, trade.pnl),
          worstTrade: Math.min(stats.worstTrade, trade.pnl),
          averageTrade: (stats.totalPnl + trade.pnl) / (stats.totalTrades + 1),
          winRate: ((stats.winningTrades + (isWin ? 1 : 0)) / (stats.totalTrades + 1)) * 100,
          currentStreak: isWin ? stats.currentStreak + 1 : 0,
          longestStreak: Math.max(stats.longestStreak, isWin ? stats.currentStreak + 1 : stats.currentStreak)
        }
      });
    }
  }

  private static async logTrade(params: any): Promise<void> {
    await AuditService.log({
      userId: params.userId,
      action: params.action,
      category: 'TRADE',
      details: params,
      status: params.error ? 'FAILURE' : 'SUCCESS',
      errorMessage: params.error
    });
  }

  private static async awardXP(userId: string, amount: number): Promise<void> {
    // TODO: Implement XP system
  }

  private static async checkTradeAchievements(userId: string, params: {
    isFirstTrade?: boolean;
    leverage?: number;
    pnl?: number;
  }) {
    try {
      const achievements: any[] = [];

      if (params.isFirstTrade) {
        // Check total trades
        const totalTrades = await prisma.trade.count({
          where: { userId }
        });

        if (totalTrades === 0) {
          achievements.push(TRADING_ACHIEVEMENTS.FIRST_TRADE);
        }
      }

      if (params.leverage === MAX_LEVERAGE) {
        achievements.push(TRADING_ACHIEVEMENTS.HIGH_LEVERAGE);
      }

      if (params.pnl && params.pnl > 1000) {
        achievements.push(TRADING_ACHIEVEMENTS.BIG_WIN);
      }

      // Unlock achievements
      for (const achievement of achievements) {
        await fetch('/api/achievements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            ...achievement
          })
        });
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
      // Don't throw error to prevent disrupting the main trade flow
    }
  }

  private static validateOrder(params: OrderParams): OrderValidation {
    const errors: string[] = [];

    if (params.leverage < 1 || params.leverage > MAX_LEVERAGE) {
      errors.push(`Leverage must be between 1 and ${MAX_LEVERAGE}`);
    }

    if (params.size < MIN_TRADE_SIZE || params.size > MAX_TRADE_SIZE) {
      errors.push(`Size must be between ${MIN_TRADE_SIZE} and ${MAX_TRADE_SIZE}`);
    }

    if (params.type === 'LIMIT' && !params.price) {
      errors.push('Limit orders require a price');
    }

    if (params.stopLoss) {
      const isValidStop = params.side === 'LONG' 
        ? params.stopLoss < (params.price || Infinity)
        : params.stopLoss > (params.price || 0);
      
      if (!isValidStop) {
        errors.push('Invalid stop loss price');
      }
    }

    if (params.takeProfit) {
      const isValidTP = params.side === 'LONG'
        ? params.takeProfit > (params.price || 0)
        : params.takeProfit < (params.price || Infinity);
      
      if (!isValidTP) {
        errors.push('Invalid take profit price');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static calculateRequiredMargin(params: OrderParams): number {
    const margin = params.size / params.leverage;
    const fees = params.size * 0.001; // 0.1% trading fee
    return margin + fees;
  }

  private static calculateLiquidationPrice(params: {
    entryPrice: number;
    leverage: number;
    side: 'LONG' | 'SHORT';
  }): number {
    const { entryPrice, leverage, side } = params;
    const maintenanceMargin = 0.01; // 1%
    
    if (side === 'LONG') {
      return entryPrice * (1 - (1 - maintenanceMargin) / leverage);
    } else {
      return entryPrice * (1 + (1 - maintenanceMargin) / leverage);
    }
  }

  private static calculatePnL(position: any, currentPrice: number): number {
    const priceDiff = currentPrice - position.entryPrice;
    const multiplier = position.side === 'LONG' ? 1 : -1;
    return (priceDiff / position.entryPrice) * position.size * position.leverage * multiplier;
  }

  private static async getCurrentPrice(symbol: string): Promise<number> {
    // TODO: Implement real price feed
    return 100; // Placeholder
  }
} 