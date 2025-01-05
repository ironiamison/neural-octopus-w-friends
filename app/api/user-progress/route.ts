import { NextResponse } from 'next/server'
import { getUserProgress, updateUserXP, completeAchievement, updateSkillProgress } from '../../utils/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const userProgress = await getUserProgress(userId)
    return NextResponse.json(userProgress)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user progress' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, action, data } = body

    if (!userId || !action) {
      return NextResponse.json({ error: 'User ID and action are required' }, { status: 400 })
    }

    let result

    switch (action) {
      case 'UPDATE_XP':
        result = await updateUserXP(userId, data.xp)
        break
      case 'COMPLETE_ACHIEVEMENT':
        result = await completeAchievement(userId, data.achievementId)
        break
      case 'UPDATE_SKILL':
        result = await updateSkillProgress(userId, data.skillName, data.progress)
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user progress' }, { status: 500 })
  }
} 