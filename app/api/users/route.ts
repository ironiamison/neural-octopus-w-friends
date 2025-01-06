import { NextResponse } from 'next/server'
import { errorService, ValidationError, NotFoundError } from '@/lib/services/error.service'
import { z } from 'zod'
import prisma from '@/lib/mongodb'

// Input validation schema
const createUserSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = createUserSchema.safeParse(body)
    if (!validationResult.success) {
      throw new ValidationError('Invalid input data', {
        errors: validationResult.error.errors,
      })
    }

    const { walletAddress, username } = validationResult.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress },
    })

    if (existingUser) {
      throw new ValidationError('User already exists with this wallet address')
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        walletAddress,
        username: username || `trader_${Math.random().toString(36).substring(2, 8)}`,
        portfolio: {
          create: {
            balance: 10000, // Starting balance
          },
        },
      },
      include: {
        portfolio: true,
      },
    })

    return NextResponse.json(user)
  } catch (error: any) {
    const errorResponse = errorService.handleError(error, {
      endpoint: '/api/users',
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
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      throw new ValidationError('Wallet address is required')
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        portfolio: true,
      },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return NextResponse.json(user)
  } catch (error: any) {
    const errorResponse = errorService.handleError(error, {
      endpoint: '/api/users',
      method: 'GET',
    })
    
    return NextResponse.json(
      errorResponse.error,
      { status: errorResponse.statusCode }
    )
  }
} 