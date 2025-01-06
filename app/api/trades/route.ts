import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import prisma from '@/lib/mongodb'
import { ProfileService } from '@/lib/services/profile.service'
import { TradingService } from '@/lib/services/trading.service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }

    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { openedAt: 'desc' }
    })

    return NextResponse.json(trades)
  } catch (error: any) {
    console.error('Error fetching trades:', error)
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }

    const { symbol, side, size, price, leverage = 1, stopLoss, takeProfit } = await request.json()

    if (!symbol || !side || !size || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user with portfolio
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolio: true
      }
    })

    if (!user?.portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }

    if (!user.portfolio.isActive) {
      return NextResponse.json({ error: 'Please connect your wallet to start trading' }, { status: 403 })
    }

    const requiredMargin = size / leverage
    const newBalance = user.portfolio.balance - requiredMargin

    if (newBalance < 0) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 })
    }

    // Open position using trading service
    const position = await TradingService.openPosition({
      userId,
      symbol,
      side: side as 'LONG' | 'SHORT',
      type: 'MARKET',
      size,
      price,
      leverage,
      stopLoss,
      takeProfit
    })

    // Update portfolio balance
    await prisma.portfolio.update({
      where: { userId },
      data: {
        balance: newBalance
      }
    })

    // Update trading stats and award XP
    await ProfileService.updateTradingStats(userId, {
      ...position,
      pnl: 0
    })

    // Get updated profile
    const profile = await ProfileService.getProfile(userId)
    return NextResponse.json({ position, profile })
  } catch (error: any) {
    console.error('Error creating trade:', error)
    return NextResponse.json({ error: error.message || 'Failed to process trade' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const positionId = searchParams.get('positionId')
    const userId = searchParams.get('userId')

    if (!positionId || !userId) {
      return NextResponse.json({ error: 'Position ID and User ID are required' }, { status: 400 })
    }

    const exitPrice = parseFloat(searchParams.get('exitPrice') || '0')
    if (!exitPrice) {
      return NextResponse.json({ error: 'Exit price is required' }, { status: 400 })
    }

    // Close position using trading service
    const trade = await TradingService.closePosition(userId, positionId, exitPrice)

    // Update trading stats and award XP
    await ProfileService.updateTradingStats(userId, trade)

    return NextResponse.json(trade)
  } catch (error: any) {
    console.error('Error closing position:', error)
    return NextResponse.json({ error: error.message || 'Failed to close position' }, { status: 500 })
  }
} 