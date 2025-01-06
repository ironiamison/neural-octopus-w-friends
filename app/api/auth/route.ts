import { NextResponse } from 'next/server'
import prisma from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return new NextResponse('Wallet address is required', { status: 400 })
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        portfolio: true
      }
    })

    if (!user) {
      // Create new user with portfolio
      user = await prisma.user.create({
        data: {
          walletAddress,
          portfolio: {
            create: {
              balance: 10000
            }
          }
        },
        include: {
          portfolio: true
        }
      })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error in auth API:', error)
    return new NextResponse(error.message, { status: 500 })
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
        positions: {
          orderBy: { openedAt: 'desc' },
          take: 10
        }
      }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error in auth API:', error)
    return new NextResponse(error.message, { status: 500 })
  }
} 