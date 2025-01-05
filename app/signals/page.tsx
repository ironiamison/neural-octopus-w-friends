'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Brain, ChevronRight } from 'lucide-react'

const roadmapItems = [
  { title: 'Phase 1: AI Signal Generation', description: 'Advanced machine learning models for market analysis' },
  { title: 'Phase 2: Real-time Analytics', description: 'Live market sentiment and trend detection' },
  { title: 'Phase 3: Custom Alerts', description: 'Personalized trading signals based on your strategy' },
  { title: 'Phase 4: Performance Tracking', description: 'Detailed analytics and success metrics' },
  { title: 'Phase 5: Social Integration', description: 'Community-driven insights and signal sharing' }
]

export default function SignalsPage() {
  const router = useRouter()
  const [currentPhase, setCurrentPhase] = useState(0)

  useEffect(() => {
    // Cycle through phases
    const phaseInterval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % roadmapItems.length)
    }, 2000)

    // Redirect after showing all phases
    const redirectTimer = setTimeout(() => {
      router.push('/')
    }, 12000) // Redirect after 12 seconds

    return () => {
      clearInterval(phaseInterval)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-[#131722] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[#1E222D] rounded-lg border border-gray-800 p-8 md:p-12"
        >
          {/* AI16Z Branding */}
          <motion.div 
            className="flex items-center justify-center mb-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain className="w-12 h-12 text-blue-500 mr-3" />
            <h2 className="text-2xl font-bold text-white">Powered by AI16Z</h2>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-6 text-center"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Smart Signals Coming Soon
          </motion.h1>

          <p className="text-gray-400 text-lg md:text-xl text-center mb-12">
            We're building the future of AI-powered trading signals. Get ready for intelligent market insights backed by AI16Z technology.
          </p>

          {/* Roadmap */}
          <div className="space-y-4">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: -50, opacity: 0 }}
                animate={{ 
                  x: currentPhase >= index ? 0 : -50,
                  opacity: currentPhase >= index ? 1 : 0.5
                }}
                className={`flex items-center space-x-4 ${
                  currentPhase >= index ? 'text-white' : 'text-gray-600'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentPhase >= index ? 'bg-blue-500' : 'bg-gray-800'
                }`}>
                  <ChevronRight className={`w-6 h-6 ${
                    currentPhase >= index ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className={`${
                    currentPhase >= index ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress Indicator */}
          <motion.div 
            className="mt-8 h-1 bg-gray-800 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentPhase + 1) / roadmapItems.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          <p className="text-gray-400 text-center mt-8">
            Redirecting to home in a few seconds...
          </p>
        </motion.div>
      </div>
    </div>
  )
} 