interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  imageUrl: string
  source: string
  categories: string[]
  timestamp: number
}

// Mock news data
const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'BONK Token Surges 150% in 24 Hours',
    description: 'The Solana-based meme token BONK has seen a massive surge in price, reaching new all-time highs as trading volume spikes across major exchanges.',
    url: '#',
    imageUrl: '',
    source: 'Crypto News',
    categories: ['market', 'trending'],
    timestamp: Date.now() - 3600000
  },
  {
    id: '2',
    title: 'New Meme Token Launch Platform Announced',
    description: 'A new platform designed specifically for launching and trading meme tokens has been announced, promising improved liquidity and safer trading.',
    url: '#',
    imageUrl: '',
    source: 'DeFi Daily',
    categories: ['market'],
    timestamp: Date.now() - 7200000
  },
  {
    id: '3',
    title: 'WIF Token Integration with Major DeFi Protocol',
    description: 'The popular meme token WIF is being integrated into a major DeFi protocol, enabling new use cases and potential yield opportunities.',
    url: '#',
    imageUrl: '',
    source: 'Crypto Weekly',
    categories: ['trending'],
    timestamp: Date.now() - 10800000
  }
]

export async function fetchNews(categories: string[] = []): Promise<NewsArticle[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Filter by categories if specified
  return mockNews.filter(article => 
    categories.length === 0 || 
    article.categories.some(cat => 
      categories.some(filter => 
        cat.toLowerCase().includes(filter.toLowerCase())
      )
    )
  )
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }
  return 'Just now'
} 