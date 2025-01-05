import { NextResponse } from 'next/server'
import prisma from '@/app/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { email, walletAddress } = await request.json()

    if (!email) {
      return new NextResponse('Email is required', { status: 400 })
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        portfolio: true
      }
    })

    if (!user) {
      // Create new user with inactive portfolio
      user = await prisma.user.create({
        data: {
          email,
          walletAddress,
          portfolio: {
            create: {
              balance: 10000,
              positions: [],
              isActive: !!walletAddress
            }
          }
        },
        include: {
          portfolio: true
        }
      })
    } else if (walletAddress && !user.walletAddress) {
      // Update existing user with wallet address and activate portfolio
      user = await prisma.user.update({
        where: { email },
        data: {
          walletAddress,
          portfolio: {
            update: {
              isActive: true
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
    const email = searchParams.get('email')
    const walletAddress = searchParams.get('walletAddress')

    if (!email && !walletAddress) {
      return new NextResponse('Email or wallet address is required', { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: email ? { email } : { walletAddress: walletAddress! },
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

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error in auth API:', error)
    return new NextResponse(error.message, { status: 500 })
  }
} 