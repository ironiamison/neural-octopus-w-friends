'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trophy, Zap, TrendingUp, Award, Star, Target, Flame, Sword, Shield, Crown, Medal, Search, CheckCircle } from 'lucide-react';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import ClientOnly from './ClientOnly';

interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  category: string;
  progress: number;
  target: number;
  completed: boolean;
  unlockedAt?: Date;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  walletAddress: string;
  winRate: number;
  pnl: number;
  trades: number;
  achievements: Achievement[];
  level: number;
  xp: number;
  xpToNextLevel: number;
  rankPoints: number;
  streak: number;
  avatar?: string;
  phantomProfile?: {
    displayName?: string;
    verified: boolean;
    joinedAt: Date;
  };
}

const calculateRankPoints = (entry: LeaderboardEntry) => {
  const winRatePoints = entry.winRate * 10;
  const pnlPoints = Math.min(Math.abs(entry.pnl) / 100, 1000);
  const achievementPoints = entry.achievements.reduce((acc, curr) => acc + curr.points, 0);
  const tradePoints = Math.min(entry.trades * 2, 500);
  const streakPoints = entry.streak * 50;
  
  return Math.floor(winRatePoints + pnlPoints + achievementPoints + tradePoints + streakPoints);
};

const getRankTier = (points: number) => {
  if (points >= 5000) return { name: 'Elite', color: 'text-purple-500' };
  if (points >= 4000) return { name: 'Diamond', color: 'text-blue-400' };
  if (points >= 3000) return { name: 'Platinum', color: 'text-cyan-500' };
  if (points >= 2000) return { name: 'Gold', color: 'text-yellow-500' };
  if (points >= 1000) return { name: 'Silver', color: 'text-gray-400' };
  return { name: 'Bronze', color: 'text-orange-500' };
};

const generateAchievements = (): Achievement[] => {
  const achievements: Achievement[] = [
    // Trading Milestones (50 achievements)
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `trades-${i}`,
      name: `Trade Master ${i + 1}`,
      description: `Complete ${(i + 1) * 100} trades`,
      points: (i + 1) * 100,
      category: 'milestone',
      progress: 0,
      target: (i + 1) * 100,
      completed: false
    })),
    
    // Win Streaks (30 achievements)
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `streak-${i}`,
      name: `Winning Streak ${i + 1}`,
      description: `Achieve a ${(i + 1) * 5} trade winning streak`,
      points: (i + 1) * 200,
      category: 'streak',
      progress: 0,
      target: (i + 1) * 200,
      completed: false
    })),
    
    // Profit Milestones (50 achievements)
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `profit-${i}`,
      name: `Profit Hunter ${i + 1}`,
      description: `Reach ${(i + 1) * 10000}USDC in total profits`,
      points: (i + 1) * 300,
      category: 'profit',
      progress: 0,
      target: (i + 1) * 300,
      completed: false
    })),
    
    // Win Rate Achievements (30 achievements)
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `winrate-${i}`,
      name: `Accuracy ${i + 1}`,
      description: `Maintain a ${55 + (i * 1.5)}% win rate over 100 trades`,
      points: (i + 1) * 400,
      category: 'accuracy',
      progress: 0,
      target: (i + 1) * 400,
      completed: false
    })),
    
    // Position Size Achievements (30 achievements)
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `size-${i}`,
      name: `Whale ${i + 1}`,
      description: `Open a position worth ${(i + 1) * 50000}USDC`,
      points: (i + 1) * 250,
      category: 'size',
      progress: 0,
      target: (i + 1) * 250,
      completed: false
    })),
    
    // Time-based Achievements (50 achievements)
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `time-${i}`,
      name: `Veteran ${i + 1}`,
      description: `Trade actively for ${i + 1} ${i < 12 ? 'months' : 'years'}`,
      points: (i + 1) * 150,
      category: 'time',
      progress: 0,
      target: (i + 1) * 150,
      completed: false
    })),

    // Market Analysis (50 achievements)
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `analysis-${i}`,
      name: `Market Analyst ${i + 1}`,
      description: `Successfully predict ${(i + 1) * 10} market movements`,
      points: (i + 1) * 200,
      category: 'analysis',
      progress: 0,
      target: (i + 1) * 200,
      completed: false
    })),

    // Technical Indicators (50 achievements)
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `indicator-${i}`,
      name: `Technical Master ${i + 1}`,
      description: `Successfully trade using ${i + 1} different technical indicators`,
      points: (i + 1) * 175,
      category: 'technical',
      progress: 0,
      target: (i + 1) * 175,
      completed: false
    })),

    // Trading Patterns (50 achievements)
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `pattern-${i}`,
      name: `Pattern Hunter ${i + 1}`,
      description: `Successfully identify and trade ${i + 1} chart patterns`,
      points: (i + 1) * 225,
      category: 'pattern',
      progress: 0,
      target: (i + 1) * 225,
      completed: false
    })),

    // Risk Management (50 achievements)
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `risk-${i}`,
      name: `Risk Master ${i + 1}`,
      description: `Maintain proper risk management for ${(i + 1) * 50} trades`,
      points: (i + 1) * 200,
      category: 'risk',
      progress: 0,
      target: (i + 1) * 200,
      completed: false
    })),

    // Special Achievements (60 unique achievements)
    { id: 'first-trade', name: 'First Steps', description: 'Complete your first trade', points: 100, category: 'special', progress: 0, target: 100, completed: false },
    { id: 'diamond-hands', name: 'Diamond Hands', description: 'Hold a winning position for 7 days', points: 500, category: 'special', progress: 0, target: 500, completed: false },
    { id: 'paper-hands', name: 'Quick Fingers', description: 'Close a trade with over 100% profit in under 1 hour', points: 750, category: 'special', progress: 0, target: 750, completed: false },
    { id: 'comeback', name: 'Epic Comeback', description: 'Recover from a 50% drawdown to profitability', points: 1000, category: 'special', progress: 0, target: 1000, completed: false },
    { id: 'perfect-week', name: 'Perfect Week', description: 'Achieve 100% win rate over 10+ trades in a week', points: 1500, category: 'special', progress: 0, target: 1500, completed: false },
    { id: 'night-owl', name: 'Night Owl', description: 'Complete successful trades during night hours', points: 300, category: 'special', progress: 0, target: 300, completed: false },
    { id: 'early-bird', name: 'Early Bird', description: 'Complete successful trades during morning hours', points: 300, category: 'special', progress: 0, target: 300, completed: false },
    { id: 'market-maker', name: 'Market Maker', description: 'Provide significant liquidity to the market', points: 800, category: 'special', progress: 0, target: 800, completed: false },
    { id: 'trend-setter', name: 'Trend Setter', description: 'Start a trading movement followed by others', points: 1000, category: 'special', progress: 0, target: 1000, completed: false },
    { id: 'community-leader', name: 'Community Leader', description: 'Help 100 other traders improve their skills', points: 2000, category: 'special', progress: 0, target: 2000, completed: false },
    { id: 'mentor', name: 'Trading Mentor', description: 'Successfully mentor 10 new traders', points: 1500, category: 'special', progress: 0, target: 1500, completed: false },
    { id: 'innovator', name: 'Trading Innovator', description: 'Develop a unique trading strategy', points: 2000, category: 'special', progress: 0, target: 2000, completed: false },
    { id: 'researcher', name: 'Market Researcher', description: 'Publish valuable market research', points: 1000, category: 'special', progress: 0, target: 1000, completed: false },
    { id: 'educator', name: 'Trading Educator', description: 'Create educational content for the community', points: 1500, category: 'special', progress: 0, target: 1500, completed: false },
    { id: 'influencer', name: 'Market Influencer', description: 'Build a following of 1000+ traders', points: 2000, category: 'special', progress: 0, target: 2000, completed: false },
    { id: 'guru', name: 'Trading Guru', description: 'Achieve legendary status in the community', points: 5000, category: 'special', progress: 0, target: 5000, completed: false },
    { id: 'oracle', name: 'Market Oracle', description: 'Predict a major market event', points: 3000, category: 'special', progress: 0, target: 3000, completed: false },
    { id: 'phoenix', name: 'Trading Phoenix', description: 'Recover from a complete account loss', points: 2000, category: 'special', progress: 0, target: 2000, completed: false },
    { id: 'iron-will', name: 'Iron Will', description: 'Trade consistently for 365 days', points: 2500, category: 'special', progress: 0, target: 2500, completed: false },
    { id: 'golden-touch', name: 'Golden Touch', description: 'Achieve 10 consecutive 100%+ profit trades', points: 3000, category: 'special', progress: 0, target: 3000, completed: false }
  ];

  return achievements;
};

const mockAchievements = generateAchievements();

const generateMockData = (timeframe: string): LeaderboardEntry[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    username: `Trader${i + 1}`,
    walletAddress: `${Array(32).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    winRate: 50 + Math.random() * 40,
    pnl: Math.random() * 50000 * (Math.random() > 0.3 ? 1 : -1),
    trades: 50 + Math.floor(Math.random() * 450),
    achievements: mockAchievements.slice(0, Math.floor(Math.random() * 3) + 1),
    level: Math.floor(Math.random() * 50) + 1,
    xp: Math.floor(Math.random() * 1000),
    xpToNextLevel: 1000,
    rankPoints: 0,
    streak: Math.floor(Math.random() * 10),
    avatar: `/avatars/trader${i + 1}.png`,
    phantomProfile: {
      displayName: `Phantom Trader ${i + 1}`,
      verified: Math.random() > 0.5,
      joinedAt: new Date(Date.now() - Math.random() * 10000000000)
    }
  })).map(entry => ({
    ...entry,
    rankPoints: calculateRankPoints(entry)
  })).sort((a, b) => b.rankPoints - a.rankPoints);
};

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

const AchievementModal = ({ isOpen, onClose, achievements }: AchievementModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['all', 'milestone', 'streak', 'profit', 'accuracy', 'size', 'time', 'analysis', 'technical', 'pattern', 'risk', 'special'];
  
  const filteredAchievements = achievements
    .filter(a => {
      const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // Sort by completion status first, then by progress percentage
      if (a.completed !== b.completed) return b.completed ? 1 : -1;
      const aProgress = (a.progress / a.target) * 100;
      const bProgress = (b.progress / b.target) * 100;
      return bProgress - aProgress;
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#131722] p-6 rounded-lg w-[80vw] max-w-4xl max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Medal className="w-6 h-6 text-[#F0B90B]" />
                <span className="bg-gradient-to-r from-[#F0B90B] to-[#F5D74F] bg-clip-text text-transparent">
                  Achievements Gallery
                </span>
              </h2>
              <button
                onClick={onClose}
                className="text-[#848E9C] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col space-y-4 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search achievements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1E222D] border border-[#2A2D35] rounded-lg text-white placeholder-[#848E9C] focus:outline-none focus:border-[#F0B90B]"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#848E9C]" />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#F0B90B] text-black'
                        : 'bg-[#1E222D] text-[#848E9C] hover:bg-[#2A2D35]'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAchievements.map(achievement => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-[#1E222D] p-4 rounded-lg transition-colors ${
                    achievement.completed ? 'border border-[#F0B90B]' : 'hover:bg-[#2A2D35]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      {achievement.name}
                      {achievement.completed && (
                        <CheckCircle className="w-4 h-4 text-[#F0B90B]" />
                      )}
                    </h3>
                    <Badge variant="outline" className="bg-[#131722] border-[#2A2D35]">
                      {achievement.points} pts
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-[#848E9C]">{achievement.description}</p>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-[#848E9C] mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.target}</span>
                    </div>
                    <Progress
                      value={(achievement.progress / achievement.target) * 100}
                      className="h-1"
                      indicatorClassName={achievement.completed ? 'bg-[#F0B90B]' : 'bg-[#1E9CEF]'}
                    />
                  </div>
                  
                  {achievement.completed && achievement.unlockedAt && (
                    <div className="mt-2 text-xs text-[#848E9C]">
                      Unlocked: {achievement.unlockedAt.toLocaleDateString()}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState('daily');
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setData(generateMockData(timeframe));
  }, [timeframe]);

  const filteredData = data.filter(entry => 
    entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.phantomProfile?.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ClientOnly>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Leaderboard
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search traders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg bg-background border border-input"
                />
              </div>
              <Tabs value={timeframe} onValueChange={setTimeframe}>
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="alltime">All Time</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={timeframe}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {filteredData.map((entry, index) => {
                const tier = getRankTier(entry.rankPoints);
                return (
                  <motion.div
                    key={entry.walletAddress}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-center gap-4 p-4 rounded-lg bg-card hover:bg-accent/50 transition-colors"
                  >
                    {/* Entry content */}
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
      {selectedEntry && (
        <AchievementModal
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
          achievements={selectedEntry.achievements}
        />
      )}
    </ClientOnly>
  );
} 