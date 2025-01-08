'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown, FiBarChart2, FiClock, FiThumbsUp, FiThumbsDown } from 'react-icons/fi'
import { RiRobot2Line } from 'react-icons/ri'
import { BsRobot } from 'react-icons/bs'
import { NewsItem, NewsAnalysis, MarketTrends, NEWS_CATEGORIES } from '../types/news'

interface NewsResponse {
  success: boolean;
  data: {
    news: NewsItem[];
    trends: MarketTrends;
  };
}

// Add default values for analysis
const defaultAnalysis: NewsAnalysis = {
  marketSentiment: 0.5,
  topTrends: [],
  keyInsights: [],
  confidence: 0.5
}

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [trends, setTrends] = useState<MarketTrends | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [aiAnalysis, setAiAnalysis] = useState<NewsAnalysis>(defaultAnalysis)
  const [activeSource, setActiveSource] = useState('all')

  useEffect(() => {
    fetchNews()
  }, [selectedCategory])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/news')
      const data: NewsResponse = await response.json()
      if (data.success) {
        setNews(data.data.news)
        setTrends(data.data.trends)
        setAiAnalysis(generateAiAnalysis(data.data))
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    }
    setLoading(false)
  }

  const generateAiAnalysis = (data: { news: NewsItem[]; trends: MarketTrends }): NewsAnalysis => {
    const { news, trends } = data
    return {
      marketSentiment: trends.sentiment.overall,
      topTrends: trends.topics,
      keyInsights: analyzeNewsContent(news),
      confidence: Number(calculateConfidence(news))
    }
  }

  const analyzeNewsContent = (newsItems: NewsItem[]) => {
    const topics: Record<string, { count: number; sentiment: number; articles: NewsItem[] }> = {}
    
    newsItems.forEach(item => {
      item.categories.forEach(category => {
        if (!topics[category]) {
          topics[category] = {
            count: 0,
            sentiment: 0,
            articles: []
          }
        }
        topics[category].count++
        topics[category].sentiment += item.sentiment.score
        topics[category].articles.push(item)
      })
    })

    return Object.entries(topics)
      .map(([topic, data]) => ({
        topic,
        volume: data.count,
        sentiment: data.sentiment / data.count,
        articles: data.articles.slice(0, 3)
      }))
      .sort((a, b) => b.volume - a.volume)
  }

  const calculateConfidence = (newsItems: NewsItem[]): string => {
    const sources = new Set(newsItems.map(item => item.source.name))
    const avgReliability = newsItems.reduce((acc, item) => acc + item.source.reliability, 0) / newsItems.length
    return (sources.size * 0.2 + avgReliability * 0.8).toFixed(2)
  }

  const handleVote = async (articleId: string, voteType: 'up' | 'down') => {
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, voteType })
      })
      if (response.ok) {
        fetchNews()
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.6) return 'text-green-500'
    if (sentiment < 0.4) return 'text-red-500'
    return 'text-yellow-500'
  }

  const getSentimentText = (sentiment: number) => {
    if (sentiment > 0.6) return 'Bullish'
    if (sentiment < 0.4) return 'Bearish'
    return 'Neutral'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <div className="flex flex-col items-center justify-center space-y-4 h-[60vh]">
          <BsRobot className="text-6xl text-blue-500 animate-pulse" />
          <h2 className="text-2xl font-bold text-center">AI16Z News Analysis</h2>
          <p className="text-gray-400">Analyzing market sentiment and trends...</p>
          <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <BsRobot className="text-4xl text-blue-500" />
          <h1 className="text-3xl font-bold">AI16Z Powered News</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => fetchNews()}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Analysis
          </button>
        </div>
      </div>

      {/* AI Analysis Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 bg-gray-800 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <RiRobot2Line className="mr-2 text-blue-500" />
            AI Market Sentiment Analysis
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-gray-400 mb-2">Market Sentiment</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${getSentimentColor(aiAnalysis.marketSentiment)}`}>
                    {getSentimentText(aiAnalysis.marketSentiment)}
                  </span>
                  <div className="flex items-center space-x-2">
                    {aiAnalysis.marketSentiment > 0.5 ? (
                      <FiTrendingUp className="text-green-500 text-2xl" />
                    ) : (
                      <FiTrendingDown className="text-red-500 text-2xl" />
                    )}
                    <span className="text-lg">
                      {(aiAnalysis.marketSentiment * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getSentimentColor(aiAnalysis.marketSentiment)} bg-current transition-all duration-500`}
                    style={{ width: `${aiAnalysis.marketSentiment * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-gray-400 mb-2">AI Confidence</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <FiBarChart2 className="text-blue-500 text-2xl" />
                  <span className="text-2xl font-bold">
                    {(aiAnalysis.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${aiAnalysis.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
          <div className="space-y-4">
            {aiAnalysis?.topTrends?.map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{trend.name}</span>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-20 rounded-full ${
                    trend.sentiment > 0.6 ? 'bg-green-500' :
                    trend.sentiment < 0.4 ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <span className="text-sm text-gray-400">
                    {(trend.volume * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* News Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', ...Object.values(NEWS_CATEGORIES)].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category === 'all' ? 'All News' : category}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {news
            .filter(item => selectedCategory === 'all' || item.categories.includes(selectedCategory))
            .map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {item.multimedia?.[0] && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.multimedia[0].url}
                      alt={item.multimedia[0].caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400 flex items-center">
                      <FiClock className="mr-1" />
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVote(item.id, 'up')}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        <FiThumbsUp className="text-gray-400 hover:text-green-500" />
                      </button>
                      <button
                        onClick={() => handleVote(item.id, 'down')}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        <FiThumbsDown className="text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{item.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={item.source.logo || '/placeholder-logo.png'}
                        alt={item.source.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-400">{item.source.name}</span>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-400 text-sm"
                    >
                      Read More →
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default NewsPage 