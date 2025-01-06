'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  // Mock top traders data
  const topTraders = [
    {
      username: "CryptoWhale",
      avatar: "/placeholder.png",
      winRate: 92.5,
      pnl: 145890,
      trades: 234,
      streak: 12
    },
    {
      username: "DiamondHands",
      avatar: "/placeholder.png",
      winRate: 88.3,
      pnl: 98450,
      trades: 189,
      streak: 8
    },
    {
      username: "MoonShooter",
      avatar: "/placeholder.png",
      winRate: 85.7,
      pnl: 76540,
      trades: 156,
      streak: 6
    },
    {
      username: "AlphaTrader",
      avatar: "/placeholder.png",
      winRate: 83.2,
      pnl: 65230,
      trades: 142,
      streak: 5
    },
    {
      username: "SolanaKing",
      avatar: "/placeholder.png",
      winRate: 81.9,
      pnl: 54320,
      trades: 128,
      streak: 4
    },
    {
      username: "MemeWizard",
      avatar: "/placeholder.png",
      winRate: 79.5,
      pnl: 43210,
      trades: 115,
      streak: 3
    }
  ]

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-[#0D1117] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-pink-900/10 to-[#0D1117] animate-gradient-y" />
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.1
              }}
            >
              <div className="w-4 h-4 bg-purple-500 rounded-full blur-sm" />
            </div>
          ))}
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#1E222D]/80 px-4 py-2 rounded-full backdrop-blur-sm border border-purple-500/20">
          <Image
            src="/icons/ai16z.png"
            alt="AI16Z"
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="text-sm text-purple-300">Powered by AI16Z</span>
        </div>

        <div className="container mx-auto px-4 py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <Image
                src="/logo.png"
                alt="papermemes.fun"
                width={120}
                height={120}
                className="animate-pulse-slow"
              />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-gradient-x">
              Trade Solana Meme Coins
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              The fastest and most reliable DEX aggregator for Solana meme coins. 
              Experience risk-free paper trading powered by advanced AI technology.
            </p>
            <div className="flex items-center justify-center gap-6">
              <Link 
                href="/trade" 
                className="group relative px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center">
                  Start Trading Now
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
              <div className="flex gap-4">
                <Link 
                  href="/leaderboard"
                  className="px-6 py-4 rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Leaderboard
                </Link>
                <Link 
                  href="/learn"
                  className="px-6 py-4 rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Learn to Trade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[#1E222D]/50 border-y border-purple-500/10 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group cursor-pointer" onClick={() => window.location.href = '/leaderboard'}>
              <p className="text-gray-400 text-sm">Top Trader</p>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 group-hover:scale-105 transition-transform">
                @tradingpro
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Paper Trades</p>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {(Math.random() * 10000).toFixed(0)}+
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Daily Trading Volume</p>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                $12,458,390
              </p>
            </div>
            <div className="text-center group cursor-pointer" onClick={() => window.location.href = '/rewards'}>
              <p className="text-gray-400 text-sm">Available Rewards</p>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 group-hover:scale-105 transition-transform">
                🏆 1,000 USDC
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute top-5 right-5">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-full text-sm font-bold animate-pulse">
            Coming Soon
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto bg-[#1E222D]/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-gradient-x">
                Powered by
              </h2>
              <p className="text-gray-400">
                Contract Address
              </p>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center gap-4 bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex-1 font-mono text-base text-purple-300 overflow-x-auto whitespace-nowrap">
                  0x742d35Cc6634C0532925a3b844Bc454e4438f44e
                </div>
                <button 
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
                      // Add visual feedback here if needed
                    } catch (err) {
                      console.error('Failed to copy:', err);
                    }
                  }}
                  className="group/copy flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-all duration-300"
                >
                  <span className="text-sm text-purple-400 group-hover/copy:text-purple-300">Copy</span>
                  <svg 
                    className="w-4 h-4 text-purple-400 group-hover/copy:text-purple-300 group-hover/copy:scale-110 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div className="text-center p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-gray-400">Total Supply</p>
                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Coming Soon
                </p>
              </div>
              <div className="text-center p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-gray-400">Circulating</p>
                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Coming Soon
                </p>
              </div>
              <div className="text-center p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-gray-400">Holders</p>
                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Coming Soon
                </p>
              </div>
              <div className="text-center p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-gray-400">Launch Date</p>
                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Coming Soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-gradient-x">
            Top Performing Traders
          </h2>
          <p className="text-gray-400 text-lg">
            Join the competition and climb the ranks with paper trading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#1E222D] rounded-lg p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full" />
                  <div>
                    <div className="h-5 w-20 bg-gray-700 rounded mb-2" />
                    <div className="h-4 w-32 bg-gray-700 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-700 rounded" />
                  <div className="h-4 w-24 bg-gray-700 rounded" />
                </div>
              </div>
            ))
          ) : (
            topTraders.map((trader, index) => (
              <Link 
                key={trader.username} 
                href="/leaderboard"
                className="group relative bg-[#1E222D]/80 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 border border-purple-500/10"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Rank badge with glow effect */}
                <div className="absolute -top-3 -left-3 w-12 h-12">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-xl font-bold border-2 border-purple-400/20 shadow-lg">
                    #{index + 1}
                  </div>
                </div>

                <div className="relative flex flex-col h-full">
                  {/* Trader info */}
                  <div className="flex items-center gap-4 mb-6 mt-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-colors duration-500">
                        {trader.username}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-gray-400 text-sm">Online</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-medium text-gray-400">Win Rate</div>
                      <div className="text-lg font-bold text-green-400">{trader.winRate}%</div>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">Total PnL</p>
                      <p className="text-xl font-bold text-green-400 group-hover:scale-110 transition-transform duration-500">
                        +${trader.pnl.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">Win Streak</p>
                      <div className="flex items-center gap-2 group-hover:scale-110 transition-transform duration-500">
                        <span className="text-xl font-bold text-orange-400">
                          {trader.streak}
                        </span>
                        <span className="text-orange-400 animate-bounce">🔥</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional stats */}
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {trader.trades} trades
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs">View Profile</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="text-center mt-16 space-y-8">
          <Link 
            href="/trade" 
            className="group relative inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative flex items-center">
              Start Paper Trading
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>

          <p className="text-gray-400">
            New to trading? Check out our{' '}
            <Link href="/academy" className="text-purple-400 hover:text-purple-300 underline">
              Trading Academy
            </Link>
            {' '}or join our{' '}
            <Link href="/community" className="text-purple-400 hover:text-purple-300 underline">
              Discord Community
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
