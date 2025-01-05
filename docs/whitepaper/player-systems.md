# Player Progression Systems

## Experience (XP) and Leveling System

### 1. XP Mechanics
```typescript
interface XPSystem {
    levelConfig: {
        maxLevel: 100,
        xpPerLevel: number[],  // Array of XP required for each level
        levelBonuses: {
            tradingFeeDiscounts: number[],
            leverageUnlocks: number[],
            specialFeatureUnlocks: string[]
        }
    },
    
    xpSources: {
        trading: {
            baseXP: 100,            // Base XP per trade
            volumeMultiplier: 0.01, // Additional XP per $1000 traded
            profitMultiplier: 0.05  // Additional XP per $100 profit
        },
        learning: {
            lessonCompletion: 500,  // XP per lesson completed
            quizSuccess: 200,       // XP per quiz passed
            practiceTrading: 150    // XP per practice trade
        },
        achievements: {
            baseXP: 1000,          // Base XP per achievement
            tierMultiplier: 2.0     // Multiplier for higher tier achievements
        },
        tournaments: {
            participation: 500,     // Base XP for participating
            rankingBonus: 1000,     // Additional XP for top rankings
            winnerBonus: 5000       // Bonus XP for tournament winners
        }
    }
}
```

### 2. Level Progression
```typescript
interface LevelProgression {
    levels: {
        [level: number]: {
            xpRequired: number,
            unlocks: string[],
            title: string,
            benefits: {
                feeDiscount: number,
                maxLeverage: number,
                specialFeatures: string[]
            }
        }
    },
    
    milestones: {
        [level: number]: {
            achievement: string,
            reward: {
                type: string,
                value: number,
                description: string
            }
        }
    }
}

const levelBenefits = {
    10: {
        title: "Apprentice Trader",
        unlocks: ["Basic Leverage", "Simple Charts"],
        feeDiscount: 0.05
    },
    25: {
        title: "Journeyman Trader",
        unlocks: ["Advanced Charts", "Price Alerts"],
        feeDiscount: 0.10
    },
    50: {
        title: "Expert Trader",
        unlocks: ["Maximum Leverage", "AI Signals"],
        feeDiscount: 0.20
    },
    75: {
        title: "Master Trader",
        unlocks: ["VIP Features", "Custom Indicators"],
        feeDiscount: 0.30
    },
    100: {
        title: "Legendary Trader",
        unlocks: ["All Features", "Special Badge"],
        feeDiscount: 0.50
    }
}
```

## Achievement System

### 1. Achievement Categories
```typescript
interface AchievementSystem {
    categories: {
        trading: {
            volumeMilestones: {
                levels: number[],      // [10000, 100000, 1000000]
                rewards: number[]      // XP rewards for each level
            },
            profitMilestones: {
                levels: number[],      // [1000, 10000, 100000]
                rewards: number[]      // XP rewards for each level
            },
            winStreaks: {
                levels: number[],      // [5, 10, 20]
                rewards: number[]      // XP rewards for each level
            }
        },
        learning: {
            coursesCompleted: {
                levels: number[],      // [1, 5, 10]
                rewards: number[]      // XP rewards for each level
            },
            quizScores: {
                levels: number[],      // [80, 90, 100]
                rewards: number[]      // XP rewards for each level
            },
            practiceSuccess: {
                levels: number[],      // [10, 50, 100]
                rewards: number[]      // XP rewards for each level
            }
        },
        social: {
            referrals: {
                levels: number[],      // [1, 5, 10]
                rewards: number[]      // XP rewards for each level
            },
            communityContributions: {
                levels: number[],      // [1, 10, 50]
                rewards: number[]      // XP rewards for each level
            }
        }
    },
    
    tiers: {
        bronze: {
            minScore: 0,
            multiplier: 1.0
        },
        silver: {
            minScore: 1000,
            multiplier: 1.5
        },
        gold: {
            minScore: 5000,
            multiplier: 2.0
        },
        platinum: {
            minScore: 10000,
            multiplier: 3.0
        },
        diamond: {
            minScore: 50000,
            multiplier: 5.0
        }
    }
}
```

### 2. Achievement Processing
```typescript
interface AchievementProcessor {
    tracking: {
        metrics: {
            tradingVolume: number,
            profitLoss: number,
            winStreak: number,
            completedCourses: string[],
            quizResults: Map<string, number>,
            practiceResults: {
                completed: number,
                successful: number
            }
        },
        
        checkpoints: {
            daily: {
                lastCheck: number,
                progress: Map<string, number>
            },
            weekly: {
                lastCheck: number,
                progress: Map<string, number>
            },
            monthly: {
                lastCheck: number,
                progress: Map<string, number>
            }
        }
    },
    
    rewards: {
        xpRewards: Map<string, number>,
        itemRewards: Map<string, any>,
        specialRewards: Map<string, any>
    }
}
```

## Tournament System

### 1. Tournament Structure
```typescript
interface TournamentSystem {
    types: {
        daily: {
            duration: 86400,          // 24 hours in seconds
            entryFee: number,
            minParticipants: 10,
            maxParticipants: 100,
            prizePool: {
                distribution: number[], // [0.5, 0.3, 0.2]
                minimumPool: number
            }
        },
        weekly: {
            duration: 604800,         // 7 days in seconds
            entryFee: number,
            minParticipants: 50,
            maxParticipants: 500,
            prizePool: {
                distribution: number[], // [0.4, 0.25, 0.15, 0.1, 0.1]
                minimumPool: number
            }
        },
        special: {
            duration: number,         // Variable duration
            entryFee: number,
            minParticipants: 100,
            maxParticipants: 1000,
            prizePool: {
                distribution: number[],
                minimumPool: number,
                sponsorBonus: number
            }
        }
    },
    
    rules: {
        tradingPairs: string[],      // Allowed trading pairs
        leverageLimit: number,
        minimumTrades: number,
        maximumDrawdown: number,
        scoringMetrics: {
            profitWeight: number,
            volumeWeight: number,
            winRateWeight: number,
            riskAdjustmentWeight: number
        }
    }
}
```

### 2. Tournament Management
```typescript
interface TournamentManager {
    registration: {
        status: "open" | "closed" | "in_progress",
        participants: Map<string, ParticipantInfo>,
        waitlist: string[],
        requirements: {
            minLevel: number,
            minBalance: number,
            previousParticipation: boolean
        }
    },
    
    leaderboard: {
        updateFrequency: number,     // Seconds between updates
        metrics: {
            totalProfit: number,
            totalVolume: number,
            winRate: number,
            sharpeRatio: number,
            finalScore: number
        },
        rankings: Map<string, number>
    },
    
    rewards: {
        monetary: {
            currency: string,
            amounts: number[]
        },
        achievements: {
            titles: string[],
            badges: string[],
            multipliers: number[]
        },
        special: {
            vipStatus: boolean,
            customEmotes: string[],
            exclusiveAccess: string[]
        }
    }
}
```

### 3. Scoring System
```typescript
interface TournamentScoring {
    metrics: {
        profitLoss: {
            weight: 0.4,
            calculation: "percentageReturn",
            minimumThreshold: -0.5    // -50% maximum drawdown
        },
        volume: {
            weight: 0.2,
            calculation: "logarithmic",
            minimumThreshold: 10000
        },
        consistency: {
            weight: 0.2,
            calculation: "sharpeRatio",
            minimumThreshold: 0
        },
        winRate: {
            weight: 0.2,
            calculation: "percentage",
            minimumThreshold: 0.4     // 40% minimum win rate
        }
    },
    
    adjustments: {
        riskFactor: {
            leverageMultiplier: number[],
            drawdownPenalty: number[]
        },
        timeWeighting: {
            enabled: boolean,
            decayFactor: number
        },
        volatilityAdjustment: {
            enabled: boolean,
            factor: number
        }
    },
    
    bonuses: {
        streaks: {
            winStreak: number[],
            volumeStreak: number[]
        },
        achievements: {
            firstPlace: number,
            topThree: number,
            topTen: number
        },
        special: {
            earlyBird: number,
            perfectTiming: number,
            crowdFavorite: number
        }
    }
}
``` 