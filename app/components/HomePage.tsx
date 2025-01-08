'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Brain, BookOpen, Check, ChevronRight, TrendingUp, Users, Zap, Copy } from 'lucide-react'
import type { MarketStats, TrendingCoin, FeatureStats } from '../lib/services/stats.service'

interface HomePageProps {
  initialMarketStats: MarketStats
  initialTrendingCoins: TrendingCoin[]
  initialFeatureStats: FeatureStats
}

export function HomePage({ 
  initialMarketStats, 
  initialTrendingCoins, 
  initialFeatureStats
}: HomePageProps) {
  const [showCopiedToast, setShowCopiedToast] = useState(false)
  const [marketStats, setMarketStats] = useState(initialMarketStats)
  const [trendingCoins, setTrendingCoins] = useState(initialTrendingCoins)
  const [featureStats, setFeatureStats] = useState(initialFeatureStats)

  const handleCopyAddress = async () => {
    const address = "Ai16Z5bqJpHzwpEYX7XqZdWkqtPjG9CvDZKHEgXkGFLD"
    await navigator.clipboard.writeText(address)
    setShowCopiedToast(true)
    setTimeout(() => setShowCopiedToast(false), 2000)
  }

  return (
    <main className="min-h-screen bg-[#0D1117] text-white">
      {/* Toast Notification */}
      <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${showCopiedToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-center gap-2 bg-green-500/90 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
          <Check className="w-4 h-4" />
          <span>Address copied to clipboard!</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-pink-900/10 to-[#0D1117] animate-gradient-y" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <Image
                src="/tokens/ai16z.svg"
                alt="AI16Z"
                width={64}
                height={64}
                className="rounded-full"
              />
              <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                AI16Z Trading
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Experience the future of AI-powered trading with advanced machine learning algorithms and expert research.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/trade" className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors">
                Start Trading
              </Link>
              <Link href="/learn" className="px-8 py-3 bg-[#1E222D] hover:bg-[#2A2D35] rounded-lg font-semibold transition-colors">
                Learn More
              </Link>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E222D] hover:bg-[#2A2D35] rounded-lg transition-colors"
              >
                <span className="font-mono text-sm">Ai16Z...GFLD</span>
                <Copy className="w-4 h-4" />
              </button>
              <Link
                href="/docs"
                className="flex items-center gap-2 px-4 py-2 bg-[#1E222D] hover:bg-[#2A2D35] rounded-lg transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Documentation</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className="bg-[#1E222D]/50 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-gray-400">Trading Volume</h3>
              </div>
              <p className="text-2xl font-bold">${marketStats.tradingVolume24h.toLocaleString()}</p>
            </div>
            <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-purple-400" />
                <h3 className="text-gray-400">Active Traders</h3>
              </div>
              <p className="text-2xl font-bold">{marketStats.activeTraders.toLocaleString()}</p>
            </div>
            <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-gray-400">Total Trades</h3>
              </div>
              <p className="text-2xl font-bold">{marketStats.totalTrades.toLocaleString()}</p>
            </div>
            <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-5 h-5 text-green-400" />
                <h3 className="text-gray-400">Execution Rate</h3>
              </div>
              <p className="text-2xl font-bold">{marketStats.executionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Start Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/learn/basics" className="group bg-[#1E222D] rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <h3 className="font-semibold">Trading Basics</h3>
              </div>
              <p className="text-gray-400 text-sm group-hover:text-gray-300">Learn the fundamentals of crypto trading and market analysis.</p>
            </Link>
            <Link href="/learn/ai" className="group bg-[#1E222D] rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
                <h3 className="font-semibold">AI Trading</h3>
              </div>
              <p className="text-gray-400 text-sm group-hover:text-gray-300">Master AI-powered trading strategies and signals.</p>
            </Link>
            <Link href="/learn/advanced" className="group bg-[#1E222D] rounded-xl p-6 border border-gray-800 hover:border-pink-500/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-pink-400" />
                <h3 className="font-semibold">Advanced Strategies</h3>
              </div>
              <p className="text-gray-400 text-sm group-hover:text-gray-300">Advanced trading techniques and risk management.</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Stats */}
      <div className="bg-[#1E222D]/50 backdrop-blur-md py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-blue-400" />
                <h3 className="font-semibold">AI Predictions</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Predictions</span>
                  <span>{featureStats.aiPredictions.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Accuracy Rate</span>
                  <span className="text-green-400">{featureStats.aiPredictions.accuracy}%</span>
                </div>
              </div>
            </div>
            <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h3 className="font-semibold">Analytics</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Users</span>
                  <span>{featureStats.analytics.activeUsers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reports Generated</span>
                  <span>{featureStats.analytics.reportsGenerated.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="bg-[#1E222D] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-yellow-400" />
                <h3 className="font-semibold">Paper Trading</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Users</span>
                  <span>{featureStats.paperTrading.totalUsers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Trades Executed</span>
                  <span>{featureStats.paperTrading.tradesExecuted.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of traders using our AI-powered platform for paper trading. Practice risk-free and master your strategies.
            </p>
            <Link href="/trade" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors">
              Start Trading Now
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
} 