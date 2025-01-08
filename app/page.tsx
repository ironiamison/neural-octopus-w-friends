'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trophy, Star, TrendingUp, Twitter, Github, Copy, ExternalLink, Sparkles, BookOpen, Brain, Lock } from 'lucide-react'

export default function HomePage() {
  const contractAddress = "0x1234567890abcdef1234567890abcdef12345678" // Replace with actual CA

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(74, 114, 255, 0.1) 0%, transparent 50%)',
          animation: 'pulse 4s infinite'
        }} />
        
        {/* Contract Address Display */}
        <div className="absolute top-6 left-6">
          <div className="flex items-center gap-3 bg-[#1E222D]/90 px-4 py-2.5 rounded-xl backdrop-blur-sm border border-gray-800/50 hover:border-blue-500/50 transition-all group">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-400 mb-1">Contract Address</span>
              <div className="flex items-center gap-3">
                <code className="font-mono text-sm text-blue-400">{contractAddress}</code>
                <button 
                  onClick={() => navigator.clipboard.writeText(contractAddress)}
                  className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors group-hover:scale-105 transform duration-150"
                >
                  <Copy className="w-4 h-4 text-blue-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI16z Branding */}
        <div className="absolute top-6 right-6">
          <div className="flex items-center gap-3 bg-[#1E222D]/90 px-4 py-2.5 rounded-xl backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/50 transition-all group">
            <span className="text-sm font-medium bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">Powered by</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <Brain className="w-5 h-5 text-white relative" />
              </div>
              <span className="font-semibold text-base bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">AI16z</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-center space-y-8 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <h1 className="text-6xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Trade Smarter
              </span>
            </h1>
            <div className="mt-4 text-2xl text-gray-400 font-light">
              AI-Powered Paper Trading Platform
            </div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Practice trading with AI insights, compete in tournaments, and learn from the best.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link 
              href="/learn" 
              className="group px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Start Learning
              </span>
            </Link>

            <Link 
              href="/tournaments"
              className="group px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Join Tournament
              </span>
            </Link>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
              <Link 
                href="/trade"
                className="relative px-8 py-3 bg-[#1E222D] rounded-lg font-medium flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5 text-green-400" />
                Trade Now
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
              <Link 
                href="/leaderboard"
                className="relative px-8 py-3 bg-[#1E222D] rounded-lg font-medium flex items-center gap-2"
              >
                <Star className="w-5 h-5 text-yellow-400" />
                Leaderboard
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            <div className="flex items-center gap-2 bg-[#1E222D]/60 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-400">5.2k Active Traders</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1E222D]/60 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-sm text-gray-400">3 Live Tournaments</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1E222D]/60 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm text-gray-400">$12.5M 24h Volume</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Animation Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full"
            animate={{
              x: [Math.random() * 100, Math.random() * -100],
              y: [Math.random() * 100, Math.random() * -100],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="bg-blue-500/20 p-3 rounded-xl"
              >
                <BookOpen className="w-6 h-6 text-blue-400" />
              </motion.div>
              <div>
                <h3 className="font-semibold">Learn to Trade</h3>
                <p className="text-sm text-gray-400">Expert-curated content</p>
              </div>
            </div>
            <p className="text-gray-400">Master crypto trading with our comprehensive learning paths and real-time practice.</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="bg-purple-500/20 p-3 rounded-xl"
              >
                <Trophy className="w-6 h-6 text-purple-400" />
              </motion.div>
              <div>
                <h3 className="font-semibold">Tournaments</h3>
                <p className="text-sm text-gray-400">Compete & win prizes</p>
              </div>
            </div>
            <p className="text-gray-400">Join weekly trading tournaments and compete for exclusive rewards and recognition.</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800 hover:border-pink-500/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="bg-pink-500/20 p-3 rounded-xl"
              >
                <Sparkles className="w-6 h-6 text-pink-400" />
              </motion.div>
              <div>
                <h3 className="font-semibold">AI Insights</h3>
                <p className="text-sm text-gray-400">Smart trading signals</p>
              </div>
            </div>
            <p className="text-gray-400">Get AI-powered trading insights and real-time market analysis to improve your strategy.</p>
          </motion.div>
        </motion.div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              How It Works
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get started with paper trading in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 hidden md:block" />
          
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="relative bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-8 border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center border border-blue-500/50">
              <span className="text-2xl font-bold text-blue-400">1</span>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Connect Wallet</h3>
              <p className="text-gray-400">Link your Solana wallet to start trading with virtual funds</p>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="mt-6 bg-blue-500/20 p-4 rounded-xl inline-block"
              >
                <BookOpen className="w-8 h-8 text-blue-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="relative bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center border border-purple-500/50">
              <span className="text-2xl font-bold text-purple-400">2</span>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Learn & Practice</h3>
              <p className="text-gray-400">Access tutorials and practice trading with AI-powered insights</p>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="mt-6 bg-purple-500/20 p-4 rounded-xl inline-block"
              >
                <Brain className="w-8 h-8 text-purple-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="relative bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-8 border border-gray-800 hover:border-pink-500/50 transition-all duration-300"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-pink-500/20 w-12 h-12 rounded-full flex items-center justify-center border border-pink-500/50">
              <span className="text-2xl font-bold text-pink-400">3</span>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Compete & Win</h3>
              <p className="text-gray-400">Join tournaments and climb the leaderboard to earn rewards</p>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="mt-6 bg-pink-500/20 p-4 rounded-xl inline-block"
              >
                <Trophy className="w-8 h-8 text-pink-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800 hover:border-green-500/50 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div whileHover={{ scale: 1.1 }}>
                <TrendingUp className="w-6 h-6 text-green-400" />
              </motion.div>
              <div>
                <h3 className="font-semibold">Trading Volume</h3>
                <p className="text-2xl font-bold text-green-400">$12.5M</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-400">24h Volume</span>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div whileHover={{ scale: 1.1 }}>
                <Star className="w-6 h-6 text-yellow-400" />
              </motion.div>
              <div>
                <h3 className="font-semibold">Active Traders</h3>
                <p className="text-2xl font-bold text-yellow-400">5,234</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-sm text-gray-400">Online Now</span>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div whileHover={{ scale: 1.1 }}>
                <Trophy className="w-6 h-6 text-purple-400" />
              </motion.div>
              <div>
                <h3 className="font-semibold">Active Tournaments</h3>
                <p className="text-2xl font-bold text-purple-400">3</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-sm text-gray-400">Join Now</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* AI Insights Preview */}
      <div className="max-w-7xl mx-auto px-4 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur-lg opacity-40" />
              <Brain className="w-8 h-8 text-white relative" />
            </div>
            <h2 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                AI Trading Insights
              </span>
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Powered by AI16z™ - Advanced market analysis and trading signals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Analysis Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg">Market Sentiment</h3>
              </div>
              <span className="text-sm text-purple-400">Live Analysis</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#1A1D24] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>BTC/USDT</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">Bullish</span>
                  <span className="text-sm text-gray-400">89% Confidence</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1A1D24] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>ETH/USDT</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">Bearish</span>
                  <span className="text-sm text-gray-400">76% Confidence</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1A1D24] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>SOL/USDT</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">Neutral</span>
                  <span className="text-sm text-gray-400">52% Confidence</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trading Signals Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg">Trading Signals</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-400">Preview</span>
                <div className="bg-blue-500/20 p-1 rounded-lg">
                  <Lock className="w-3 h-3 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-[#1A1D24] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Entry Point</span>
                  <span className="text-green-400 font-medium">$42,850</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Stop Loss</span>
                  <span className="text-red-400 font-medium">$41,200</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Take Profit</span>
                  <span className="text-green-400 font-medium">$45,500</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-400">Risk/Reward Ratio</span>
                  <span className="text-blue-400 font-medium">1:2.5</span>
                </div>
              </div>
              <div className="p-4 bg-[#1A1D24] rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Signal Strength</span>
                  <span className="text-green-400">Strong Buy</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                  />
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Based on 15 technical indicators
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-4 border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm">Volume Analysis</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">+127%</p>
            <p className="text-sm text-gray-400">24h Volume Increase</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-4 border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm">AI Confidence</span>
            </div>
            <p className="text-2xl font-bold text-purple-400">92%</p>
            <p className="text-sm text-gray-400">Signal Accuracy</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-4 border border-gray-800 hover:border-pink-500/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-pink-500/20 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-pink-400" />
              </div>
              <span className="text-sm">Market Mood</span>
            </div>
            <p className="text-2xl font-bold text-pink-400">Bullish</p>
            <p className="text-sm text-gray-400">Overall Sentiment</p>
          </motion.div>
        </div>
      </div>

      {/* Featured Tournaments */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Live Tournaments
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join competitive trading events and win exclusive rewards
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Daily Tournament */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Trophy className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Daily Sprint</h3>
                  <p className="text-sm text-gray-400">24h Tournament</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-sm text-yellow-400">Starting Soon</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Prize Pool</span>
                <span className="font-medium text-blue-400">$5,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Participants</span>
                <span className="font-medium">234/500</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Entry Fee</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "47%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium mt-4 group-hover:opacity-90 transition-opacity">
                Join Tournament
              </button>
            </div>
          </motion.div>

          {/* Weekly Championship */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Trophy className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Weekly Championship</h3>
                  <p className="text-sm text-gray-400">5 days left</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-sm text-yellow-400">Starting Soon</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Prize Pool</span>
                <span className="font-medium text-purple-400">$25,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Participants</span>
                <span className="font-medium">156/200</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Entry Fee</span>
                <span className="font-medium">100 USDC</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "78%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium mt-4 group-hover:opacity-90 transition-opacity">
                Join Tournament
              </button>
            </div>
          </motion.div>

          {/* Special Event */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-pink-500/20 p-2 rounded-lg">
                  <Sparkles className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Trading Challenge</h3>
                  <p className="text-sm text-gray-400">Special Event</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-sm text-yellow-400">Starting Soon</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Prize Pool</span>
                <span className="font-medium text-pink-400">$50,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Participants</span>
                <span className="font-medium">89/100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Entry Fee</span>
                <span className="font-medium">500 USDC</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "89%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full"
                />
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-600 rounded-lg font-medium mt-4 group-hover:opacity-90 transition-opacity">
                Join Waitlist
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="https://twitter.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="https://github.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </Link>
          </div>
          <div className="text-sm text-gray-400">
            © 2024 Papermemes. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}