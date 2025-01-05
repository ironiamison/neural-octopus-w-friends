'use client'

import React, { useState } from 'react';
import { Medal, Star, Trophy, Target, Book, TrendingUp, Rocket, Crown, Shield } from 'lucide-react';

const TraderProgression = () => {
  const [currentLevel, setCurrentLevel] = useState(5);
  const maxLevel = 100;

  // Level rewards system
  const levelRewards = {
    10: { title: 'Novice Trader', rewards: ['Unlock leverage up to 5x', 'Custom profile badge'] },
    25: { title: 'Intermediate Trader', rewards: ['Unlock leverage up to 10x', 'Custom trade themes'] },
    50: { title: 'Advanced Trader', rewards: ['Unlock leverage up to 20x', 'Premium indicators'] },
    75: { title: 'Expert Trader', rewards: ['Unlock max leverage', 'Create trading rooms'] },
    100: { title: 'Master Trader', rewards: ['All features unlocked', 'Special master badge'] }
  };

  // Trading skills categories
  const skillCategories = [
    { id: 'basics', name: 'Trading Basics', icon: Book, progress: 60, color: 'text-blue-400' },
    { id: 'technical', name: 'Technical Analysis', icon: TrendingUp, progress: 45, color: 'text-purple-400' },
    { id: 'risk', name: 'Risk Management', icon: Shield, progress: 30, color: 'text-green-400' },
    { id: 'psychology', name: 'Trading Psychology', icon: Target, progress: 25, color: 'text-yellow-400' },
    { id: 'advanced', name: 'Advanced Trading', icon: Crown, progress: 15, color: 'text-pink-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-md col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Level {currentLevel}</h2>
              <p className="text-gray-400">Master Trader Path</p>
            </div>
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Crown size={32} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {currentLevel + 1}</span>
              <span>7,250 / 10,000 XP</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"/>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-md">
          <h3 className="font-bold mb-2">Total XP</h3>
          <div className="text-3xl font-bold text-purple-400 mb-2">72,450</div>
          <div className="text-sm text-gray-400">Rank: Expert Trader</div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-md">
          <h3 className="font-bold mb-2">Trading Skills</h3>
          <div className="text-3xl font-bold text-green-400 mb-2">35%</div>
          <div className="text-sm text-gray-400">Overall Mastery</div>
        </div>
      </div>

      {/* Trading Skills */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {skillCategories.map(category => (
          <div 
            key={category.id}
            className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-md"
          >
            <category.icon className={`${category.color} mb-2`} size={24} />
            <div className="font-medium mb-2">{category.name}</div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r from-${category.color.split('-')[1]}-500 to-${category.color.split('-')[1]}-400`}
                style={{ width: `${category.progress}%` }}
              />
            </div>
            <div className="text-sm text-gray-400 mt-1">{category.progress}%</div>
          </div>
        ))}
      </div>

      {/* Level Rewards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4">Level Rewards</h2>
          <div className="space-y-6">
            {Object.entries(levelRewards).map(([level, { title, rewards }]) => (
              <div key={level} className={`relative ${parseInt(level) <= currentLevel ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex items-center gap-4 mb-2">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    parseInt(level) <= currentLevel
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-gray-700'
                  }`}>
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{title}</div>
                    <div className="text-sm text-gray-400">Level {level}</div>
                  </div>
                </div>
                <div className="ml-14 space-y-2">
                  {rewards.map((reward, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        parseInt(level) <= currentLevel ? 'bg-purple-400' : 'bg-gray-600'
                      }`} />
                      {reward}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4">Recent Achievements</h2>
          <div className="space-y-4">
            {[
              {
                title: 'First Blood',
                description: 'Complete your first profitable trade',
                xp: 100,
                icon: Target,
                achieved: true,
                timestamp: '2h ago'
              },
              {
                title: 'Winning Streak',
                description: 'Win 3 trades in a row',
                xp: 250,
                icon: Rocket,
                achieved: true,
                timestamp: '1d ago'
              },
              {
                title: 'Risk Manager',
                description: 'Maintain a positive balance for 7 days',
                xp: 500,
                icon: Shield,
                achieved: false,
                progress: 71
              },
              {
                title: 'Market Master',
                description: 'Achieve 75% win rate in 20 trades',
                xp: 1000,
                icon: Crown,
                achieved: false,
                progress: 45
              }
            ].map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  achievement.achieved
                    ? 'bg-purple-500/10 border border-purple-500/20'
                    : 'bg-gray-700/30 border border-gray-600/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <achievement.icon className={`h-5 w-5 ${
                      achievement.achieved ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-gray-400">{achievement.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      achievement.achieved ? 'text-purple-400' : 'text-gray-400'
                    }`}>
                      {achievement.xp} XP
                    </div>
                    {achievement.timestamp && (
                      <div className="text-sm text-gray-500">{achievement.timestamp}</div>
                    )}
                  </div>
                </div>
                {!achievement.achieved && achievement.progress && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraderProgression; 