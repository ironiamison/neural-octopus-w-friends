import { NextResponse } from 'next/server'
import { getLeaderboard } from '@/app/utils/userStore'

export async function GET() {
  try {
    const leaderboard = getLeaderboard()
    return NextResponse.json(leaderboard)
  } catch (error: any) {
    console.error('Error in leaderboard API:', error)
    return new NextResponse(error.message, { status: 500 })
  }
} 