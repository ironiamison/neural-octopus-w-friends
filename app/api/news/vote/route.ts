import { NextResponse } from 'next/server'

type VoteType = 'up' | 'down'
type VoteCounts = { up: number; down: number }

// In a real app, this would be stored in a database
let votes: Record<string, VoteCounts> = {}

export async function POST(request: Request) {
  try {
    const { url, voteType } = await request.json()
    
    if (!url || !voteType || !['up', 'down'].includes(voteType)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request parameters' 
      }, { status: 400 })
    }

    // Initialize votes for this URL if not exists
    if (!votes[url]) {
      votes[url] = { up: 0, down: 0 }
    }

    // Increment vote count
    votes[url][voteType as VoteType]++

    return NextResponse.json({
      success: true,
      data: votes[url]
    })

  } catch (error) {
    console.error('Error in vote API:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process vote'
    }, { status: 500 })
  }
} 