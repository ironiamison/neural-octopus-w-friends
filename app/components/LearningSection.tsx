'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, ChevronRight } from 'lucide-react'

export default function LearningSection() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-[#262B36] p-8 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
      onClick={() => router.push('/learn')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10">
            <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Learn Trading</h2>
            <p className="text-gray-400">
              Master crypto trading with our comprehensive learning resources and expert guidance
            </p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-gray-400" />
      </div>
    </motion.div>
  )
} 