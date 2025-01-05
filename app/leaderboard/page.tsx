'use client'

import { motion } from 'framer-motion';
import Leaderboard from '@/app/components/Leaderboard';

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">
          Compete with other traders and earn achievements to climb the ranks.
        </p>
      </motion.div>

      <Leaderboard />
    </div>
  );
} 