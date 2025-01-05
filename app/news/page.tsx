'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertCircle, Brain, Search, Filter, TrendingUp, Clock, ThumbsUp, Share2, Bookmark, Clock3 } from 'lucide-react'
import Image from 'next/image'
import ClientOnly from '../components/ClientOnly'

interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: {
    name: string
    url: string
    logo: string
  }
  author: string
  imageUrl: string
  analysis: {
    sentiment: 'positive' | 'negative' | 'neutral'
    impact: number
    relevance: number
    confidence: number
    summary: string
    technicalFactors: {
      trend: 'bullish' | 'bearish' | 'neutral'
      volatility: 'high' | 'medium' | 'low'
      momentum: number
    }
    fundamentalFactors: {
      adoption: number
      innovation: number
      regulation: number
    }
    categories: string[]
    timeframe: {
      immediate: boolean
      shortTerm: boolean
      longTerm: boolean
    }
    tags: string[]
    marketImplications: string[]
  }
  votes?: {
    up: number
    down: number
  }
  userVote?: 'up' | 'down'
}

const categories = [
  { id: 'crypto', name: 'Crypto', color: 'text-blue-400' },
  { id: 'defi', name: 'DeFi', color: 'text-green-400' },
  { id: 'nfts', name: 'NFTs', color: 'text-purple-400' },
  { id: 'blockchain', name: 'Blockchain', color: 'text-orange-400' },
  { id: 'metaverse', name: 'Metaverse', color: 'text-pink-400' }
]

const sortOptions = [
  { id: 'latest', name: 'Latest', icon: Clock },
  { id: 'trending', name: 'Trending', icon: TrendingUp },
  { id: 'votes', name: 'Most Voted', icon: ThumbsUp }
]

const DEFAULT_NEWS_IMAGE = '/placeholder-news.jpg'
const DEFAULT_SOURCE_ICON = '/icons/news-source.png'

function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('crypto')
  const [selectedSort, setSelectedSort] = useState('latest')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [marketTrends, setMarketTrends] = useState<any>(null)

  useEffect(() => {
    const fetchNewsData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/news?category=${selectedCategory}`)
        const data = await response.json()
        if (data.success) {
          setNewsItems(data.data)
          setMarketTrends(data.marketTrends)
        }
      } catch (error) {
        console.error('Error fetching news:', error)
      }
      setIsLoading(false)
    }

    fetchNewsData()
  }, [selectedCategory])

  const filteredNews = newsItems.filter(item =>
    searchQuery
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  )

  const sortedNews = [...filteredNews].sort((a, b) => {
    if (selectedSort === 'latest') {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
    if (selectedSort === 'trending') {
      return (b.analysis.impact * b.analysis.relevance) - (a.analysis.impact * a.analysis.relevance)
    }
    if (selectedSort === 'votes') {
      const bVotes = (b.votes?.up || 0) - (b.votes?.down || 0)
      const aVotes = (a.votes?.up || 0) - (a.votes?.down || 0)
      return bVotes - aVotes
    }
    return 0
  })

  return (
    <ClientOnly>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="min-h-screen bg-[#131722] text-white p-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Crypto News & Analysis</h1>
                
                {marketTrends && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#1E2329] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Market Sentiment</span>
                        <div className={`px-2 py-1 rounded text-sm ${
                          marketTrends.overallSentiment === 'positive'
                            ? 'bg-green-500/20 text-green-400'
                            : marketTrends.overallSentiment === 'negative'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {marketTrends.overallSentiment}
                        </div>
                      </div>
                      <div className="text-2xl font-bold">
                        {Math.round(marketTrends.sentimentScore * 100)}%
                      </div>
                    </div>
                    
                    <div className="bg-[#1E2329] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Market Momentum</span>
                        <TrendingUp className={`h-5 w-5 ${
                          marketTrends.marketMomentum > 0.6
                            ? 'text-green-400'
                            : marketTrends.marketMomentum < 0.4
                            ? 'text-red-400'
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="text-2xl font-bold">
                        {Math.round(marketTrends.marketMomentum * 100)}%
                      </div>
                    </div>
                    
                    <div className="bg-[#1E2329] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Volume Indicator</span>
                        <div className={`px-2 py-1 rounded text-sm ${
                          marketTrends.volumeIndicator === 'high'
                            ? 'bg-green-500/20 text-green-400'
                            : marketTrends.volumeIndicator === 'low'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {marketTrends.volumeIndicator}
                        </div>
                      </div>
                      <div className="text-2xl font-bold">
                        {marketTrends.volumeIndicator}
                      </div>
                    </div>
                    
                    <div className="bg-[#1E2329] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Price Action</span>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded text-sm ${
                            marketTrends.priceAction.shortTerm === 'bullish'
                              ? 'bg-green-500/20 text-green-400'
                              : marketTrends.priceAction.shortTerm === 'bearish'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            ST
                          </div>
                          <div className={`px-2 py-1 rounded text-sm ${
                            marketTrends.priceAction.mediumTerm === 'bullish'
                              ? 'bg-green-500/20 text-green-400'
                              : marketTrends.priceAction.mediumTerm === 'bearish'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            MT
                          </div>
                        </div>
                      </div>
                      <div className="text-sm mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-400">Short Term</span>
                          <span className={
                            marketTrends.priceAction.shortTerm === 'bullish'
                              ? 'text-green-400'
                              : marketTrends.priceAction.shortTerm === 'bearish'
                              ? 'text-red-400'
                              : 'text-gray-400'
                          }>
                            {marketTrends.priceAction.shortTerm}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Medium Term</span>
                          <span className={
                            marketTrends.priceAction.mediumTerm === 'bullish'
                              ? 'text-green-400'
                              : marketTrends.priceAction.mediumTerm === 'bearish'
                              ? 'text-red-400'
                              : 'text-gray-400'
                          }>
                            {marketTrends.priceAction.mediumTerm}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search news..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#1E2329] border border-[#2A2D35] rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {sortOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <button
                          key={option.id}
                          onClick={() => setSelectedSort(option.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            selectedSort === option.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-[#1E2329] text-gray-400 hover:bg-[#2A2D35]'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{option.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-[#1E2329] text-gray-400 hover:bg-[#2A2D35]'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-[#1E2329] rounded-lg p-6 animate-pulse">
                      <div className="h-48 bg-[#2A2D35] rounded-lg mb-4" />
                      <div className="space-y-2">
                        <div className="h-6 bg-[#2A2D35] rounded w-3/4" />
                        <div className="h-4 bg-[#2A2D35] rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedNews.map((item) => (
                    <motion.a
                      key={item.url}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="block bg-[#1E2329] rounded-lg overflow-hidden hover:bg-[#2A2D35] transition-colors"
                    >
                      <div className="relative h-48">
                        <Image
                          src={item.imageUrl || DEFAULT_NEWS_IMAGE}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Image
                              src={item.source.logo || DEFAULT_SOURCE_ICON}
                              alt={item.source.name}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                            <span className="text-sm text-gray-300">{item.source.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock3 className="h-4 w-4" />
                            <span>{estimateReadingTime(item.description)} min read</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <button className="hover:text-white transition-colors">
                              <Share2 className="h-4 w-4" />
                            </button>
                            <button className="hover:text-white transition-colors">
                              <Bookmark className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </ClientOnly>
  )
} 