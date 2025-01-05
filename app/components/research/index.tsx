'use client'

import { useState } from 'react'
import { LineChart, BarChart, TrendingUp, TrendingDown, DollarSign, Activity, Twitter, MessageCircle, Globe, TrendingUp as Trending } from 'lucide-react'

interface MarketInsight {
  id: string
  title: string
  description: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  timestamp: string
  source: string
}

interface TechnicalIndicator {
  id: string
  name: string
  value: string
  signal: 'buy' | 'sell' | 'neutral'
  timeframe: string
}

interface SentimentData {
  id: string
  source: string
  symbol: string
  sentiment: number
  mentions: number
  change24h: number
  lastUpdated: string
}

export default function Research() {
  const [activeTab, setActiveTab] = useState<'market' | 'technical' | 'sentiment'>('market')

  const insights: MarketInsight[] = [
    {
      id: '1',
      title: 'BONK Shows Strong Momentum',
      description: 'Recent price action and volume indicate growing interest in BONK token.',
      sentiment: 'bullish',
      timestamp: '2h ago',
      source: 'Market Analysis'
    },
    {
      id: '2',
      title: 'WIF Consolidating After Rally',
      description: 'WIF enters consolidation phase after 200% rally, watch key support levels.',
      sentiment: 'neutral',
      timestamp: '4h ago',
      source: 'Technical Analysis'
    },
    {
      id: '3',
      title: 'MYRO Facing Resistance',
      description: 'MYRO encounters strong resistance at $0.0045, potential reversal ahead.',
      sentiment: 'bearish',
      timestamp: '6h ago',
      source: 'Price Action'
    }
  ]

  const indicators: TechnicalIndicator[] = [
    {
      id: '1',
      name: 'RSI (14)',
      value: '72.5',
      signal: 'sell',
      timeframe: '4h'
    },
    {
      id: '2',
      name: 'MACD',
      value: 'Bullish Cross',
      signal: 'buy',
      timeframe: '1h'
    },
    {
      id: '3',
      name: 'MA (200)',
      value: 'Above',
      signal: 'buy',
      timeframe: '1d'
    },
    {
      id: '4',
      name: 'Volume',
      value: '+125%',
      signal: 'buy',
      timeframe: '24h'
    }
  ]

  const sentimentData: SentimentData[] = [
    {
      id: '1',
      source: 'Twitter',
      symbol: 'BONK',
      sentiment: 78,
      mentions: 12500,
      change24h: 15,
      lastUpdated: '5m ago'
    },
    {
      id: '2',
      source: 'Reddit',
      symbol: 'WIF',
      sentiment: 65,
      mentions: 8200,
      change24h: -5,
      lastUpdated: '10m ago'
    },
    {
      id: '3',
      source: 'Discord',
      symbol: 'MYRO',
      sentiment: 82,
      mentions: 6300,
      change24h: 25,
      lastUpdated: '15m ago'
    },
    {
      id: '4',
      source: 'Telegram',
      symbol: 'BOME',
      sentiment: 71,
      mentions: 4500,
      change24h: 8,
      lastUpdated: '20m ago'
    }
  ]

  const getSentimentIcon = (source: string) => {
    switch (source) {
      case 'Twitter':
        return <Twitter className="w-4 h-4" />
      case 'Reddit':
        return <MessageCircle className="w-4 h-4" />
      case 'Discord':
        return <MessageCircle className="w-4 h-4" />
      case 'Telegram':
        return <Globe className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  return (
    <div className="bg-[#1C2128] rounded-xl border border-[#30363D] overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[#30363D]">
        <button
          onClick={() => setActiveTab('market')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'market'
              ? 'text-white border-b-2 border-[#4A72FF]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Market Analysis
        </button>
        <button
          onClick={() => setActiveTab('technical')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'technical'
              ? 'text-white border-b-2 border-[#4A72FF]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Technical Indicators
        </button>
        <button
          onClick={() => setActiveTab('sentiment')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'sentiment'
              ? 'text-white border-b-2 border-[#4A72FF]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Sentiment Analysis
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'market' && (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="p-4 bg-[#22272E] rounded-lg border border-[#30363D]"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{insight.title}</h3>
                  <div
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      insight.sentiment === 'bullish'
                        ? 'bg-green-500/20 text-green-400'
                        : insight.sentiment === 'bearish'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {insight.sentiment.charAt(0).toUpperCase() + insight.sentiment.slice(1)}
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-2">{insight.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{insight.source}</span>
                  <span>{insight.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'technical' && (
          <div className="grid grid-cols-2 gap-4">
            {indicators.map((indicator) => (
              <div
                key={indicator.id}
                className="p-4 bg-[#22272E] rounded-lg border border-[#30363D]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-white">{indicator.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">{indicator.timeframe}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">{indicator.value}</span>
                  <div
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      indicator.signal === 'buy'
                        ? 'bg-green-500/20 text-green-400'
                        : indicator.signal === 'sell'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {indicator.signal.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sentiment' && (
          <div className="space-y-4">
            {sentimentData.map((data) => (
              <div
                key={data.id}
                className="p-4 bg-[#22272E] rounded-lg border border-[#30363D]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#30363D] rounded-lg">
                      {getSentimentIcon(data.source)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{data.symbol}</span>
                        <span className="text-sm text-gray-400">on {data.source}</span>
                      </div>
                      <div className="text-sm text-gray-400">{data.lastUpdated}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{data.sentiment}%</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Trending className={`w-4 h-4 ${data.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                      <span className={data.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {data.change24h >= 0 ? '+' : ''}{data.change24h}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Mentions</span>
                  <span className="font-medium text-white">{data.mentions.toLocaleString()}</span>
                </div>
                <div className="mt-2 h-2 bg-[#30363D] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4A72FF] rounded-full transition-all"
                    style={{ width: `${data.sentiment}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 