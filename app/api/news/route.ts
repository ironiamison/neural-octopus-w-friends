import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI for AI16Z integration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// API Keys
const NEWS_API_KEY = process.env.NEWS_API_KEY
const NEWSAPI_KEY = process.env.NEWSAPI_KEY
const CRYPTOCOMPARE_API_KEY = process.env.CRYPTOCOMPARE_API_KEY
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY
const MESSARI_API_KEY = process.env.MESSARI_API_KEY

// Define trusted news sources
const TRUSTED_SOURCES = [
  'cointelegraph.com',
  'coindesk.com',
  'decrypt.co',
  'theblock.co',
  'cryptoslate.com',
  'bitcoinmagazine.com',
  'cryptobriefing.com',
  'beincrypto.com',
  'cryptonews.com',
  'blockworks.co'
]

// Define specific categories and their search terms
const CATEGORIES = {
  crypto: {
    name: 'Crypto',
    terms: ['cryptocurrency', 'bitcoin', 'ethereum', 'crypto', 'trading', 'market']
  },
  defi: {
    name: 'DeFi',
    terms: ['defi', 'yield', 'lending', 'amm', 'dao', 'staking', 'liquidity']
  },
  nfts: {
    name: 'NFTs',
    terms: ['nft', 'collectibles', 'digital art', 'tokens', 'ownership']
  },
  blockchain: {
    name: 'Blockchain',
    terms: ['blockchain', 'consensus', 'protocol', 'network', 'layer1', 'infrastructure']
  },
  metaverse: {
    name: 'Metaverse',
    terms: ['metaverse', 'virtual reality', 'gaming', 'web3', 'virtual worlds']
  }
}

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
}

interface AI16ZAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral'
  impact: number
  relevance: number
  summary: string
  tags: string[]
  marketImplications: string[]
}

interface EnhancedAI16ZAnalysis extends AI16ZAnalysis {
  confidence: number
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
}

interface NewsAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: number;
  relevance: number;
  confidence: number;
  summary: string;
  technicalFactors: {
    trend: 'bullish' | 'bearish' | 'neutral';
    volatility: 'high' | 'medium' | 'low';
    momentum: number;
  };
  fundamentalFactors: {
    adoption: number;
    innovation: number;
    regulation: number;
  };
  categories: string[];
  timeframe: {
    immediate: boolean;
    shortTerm: boolean;
    longTerm: boolean;
  };
  tags: string[];
  marketImplications: string[];
}

interface MarketTrends {
  overallSentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  dominantTopics: string[];
  trendingPairs: string[];
  marketMomentum: number;
  confidenceScore: number;
  volumeIndicator: 'high' | 'medium' | 'low';
  priceAction: {
    shortTerm: 'bullish' | 'bearish' | 'neutral';
    mediumTerm: 'bullish' | 'bearish' | 'neutral';
  };
}

interface FilterOptions {
  timeRange?: 'hour' | 'day' | 'week' | 'month';
  sentiment?: 'positive' | 'negative' | 'neutral' | 'all';
  impact?: 'high' | 'medium' | 'low' | 'all';
  source?: string[];
  topics?: string[];
  minConfidence?: number;
}

function isValidImageUrl(url: string | null): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function fetchCryptoCompareNews(category: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&categories=${category}&api_key=${CRYPTOCOMPARE_API_KEY}`
    )
    
    if (!response.ok) return []
    
    const data = await response.json()
    return data.Data.map((article: any) => ({
      title: article.title,
      description: article.body,
      url: article.url,
      publishedAt: new Date(article.published_on * 1000).toISOString(),
      source: {
        name: article.source,
        url: new URL(article.url).hostname,
        logo: article.source_info?.img || `https://www.google.com/s2/favicons?domain=${new URL(article.url).hostname}&sz=128`
      },
      author: article.source,
      imageUrl: article.imageurl
    }))
  } catch (error) {
    console.error('Error fetching from CryptoCompare:', error)
    return []
  }
}

async function fetchCoinGeckoNews(category: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/news?category=${category}&per_page=10&x_cg_api_key=${COINGECKO_API_KEY}`
    )
    
    if (!response.ok) return []
    
    const data = await response.json()
    return data.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.created_at,
      source: {
        name: article.author.name,
        url: new URL(article.url).hostname,
        logo: `https://www.google.com/s2/favicons?domain=${new URL(article.url).hostname}&sz=128`
      },
      author: article.author.name,
      imageUrl: article.thumb_2x
    }))
  } catch (error) {
    console.error('Error fetching from CoinGecko:', error)
    return []
  }
}

async function fetchMessariNews(category: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(
      `https://data.messari.io/api/v1/news?category=${category}`,
      {
        headers: {
          'x-messari-api-key': MESSARI_API_KEY!
        }
      }
    )
    
    if (!response.ok) return []
    
    const data = await response.json()
    return data.data.map((article: any) => ({
      title: article.title,
      description: article.content,
      url: article.url,
      publishedAt: article.published_at,
      source: {
        name: article.author.name,
        url: new URL(article.url).hostname,
        logo: `https://www.google.com/s2/favicons?domain=${new URL(article.url).hostname}&sz=128`
      },
      author: article.author.name,
      imageUrl: article.lead_image_url
    }))
  } catch (error) {
    console.error('Error fetching from Messari:', error)
    return []
  }
}

async function fetchNewsFromAPIs(category: string): Promise<NewsItem[]> {
  const categoryConfig = CATEGORIES[category as keyof typeof CATEGORIES]
  const searchTerms = categoryConfig 
    ? categoryConfig.terms.join(' OR ') 
    : category

  let newsItems: NewsItem[] = []
  
  // Fetch from all sources in parallel
  const [
    cryptoCompareNews,
    coinGeckoNews,
    messariNews,
    ...otherNews
  ] = await Promise.all([
    fetchCryptoCompareNews(category),
    fetchCoinGeckoNews(category),
    fetchMessariNews(category),
    // Existing news sources
    fetch(
      `https://newsapi.org/v2/everything?q=${searchTerms}+AND+(crypto OR blockchain OR defi OR nft)&domains=${TRUSTED_SOURCES.join(',')}&sortBy=publishedAt&language=en&pageSize=10`,
      {
        headers: {
          'X-Api-Key': NEWSAPI_KEY!
        }
      }
    ).then(async (response) => {
      if (!response.ok) return []
      const data = await response.json()
      return data.articles.map((article: any) => {
        const domain = new URL(article.url).hostname
        return {
          title: article.title,
          description: article.description || '',
          url: article.url,
          publishedAt: article.publishedAt,
          source: {
            name: article.source.name,
            url: domain,
            logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
          },
          author: article.author || 'Staff Writer',
          imageUrl: isValidImageUrl(article.urlToImage) ? article.urlToImage : null
        }
      })
    }).catch(() => []),
    fetch(
      `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=${searchTerms}+AND+(crypto OR blockchain OR defi OR nft)&language=en&size=10&domain=${TRUSTED_SOURCES.join(',')}`,
    ).then(async (response) => {
      if (!response.ok) return []
      const data = await response.json()
      return data.results.map((article: any) => {
        const domain = new URL(article.link).hostname
        return {
          title: article.title,
          description: article.description || article.content || '',
          url: article.link,
          publishedAt: article.pubDate,
          source: {
            name: article.source_id,
            url: domain,
            logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
          },
          author: article.creator?.[0] || 'Staff Writer',
          imageUrl: isValidImageUrl(article.image_url) ? article.image_url : null
        }
      })
    }).catch(() => [])
  ])

  // Combine all news items
  newsItems = [
    ...cryptoCompareNews,
    ...coinGeckoNews,
    ...messariNews,
    ...otherNews.flat()
  ]

  // Remove duplicates based on URL
  const uniqueNews = Array.from(
    new Map(newsItems.map(item => [item.url, item])).values()
  )
  
  // Filter and sort news items
  return uniqueNews
    .filter(item => 
      item.title && 
      item.description && 
      !item.title.includes('404') && 
      !item.title.toLowerCase().includes('error') &&
      TRUSTED_SOURCES.some(domain => item.source.url.includes(domain))
    )
    .sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
}

// Fallback analysis when OpenAI API fails
function getFallbackAnalysis(item: NewsItem): EnhancedAI16ZAnalysis {
  // Extract sentiment from title/description using basic keyword matching
  const text = (item.title + ' ' + item.description).toLowerCase()
  const positiveWords = ['surge', 'gain', 'rise', 'bull', 'up', 'high', 'growth', 'positive']
  const negativeWords = ['crash', 'fall', 'drop', 'bear', 'down', 'low', 'negative', 'risk']
  
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
  const posCount = positiveWords.filter(word => text.includes(word)).length
  const negCount = negativeWords.filter(word => text.includes(word)).length
  
  if (posCount > negCount) sentiment = 'positive'
  else if (negCount > posCount) sentiment = 'negative'

  return {
    sentiment,
    impact: 5,
    relevance: 5,
    confidence: 3,
    summary: item.description,
    technicalFactors: {
      trend: sentiment === 'positive' ? 'bullish' : sentiment === 'negative' ? 'bearish' : 'neutral',
      volatility: 'medium',
      momentum: 5
    },
    fundamentalFactors: {
      adoption: 5,
      innovation: 5,
      regulation: 5
    },
    categories: [],
    timeframe: {
      immediate: true,
      shortTerm: true,
      longTerm: false
    },
    tags: [],
    marketImplications: ['Market impact analysis temporarily unavailable']
  }
}

// In-memory cache for AI analysis results
const analysisCache = new Map<string, { analysis: NewsAnalysis; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

async function getCachedAnalysis(newsItem: NewsItem): Promise<NewsAnalysis | null> {
  const cacheKey = newsItem.url;
  const cached = analysisCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.analysis;
  }
  
  return null;
}

async function setCachedAnalysis(newsItem: NewsItem, analysis: NewsAnalysis): Promise<void> {
  const cacheKey = newsItem.url;
  analysisCache.set(cacheKey, {
    analysis,
    timestamp: Date.now()
  });
}

// Rate limit tracking
const rateLimitState = {
  lastError: 0,
  cooldownPeriod: 5 * 60 * 1000, // 5 minutes
  isRateLimited: false
};

async function analyzeWithAI16Z(newsItem: NewsItem): Promise<NewsAnalysis> {
  try {
    // Check cache first
    const cached = await getCachedAnalysis(newsItem);
    if (cached) {
      return cached;
    }

    // Check if we're in a rate limit cooldown
    if (rateLimitState.isRateLimited && 
        Date.now() - rateLimitState.lastError < rateLimitState.cooldownPeriod) {
      console.log('Using fallback analysis due to rate limit cooldown');
      return getFallbackAnalysis(newsItem);
    }

    const openai = new OpenAI();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are AI16Z, an expert AI analyst. Analyze the news article and provide a concise JSON response with sentiment, impact (1-10), and key points."
        },
        {
          role: "user",
          content: `Title: ${newsItem.title}\nContent: ${newsItem.description}`
        }
      ],
      temperature: 0.5,
      max_tokens: 300 // Reduced token usage
    });

    const content = response.choices[0].message?.content || '';
    const analysis = parseAIResponse(content);
    
    // Cache successful result
    await setCachedAnalysis(newsItem, analysis);
    
    return analysis;
  } catch (error: any) {
    console.error('Error in AI analysis for item:', error);
    
    // Update rate limit state if we hit the quota
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      rateLimitState.lastError = Date.now();
      rateLimitState.isRateLimited = true;
      console.log('Rate limit detected, entering cooldown period');
    }
    
    const fallbackAnalysis = getFallbackAnalysis(newsItem);
    await setCachedAnalysis(newsItem, fallbackAnalysis);
    return fallbackAnalysis;
  }
}

// Helper functions for fallback analysis
function determineSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['surge', 'gain', 'rise', 'boost', 'growth', 'bullish', 'adoption', 'success'];
  const negativeWords = ['crash', 'fall', 'drop', 'decline', 'bearish', 'ban', 'hack', 'scam'];
  
  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function extractCategories(text: string): string[] {
  const categories = [];
  const categoryKeywords = {
    'Crypto': ['bitcoin', 'ethereum', 'crypto', 'blockchain', 'token'],
    'DeFi': ['defi', 'yield', 'lending', 'swap', 'liquidity'],
    'NFTs': ['nft', 'collectible', 'art', 'gaming'],
    'Regulation': ['sec', 'regulation', 'compliance', 'law'],
    'Technology': ['protocol', 'layer', 'scaling', 'network']
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
      categories.push(category);
    }
  }

  return categories.length > 0 ? categories : ['General'];
}

function extractTags(text: string): string[] {
  const commonTags = ['crypto', 'blockchain', 'bitcoin', 'ethereum', 'defi', 'nft', 'regulation'];
  return commonTags.filter(tag => text.toLowerCase().includes(tag));
}

function parseAIResponse(response: string): NewsAnalysis {
  const defaultAnalysis: NewsAnalysis = {
    sentiment: 'neutral',
    impact: 5,
    relevance: 5,
    confidence: 5,
    summary: response.slice(0, 200) + '...',
    technicalFactors: {
      trend: 'neutral',
      volatility: 'medium',
      momentum: 5
    },
    fundamentalFactors: {
      adoption: 5,
      innovation: 5,
      regulation: 5
    },
    categories: extractCategories(response),
    timeframe: {
      immediate: true,
      shortTerm: true,
      longTerm: false
    },
    tags: extractTags(response),
    marketImplications: ['Market impact analysis temporarily unavailable']
  };

  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(response);
    if (typeof parsed === 'object') {
      return {
        sentiment: parsed.sentiment || defaultAnalysis.sentiment,
        impact: parsed.impact || defaultAnalysis.impact,
        relevance: parsed.relevance || defaultAnalysis.relevance,
        confidence: parsed.confidence || defaultAnalysis.confidence,
        summary: parsed.summary || defaultAnalysis.summary,
        technicalFactors: {
          trend: parsed.technicalFactors?.trend || defaultAnalysis.technicalFactors.trend,
          volatility: parsed.technicalFactors?.volatility || defaultAnalysis.technicalFactors.volatility,
          momentum: parsed.technicalFactors?.momentum || defaultAnalysis.technicalFactors.momentum
        },
        fundamentalFactors: {
          adoption: parsed.fundamentalFactors?.adoption || defaultAnalysis.fundamentalFactors.adoption,
          innovation: parsed.fundamentalFactors?.innovation || defaultAnalysis.fundamentalFactors.innovation,
          regulation: parsed.fundamentalFactors?.regulation || defaultAnalysis.fundamentalFactors.regulation
        },
        categories: Array.isArray(parsed.categories) ? parsed.categories : defaultAnalysis.categories,
        timeframe: {
          immediate: parsed.timeframe?.immediate ?? defaultAnalysis.timeframe.immediate,
          shortTerm: parsed.timeframe?.shortTerm ?? defaultAnalysis.timeframe.shortTerm,
          longTerm: parsed.timeframe?.longTerm ?? defaultAnalysis.timeframe.longTerm
        },
        tags: Array.isArray(parsed.tags) ? parsed.tags : defaultAnalysis.tags,
        marketImplications: Array.isArray(parsed.marketImplications) ? parsed.marketImplications : defaultAnalysis.marketImplications
      };
    }
  } catch (error) {
    // If JSON parsing fails, extract information from text
    const lines = response.split('\n');
    const summary = lines.find(line => line.toLowerCase().includes('summary'))?.split(':')[1]?.trim();
    
    return {
      ...defaultAnalysis,
      summary: summary || defaultAnalysis.summary,
      sentiment: determineSentiment(response)
    };
  }

  return defaultAnalysis;
}

function aggregateMarketTrends(newsItems: (NewsItem & { analysis: NewsAnalysis })[]): MarketTrends {
  // Calculate overall sentiment
  const sentiments = newsItems.map(item => ({
    sentiment: item.analysis.sentiment,
    impact: item.analysis.impact,
    confidence: item.analysis.confidence
  }));

  const weightedSentiments = sentiments.map(s => ({
    score: s.sentiment === 'positive' ? 1 : s.sentiment === 'negative' ? -1 : 0,
    weight: (s.impact * s.confidence) / 100
  }));

  const sentimentScore = weightedSentiments.reduce((acc, curr) => 
    acc + (curr.score * curr.weight), 0) / weightedSentiments.length;

  // Extract dominant topics
  const allTags = newsItems.flatMap(item => item.analysis.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantTopics = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);

  // Calculate market momentum
  const momentum = newsItems.reduce((acc, item) => 
    acc + item.analysis.technicalFactors.momentum, 0) / newsItems.length;

  // Determine trending pairs
  const trendingPairs = ['BTC/USD', 'ETH/USD', 'SOL/USD'].filter(() => 
    Math.random() > 0.5); // Placeholder - replace with actual pair detection

  // Calculate confidence score
  const confidenceScore = newsItems.reduce((acc, item) => 
    acc + item.analysis.confidence, 0) / newsItems.length;

  // Determine volume indicator
  const volumeIndicator = momentum > 7 ? 'high' : momentum > 4 ? 'medium' : 'low';

  // Determine price action trends
  const shortTermBullish = newsItems.filter(item => 
    item.analysis.technicalFactors.trend === 'bullish' && 
    item.analysis.timeframe.immediate).length;
  
  const shortTermBearish = newsItems.filter(item => 
    item.analysis.technicalFactors.trend === 'bearish' && 
    item.analysis.timeframe.immediate).length;

  const mediumTermBullish = newsItems.filter(item => 
    item.analysis.technicalFactors.trend === 'bullish' && 
    item.analysis.timeframe.shortTerm).length;
  
  const mediumTermBearish = newsItems.filter(item => 
    item.analysis.technicalFactors.trend === 'bearish' && 
    item.analysis.timeframe.shortTerm).length;

  return {
    overallSentiment: sentimentScore > 0.3 ? 'positive' : sentimentScore < -0.3 ? 'negative' : 'neutral',
    sentimentScore: Number(sentimentScore.toFixed(2)),
    dominantTopics,
    trendingPairs,
    marketMomentum: Number(momentum.toFixed(2)),
    confidenceScore: Number(confidenceScore.toFixed(2)),
    volumeIndicator,
    priceAction: {
      shortTerm: shortTermBullish > shortTermBearish ? 'bullish' : 
                 shortTermBearish > shortTermBullish ? 'bearish' : 'neutral',
      mediumTerm: mediumTermBullish > mediumTermBearish ? 'bullish' : 
                  mediumTermBearish > mediumTermBullish ? 'bearish' : 'neutral'
    }
  };
}

function filterNews(
  newsItems: (NewsItem & { analysis: NewsAnalysis })[],
  options: FilterOptions
): (NewsItem & { analysis: NewsAnalysis })[] {
  return newsItems.filter(item => {
    // Time range filter
    if (options.timeRange) {
      const itemDate = new Date(item.publishedAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60);
      
      if (options.timeRange === 'hour' && hoursDiff > 1) return false;
      if (options.timeRange === 'day' && hoursDiff > 24) return false;
      if (options.timeRange === 'week' && hoursDiff > 24 * 7) return false;
      if (options.timeRange === 'month' && hoursDiff > 24 * 30) return false;
    }

    // Sentiment filter
    if (options.sentiment && options.sentiment !== 'all') {
      if (item.analysis.sentiment !== options.sentiment) return false;
    }

    // Impact filter
    if (options.impact && options.impact !== 'all') {
      const impact = item.analysis.impact;
      if (options.impact === 'high' && impact < 7) return false;
      if (options.impact === 'medium' && (impact < 4 || impact > 6)) return false;
      if (options.impact === 'low' && impact > 3) return false;
    }

    // Source filter
    if (options.source && options.source.length > 0) {
      if (!options.source.some(s => item.source.url.includes(s))) return false;
    }

    // Topics filter
    if (options.topics && options.topics.length > 0) {
      if (!options.topics.some(topic => 
        item.analysis.tags.includes(topic) || 
        item.analysis.categories.includes(topic)
      )) return false;
    }

    // Confidence filter
    if (options.minConfidence !== undefined) {
      if (item.analysis.confidence < options.minConfidence) return false;
    }

    return true;
  });
}

function categorizeByTopic(
  newsItems: (NewsItem & { analysis: NewsAnalysis })[]
): Record<string, (NewsItem & { analysis: NewsAnalysis })[]> {
  const topics: Record<string, (NewsItem & { analysis: NewsAnalysis })[]> = {};
  
  newsItems.forEach(item => {
    const itemTopics = new Set([
      ...item.analysis.categories,
      ...item.analysis.tags
    ]);

    itemTopics.forEach(topic => {
      if (!topics[topic]) {
        topics[topic] = [];
      }
      topics[topic].push(item);
    });
  });

  // Sort each topic's news by impact and relevance
  Object.keys(topics).forEach(topic => {
    topics[topic].sort((a, b) => 
      (b.analysis.impact * b.analysis.relevance) - 
      (a.analysis.impact * a.analysis.relevance)
    );
  });

  return topics;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'crypto';
    
    // Parse filter options from query params
    const filterOptions: FilterOptions = {
      timeRange: searchParams.get('timeRange') as FilterOptions['timeRange'] || undefined,
      sentiment: searchParams.get('sentiment') as FilterOptions['sentiment'] || undefined,
      impact: searchParams.get('impact') as FilterOptions['impact'] || undefined,
      source: searchParams.get('source')?.split(',') || undefined,
      topics: searchParams.get('topics')?.split(',') || undefined,
      minConfidence: searchParams.get('minConfidence') ? 
        Number(searchParams.get('minConfidence')) : undefined
    };

    const newsItems = await fetchNewsFromAPIs(category);
    const analyzedNews = [];
    
    for (let i = 0; i < newsItems.length; i += 2) {
      const batch = newsItems.slice(i, i + 2);
      const batchResults = await Promise.all(
        batch.map(async (item) => {
          const analysis = await analyzeWithAI16Z(item);
          return { ...item, analysis };
        })
      );
      analyzedNews.push(...batchResults);
      
      if (i + 2 < newsItems.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Apply filters
    const filteredNews = filterNews(analyzedNews, filterOptions);

    // Calculate market trends from filtered news
    const marketTrends = aggregateMarketTrends(filteredNews);

    // Categorize news by topics
    const newsByTopic = categorizeByTopic(filteredNews);

    return NextResponse.json({
      success: true,
      data: filteredNews,
      meta: {
        total: filteredNews.length,
        usingFallback: rateLimitState.isRateLimited,
        cooldownRemaining: rateLimitState.isRateLimited ? 
          Math.max(0, rateLimitState.cooldownPeriod - (Date.now() - rateLimitState.lastError)) : 0
      },
      marketTrends,
      topics: Object.keys(newsByTopic).map(topic => ({
        name: topic,
        count: newsByTopic[topic].length,
        topArticles: newsByTopic[topic].slice(0, 3) // Top 3 articles per topic
      }))
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch news'
    }, { status: 500 });
  }
} 