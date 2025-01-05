import { NextResponse } from 'next/server'

interface LearningConfig {
  topic: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  format: 'text' | 'video' | 'interactive'
  userLevel: string
  preferredStyle: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const elizaResponse = await fetch('https://elizaos.github.io/eliza/api/learn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        config: {
          topic: body.topic,
          difficulty: body.difficulty,
          format: body.format,
          userLevel: body.userLevel,
          preferredStyle: body.preferredStyle,
          features: {
            adaptiveLearning: true,
            quizGeneration: true,
            practiceExercises: true,
            progressTracking: true
          }
        }
      })
    })

    if (!elizaResponse.ok) {
      throw new Error('Failed to generate learning content')
    }

    const data = await elizaResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in learning API:', error)
    return NextResponse.json(
      { error: 'Failed to generate learning content' },
      { status: 500 }
    )
  }
} 