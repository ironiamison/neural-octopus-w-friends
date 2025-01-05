'use client'

import React, { useState } from 'react';
import { Trophy, Zap, Flame, Target, Award, Rocket, Star } from 'lucide-react';
import TradingViewWidget from './TradingViewWidget'; // Import the TradingView widget

// Custom experience bar component
const ExperienceBar = ({ level, progress }) => (
  <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
    <div 
      className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
      style={{ width: `${progress}%` }}
    />
  </div>
);

// Custom achievement notification
const AchievementPopup = ({ achievement }) => (
  <div className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-500/90 to-blue-500/90 p-4 rounded-xl backdrop-blur-md animate-slide-up">
    <div className="flex items-center space-x-3">
      <Award className="text-yellow-300" size={24} />
      <div>
        <h4 className="font-bold">Achievement Unlocked!</h4>
        <p className="text-sm opacity-90">{achievement}</p>
      </div>
    </div>
  </div>
);

const GamifiedTrader = () => {
  const [traderLevel, setTraderLevel] = useState(5);
  const [experience, setExperience] = useState(75);
  const [streak, setStreak] = useState(3);
  const [portfolio, setPortfolio] = useState({
    balance: 10000,
    profitLoss: 2450,
    winRate: 68
  });

  const achievements = [
    { id: 1, name: "First Blood", description: "Make your first profitable trade", completed: true },
    { id: 2, name: "Diamond Hands", description: "Hold a position for 24 hours", completed: true },
    { id: 3, name: "To The Moon", description: "Achieve 100% profit on a single trade", completed: false },
  ];

  const leaderboard = [
    { rank: 1, name: "🚀 MoonWolf", profit: "+458%", prize: "5000 USDC" },
    { rank: 2, name: "💎 DiamondApe", profit: "+312%", prize: "2500 USDC" },
    { rank: 3, name: "🦍 CryptoKing", profit: "+245%", prize: "1000 USDC" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Top Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Trophy className="text-yellow-400" size={20} />
              <span className="font-medium">Trader Level {traderLevel}</span>
            </div>
            <span className="text-sm text-gray-400">{experience}/100 XP</span>
          </div>
          <ExperienceBar level={traderLevel} progress={experience} />
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-md">
          <div className="flex items-center space-x-2 mb-1">
            <Flame className="text-orange-400" size={20} />
            <span className="font-medium">Trading Streak</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">{streak} Days 🔥</div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-md">
          <div className="flex items-center space-x-2 mb-1">
            <Target className="text-green-400" size={20} />
            <span className="font-medium">Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{portfolio.winRate}%</div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-md">
          <div className="flex items-center space-x-2 mb-1">
            <Rocket className="text-purple-400" size={20} />
            <span className="font-medium">Paper Balance</span>
          </div>
          <div className="text-2xl font-bold">${portfolio.balance.toLocaleString()}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Trading Interface */}
        <div className="col-span-8">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">BONK/USD</h2>
                <p className="text-gray-400">Level 3 Trading Challenge Active!</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-400">Target: +25%</div>
                <div className="h-2 w-32 bg-gray-700 rounded-full">
                  <div className="h-full w-1/2 bg-green-500 rounded-full"/>
                </div>
              </div>
            </div>

            {/* TradingView Widget for BONK/USD */}
            <div className="h-64 mb-6">
              <TradingViewWidget symbol="BINANCE:BONKUSDT" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 p-4 rounded-xl transition-all duration-300 border border-green-500/30">
                <div className="text-xl font-bold mb-1">LONG</div>
                <div className="text-sm opacity-80">Earn 50 XP on win</div>
              </button>
              <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-4 rounded-xl transition-all duration-300 border border-red-500/30">
                <div className="text-xl font-bold mb-1">SHORT</div>
                <div className="text-sm opacity-80">Earn 50 XP on win</div>
              </button>
            </div>
          </div>

          {/* Quick Challenges */}
          <div className="grid grid-cols-2 gap-4">
            {['Win 3 Trades', 'Hold 1h', '10% Profit'].map(challenge => (
              <div key={challenge} className="bg-blue-500/20 p-4 rounded-xl border border-blue-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{challenge}</span>
                  <Zap className="text-yellow-400" size={16} />
                </div>
                <div className="text-sm text-blue-300">+100 XP</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-4 space-y-6">
          {/* Tournament Status */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Weekly Tournament</h3>
              <Trophy className="text-yellow-400" size={20} />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Your Rank:</span>
                <span className="text-yellow-400 font-bold">#42</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Prize Pool:</span>
                <span className="text-green-400 font-bold">10,000 USDC</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Time Left:</span>
                <span className="text-purple-400 font-bold">2d 14h</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-md">
            <h3 className="font-bold text-lg mb-4">Achievements</h3>
            <div className="space-y-3">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className={`p-3 rounded-lg border ${
                    achievement.completed 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-gray-700/30 border-gray-600/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{achievement.name}</span>
                    {achievement.completed && <Star className="text-yellow-400" size={16} />}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-md">
            <h3 className="font-bold text-lg mb-4">Top Traders</h3>
            <div className="space-y-3">
              {leaderboard.map(player => (
                <div key={player.rank} className="flex items-center justify-between p-2">
                  <div className="flex items-center space-x-3">
                    <span className={`text-lg ${
                      player.rank === 1 ? 'text-yellow-400' :
                      player.rank === 2 ? 'text-gray-400' :
                      'text-orange-400'
                    }`}>#{player.rank}</span>
                    <span>{player.name}</span>
                  </div>
                  <div className="text-green-400">{player.profit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Popup */}
      <AchievementPopup achievement="Diamond Hands: Hold a position for 24 hours!" />
    </div>
  );
};

export default GamifiedTrader; 