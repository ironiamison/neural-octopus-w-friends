'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertCircle, Brain, Search, Filter, TrendingUp, Clock, ThumbsUp, Share2, Bookmark, Clock3 } from 'lucide-react'
import Image from 'next/image'

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
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    timeRange: '24h',
    sentiment: 'all',
    impact: 'all'
  })
  const [savedArticles, setSavedArticles] = useState<string[]>([])

  const handleVote = async (url: string, voteType: 'up' | 'down') => {
    try {
      const response = await fetch('/api/news/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, voteType }),
      })

      if (!response.ok) throw new Error('Failed to vote')
      
      setNews(currentNews => 
        currentNews.map(item => {
          if (item.url === url) {
            const votes = item.votes || { up: 0, down: 0 }
            const userVote = item.userVote
            
            // Remove previous vote if exists
            if (userVote) {
              votes[userVote]--
            }
            
            // Add new vote if different from previous
            if (userVote !== voteType) {
              votes[voteType]++
              return { ...item, votes, userVote: voteType }
            } else {
              return { ...item, votes, userVote: undefined }
            }
          }
          return item
        })
      )
    } catch (err) {
      console.error('Error voting:', err)
    }
  }

  const handleShare = async (item: NewsItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: item.url
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(item.url)
    }
  }

  const toggleSaveArticle = (url: string) => {
    setSavedArticles(current => 
      current.includes(url)
        ? current.filter(id => id !== url)
        : [...current, url]
    )
  }

  useEffect(() => {
    async function fetchNews() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/news?category=${selectedCategory}`)
        if (!response.ok) throw new Error('Failed to fetch news')
        const data = await response.json()
        if (!data.success) throw new Error(data.error || 'Failed to fetch news')
        setNews(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [selectedCategory])

  const filteredNews = news.filter(item => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.analysis.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }
    return true
  }).sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return (b.analysis.impact * b.analysis.relevance) - (a.analysis.impact * a.analysis.relevance)
      case 'votes':
        const aVotes = (a.votes?.up || 0) - (a.votes?.down || 0)
        const bVotes = (b.votes?.up || 0) - (b.votes?.down || 0)
        return bVotes - aVotes
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
  })

  return (
    <div className="min-h-screen bg-[#131722] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Brain className="w-12 h-12 text-blue-500 mr-3" />
            <h1 className="text-3xl font-bold">AI16Z News Analysis</h1>
          </div>
          <Image
            src="/icons/ai16z.png"
            alt="AI16Z"
            width={120}
            height={40}
            className="opacity-80"
          />
        </div>

        <div className="flex items-center justify-center mb-8 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl backdrop-blur-md border transition-all ${
                selectedCategory === category.id
                  ? `${category.color} border-2 border-current bg-[#1C2127]/80`
                  : 'text-gray-400 border-[#2A2D35]/50 bg-[#1C2127]/50 hover:border-blue-500/30'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search news, topics, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1C2127] border border-[#2A2D35] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    sortBy === option.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#1C2127] text-gray-400 hover:text-white'
                  }`}
                >
                  <option.icon className="w-4 h-4" />
                  {option.name}
                </button>
              ))}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-blue-500 text-white' : 'bg-[#1C2127] text-gray-400 hover:text-white'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#1C2127] border border-[#2A2D35] rounded-lg p-4 space-y-4"
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Time Range</label>
                  <select
                    value={filters.timeRange}
                    onChange={(e) => setFilters(f => ({ ...f, timeRange: e.target.value }))}
                    className="w-full bg-[#2A2D35] text-white rounded-lg px-3 py-2"
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Sentiment</label>
                  <select
                    value={filters.sentiment}
                    onChange={(e) => setFilters(f => ({ ...f, sentiment: e.target.value }))}
                    className="w-full bg-[#2A2D35] text-white rounded-lg px-3 py-2"
                  >
                    <option value="all">All</option>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Impact</label>
                  <select
                    value={filters.impact}
                    onChange={(e) => setFilters(f => ({ ...f, impact: e.target.value }))}
                    className="w-full bg-[#2A2D35] text-white rounded-lg px-3 py-2"
                  >
                    <option value="all">All</option>
                    <option value="high">High Impact</option>
                    <option value="medium">Medium Impact</option>
                    <option value="low">Low Impact</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-400">AI16Z is analyzing the latest news...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-400">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="text-lg">{error}</p>
            <p className="text-gray-400 mt-2">Please try again later</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid gap-6">
              {filteredNews.map((item, index) => (
                <motion.div
                  key={item.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#1E222D] rounded-lg overflow-hidden shadow-lg border border-gray-800/50"
                >
                  <div className="flex flex-col md:flex-row">
                    {item.imageUrl && (
                      <div className="md:w-1/3 relative h-[200px] bg-gray-800/50">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // @ts-ignore
                            e.target.src = DEFAULT_NEWS_IMAGE
                          }}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={true}
                        />
                      </div>
                    )}
                    <div className={`flex-1 p-6 ${item.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
                      <div className="flex items-center mb-4">
                        <div className="relative w-6 h-6">
                          <Image
                            src={item.source.logo}
                            alt={item.source.name}
                            fill
                            className="rounded-full"
                            onError={(e) => {
                              // @ts-ignore
                              e.target.src = DEFAULT_SOURCE_ICON
                            }}
                            sizes="24px"
                          />
                        </div>
                        <a 
                          href={`https://${item.source.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 mr-2"
                        >
                          {item.source.name}
                        </a>
                        <span className="mx-2 text-gray-600">•</span>
                        <span className="text-sm text-gray-400">
                          {new Date(item.publishedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <div className="ml-auto flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleVote(item.url, 'up')}
                              className={`p-1.5 rounded-full transition-colors ${
                                item.userVote === 'up' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'hover:bg-gray-700/50 text-gray-400'
                              }`}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <span className="text-sm font-medium text-gray-400">
                              {item.votes?.up || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleVote(item.url, 'down')}
                              className={`p-1.5 rounded-full transition-colors ${
                                item.userVote === 'down' 
                                  ? 'bg-red-500/20 text-red-400' 
                                  : 'hover:bg-gray-700/50 text-gray-400'
                              }`}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <span className="text-sm font-medium text-gray-400">
                              {item.votes?.down || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-start mb-4">
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xl font-semibold hover:text-blue-400 transition-colors flex-1"
                        >
                          {item.title}
                        </a>
                        <div className={`ml-4 px-3 py-1 rounded-full text-sm ${
                          item.analysis.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                          item.analysis.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {item.analysis.sentiment}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center text-gray-400">
                          <Clock3 className="w-4 h-4 mr-1" />
                          <span className="text-sm">{estimateReadingTime(item.description)} min read</span>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={() => handleShare(item)}
                            className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
                            title="Share article"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleSaveArticle(item.url)}
                            className={`p-2 rounded-lg hover:bg-gray-700/50 transition-colors ${
                              savedArticles.includes(item.url)
                                ? 'text-blue-400 hover:text-blue-300'
                                : 'text-gray-400 hover:text-white'
                            }`}
                            title={savedArticles.includes(item.url) ? 'Remove from saved' : 'Save article'}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4">{item.analysis.summary}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h3 className="text-sm font-medium mb-2">Technical Analysis</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Trend</span>
                              <span className={
                                item.analysis.technicalFactors.trend === 'bullish' ? 'text-green-400' :
                                item.analysis.technicalFactors.trend === 'bearish' ? 'text-red-400' :
                                'text-gray-400'
                              }>{item.analysis.technicalFactors.trend}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Volatility</span>
                              <span>{item.analysis.technicalFactors.volatility}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Momentum</span>
                              <span>{item.analysis.technicalFactors.momentum}/10</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h3 className="text-sm font-medium mb-2">Fundamental Factors</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Adoption</span>
                              <span>{item.analysis.fundamentalFactors.adoption}/10</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Innovation</span>
                              <span>{item.analysis.fundamentalFactors.innovation}/10</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Regulation</span>
                              <span>{item.analysis.fundamentalFactors.regulation}/10</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Market Implications</h3>
                          <ul className="list-disc list-inside space-y-1 text-gray-300">
                            {item.analysis.marketImplications.map((implication, i) => (
                              <li key={i}>{implication}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {item.analysis.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{item.source.name}</span>
                          <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center">
                          <span>By {item.author}</span>
                          <a 
                            href={`https://${item.source.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-400 hover:text-blue-300"
                          >
                            {item.source.url}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
} 