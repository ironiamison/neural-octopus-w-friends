export const TRADING_TOKENS = [
  {
    symbol: 'AI16Z',
    name: 'AI16Z Token',
    baseDecimals: 6,
    quoteDecimals: 2,
    minOrderSize: 0.1,
    tickSize: 0.01,
    minLeverage: 1,
    maxLeverage: 10,
    description: 'The future of AI trading',
    icon: '/tokens/ai16z.svg'
  },
  {
    symbol: 'FARTCOIN',
    name: 'Fartcoin',
    baseDecimals: 6,
    quoteDecimals: 2,
    minOrderSize: 0.1,
    tickSize: 0.01,
    minLeverage: 1,
    maxLeverage: 10,
    description: 'The memest of meme coins',
    icon: '/tokens/fartcoin.svg'
  },
  {
    symbol: 'GOAT',
    name: 'GOAT Token',
    baseDecimals: 6,
    quoteDecimals: 2,
    minOrderSize: 0.1,
    tickSize: 0.01,
    minLeverage: 1,
    maxLeverage: 10,
    description: 'For the greatest traders of all time',
    icon: '/tokens/goat.svg'
  }
];

export const ACHIEVEMENT_LEVELS = {
  NOVICE: { min: 0, max: 999 },
  APPRENTICE: { min: 1000, max: 2499 },
  INTERMEDIATE: { min: 2500, max: 4999 },
  ADVANCED: { min: 5000, max: 9999 },
  EXPERT: { min: 10000, max: 19999 },
  MASTER: { min: 20000, max: 49999 },
  LEGEND: { min: 50000, max: Infinity }
};

export const XP_REWARDS = {
  TRADE_COMPLETE: 50,
  PROFITABLE_TRADE: 100,
  WIN_STREAK_3: 200,
  WIN_STREAK_5: 500,
  WIN_STREAK_10: 1000,
  FIRST_1000_PROFIT: 300,
  FIRST_10000_PROFIT: 1000,
  FIRST_100000_PROFIT: 5000
};

export const ACHIEVEMENTS = [
  {
    id: 'first_trade',
    title: 'First Steps',
    description: 'Complete your first trade',
    xpReward: 100,
    icon: '🎯'
  },
  {
    id: 'profitable_trader',
    title: 'Profitable Trader',
    description: 'Complete 10 profitable trades',
    xpReward: 500,
    icon: '💰'
  },
  {
    id: 'win_streak',
    title: 'Hot Streak',
    description: 'Win 3 trades in a row',
    xpReward: 300,
    icon: '🔥'
  },
  {
    id: 'high_roller',
    title: 'High Roller',
    description: 'Make a single trade with $1,000+ profit',
    xpReward: 1000,
    icon: '🎲'
  },
  {
    id: 'comeback_kid',
    title: 'Comeback Kid',
    description: 'Recover from a $5,000+ loss to overall profitability',
    xpReward: 2000,
    icon: '🔄'
  }
];

export const TRADING_LEVELS = [
  {
    level: 1,
    title: 'Paper Hands',
    xpRequired: 0,
    perks: ['Basic trading access']
  },
  {
    level: 2,
    title: 'Diamond Hands',
    xpRequired: 1000,
    perks: ['Increased position limits', 'Access to advanced order types']
  },
  {
    level: 3,
    title: 'Crypto Warrior',
    xpRequired: 2500,
    perks: ['Higher leverage limits', 'Reduced trading fees']
  },
  {
    level: 4,
    title: 'Trading Sage',
    xpRequired: 5000,
    perks: ['Priority order execution', 'Custom trading interface']
  },
  {
    level: 5,
    title: 'Market Legend',
    xpRequired: 10000,
    perks: ['Maximum leverage access', 'Zero trading fees']
  }
];

export const ORDER_TYPES = {
  MARKET: 'MARKET',
  LIMIT: 'LIMIT'
} as const;

export const POSITION_SIDES = {
  LONG: 'LONG',
  SHORT: 'SHORT'
} as const;

export const DEFAULT_TRADING_CONFIG = {
  defaultLeverage: 1,
  maxPositions: 10,
  maxLeverage: 10,
  minTradeSize: 0.1,
  makerFee: 0.001, // 0.1%
  takerFee: 0.002, // 0.2%
  liquidationThreshold: 0.8, // 80% of margin used
  maintenanceMargin: 0.05 // 5% of position size
}; 