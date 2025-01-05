import { NextResponse } from 'next/server'

interface TradingConfig {
  strategy: string
  riskLevel: 'low' | 'medium' | 'high'
  maxPositions: number
  tokenPairs: string[]
  timeframe: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const elizaResponse = await fetch('https://elizaos.github.io/eliza/api/trading', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        config: {
          strategy: body.strategy,
          riskLevel: body.riskLevel,
          maxPositions: body.maxPositions,
          tokenPairs: body.tokenPairs,
          timeframe: body.timeframe,
          features: {
            autoRebalancing: true,
            stopLoss: true,
            takeProfits: true,
            dollarCostAveraging: true
          }
        }
      })
    })

    if (!elizaResponse.ok) {
      throw new Error('Failed to initialize trading bot')
    }

    const data = await elizaResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in trading API:', error)
    return NextResponse.json(
      { error: 'Failed to initialize trading bot' },
      { status: 500 }
    )
  }
} 