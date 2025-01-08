'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Brain, ChevronRight, Sparkles, LineChart, Bell, TrendingUp } from 'lucide-react'
import { MotionDiv } from '../components/motion'

const roadmapItems = [
  { 
    title: 'Phase 1: AI Signal Generation', 
    description: 'Advanced machine learning models for market analysis',
    icon: Brain,
    color: 'from-blue-500 to-purple-500'
  },
  { 
    title: 'Phase 2: Real-time Analytics', 
    description: 'Live market sentiment and trend detection',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    title: 'Phase 3: Custom Alerts', 
    description: 'Personalized trading signals based on your strategy',
    icon: Bell,
    color: 'from-pink-500 to-red-500'
  },
  { 
    title: 'Phase 4: Performance Tracking', 
    description: 'Detailed analytics and success metrics',
    icon: LineChart,
    color: 'from-red-500 to-orange-500'
  },
  { 
    title: 'Phase 5: Social Integration', 
    description: 'Community-driven insights and signal sharing',
    icon: Sparkles,
    color: 'from-orange-500 to-yellow-500'
  }
]

export default function SignalsPage() {
  const router = useRouter()
  const [currentPhase, setCurrentPhase] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [countdown, setCountdown] = useState(12)

  useEffect(() => {
    setMounted(true)
    
    // Cycle through phases
    const phaseInterval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % roadmapItems.length)
    }, 2000)

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(phaseInterval)
      clearInterval(countdownInterval)
    }
  }, [router])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="max-w-4xl w-full relative">
        <MotionDiv
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative bg-[#1C2127]/40 backdrop-blur-xl rounded-2xl border border-[#2A2D35]/50 p-8 md:p-12 overflow-hidden"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5" />
          
          {/* Content */}
          <div className="relative">
            {/* AI16Z Branding */}
            <MotionDiv 
              className="flex items-center justify-center mb-12"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative w-16 h-16 mr-4">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-50 animate-pulse" />
                <div className="relative w-full h-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 p-[1px]">
                  <div className="absolute inset-0 rounded-2xl bg-[#1C2127]/90 backdrop-blur-xl" />
                  <div className="relative w-full h-full rounded-2xl flex items-center justify-center">
                    <Brain className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI16Z Signals
                </h2>
                <p className="text-sm text-gray-400 mt-1">Advanced Trading Intelligence</p>
              </div>
            </MotionDiv>

            {/* Main Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Smart Signals Coming Soon
              </h1>
              <p className="text-lg text-gray-400">
                Experience the future of AI-powered trading signals. Get ready for intelligent market insights backed by cutting-edge technology.
              </p>
            </div>

            {/* Roadmap */}
            <div className="space-y-6 mb-12">
              {roadmapItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <MotionDiv
                    key={index}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ 
                      x: currentPhase >= index ? 0 : -50,
                      opacity: currentPhase >= index ? 1 : 0.5
                    }}
                    className={`flex items-start space-x-4 ${
                      currentPhase >= index ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    <div className={`relative flex-shrink-0`}>
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} blur-lg opacity-20`} />
                      <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} p-[1px]`}>
                        <div className="absolute inset-0 rounded-xl bg-[#1C2127]/90 backdrop-blur-xl" />
                        <div className={`relative w-full h-full rounded-xl flex items-center justify-center ${
                          currentPhase >= index ? 'text-white' : 'text-gray-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className={currentPhase >= index ? 'text-gray-400' : 'text-gray-600'}>
                        {item.description}
                      </p>
                    </div>
                  </MotionDiv>
                )
              })}
            </div>

            {/* Progress Bar */}
            <MotionDiv className="relative h-1 bg-gray-800/50 rounded-full overflow-hidden mb-8">
              <MotionDiv
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentPhase + 1) / roadmapItems.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </MotionDiv>

            {/* Countdown */}
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-gray-400"
            >
              Redirecting to home in {countdown} seconds...
            </MotionDiv>
          </div>
        </MotionDiv>
      </div>
    </div>
  )
} 