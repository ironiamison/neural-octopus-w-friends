import { NextResponse } from 'next/server'
import { NewsItem, Topic, NEWS_CATEGORIES } from '../../types/news'

// Performance tracking
interface SourceStats {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageResponseTime: number;
  lastResponseTime: number;
  lastUpdated: Date;
  articleCount: number;
  errors: string[];
}

const sourceStats: Record<string, SourceStats> = {
  CryptoCompare: createEmptyStats(),
  Messari: createEmptyStats(),
  CoinGecko: createEmptyStats(),
  CoinDesk: createEmptyStats(),
  TheBlock: createEmptyStats(),
  Decrypt: createEmptyStats()
}

function createEmptyStats(): SourceStats {
  return {
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    averageResponseTime: 0,
    lastResponseTime: 0,
    lastUpdated: new Date(),
    articleCount: 0,
    errors: []
  }
}

async function measureSourcePerformance(sourceName: string, fetchFn: () => Promise<any[]>) {
  const stats = sourceStats[sourceName]
  const startTime = Date.now()
  stats.totalCalls++
  
  try {
    const articles = await fetchFn()
    const endTime = Date.now()
    stats.lastResponseTime = endTime - startTime
    stats.averageResponseTime = ((stats.averageResponseTime * (stats.successfulCalls)) + stats.lastResponseTime) / (stats.successfulCalls + 1)
    stats.successfulCalls++
    stats.lastUpdated = new Date()
    stats.articleCount = articles.length
    return articles
  } catch (error) {
    stats.failedCalls++
    stats.errors.push(error instanceof Error ? error.message : 'Unknown error')
    if (stats.errors.length > 10) stats.errors.shift() // Keep last 10 errors
    throw error
  }
}

// Source metadata
const NEWS_SOURCES = {
  CryptoCompare: {
    name: 'CryptoCompare',
    url: 'https://www.cryptocompare.com/news/',
    description: 'Real-time cryptocurrency news aggregator',
    reliability: 0.9,
    categories: ['Market Analysis', 'Trading', 'Technology']
  },
  Messari: {
    name: 'Messari',
    url: 'https://messari.io/news',
    description: 'Professional-grade crypto market intelligence',
    reliability: 0.95,
    categories: ['Market Analysis', 'Research', 'DeFi']
  },
  CoinGecko: {
    name: 'CoinGecko',
    url: 'https://www.coingecko.com/en/news',
    description: 'Comprehensive cryptocurrency data platform',
    reliability: 0.85,
    categories: ['Market Analysis', 'Trading', 'General']
  },
  CoinDesk: {
    name: 'CoinDesk',
    url: 'https://www.coindesk.com/',
    description: 'Leading digital media and information services company',
    reliability: 0.95,
    categories: ['Regulation', 'Technology', 'Business']
  },
  TheBlock: {
    name: 'The Block',
    url: 'https://www.theblock.co/',
    description: 'Digital assets research and news platform',
    reliability: 0.95,
    categories: ['Research', 'Business', 'Technology']
  },
  Decrypt: {
    name: 'Decrypt',
    url: 'https://decrypt.co/news',
    description: 'Cryptocurrency and Web3 news platform',
    reliability: 0.9,
    categories: ['NFTs', 'DeFi', 'Web3']
  }
} as const;

// Helper function to categorize news articles
function categorizeArticle(article: any): string[] {
  const text = `${article.title} ${article.content}`.toLowerCase()
  const categories: string[] = []

  // Category detection rules
  if (text.match(/defi|lending|borrowing|yield|staking|liquidity/)) categories.push(NEWS_CATEGORIES.DEFI)
  if (text.match(/nft|gaming|game|metaverse|virtual|play/)) categories.push(NEWS_CATEGORIES.NFT)
  if (text.match(/regulation|sec|cftc|law|compliance|legal/)) categories.push(NEWS_CATEGORIES.REGULATION)
  if (text.match(/technology|protocol|upgrade|development|blockchain/)) categories.push(NEWS_CATEGORIES.TECHNOLOGY)
  if (text.match(/adoption|partnership|integration|enterprise|business/)) categories.push(NEWS_CATEGORIES.ADOPTION)
  if (text.match(/mining|miner|hash|pow|difficulty/)) categories.push(NEWS_CATEGORIES.MINING)
  if (text.match(/security|hack|exploit|vulnerability|breach/)) categories.push(NEWS_CATEGORIES.SECURITY)
  if (text.match(/layer 2|l2|scaling|rollup|optimism|arbitrum/)) categories.push(NEWS_CATEGORIES.LAYER2)
  if (text.match(/market|price|trading|analysis|chart/)) categories.push(NEWS_CATEGORIES.MARKET)
  if (text.match(/funding|investment|venture|startup|raise/)) categories.push(NEWS_CATEGORIES.FUNDING)

  return categories.length ? categories : [NEWS_CATEGORIES.MARKET]
}

async function fetchCryptoCompareNews() {
  return measureSourcePerformance('CryptoCompare', async () => {
    console.log('Fetching from CryptoCompare...')
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=${process.env.CRYPTOCOMPARE_API_KEY}`
    )

    if (!response.ok) {
      console.error('CryptoCompare API error:', response.status, response.statusText)
      throw new Error(`Failed to fetch from CryptoCompare: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Received CryptoCompare data:', data.Data?.length, 'articles')
    
    return data.Data.map((article: any) => ({
      id: article.id || String(Date.now()),
      title: article.title,
      content: article.body,
      summary: article.body.slice(0, 200) + '...',
      url: article.url,
      publishedAt: new Date(article.published_on * 1000).toISOString(),
      source: {
        ...NEWS_SOURCES.CryptoCompare,
        socialMetrics: {
          followers: article.source_info?.followers || 0,
          engagement: article.source_info?.engagement || 0
        }
      },
      author: {
        name: article.source,
        title: 'Crypto Journalist',
        avatar: null
      },
      keyPoints: article.categories?.split('|') || [],
      multimedia: article.imageurl ? [{
        type: 'image' as const,
        url: article.imageurl,
        caption: article.title
      }] : [],
      sentiment: {
        score: article.upvotes ? article.upvotes / (article.upvotes + article.downvotes) : 0.5,
        label: article.upvotes > article.downvotes ? 'positive' : 
               article.downvotes > article.upvotes ? 'negative' : 'neutral'
      },
      impact: article.upvotes ? article.upvotes / (article.upvotes + article.downvotes) : 0.7,
      relevance: 0.9,
      categories: categorizeArticle(article),
      sourceUrl: NEWS_SOURCES.CryptoCompare.url,
      votes: {
        up: 0,
        down: 0,
        score: 0
      }
    }))
  })
}

async function fetchCoinGeckoNews() {
  console.log('Fetching from CoinGecko...')
  const response = await fetch('https://api.coingecko.com/api/v3/news?category=general&per_page=20')
  
  if (!response.ok) {
    console.error('CoinGecko API error:', response.status, response.statusText)
    throw new Error(`Failed to fetch from CoinGecko: ${response.statusText}`)
  }

  const data = await response.json()
  console.log('Received CoinGecko data:', data?.length, 'articles')
  
  return data.map((article: any) => ({
    id: article.id || String(Date.now()),
    title: article.title,
    content: article.text || article.description || '',
    summary: article.description || article.text || '',
    url: article.url,
    publishedAt: article.created_at || new Date().toISOString(),
    source: {
      name: article.author || article.source?.name || 'CoinGecko',
      reliability: 0.8,
      socialMetrics: {
        followers: article.likes || 0,
        engagement: article.sentiment_votes_up_percentage || 0
      }
    },
    author: {
      name: article.author || 'Unknown',
      title: 'Journalist',
      avatar: null
    },
    keyPoints: article.categories?.slice(0, 3) || [],
    multimedia: article.thumb_2x ? [{
      type: 'image' as const,
      url: article.thumb_2x,
      caption: article.title
    }] : [],
    sentiment: {
      score: article.sentiment_votes_up_percentage ? article.sentiment_votes_up_percentage / 100 : 0.5,
      label: article.sentiment_votes_up_percentage > 60 ? 'positive' :
             article.sentiment_votes_up_percentage < 40 ? 'negative' : 'neutral'
    },
    impact: article.sentiment_votes_up_percentage ? article.sentiment_votes_up_percentage / 100 : 0.7,
    relevance: 0.8,
    categories: categorizeArticle(article),
    sourceUrl: NEWS_SOURCES.CoinGecko.url,
    votes: {
      up: 0,
      down: 0,
      score: 0
    }
  }))
}

async function fetchMessariNews() {
  console.log('Fetching from Messari...')
  const response = await fetch('https://data.messari.io/api/v1/news', {
    headers: {
      'x-messari-api-key': process.env.MESSARI_API_KEY || ''
    }
  })

  if (!response.ok) {
    console.error('Messari API error:', response.status, response.statusText)
    throw new Error(`Failed to fetch from Messari: ${response.statusText}`)
  }

  const data = await response.json()
  console.log('Received Messari data:', data.data?.length, 'articles')
  
  return data.data.map((article: any) => ({
    id: article.id || String(Date.now()),
    title: article.title,
    content: article.content,
    summary: article.excerpt || article.content?.slice(0, 200) + '...' || '',
    url: article.url,
    publishedAt: article.published_at,
    source: {
      name: article.author?.name || article.source?.name || 'Messari',
      reliability: 0.95,
      socialMetrics: {
        followers: article.author?.followers_count || 0,
        engagement: article.engagement_score || 0
      }
    },
    author: {
      name: article.author?.name || 'Unknown',
      title: article.author?.title || 'Research Analyst',
      avatar: article.author?.avatar_url || null
    },
    keyPoints: article.tags || [],
    multimedia: article.lead_image_url ? [{
      type: 'image' as const,
      url: article.lead_image_url,
      caption: article.title
    }] : [],
    sentiment: {
      score: article.sentiment_score || 0.5,
      label: article.sentiment_score > 0.6 ? 'positive' :
             article.sentiment_score < 0.4 ? 'negative' : 'neutral'
    },
    impact: article.importance_score || 0.7,
    relevance: article.relevance_score || 0.8,
    categories: categorizeArticle(article),
    sourceUrl: NEWS_SOURCES.Messari.url,
    votes: {
      up: 0,
      down: 0,
      score: 0
    }
  }))
}

async function fetchCoinDeskNews() {
  console.log('Fetching from CoinDesk...')
  const response = await fetch('https://api.coindesk.com/v1/news/feed')
  
  if (!response.ok) {
    console.error('CoinDesk API error:', response.status, response.statusText)
    throw new Error(`Failed to fetch from CoinDesk: ${response.statusText}`)
  }

  const data = await response.json()
  console.log('Received CoinDesk data:', data.articles?.length, 'articles')
  
  return (data.articles || []).map((article: any) => ({
    id: article.id || String(Date.now()),
    title: article.title,
    content: article.content,
    summary: article.description || article.content?.slice(0, 200) + '...',
    url: article.url,
    publishedAt: article.published_at || new Date().toISOString(),
    source: {
      name: 'CoinDesk',
      reliability: 0.95,
      socialMetrics: {
        followers: article.social_shares || 0,
        engagement: article.engagement_score || 0
      }
    },
    author: {
      name: article.author || 'CoinDesk Staff',
      title: 'Journalist',
      avatar: article.author_image || null
    },
    keyPoints: article.tags || [],
    multimedia: article.lead_image ? [{
      type: 'image' as const,
      url: article.lead_image,
      caption: article.title
    }] : [],
    sentiment: {
      score: article.sentiment_score || 0.5,
      label: article.sentiment_score > 0.6 ? 'positive' :
             article.sentiment_score < 0.4 ? 'negative' : 'neutral'
    },
    impact: article.importance_score || 0.8,
    relevance: 0.9,
    categories: categorizeArticle(article),
    sourceUrl: NEWS_SOURCES.CoinDesk.url,
    votes: {
      up: 0,
      down: 0,
      score: 0
    }
  }))
}

async function fetchTheBlockNews() {
  console.log('Fetching from The Block...')
  const response = await fetch('https://api.theblock.co/api/v1/posts/latest')
  
  if (!response.ok) {
    console.error('The Block API error:', response.status, response.statusText)
    throw new Error(`Failed to fetch from The Block: ${response.statusText}`)
  }

  const data = await response.json()
  console.log('Received The Block data:', data.posts?.length, 'articles')
  
  return (data.posts || []).map((article: any) => ({
    id: article.id || String(Date.now()),
    title: article.title,
    content: article.content,
    summary: article.excerpt || article.content?.slice(0, 200) + '...',
    url: article.url,
    publishedAt: article.published_at,
    source: {
      name: 'The Block',
      reliability: 0.95,
      socialMetrics: {
        followers: article.social_stats?.followers || 0,
        engagement: article.social_stats?.engagement || 0
      }
    },
    author: {
      name: article.author?.name || 'The Block Staff',
      title: article.author?.role || 'Research Analyst',
      avatar: article.author?.avatar || null
    },
    keyPoints: article.categories || [],
    multimedia: article.featured_image ? [{
      type: 'image' as const,
      url: article.featured_image,
      caption: article.title
    }] : [],
    sentiment: {
      score: article.sentiment_score || 0.5,
      label: article.sentiment_score > 0.6 ? 'positive' :
             article.sentiment_score < 0.4 ? 'negative' : 'neutral'
    },
    impact: article.importance_score || 0.85,
    relevance: 0.9,
    categories: categorizeArticle(article),
    sourceUrl: NEWS_SOURCES.TheBlock.url,
    votes: {
      up: 0,
      down: 0,
      score: 0
    }
  }))
}

async function fetchDecryptNews() {
  console.log('Fetching from Decrypt...')
  const response = await fetch('https://api.decrypt.co/api/v1/posts')
  
  if (!response.ok) {
    console.error('Decrypt API error:', response.status, response.statusText)
    throw new Error(`Failed to fetch from Decrypt: ${response.statusText}`)
  }

  const data = await response.json()
  console.log('Received Decrypt data:', data.posts?.length, 'articles')
  
  return (data.posts || []).map((article: any) => ({
    id: article.id || String(Date.now()),
    title: article.title,
    content: article.content,
    summary: article.excerpt || article.content?.slice(0, 200) + '...',
    url: article.url,
    publishedAt: article.published_at,
    source: {
      name: 'Decrypt',
      reliability: 0.9,
      socialMetrics: {
        followers: article.social_stats?.followers || 0,
        engagement: article.social_stats?.engagement || 0
      }
    },
    author: {
      name: article.author?.name || 'Decrypt Staff',
      title: article.author?.role || 'Journalist',
      avatar: article.author?.avatar || null
    },
    keyPoints: article.tags || [],
    multimedia: article.featured_image ? [{
      type: 'image' as const,
      url: article.featured_image,
      caption: article.title
    }] : [],
    sentiment: {
      score: article.sentiment_score || 0.5,
      label: article.sentiment_score > 0.6 ? 'positive' :
             article.sentiment_score < 0.4 ? 'negative' : 'neutral'
    },
    impact: article.importance_score || 0.75,
    relevance: 0.85,
    categories: categorizeArticle(article),
    sourceUrl: NEWS_SOURCES.Decrypt.url,
    votes: {
      up: 0,
      down: 0,
      score: 0
    }
  }))
}

// Helper function to normalize sentiment score to 0-1 range
function normalizeSentiment(score: number): number {
  // Ensure the score is between 0 and 1
  return Math.max(0, Math.min(1, score))
}

// Helper function to calculate aggregate sentiment
function calculateAggregateSentiment(newsItems: NewsItem[]): number {
  if (!newsItems.length) return 0.5

  // Calculate weighted sentiment based on source reliability and article impact
  const weightedSentiment = newsItems.reduce((acc, item) => {
    const weight = item.source.reliability * item.impact
    return acc + (item.sentiment.score * weight)
  }, 0)

  const totalWeight = newsItems.reduce((acc, item) => 
    acc + (item.source.reliability * item.impact), 0)

  return normalizeSentiment(weightedSentiment / totalWeight)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categories = searchParams.get('categories')?.split(',') || []
  const minVoteScore = parseInt(searchParams.get('minVoteScore') || '0')
  
  try {
    console.log('Fetching news from multiple sources...')
    console.log('Current source statistics:', JSON.stringify(sourceStats, null, 2))
    
    // Fetch from all sources in parallel
    const [
      cryptoCompareNews,
      messariNews,
      coinGeckoNews,
      coinDeskNews,
      theBlockNews,
      decryptNews
    ] = await Promise.allSettled([
      fetchCryptoCompareNews(),
      fetchMessariNews(),
      fetchCoinGeckoNews(),
      fetchCoinDeskNews(),
      fetchTheBlockNews(),
      fetchDecryptNews()
    ])

    console.log('API Results:')
    console.log('CryptoCompare:', cryptoCompareNews.status)
    console.log('Messari:', messariNews.status)
    console.log('CoinGecko:', coinGeckoNews.status)
    console.log('CoinDesk:', coinDeskNews.status)
    console.log('The Block:', theBlockNews.status)
    console.log('Decrypt:', decryptNews.status)

    // Log any errors
    const sources = {
      CryptoCompare: cryptoCompareNews,
      Messari: messariNews,
      CoinGecko: coinGeckoNews,
      CoinDesk: coinDeskNews,
      TheBlock: theBlockNews,
      Decrypt: decryptNews
    }

    Object.entries(sources).forEach(([name, result]) => {
      if (result.status === 'rejected') {
        console.error(`${name} error:`, result.reason)
      }
    })

    // Combine and deduplicate news
    const allNews = [
      ...(cryptoCompareNews.status === 'fulfilled' ? cryptoCompareNews.value : []),
      ...(messariNews.status === 'fulfilled' ? messariNews.value : []),
      ...(coinGeckoNews.status === 'fulfilled' ? coinGeckoNews.value : []),
      ...(coinDeskNews.status === 'fulfilled' ? coinDeskNews.value : []),
      ...(theBlockNews.status === 'fulfilled' ? theBlockNews.value : []),
      ...(decryptNews.status === 'fulfilled' ? decryptNews.value : [])
    ]

    console.log('Total raw news:', allNews.length)

    // Remove duplicates based on title similarity and URL
    const uniqueNews = allNews.filter((news, index, self) =>
      index === self.findIndex((t) => (
        t.url === news.url || // Exact URL match
        t.title.toLowerCase().includes(news.title.toLowerCase()) || // Title contains
        news.title.toLowerCase().includes(t.title.toLowerCase()) || // Title is contained
        calculateSimilarity(t.title, news.title) > 0.8 // Title similarity
      ))
    )

    // Sort by date and relevance score
    const sortedNews = uniqueNews.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime()
      const dateB = new Date(b.publishedAt).getTime()
      const timeWeight = 0.7 // Weight for time factor
      const relevanceWeight = 0.3 // Weight for relevance factor
      
      // Normalize time difference to a 0-1 scale
      const maxTimeDiff = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      const timeDiff = Math.min(Math.abs(dateB - dateA), maxTimeDiff)
      const timeScore = 1 - (timeDiff / maxTimeDiff)
      
      // Combine time and relevance scores
      const scoreA = (timeScore * timeWeight) + (a.relevance * relevanceWeight)
      const scoreB = (timeScore * timeWeight) + (b.relevance * relevanceWeight)
      
      return scoreB - scoreA
    })

    console.log('Total unique news articles:', sortedNews.length)

    // Calculate overall sentiment properly
    const overallSentiment = calculateAggregateSentiment(sortedNews)

    // Generate market trends with normalized values
    const marketTrends = {
      sentiment: {
        overall: overallSentiment,
        byAsset: {}
      },
      topics: sortedNews.reduce((acc: Topic[], news: NewsItem) => {
        // Extract topics from news content
        const topics: Topic[] = news.categories.map((category: string) => ({
          name: category,
          volume: 1,
          sentiment: normalizeSentiment(news.sentiment.score)
        }))

        // Merge topics with same name
        topics.forEach((topic: Topic) => {
          const existing = acc.find(t => t.name === topic.name)
          if (existing) {
            existing.volume++
            existing.sentiment = normalizeSentiment(
              (existing.sentiment * (existing.volume - 1) + topic.sentiment) / existing.volume
            )
          } else {
            acc.push(topic)
          }
        })

        return acc
      }, [])
        .sort((a: Topic, b: Topic) => b.volume - a.volume)
        .map((topic: Topic) => ({
          ...topic,
          volume: topic.volume / sortedNews.length // Normalize volume to percentage
        }))
        .slice(0, 5) // Keep top 5 topics
    }

    // Filter by categories if specified
    const filteredNews = categories.length
      ? sortedNews.filter(news => 
          news.categories.some((category: string) => categories.includes(category))
        )
      : sortedNews

    // Filter by vote score
    const voteFilteredNews = minVoteScore
      ? filteredNews.filter(news => (news.votes?.score || 0) >= minVoteScore)
      : filteredNews

    // Group news by category
    const newsByCategory = Object.values(NEWS_CATEGORIES).reduce((acc: Record<string, typeof voteFilteredNews>, category: string) => {
      acc[category] = voteFilteredNews.filter(news => 
        news.categories.includes(category)
      )
      return acc
    }, {} as Record<string, typeof voteFilteredNews>)

    return NextResponse.json({
      success: true,
      data: {
        news: voteFilteredNews,
        newsByCategory,
        categories: Object.values(NEWS_CATEGORIES),
        sources: NEWS_SOURCES,
        trends: marketTrends,
        sourceStats: Object.fromEntries(
          Object.entries(sources).map(([name, result]) => [
            name,
            { 
              status: result.status, 
              count: result.status === 'fulfilled' ? result.value.length : 0,
              stats: sourceStats[name],
              metadata: NEWS_SOURCES[name as keyof typeof NEWS_SOURCES]
            }
          ])
        )
      }
    })
  } catch (error) {
    console.error('Error in news API:', error)
    return NextResponse.json({
      success: false,
      error: {
        message: 'Failed to fetch news data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

// Helper function to calculate title similarity
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase()
  const s2 = str2.toLowerCase()
  const words1 = s1.split(/\W+/).filter(Boolean)
  const words2 = s2.split(/\W+/).filter(Boolean)
  const words1Set = new Set(words1)
  const words2Set = new Set(words2)
  const intersection = words1.filter(x => words2Set.has(x))
  const union = Array.from(new Set([...words1, ...words2]))
  return intersection.length / union.length
}

// Add voting endpoints
export async function POST(request: Request) {
  try {
    const { articleId, voteType } = await request.json()
    
    if (!articleId || !['up', 'down'].includes(voteType)) {
      return NextResponse.json({
        success: false,
        error: { message: 'Invalid vote parameters' }
      }, { status: 400 })
    }

    // Here you would typically update a database
    // For now, we'll just return a success response
    return NextResponse.json({
      success: true,
      data: {
        articleId,
        votes: {
          up: voteType === 'up' ? 1 : 0,
          down: voteType === 'down' ? 1 : 0,
          score: voteType === 'up' ? 1 : -1
        }
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: { message: 'Failed to process vote' }
    }, { status: 500 })
  }
} 