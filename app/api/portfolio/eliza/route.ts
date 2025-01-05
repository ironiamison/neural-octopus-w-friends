import { NextResponse } from 'next/server'

interface PortfolioConfig {
  holdings: Array<{
    token: string
    amount: number
    entryPrice: number
  }>
  riskProfile: 'conservative' | 'moderate' | 'aggressive'
  investmentGoals: string[]
  timeHorizon: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const elizaResponse = await fetch('https://elizaos.github.io/eliza/api/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        config: {
          holdings: body.holdings,
          riskProfile: body.riskProfile,
          investmentGoals: body.investmentGoals,
          timeHorizon: body.timeHorizon,
          features: {
            rebalancingAdvice: true,
            riskAnalysis: true,
            performanceProjections: true,
            diversificationMetrics: true,
            taxEfficiencyAnalysis: true,
            marketCorrelations: true
          }
        }
      })
    })

    if (!elizaResponse.ok) {
      throw new Error('Failed to analyze portfolio')
    }

    const data = await elizaResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in portfolio API:', error)
    return NextResponse.json(
      { error: 'Failed to analyze portfolio' },
      { status: 500 }
    )
  }
} 