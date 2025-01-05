'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  category: string;
  rarity: string;
  icon?: string;
}

interface AchievementUnlockProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const rarityColors = {
  common: 'from-gray-400 to-gray-300',
  rare: 'from-blue-500 to-blue-400',
  epic: 'from-purple-600 to-purple-500',
  legendary: 'from-[#F0B90B] to-[#F5D74F]'
};

export default function AchievementUnlock({ achievement, onClose }: AchievementUnlockProps) {
  useEffect(() => {
    if (achievement) {
      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F0B90B', '#F5D74F', '#ffffff']
      });

      // Auto close after 5 seconds
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.3 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="relative">
            {/* Background glow effect */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`absolute inset-0 bg-gradient-to-r ${rarityColors[achievement.rarity]} blur-xl opacity-30`}
            />

            {/* Achievement card */}
            <motion.div
              className="relative bg-[#131722] border border-[#2A2D35] p-6 rounded-lg shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Floating stars */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-2 -left-2"
              >
                <Star className="w-6 h-6 text-[#F0B90B]" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute -bottom-2 -right-2"
              >
                <Star className="w-6 h-6 text-[#F0B90B]" />
              </motion.div>

              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Trophy className="w-8 h-8 text-[#F0B90B]" />
                </motion.div>
                <div>
                  <motion.h3
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-lg font-bold bg-gradient-to-r from-[#F0B90B] to-[#F5D74F] bg-clip-text text-transparent"
                  >
                    Achievement Unlocked!
                  </motion.h3>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-[#848E9C]"
                  >
                    {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                  </motion.div>
                </div>
              </div>

              {/* Achievement details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <h4 className="font-semibold text-white">{achievement.name}</h4>
                <p className="text-sm text-[#848E9C]">{achievement.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-[#F0B90B]" />
                  <span className="text-[#F0B90B]">+{achievement.points} points</span>
                </div>
              </motion.div>

              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-2 right-2 text-[#848E9C] hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                ✕
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 