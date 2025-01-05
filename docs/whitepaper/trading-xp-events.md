# Trading XP & Special Events

## Trading XP System

### 1. Base Trading XP
```typescript
interface TradingXPCalculator {
    baseTrading: {
        successfulTrade: 100,         // Base XP for completing a trade
        minimumTradeSize: 100,        // Minimum USD value for XP eligibility
        maxDailyTrades: 100,          // Maximum trades counted per day
        cooldownPeriod: 300           // Seconds between trade XP awards
    },

    volumeBonus: {
        baseMultiplier: 0.01,         // XP per $1000 traded
        tiers: [
            { threshold: 1000, multiplier: 1.0 },
            { threshold: 10000, multiplier: 1.2 },
            { threshold: 100000, multiplier: 1.5 },
            { threshold: 1000000, multiplier: 2.0 }
        ],
        dailyCap: 10000               // Maximum volume bonus XP per day
    },

    profitBonus: {
        baseMultiplier: 0.05,         // XP per $100 profit
        tiers: [
            { threshold: 100, multiplier: 1.0 },
            { threshold: 1000, multiplier: 1.3 },
            { threshold: 10000, multiplier: 1.6 },
            { threshold: 100000, multiplier: 2.0 }
        ],
        dailyCap: 20000               // Maximum profit bonus XP per day
    }
}
```

### 2. Trading Streak Bonuses
```typescript
interface StreakBonuses {
    winStreak: {
        minStreak: 3,                 // Minimum trades for streak bonus
        baseBonus: 500,               // Base XP for achieving min streak
        bonusMultiplier: 1.5,         // Multiplier for each additional win
        maxStreak: 10,                // Maximum streak multiplier cap
        streakPreservation: {
            maxTimeGap: 86400,        // 24 hours to maintain streak
            allowedLosses: 1          // Losses allowed before breaking streak
        }
    },

    dailyStreak: {
        minDays: 5,                   // Minimum days for streak bonus
        baseBonus: 1000,              // Base XP for achieving min streak
        bonusMultiplier: 1.2,         // Multiplier for each additional day
        maxStreak: 30,                // Maximum streak multiplier cap
        requirements: {
            minTrades: 3,             // Minimum trades per day
            minProfit: 0,             // Minimum profit per day
            maxDrawdown: 0.1          // Maximum allowed daily drawdown
        }
    },

    volumeStreak: {
        minDays: 3,                   // Minimum days for volume streak
        baseBonus: 750,               // Base XP for achieving min streak
        bonusMultiplier: 1.3,         // Multiplier for each additional day
        maxStreak: 15,                // Maximum streak multiplier cap
        requirements: {
            minVolume: 10000,         // Minimum daily volume
            minTrades: 5              // Minimum trades per day
        }
    }
}
```

### 3. Risk Management Bonuses
```typescript
interface RiskManagementXP {
    stopLossUsage: {
        baseBonus: 50,                // Bonus per trade with stop loss
        successMultiplier: 1.5,       // Multiplier for profitable trades
        consistencyBonus: 500,        // Bonus for consistent usage
        maxDailyBonus: 1000          // Maximum daily stop loss bonus
    },

    positionSizing: {
        optimalSize: {
            minSize: 0.01,            // Minimum position size (BTC)
            maxSize: 0.1,             // Maximum position size (BTC)
            baseBonus: 100            // Bonus for optimal sizing
        },
        riskPerTrade: {
            maxRisk: 0.02,            // Maximum 2% account risk per trade
            baseBonus: 150            // Bonus for proper risk management
        }
    },

    drawdownControl: {
        maxDrawdown: 0.1,             // Maximum 10% drawdown threshold
        recoveryBonus: 1000,          // Bonus for recovering from drawdown
        preventionBonus: 500          // Bonus for maintaining low drawdown
    }
}
```

## Special Events

### 1. Seasonal Championships
```typescript
interface SeasonalEvent {
    schedule: {
        duration: 2592000,            // 30-day seasons
        preSeasonDuration: 604800,    // 7-day preparation period
        postSeasonDuration: 172800,   // 2-day celebration period
        seasonTypes: [
            "Bull Market Bonanza",
            "Bear Market Battle",
            "Volatility Ventures",
            "Altcoin Adventure"
        ]
    },

    rewards: {
        seasonal: {
            xpMultiplier: 2.0,        // Double XP during season
            specialBadges: string[],   // Season-specific badges
            uniqueEmotes: string[],    // Season-specific emotes
            leaderboardRewards: {
                top10: {
                    xpBonus: 50000,
                    specialTitle: string,
                    uniqueNFT: string
                },
                top100: {
                    xpBonus: 25000,
                    specialBadge: string
                },
                participants: {
                    xpBonus: 5000,
                    commemorativeBadge: string
                }
            }
        }
    },

    challenges: {
        daily: {
            tasks: string[],          // Daily seasonal challenges
            bonusXP: number,          // Daily challenge XP bonus
            streakBonus: number       // Bonus for completing consecutive days
        },
        weekly: {
            missions: string[],       // Weekly seasonal missions
            bonusXP: number,          // Weekly mission XP bonus
            progressiveRewards: any[] // Increasing rewards for completion
        },
        seasonal: {
            milestones: string[],     // Season-long achievement goals
            finalRewards: any[],      // End-of-season rewards
            leaderboardPoints: number // Points for seasonal ranking
        }
    }
}
```

### 2. Special Trading Events
```typescript
interface SpecialEvents {
    marketEvents: {
        bullRun: {
            trigger: "price_increase",
            threshold: 0.1,           // 10% price increase
            duration: 3600,           // 1-hour event
            bonuses: {
                xpMultiplier: 3.0,
                volumeBonus: 2.0,
                specialRewards: any[]
            }
        },
        volatilitySpike: {
            trigger: "volatility_increase",
            threshold: 0.05,          // 5% volatility increase
            duration: 1800,           // 30-minute event
            bonuses: {
                xpMultiplier: 2.5,
                accuracyBonus: 2.0,
                specialRewards: any[]
            }
        },
        memeCoin: {
            trigger: "social_momentum",
            threshold: 1000,          // Social mention threshold
            duration: 7200,           // 2-hour event
            bonuses: {
                xpMultiplier: 4.0,
                volumeBonus: 3.0,
                specialRewards: any[]
            }
        }
    },

    communityEvents: {
        tradingCompetitions: {
            types: [
                "Speed Trading Sprint",
                "Precision Trading Challenge",
                "Volume Warriors",
                "Profit Pioneers"
            ],
            duration: 3600,           // 1-hour events
            entryRequirements: {
                minLevel: 10,
                minBalance: 1000,
                previousRank: string
            },
            rewards: {
                xpMultiplier: 5.0,
                specialBadges: string[],
                uniqueEmotes: string[],
                prizePools: number[]
            }
        },
        
        tradingRallies: {
            duration: 86400,          // 24-hour events
            teamSize: 5,
            objectives: {
                totalVolume: number,
                averageProfit: number,
                teamConsistency: number
            },
            rewards: {
                teamXPBonus: 10000,
                individualXPBonus: 2000,
                specialTeamBadges: string[],
                prizePools: number[]
            }
        }
    }
}
```

### 3. Holiday Events
```typescript
interface HolidayEvents {
    schedule: {
        newYear: {
            duration: 604800,         // 7-day event
            specialFeatures: [
                "Year in Review Stats",
                "New Year Predictions",
                "Resolution Challenges"
            ],
            bonuses: {
                xpMultiplier: 2.5,
                specialRewards: any[],
                uniqueDecorations: string[]
            }
        },
        
        lunarNewYear: {
            duration: 1209600,        // 14-day event
            specialFeatures: [
                "Zodiac Trading Challenges",
                "Fortune Trading Bonus",
                "Lucky Trade Hours"
            ],
            bonuses: {
                xpMultiplier: 2.0,
                luckyTradeBonus: 3.0,
                specialRewards: any[]
            }
        },
        
        halloween: {
            duration: 259200,         // 3-day event
            specialFeatures: [
                "Spooky Trading Challenges",
                "Mystery Box Rewards",
                "Trick or Trade Bonus"
            ],
            bonuses: {
                xpMultiplier: 3.0,
                mysteryMultiplier: 2.0,
                specialRewards: any[]
            }
        }
    },

    specialMechanics: {
        doubleXPHours: {
            frequency: 3600,          // Every hour
            duration: 300,            // 5-minute windows
            multiplier: 2.0
        },
        luckyTrades: {
            probability: 0.1,         // 10% chance per trade
            xpBonus: 1000,
            specialReward: any
        },
        eventChallenges: {
            daily: any[],
            weekly: any[],
            eventWide: any[]
        }
    }
}
``` 