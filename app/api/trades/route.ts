import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import prisma from '@/app/lib/mongodb'
import { ProfileService } from '@/app/lib/services/profile.service'

export async function GET(request: Request) {
  try {
    const headersList = headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }

    const profile = await ProfileService.getProfile(userId)
    return NextResponse.json(profile)
  } catch (error: any) {
    console.error('Error fetching trades:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }

    const { symbol, type, amount, price, leverage = 1, stopLoss, takeProfit } = await request.json()

    if (!symbol || !type || !amount || !price) {
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

    const cost = amount * price
    const newBalance = user.portfolio.balance - cost

    if (newBalance < 0) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 })
    }

    const currentPositions = user.portfolio.positions as Array<{
      symbol: string
      amount: number
      averagePrice: number
    }>

    const existingPosition = currentPositions.find(p => p.symbol === symbol)

    if (existingPosition) {
      existingPosition.amount += type === 'BUY' ? amount : -amount
      existingPosition.averagePrice = (existingPosition.averagePrice * existingPosition.amount + price * amount) / (existingPosition.amount + amount)
    } else {
      currentPositions.push({
        symbol,
        amount: type === 'BUY' ? amount : -amount,
        averagePrice: price
      })
    }

    // Create trade and update portfolio in a transaction
    const [trade] = await prisma.$transaction([
      prisma.trade.create({
        data: {
          userId,
          symbol,
          type,
          amount,
          price,
          status: 'OPEN',
          leverage,
          stopLoss,
          takeProfit
        }
      }),
      prisma.portfolio.update({
        where: { userId },
        data: {
          balance: newBalance,
          positions: currentPositions
        }
      })
    ])

    // Update trading stats and award XP
    await ProfileService.updateTradingStats(userId, trade)

    // Get updated profile
    const profile = await ProfileService.getProfile(userId)
    return NextResponse.json({ trade, profile })
  } catch (error: any) {
    console.error('Error creating trade:', error)
    return NextResponse.json({ error: 'Failed to process trade' }, { status: 500 })
  }
} 