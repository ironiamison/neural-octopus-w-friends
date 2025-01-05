import { NextResponse } from 'next/server'

interface ElizaConfig {
  sources: string[]
  analysisType: string
  includeSocialMetrics: boolean
}

interface ElizaRequest {
  category: string | null
  config: ElizaConfig
}

export async function POST(request: Request) {
  try {
    const body: ElizaRequest = await request.json()
    
    // Initialize Eliza client
    const elizaResponse = await fetch('https://elizaos.github.io/eliza/api/news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        category: body.category,
        config: {
          sources: body.config.sources,
          analysisType: body.config.analysisType,
          includeSocialMetrics: body.config.includeSocialMetrics,
          filters: {
            minImpact: 5,
            minMentions: 100,
            timeRange: '24h'
          }
        }
      })
    })

    if (!elizaResponse.ok) {
      throw new Error('Failed to fetch from Eliza')
    }

    const data = await elizaResponse.json()

    // Validate and clean tokens before returning
    return NextResponse.json({
      articles: data.articles.map((article: any) => {
        // Ensure tokens are valid strings and uppercase
        const validTokens = (article.tokens || [])
          .filter((token: any) => 
            typeof token === 'string' && 
            token.length > 0 && 
            token.length <= 10 && // Reasonable max length for a token symbol
            /^[A-Z0-9]+$/.test(token.toUpperCase()) // Only allow uppercase letters and numbers
          )
          .map((token: any) => token.toUpperCase())

        return {
          id: article.id,
          title: article.title,
          summary: article.summary,
          source: article.source,
          timestamp: article.timestamp,
          sentiment: article.sentiment,
          impact: article.impact,
          tokens: validTokens,
          url: article.url,
          socialMetrics: {
            mentions: article.socialMetrics?.mentions || 0,
            sentiment: article.socialMetrics?.sentiment || 0,
            engagement: article.socialMetrics?.engagement || 0
          }
        }
      })
    })
  } catch (error) {
    console.error('Error in news API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
} 