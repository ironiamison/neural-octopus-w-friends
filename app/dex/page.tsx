'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { 
  Brain, 
  Zap, 
  ChartBar, 
  Bot, 
  Shield, 
  Sparkles,
  BookOpen,
  TrendingUp,
  LineChart,
  Target,
  Cpu,
  Microscope,
  Gauge,
  Radar,
  Workflow,
  Rocket,
  Timer,
  Crosshair
} from 'lucide-react'
import LearningSection from '../components/LearningSection'

// Dynamically import framer-motion components
const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
)

const features = [
  {
    icon: Brain,
    title: 'AI Price Prediction Engine',
    description: 'Advanced neural networks analyze market patterns, sentiment, and on-chain data to predict price movements with high accuracy'
  },
  {
    icon: Microscope,
    title: 'AI16Z Research Integration',
    description: 'Real-time market analysis and insights from a16z crypto research team, powered by artificial intelligence'
  },
  {
    icon: Workflow,
    title: 'Smart Order Routing',
    description: 'Cross-chain liquidity aggregation with MEV protection and optimal execution paths'
  },
  {
    icon: Bot,
    title: 'Custom Trading Bots',
    description: 'Build and backtest AI-powered trading strategies with drag-and-drop strategy builder'
  },
  {
    icon: Radar,
    title: 'Sentiment Analysis',
    description: 'Real-time social media and news sentiment analysis to gauge market momentum'
  },
  {
    icon: Target,
    title: 'Price Action Signals',
    description: 'AI-generated trading signals based on technical and fundamental analysis'
  },
  {
    icon: Gauge,
    title: 'Risk Analytics',
    description: 'Advanced risk metrics and portfolio optimization suggestions'
  },
  {
    icon: Cpu,
    title: 'AI Trading Assistant',
    description: 'Personal AI assistant to help analyze trades and improve strategy'
  },
  {
    icon: LineChart,
    title: 'Advanced Charting',
    description: 'Professional-grade charts with AI-powered technical indicators'
  }
]

const botFeatures = [
  {
    icon: Rocket,
    title: 'Lightning-Fast Execution',
    description: 'Sub-millisecond transaction execution with MEV protection'
  },
  {
    icon: Timer,
    title: 'Smart Timing',
    description: 'AI-powered entry and exit timing based on market conditions'
  },
  {
    icon: Crosshair,
    title: 'Precision Sniping',
    description: 'Advanced mempool monitoring for optimal trade execution'
  }
]

export default function DexPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [showFinalPopup, setShowFinalPopup] = useState(false)
  const [countdown, setCountdown] = useState(20)

  useEffect(() => {
    setMounted(true)

    // Show popup after 10 seconds
    const popupTimer = setTimeout(() => {
      setShowFinalPopup(true)
    }, 10000)

    // Redirect after 20 seconds
    const redirectTimer = setTimeout(() => {
      router.push('/')
    }, 20000)

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev > 0 ? prev - 1 : 0)
    }, 1000)

    return () => {
      clearTimeout(popupTimer)
      clearTimeout(redirectTimer)
      clearInterval(countdownInterval)
    }
  }, [router])

  // Prevent hydration mismatch by not rendering countdown until mounted
  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center justify-center p-8">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full space-y-12"
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <MotionDiv
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-6">
              AI-Powered DEX Coming Soon
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of decentralized trading with our AI16Z-powered platform. 
              Advanced machine learning algorithms combined with expert research for optimal trading outcomes.
            </p>
          </MotionDiv>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <MotionDiv
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-[#262B36] p-6 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all">
                    <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                </div>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{feature.description}</p>
              </MotionDiv>
            )
          })}
        </div>

        {/* Learning Section */}
        <LearningSection />

        {showFinalPopup && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
          >
            <MotionDiv 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-[#1E222D] rounded-2xl p-8 max-w-2xl w-full mx-4 border border-blue-500/20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <Bot className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    AI Trading Bot Suite
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-mono">{countdown}s</span>
                </div>
              </div>

              <p className="text-gray-400 mb-8">
                Experience the power of AI-driven automated trading with our advanced bot suite. 
                Designed for optimal performance in the Solana meme ecosystem.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {botFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <MotionDiv
                      key={feature.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-[#262B36] p-4 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-blue-400" />
                        <h3 className="font-medium text-white">{feature.title}</h3>
                      </div>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </MotionDiv>
                  )
                })}
              </div>

              <div className="text-center text-gray-400">
                {mounted && `Redirecting to home page in ${countdown} seconds...`}
              </div>
            </MotionDiv>
          </MotionDiv>
        )}

        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-400 mt-8 flex items-center justify-center gap-3"
        >
          <Timer className="w-5 h-5" />
          <span>{mounted && `Redirecting in ${countdown} seconds...`}</span>
        </MotionDiv>
      </MotionDiv>
    </div>
  )
} 