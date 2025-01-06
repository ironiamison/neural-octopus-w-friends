import { sql } from 'drizzle-orm';
import { 
  pgTable, 
  text, 
  timestamp, 
  uuid, 
  doublePrecision,
  integer,
  boolean
} from 'drizzle-orm/pg-core';

export const positions = pgTable('positions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  symbol: text('symbol').notNull(),
  side: text('side').notNull().$type<'LONG' | 'SHORT'>(),
  type: text('type').notNull().$type<'MARKET' | 'LIMIT'>(),
  size: doublePrecision('size').notNull(),
  leverage: integer('leverage').notNull(),
  entryPrice: doublePrecision('entry_price').notNull(),
  markPrice: doublePrecision('mark_price').notNull(),
  liquidationPrice: doublePrecision('liquidation_price').notNull(),
  unrealizedPnl: doublePrecision('unrealized_pnl').notNull(),
  marginUsed: doublePrecision('margin_used').notNull(),
  collateral: doublePrecision('collateral').notNull(),
  status: text('status').notNull().$type<'OPEN' | 'CLOSED'>(),
  stopLoss: doublePrecision('stop_loss'),
  takeProfit: doublePrecision('take_profit'),
  timeInForce: text('time_in_force').$type<'GTC' | 'IOC' | 'FOK'>(),
  openedAt: timestamp('opened_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const trades = pgTable('trades', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  symbol: text('symbol').notNull(),
  type: text('type').notNull().$type<'MARKET' | 'LIMIT'>(),
  side: text('side').notNull().$type<'LONG' | 'SHORT'>(),
  size: doublePrecision('size').notNull(),
  leverage: integer('leverage').notNull(),
  entryPrice: doublePrecision('entry_price').notNull(),
  exitPrice: doublePrecision('exit_price'),
  pnl: doublePrecision('pnl').notNull(),
  fees: doublePrecision('fees').notNull(),
  slippage: doublePrecision('slippage').notNull(),
  executionTime: integer('execution_time').notNull(),
  status: text('status').notNull().$type<'OPEN' | 'CLOSED' | 'CANCELLED'>(),
  openedAt: timestamp('opened_at').defaultNow().notNull(),
  closedAt: timestamp('closed_at')
});

export const tradingStats = pgTable('trading_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().unique(),
  totalTrades: integer('total_trades').notNull().default(0),
  winningTrades: integer('winning_trades').notNull().default(0),
  totalPnl: doublePrecision('total_pnl').notNull().default(0),
  bestTrade: doublePrecision('best_trade').notNull().default(0),
  worstTrade: doublePrecision('worst_trade').notNull().default(0),
  averageTrade: doublePrecision('average_trade').notNull().default(0),
  winRate: doublePrecision('win_rate').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}); 