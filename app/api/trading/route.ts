import { NextResponse } from 'next/server'
import { prisma } from '@/app/utils/db'

// Open a new position
export async function POST(request: Request) {
  try {
    const { userId, tokenAddress, amount, leverage, isLong, price } = await request.json()

    if (!userId || !tokenAddress || !amount || !price) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Validate leverage
    if (leverage < 1 || leverage > 10) {
      return new NextResponse('Leverage must be between 1x and 10x', { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Check balance
    const totalCost = amount * leverage
    if (totalCost > user.balance) {
      return new NextResponse('Insufficient balance', { status: 400 })
    }

    // Calculate liquidation price
    const liquidationPrice = isLong
      ? price * (1 - 1 / leverage)
      : price * (1 + 1 / leverage)

    // Create position and update user balance in a transaction
    const result = await prisma.$transaction([
      prisma.position.create({
        data: {
          userId,
          tokenAddress,
          amount,
          entryPrice: price,
          leverage,
          isLong,
          liquidationPrice,
          pnl: 0
        }
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          balance: { decrement: totalCost }
        }
      })
    ])

    return NextResponse.json(result[0])
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

    const positions = await prisma.position.findMany({
      where: { userId }
    })

    return NextResponse.json(positions)
  } catch (error: any) {
    console.error('Error in trading API:', error)
    return new NextResponse(error.message, { status: 500 })
  }
} 