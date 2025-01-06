import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { walletAddress } = await request.json()
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { walletAddress }
    })

    // If user doesn't exist, create new one
    if (!user) {
      const username = `trader_${Math.random().toString(36).substring(2, 8)}`
      user = await prisma.user.create({
        data: {
          walletAddress,
          username,
          totalXp: 0,
          currentLevel: 1
        }
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
} 