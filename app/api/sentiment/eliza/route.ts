import { NextResponse } from 'next/server'

interface SentimentConfig {
  tokens: string[]
  platforms: string[]
  timeframe: string
  depth: 'basic' | 'detailed' | 'comprehensive'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const elizaResponse = await fetch('https://elizaos.github.io/eliza/api/sentiment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        config: {
          tokens: body.tokens,
          platforms: body.platforms,
          timeframe: body.timeframe,
          depth: body.depth,
          features: {
            trendAnalysis: true,
            influencerTracking: true,
            communityMetrics: true,
            predictiveAnalysis: true,
            realTimeUpdates: true
          }
        }
      })
    })

    if (!elizaResponse.ok) {
      throw new Error('Failed to analyze sentiment')
    }

    const data = await elizaResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in sentiment API:', error)
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    )
  }
} 