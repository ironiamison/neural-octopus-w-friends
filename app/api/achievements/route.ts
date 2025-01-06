import { NextResponse } from 'next/server'
import prisma from '@/lib/mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }

    const achievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' }
    })

    return NextResponse.json(achievements)
  } catch (error: any) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, type, name, description, xpReward } = await request.json()

    if (!userId || !type || !name || !description || !xpReward) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if achievement already exists
    const existingAchievement = await prisma.achievement.findFirst({
      where: {
        userId,
        type
      }
    })

    if (existingAchievement) {
      return NextResponse.json({ error: 'Achievement already unlocked' }, { status: 400 })
    }

    // Create achievement and update user XP in transaction
    const [achievement, user] = await prisma.$transaction([
      prisma.achievement.create({
        data: {
          userId,
          type,
          name,
          description,
          xpReward
        }
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          totalXp: {
            increment: xpReward
          }
        }
      })
    ])

    return NextResponse.json({ achievement, totalXp: user.totalXp })
  } catch (error: any) {
    console.error('Error creating achievement:', error)
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 })
  }
} 