import { NextResponse } from 'next/server'
import prisma from '@/app/lib/mongodb'

// Open a new position
export async function POST(request: Request) {
  try {
    const { userId, symbol, amount, leverage = 1 } = await request.json()

    if (!userId || !symbol || !amount) {
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

    if (!user.portfolio.isActive) {
      return new NextResponse('Please connect your wallet to start trading', { status: 403 })
    }

    // Check balance
    const totalCost = amount * leverage
    if (totalCost > user.portfolio.balance) {
      return new NextResponse('Insufficient balance', { status: 400 })
    }

    // Update portfolio balance
    const updatedPortfolio = await prisma.portfolio.update({
      where: { userId },
      data: {
        balance: user.portfolio.balance - totalCost
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
    const pnl = position.isLong
      ? (price - position.entryPrice) * position.amount * position.leverage
      : (position.entryPrice - price) * position.amount * position.leverage

    // Close position and update user balance in a transaction
    const result = await prisma.$transaction([
      prisma.trade.create({
        data: {
          userId,
          tokenAddress: position.tokenAddress,
          amount: position.amount,
          entryPrice: position.entryPrice,
          exitPrice: price,
          leverage: position.leverage,
          isLong: position.isLong,
          pnl,
          openedAt: position.openedAt,
          closedAt: new Date()
        }
      }),
      prisma.position.delete({
        where: { id: positionId }
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          balance: { increment: position.amount * position.leverage + pnl }
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        portfolio: true,
        trades: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json({
      balance: user.portfolio?.balance || 0,
      trades: user.trades
    })
  } catch (error: any) {
    console.error('Error in trading API:', error)
    return new NextResponse(error.message, { status: 500 })
  }
} 