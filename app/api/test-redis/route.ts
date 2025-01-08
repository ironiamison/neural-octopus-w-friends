import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/redis'

export async function GET() {
  try {
    const result = await testConnection()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Redis test endpoint error:', error)
    return NextResponse.json({
      success: false,
      message: 'Redis connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 