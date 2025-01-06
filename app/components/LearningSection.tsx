'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, ChevronRight, Star, Award } from 'lucide-react'

export default function LearningSection() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-8 border border-gray-800 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer group"
      onClick={() => router.push('/learn')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300">
            <BookOpen className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Learn Trading
              </h2>
              <Award className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-gray-400">
              Master crypto trading with our comprehensive learning resources and expert guidance
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-indigo-400">
            <Star className="w-4 h-4" />
            <span className="text-sm">Earn XP & Rewards</span>
          </div>
          <ChevronRight className="w-6 h-6 text-indigo-400 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </motion.div>
  )
} 