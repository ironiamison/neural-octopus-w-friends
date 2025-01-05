import { NextResponse } from 'next/server'
import { createUser, updateUser, getUserByWallet } from '@/app/utils/userStore'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { walletAddress, ...updates } = data

    let user

    if (walletAddress) {
      // Find or create user by wallet address
      user = getUserByWallet(walletAddress) || createUser(walletAddress)
      if (Object.keys(updates).length > 0) {
        user = updateUser(walletAddress, updates)
      }
    }

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error in users API:', error)
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

    const user = getUserByWallet(walletAddress)
    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error in users API:', error)
    return new NextResponse(error.message, { status: 500 })
  }
} 