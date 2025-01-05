'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { MemeCoin, getTopMemeCoins } from './utils/memeCoins'

export default function Home() {
  const [topCoins, setTopCoins] = useState<MemeCoin[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTopCoins() {
      try {
        setIsLoading(true)
        const data = await getTopMemeCoins()
        setTopCoins(data || [])
      } catch (err) {
        console.error('Error fetching top coins:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTopCoins()
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
                ${topCoins.reduce((sum, coin) => sum + coin.volume24h, 0).toLocaleString()}
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

      {/* Leaderboard Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
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
            topCoins.slice(0, 6).map((coin) => (
              <Link 
                key={coin.symbol} 
                href={`/trade?symbol=${coin.symbol}`}
                className="group bg-[#1E222D] rounded-lg p-6 hover:bg-gray-800/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
                    <Image
                      src={coin.image || '/placeholder.png'}
                      alt={coin.symbol}
                      width={48}
                      height={48}
                      className="rounded-full relative"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-colors">
                      {coin.symbol}
                    </h3>
                    <p className="text-gray-400 text-sm">24h Volume: ${coin.volume24h.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">${coin.price.toFixed(6)}</p>
                    <p className={`text-sm ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Market Cap</p>
                    <p className="font-medium">${coin.marketCap.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="text-center mt-16 space-y-8">
          <Link 
            href="/trade" 
            className="group inline-flex items-center px-8 py-4 rounded-lg bg-[#1E222D] text-white hover:bg-gray-800/50 transition-all hover:scale-105"
          >
            Start Paper Trading
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
