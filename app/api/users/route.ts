import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Use a single instance of Prisma Client in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { walletAddress, username } = data

    console.log('Received data:', data);

    if (!walletAddress) {
      return new NextResponse('Wallet address is required', { status: 400 })
    }

    if (!username) {
      return new NextResponse('Username is required', { status: 400 });
    }

    if (username) {
      console.log('Checking username:', username);
      const existingUser = await prisma.user.findFirst({
        where: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      });
      console.log('Existing user:', existingUser);
      if (existingUser) {
        return new NextResponse('Username is already taken', { status: 400 });
      }
    }

    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        portfolio: true,
        achievements: true,
        trades: {
          orderBy: {
            openedAt: 'desc'
          },
          take: 5
        }
      },
    })

    // If user doesn't exist, create new user with portfolio
    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress,
          username,
          portfolio: {
            create: {
              balance: 10000, // Starting balance
            },
          },
        },
        include: {
          portfolio: true,
          achievements: true,
          trades: {
            orderBy: {
              openedAt: 'desc'
            },
            take: 5
          }
        },
      })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error in users API:', error)
    return new NextResponse(
      error.message || 'Internal Server Error', 
      { status: error.status || 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return new NextResponse('Wallet address is required', { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        portfolio: true,
        achievements: true,
        trades: {
          orderBy: {
            openedAt: 'desc'
          },
          take: 5
        }
      },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error in users API:', error)
    return new NextResponse(
      error.message || 'Internal Server Error', 
      { status: error.status || 500 }
    )
  }
} 