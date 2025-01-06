'use client'

import { motion } from 'framer-motion'
import { 
  ChartBar, 
  LineChart, 
  History, 
  TrendingUp, 
  Wallet,
  DollarSign,
  Clock,
  Trophy,
  ArrowRight
} from 'lucide-react'
import { Button } from './ui/button'

interface ConnectPreviewProps {
  type: 'portfolio' | 'history'
}

const features = {
  portfolio: [
    {
      icon: <DollarSign className="w-6 h-6 text-blue-400" />,
      title: "Real-time Portfolio Value",
      description: "Track your total portfolio value and available balance"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-400" />,
      title: "Position Management",
      description: "Monitor and manage your open positions"
    },
    {
      icon: <ChartBar className="w-6 h-6 text-purple-400" />,
      title: "PnL Analytics",
      description: "View detailed profit and loss analytics"
    }
  ],
  history: [
    {
      icon: <History className="w-6 h-6 text-blue-400" />,
      title: "Trade History",
      description: "View all your past trades and performance"
    },
    {
      icon: <Trophy className="w-6 h-6 text-yellow-400" />,
      title: "Performance Metrics",
      description: "Track your win rate and trading statistics"
    },
    {
      icon: <Clock className="w-6 h-6 text-green-400" />,
      title: "Time Analysis",
      description: "Analyze your trading patterns over time"
    }
  ]
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export default function ConnectPreview({ type }: ConnectPreviewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: -10,
                opacity: 0.2
              }}
              animate={{ 
                y: window.innerHeight + 10,
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{ 
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10
              }}
            />
          ))}
        </div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-center space-y-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-gray-800/50 border border-gray-700/50 backdrop-blur-md">
                {type === 'portfolio' ? (
                  <LineChart className="w-12 h-12 text-blue-400" />
                ) : (
                  <History className="w-12 h-12 text-blue-400" />
                )}
              </div>
            </div>
            <h1 className="text-4xl font-bold">
              {type === 'portfolio' ? 'Your Portfolio Awaits' : 'Track Your Progress'}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {type === 'portfolio' 
                ? 'Connect your wallet to view your portfolio, manage positions, and track your performance'
                : 'Connect your wallet to access your trading history, analyze patterns, and improve your strategy'
              }
            </p>
          </motion.div>

          {/* Features */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {features[type].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-lg bg-gray-800/50">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Preview Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {type === 'portfolio' ? (
              <>
                <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Total Value</span>
                      <span className="blur-sm">$10,000.00</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Open Positions</span>
                      <span className="blur-sm">3 Positions</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>24h PnL</span>
                      <span className="blur-sm text-green-400">+$520.45</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-gray-400">
                      <span>BTC/USD Long</span>
                      <span className="blur-sm text-green-400">+2.5%</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>ETH/USD Short</span>
                      <span className="blur-sm text-red-400">-1.2%</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>SOL/USD Long</span>
                      <span className="blur-sm text-green-400">+4.8%</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Win Rate</span>
                      <span className="blur-sm">65%</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Total Trades</span>
                      <span className="blur-sm">128</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Best Trade</span>
                      <span className="blur-sm text-green-400">+$1,245.00</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Average Profit</span>
                      <span className="blur-sm text-green-400">$245.50</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Average Loss</span>
                      <span className="blur-sm text-red-400">$125.30</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Profit Factor</span>
                      <span className="blur-sm">1.95</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 