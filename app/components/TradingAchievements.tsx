import React, { useState } from 'react';
import { Medal, Star, Trophy, Target, Award, Rocket } from 'lucide-react';

const TradingAchievements = () => {
  const achievements = [
    {
      category: 'Basics',
      achievements: [
        { id: 1, name: "First Blood", description: "Make your first profitable trade", completed: true, xp: 100 },
        { id: 2, name: "Diamond Hands", description: "Hold a position for 24 hours", completed: true, xp: 200 },
        { id: 3, name: "To The Moon", description: "Achieve 100% profit on a single trade", completed: false, xp: 500 },
      ]
    },
    {
      category: 'Advanced',
      achievements: [
        { id: 4, name: "Trend Rider", description: "Successfully trade with the trend 5 times", completed: false, xp: 300 },
        { id: 5, name: "Pattern Master", description: "Profit from 3 chart pattern trades", completed: false, xp: 400 },
        { id: 6, name: "Risk Manager", description: "Maintain positive risk-reward for 10 trades", completed: false, xp: 600 },
      ]
    },
    {
      category: 'Expert',
      achievements: [
        { id: 7, name: "Market Wizard", description: "Achieve 1000% portfolio growth", completed: false, xp: 1000 },
        { id: 8, name: "Trading Legend", description: "Complete all basic and advanced achievements", completed: false, xp: 2000 },
        { id: 9, name: "Neural Master", description: "Successfully use AI predictions in 50 trades", completed: false, xp: 1500 },
      ]
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState('Basics');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Achievement Overview */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-yellow-400 h-8 w-8" />
            <div>
              <h3 className="font-bold text-xl">Total XP</h3>
              <p className="text-gray-400">300/7600</p>
            </div>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div className="h-full w-[4%] bg-yellow-400 rounded-full" />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <Medal className="text-purple-400 h-8 w-8" />
            <div>
              <h3 className="font-bold text-xl">Achievements</h3>
              <p className="text-gray-400">2/27 Completed</p>
            </div>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div className="h-full w-[7%] bg-purple-400 rounded-full" />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="text-blue-400 h-8 w-8" />
            <div>
              <h3 className="font-bold text-xl">Current Rank</h3>
              <p className="text-gray-400">Novice Trader</p>
            </div>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div className="h-full w-[10%] bg-blue-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="flex gap-4 mb-6">
        {achievements.map(category => (
          <button
            key={category.category}
            onClick={() => setSelectedCategory(category.category)}
            className={`px-6 py-3 rounded-lg transition-all ${
              selectedCategory === category.category
                ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                : 'bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            {category.category}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-3 gap-6">
        {achievements
          .find(cat => cat.category === selectedCategory)
          ?.achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`p-6 rounded-xl border backdrop-blur-md ${
                achievement.completed
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-gray-800/50 border-gray-700/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{achievement.name}</h3>
                {achievement.completed ? (
                  <Star className="text-yellow-400" />
                ) : (
                  <Target className="text-gray-400" />
                )}
              </div>
              <p className="text-gray-400 mb-4">{achievement.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className={achievement.completed ? 'text-green-400' : 'text-gray-400'}>
                  {achievement.completed ? 'Completed' : 'In Progress'}
                </span>
                <span className="text-yellow-400">+{achievement.xp} XP</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TradingAchievements; 