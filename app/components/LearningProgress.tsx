'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Trophy, Star, Award } from 'lucide-react';
import { userService, LearningStats } from '../lib/services/user.service';
import { useWallet } from '../providers/WalletProvider';
import ClientOnly from './ClientOnly';

export default function LearningProgress() {
  const { publicKey } = useWallet();
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!publicKey) return;
      try {
        const profile = await userService.getProfile(publicKey.toString());
        if (profile) {
          setStats(profile.learningStats);
        }
      } catch (error) {
        console.error('Error loading learning stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Book className="w-12 h-12 mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-gray-500">Connect your wallet to track your learning progress</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Book className="w-12 h-12 mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">No Progress Yet</h3>
        <p className="text-gray-500">Start learning to track your progress</p>
      </div>
    );
  }

  const progressPercent = (stats.completedLessons / stats.totalLessons) * 100;
  const xpProgressPercent = (stats.xp / stats.xpToNextLevel) * 100;

  return (
    <ClientOnly>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {/* Level and XP */}
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-semibold">Level {stats.currentLevel}</h3>
            </div>
            <span className="text-sm text-gray-500">{stats.xp} / {stats.xpToNextLevel} XP</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgressPercent}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-primary"
            />
          </div>
        </div>

        {/* Lesson Progress */}
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Book className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-semibold">Lesson Progress</h3>
            </div>
            <span className="text-sm text-gray-500">
              {stats.completedLessons} / {stats.totalLessons} Completed
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-blue-500"
            />
          </div>
        </div>

        {/* Recent Achievements */}
        {stats.achievements.length > 0 && (
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Star className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-semibold">Recent Achievements</h3>
            </div>
            <div className="space-y-4">
              {stats.achievements.slice(-3).map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 text-sm"
                >
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span>{achievement}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </ClientOnly>
  );
} 