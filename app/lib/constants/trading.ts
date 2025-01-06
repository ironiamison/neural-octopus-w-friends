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
  TRADE_COMPLETE: 10,
  PROFITABLE_TRADE: 25,
  HIGH_LEVERAGE_TRADE: 50,
  WINNING_STREAK_5: 100,
  WINNING_STREAK_10: 250,
  NO_LIQUIDATION_STREAK_10: 500
} as const;

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
  },
  {
    id: 'master_entry',
    title: 'Entry Master',
    description: 'Execute 10 trades with perfect entry timing',
    xpReward: 1000,
    icon: '🎯',
    chainId: 'timing_master'
  },
  {
    id: 'exit_master',
    title: 'Exit Master',
    description: 'Execute 10 trades with perfect exit timing',
    xpReward: 1000,
    icon: '🎯',
    chainId: 'timing_master'
  },
  {
    id: 'risk_master',
    title: 'Risk Management Master',
    description: 'Complete 20 trades with proper R:R ratio',
    xpReward: 2000,
    icon: '🛡️',
    chainId: 'risk_master'
  },
  {
    id: 'trend_surfer',
    title: 'Trend Surfer',
    description: 'Successfully ride 5 major trends',
    xpReward: 1500,
    icon: '🏄‍♂️',
    chainId: 'trend_master'
  },
  {
    id: 'comeback_king',
    title: 'Comeback King',
    description: 'Recover from a 50% drawdown',
    xpReward: 3000,
    icon: '👑'
  },
  {
    id: 'volume_king',
    title: 'Volume King',
    description: 'Trade over $1M in total volume',
    xpReward: 5000,
    icon: '📊'
  },
  {
    id: 'consistency_master',
    title: 'Consistency Master',
    description: 'Maintain 60% win rate over 100 trades',
    xpReward: 5000,
    icon: '📈'
  }
];

export const ACHIEVEMENT_CHAINS = {
  timing_master: {
    name: 'Timing Master',
    description: 'Master the art of trade timing',
    achievements: ['master_entry', 'exit_master'],
    completion_bonus: 2000
  },
  risk_master: {
    name: 'Risk Management Master',
    description: 'Master risk management techniques',
    achievements: ['risk_master', 'consistency_master'],
    completion_bonus: 3000
  },
  trend_master: {
    name: 'Trend Master',
    description: 'Master trend trading techniques',
    achievements: ['trend_surfer', 'volume_king'],
    completion_bonus: 4000
  }
};

export const DAILY_CHALLENGES = [
  {
    id: 'daily_profit',
    title: 'Daily Profit Target',
    description: 'Achieve 5% profit in a day',
    xpReward: 500
  },
  {
    id: 'perfect_trades',
    title: 'Perfect Trades',
    description: 'Complete 3 trades with >80% profit target',
    xpReward: 800
  },
  {
    id: 'risk_management',
    title: 'Risk Manager',
    description: 'Complete 5 trades with proper R:R ratio',
    xpReward: 600
  }
];

export const WEEKLY_CHALLENGES = [
  {
    id: 'weekly_consistency',
    title: 'Consistent Trader',
    description: 'Maintain 55% win rate over 20 trades',
    xpReward: 2000
  },
  {
    id: 'volume_challenge',
    title: 'Volume Challenge',
    description: 'Trade $100K volume with <0.5% drawdown',
    xpReward: 2500
  }
];

export const SPECIAL_EVENTS = [
  {
    id: 'trading_competition',
    title: 'Trading Competition',
    description: 'Compete for highest return %',
    duration: '24h',
    xpReward: 5000
  },
  {
    id: 'team_challenge',
    title: 'Team Trading Challenge',
    description: 'Work with team for highest combined profit',
    duration: '1w',
    xpReward: 10000
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
  defaultLeverage: 5,
  maxPositions: 10,
  maxLeverage: 100,
  minTradeSize: 10,
  makerFee: 0.001,
  takerFee: 0.002,
  liquidationThreshold: 0.5,
  maintenanceMargin: 0.01,
  initialMargin: 0.1,
  maxDrawdown: 0.95
} as const;

export const LEVERAGE_TIERS = [
  { level: 1, maxLeverage: 10, name: 'Beginner' },
  { level: 2, maxLeverage: 25, name: 'Intermediate' },
  { level: 3, maxLeverage: 50, name: 'Advanced' },
  { level: 4, maxLeverage: 75, name: 'Expert' },
  { level: 5, maxLeverage: 100, name: 'Master' }
] as const; 