'use client'

import React from 'react'
import { useWallet } from '../providers/WalletProvider'
import { motion } from 'framer-motion'
import WalletConnect from '../components/WalletConnect'
import { LineChart, Trophy, Target, Loader2, Rocket, Brain, ChevronRight } from 'lucide-react'

export default function TradePage() {
  const { isConnected } = useWallet()
  const [isLoading, setIsLoading] = React.useState(false)
  const [showAnimation, setShowAnimation] = React.useState(false)
  const [loadingStep, setLoadingStep] = React.useState(0)

  const loadingSteps = [
    { icon: Rocket, text: "Initializing trading environment..." },
    { icon: Brain, text: "Loading AI trading algorithms..." },
    { icon: Trophy, text: "Preparing achievement system..." },
    { icon: Target, text: "Setting up paper trading..." },
    { icon: ChevronRight, text: "Almost ready..." }
  ]

  React.useEffect(() => {
    if (isConnected) {
      setIsLoading(true)
      
      // Progress through loading steps
      const stepInterval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingSteps.length)
      }, 2000)

      // Show final animation after 10 seconds
      const timer = setTimeout(() => {
        clearInterval(stepInterval)
        setIsLoading(false)
        setShowAnimation(true)
      }, 10000)

      return () => {
        clearTimeout(timer)
        clearInterval(stepInterval)
      }
    } else {
      setIsLoading(false)
      setShowAnimation(false)
      setLoadingStep(0)
    }
  }, [isConnected])

  // Not connected state - show welcome screen
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
              Start Paper Trading
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Connect your wallet to start paper trading with AI16Z
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-gray-700"
            >
              <LineChart className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Paper Trading</h3>
              <p className="text-gray-400">Trade risk-free with virtual currency</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-gray-700"
            >
              <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Earn XP</h3>
              <p className="text-gray-400">Level up and unlock achievements</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-gray-700"
            >
              <Target className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Learn Trading</h3>
              <p className="text-gray-400">Practice strategies without risk</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <WalletConnect />
          </motion.div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    const CurrentIcon = loadingSteps[loadingStep].icon

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Loader2 className="w-16 h-16 text-blue-500 absolute" />
                <CurrentIcon className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </motion.div>
              
              <motion.h2 
                key={loadingStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-2xl font-bold text-white"
              >
                {loadingSteps[loadingStep].text}
              </motion.h2>
              
              <div className="w-full max-w-md mx-auto mt-8">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 10, ease: "linear" }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>Initializing</span>
                  <span>{Math.round((loadingStep + 1) / loadingSteps.length * 100)}%</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-gray-400 text-sm"
              >
                <p>Preparing your personalized trading experience...</p>
                <p className="mt-2">This may take a few moments</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Show animation after loading
  if (showAnimation) {
    window.location.href = '/trade/interface'
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-blue-500" />
        </motion.div>
      </div>
    )
  }

  // Fallback loading state
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  )
} 