import { StaticImageData } from 'next/image';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  category: 'trading' | 'learning' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LearningProgress {
  moduleId: string;
  moduleName: string;
  progress: number;
  completedLessons: string[];
  quizScores: Record<string, number>;
  lastAccessed: Date;
}

export interface Trade {
  id: string;
  pair: string;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  size: number;
  leverage: number;
  timestamp: Date;
  pnl?: number;
  status: 'open' | 'closed' | 'liquidated';
  notes?: string;
}

export interface UserStats {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  biggestWin: number;
  biggestLoss: number;
  currentStreak: number;
  bestStreak: number;
}

export interface UserLevel {
  current: number;
  xp: number;
  xpToNextLevel: number;
  rank?: string;
  title?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string | StaticImageData;
  bio?: string;
  level: UserLevel;
  achievements: Achievement[];
  learningProgress: LearningProgress[];
  trades: Trade[];
  stats: UserStats;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    privacySettings: {
      showTrades: boolean;
      showAchievements: boolean;
      showLearningProgress: boolean;
    };
    defaultCurrency: string;
    riskManagement: {
      maxLeverage: number;
      maxPositionSize: number;
      stopLossPercentage: number;
    };
  };
  socialLinks?: {
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
  joinedAt: Date;
  lastActive: Date;
  leaderboardRank?: number;
} 