import { NextResponse } from 'next/server'
import { errorService, ValidationError, AuthenticationError, NotFoundError } from '@/lib/services/error.service'
import { z } from 'zod'
import prisma from '@/lib/mongodb'

// Input validation schemas
const createTradeSchema = z.object({
  symbol: z.string().min(1, 'Trading pair is required'),
  side: z.enum(['LONG', 'SHORT'], { 
    errorMap: () => ({ message: 'Side must be either LONG or SHORT' })
  }),
  size: z.number().positive('Size must be positive'),
  price: z.number().positive('Price must be positive'),
  leverage: z.number().min(1).max(100, 'Leverage must be between 1 and 100'),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      throw new AuthenticationError('User ID is required')
    }

    // Validate input
    const validationResult = createTradeSchema.safeParse(body)
    if (!validationResult.success) {
      throw new ValidationError('Invalid trade data', {
        errors: validationResult.error.errors,
      })
    }

    const { symbol, side, size, price, leverage, stopLoss, takeProfit } = validationResult.data

    // Get user and check balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { portfolio: true },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    const marginRequired = (size * price) / leverage
    if (user.portfolio.balance < marginRequired) {
      throw new ValidationError('Insufficient balance for trade', {
        required: marginRequired,
        available: user.portfolio.balance,
      })
    }

    // Create position
    const position = await prisma.position.create({
      data: {
        userId,
        symbol,
        side,
        size,
        entryPrice: price,
        leverage,
        marginUsed: marginRequired,
        stopLoss,
        takeProfit,
        status: 'open',
        openedAt: new Date(),
      },
    })

    // Update user's portfolio
    const updatedPortfolio = await prisma.portfolio.update({
      where: { userId },
      data: {
        balance: { decrement: marginRequired },
      },
    })

    return NextResponse.json({
      position,
      portfolio: updatedPortfolio,
    })
  } catch (error: any) {
    const errorResponse = errorService.handleError(error, {
      endpoint: '/api/trades',
      method: 'POST',
    })
    
    return NextResponse.json(
      errorResponse.error,
      { status: errorResponse.statusCode }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { openedAt: 'desc' },
      include: {
        position: true,
      },
    })

    return NextResponse.json(trades)
  } catch (error: any) {
    const errorResponse = errorService.handleError(error, {
      endpoint: '/api/trades',
      method: 'GET',
    })
    
    return NextResponse.json(
      errorResponse.error,
      { status: errorResponse.statusCode }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const positionId = searchParams.get('positionId')
    const userId = searchParams.get('userId')
    const exitPrice = parseFloat(searchParams.get('exitPrice') || '0')

    if (!positionId || !userId || !exitPrice) {
      throw new ValidationError('Position ID, user ID, and exit price are required')
    }

    // Get position
    const position = await prisma.position.findUnique({
      where: { id: positionId },
    })

    if (!position) {
      throw new NotFoundError('Position not found')
    }

    if (position.userId !== userId) {
      throw new AuthenticationError('Not authorized to close this position')
    }

    // Calculate PnL
    const priceDiff = position.side === 'LONG'
      ? exitPrice - position.entryPrice
      : position.entryPrice - exitPrice
    
    const pnl = (priceDiff / position.entryPrice) * position.size * position.leverage

    // Create trade record
    const trade = await prisma.trade.create({
      data: {
        userId,
        positionId,
        entryPrice: position.entryPrice,
        exitPrice,
        size: position.size,
        leverage: position.leverage,
        pnl,
        side: position.side,
        openedAt: position.openedAt,
        closedAt: new Date(),
      },
    })

    // Close position
    await prisma.position.update({
      where: { id: positionId },
      data: {
        status: 'closed',
        exitPrice,
        pnl,
      },
    })

    // Update user's portfolio
    const updatedPortfolio = await prisma.portfolio.update({
      where: { userId },
      data: {
        balance: { increment: position.marginUsed + pnl },
      },
    })

    return NextResponse.json({
      trade,
      portfolio: updatedPortfolio,
    })
  } catch (error: any) {
    const errorResponse = errorService.handleError(error, {
      endpoint: '/api/trades',
      method: 'DELETE',
    })
    
    return NextResponse.json(
      errorResponse.error,
      { status: errorResponse.statusCode }
    )
  }
} 