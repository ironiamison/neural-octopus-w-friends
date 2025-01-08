export interface NewsSource {
  name: string;
  url: string;
  description: string;
  reliability: number;
  categories: string[];
  logo?: string;
  socialMetrics: {
    followers: number;
    engagement: number;
  };
}

export interface NewsAuthor {
  name: string;
  title: string;
  avatar: string | null;
}

export interface NewsMultimedia {
  type: 'image' | 'video';
  url: string;
  caption: string;
}

export interface NewsSentiment {
  score: number;
  label: 'positive' | 'negative' | 'neutral';
}

export interface NewsVotes {
  up: number;
  down: number;
  score: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: NewsSource;
  author: NewsAuthor;
  keyPoints: string[];
  multimedia: NewsMultimedia[];
  sentiment: NewsSentiment;
  impact: number;
  relevance: number;
  categories: string[];
  sourceUrl: string;
  votes: NewsVotes;
}

export interface Topic {
  name: string;
  volume: number;
  sentiment: number;
}

export interface MarketTrends {
  sentiment: {
    overall: number;
    byAsset: Record<string, number>;
  };
  topics: Topic[];
}

export interface NewsAnalysis {
  marketSentiment: number;
  topTrends: Topic[];
  keyInsights: {
    topic: string;
    volume: number;
    sentiment: number;
    articles: NewsItem[];
  }[];
  confidence: number;
}

export const NEWS_CATEGORIES = {
  MARKET: 'Market Analysis',
  DEFI: 'DeFi',
  NFT: 'NFTs & Gaming',
  REGULATION: 'Regulation',
  TECHNOLOGY: 'Technology',
  ADOPTION: 'Adoption',
  MINING: 'Mining',
  SECURITY: 'Security',
  LAYER2: 'Layer 2',
  METAVERSE: 'Metaverse',
  TRADING: 'Trading',
  FUNDING: 'Funding & Startups'
} as const; 