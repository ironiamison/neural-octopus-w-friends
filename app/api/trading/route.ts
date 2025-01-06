import { NextResponse } from 'next/server'
import prisma from '@/lib/mongodb'

// Open a new position
export async function POST(request: Request) {
  try {
    const { userId, symbol, size, leverage = 1 } = await request.json()

    if (!userId || !symbol || !size) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Get user with portfolio
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolio: true
      }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    if (!user.portfolio) {
      return new NextResponse('Portfolio not found', { status: 404 })
    }

    // Check balance
    const marginRequired = size / leverage
    if (marginRequired > user.portfolio.balance) {
      return new NextResponse('Insufficient balance', { status: 400 })
    }

    // Update portfolio balance
    const updatedPortfolio = await prisma.portfolio.update({
      where: { userId },
      data: {
        balance: user.portfolio.balance - marginRequired
      }
    })

    return NextResponse.json({ success: true, balance: updatedPortfolio.balance })
  } catch (error: any) {
    console.error('Error in trading API:', error)
    return new NextResponse(error.message, { status: 500 })
  }
}

// Close a position
export async function PUT(request: Request) {
  try {
    const { userId, positionId, price } = await request.json()

    if (!userId || !positionId || !price) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Get position
    const position = await prisma.position.findUnique({
      where: { id: positionId }
    })

    if (!position) {
      return new NextResponse('Position not found', { status: 404 })
    }

    if (position.userId !== userId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    // Calculate PnL
    const pnl = position.side === 'LONG'
      ? (price - position.entryPrice) * position.size * position.leverage
      : (position.entryPrice - price) * position.size * position.leverage

    const fees = position.size * 0.001 // 0.1% trading fee
    const slippage = Math.abs(price - position.markPrice) / position.markPrice
    const executionTime = Date.now() - position.openedAt.getTime()

    // Close position and update user balance in a transaction
    const result = await prisma.$transaction([
      prisma.trade.create({
        data: {
          userId,
          symbol: position.symbol,
          type: 'MARKET',
          side: position.side,
          size: position.size,
          leverage: position.leverage,
          entryPrice: position.entryPrice,
          exitPrice: price,
          pnl,
          fees,
          slippage,
          executionTime,
          status: 'CLOSED',
          openedAt: position.openedAt,
          closedAt: new Date()
        }
      }),
      prisma.position.delete({
        where: { id: positionId }
      }),
      prisma.portfolio.update({
        where: { userId },
        data: {
          balance: { increment: position.marginUsed + pnl }
        }
      })
    ])

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error('Error in trading API:', error)
    return new NextResponse(error.message, { status: 500 })
  }
}

// Get user positions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return new NextResponse('User ID is required', { status: 400 })
    }

    const positions = await prisma.position.findMany({
      where: { userId }
    })

    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { openedAt: 'desc' },
      take: 10
    })

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId }
    })

    return NextResponse.json({
      positions,
      trades,
      balance: portfolio?.balance || 0
    })
  } catch (error: any) {
    console.error('Error in trading API:', error)
    return new NextResponse(error.message, { status: 500 })
  }
} 