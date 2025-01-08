import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import type { Tournament, TournamentRule, TournamentReward, TournamentParticipant, Prisma } from '@prisma/client'

type TournamentWithRelations = Prisma.TournamentGetPayload<{
  include: {
    participants: true
    rules: true
    rewards: true
  }
}>

// Input validation schema for creating a tournament
const createTournamentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().datetime({ message: 'Invalid start date' }),
  endDate: z.string().datetime({ message: 'Invalid end date' }),
  maxParticipants: z.number().min(2, 'Minimum 2 participants required'),
  prizePool: z.string().min(1, 'Prize pool is required'),
  entryFee: z.string().min(1, 'Entry fee is required'),
  rules: z.array(z.string()).min(1, 'At least one rule is required'),
  rewards: z.array(z.object({
    position: z.string(),
    prize: z.string()
  })).min(1, 'At least one reward is required')
})

// Get all tournaments
export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        participants: true,
        rewards: true,
        rules: true
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    // Transform the data to match the frontend interface
    const formattedTournaments = tournaments.map((tournament: TournamentWithRelations) => ({
      id: tournament.id,
      title: tournament.title,
      description: tournament.description,
      status: tournament.status,
      startDate: tournament.startDate.toISOString(),
      endDate: tournament.endDate.toISOString(),
      participants: tournament.participants.length,
      maxParticipants: tournament.maxParticipants,
      prizePool: tournament.prizePool,
      entryFee: tournament.entryFee,
      rules: tournament.rules.map((rule: TournamentRule) => rule.description),
      rewards: tournament.rewards.map((reward: TournamentReward) => ({
        position: reward.position,
        prize: reward.prize
      }))
    }))

    return NextResponse.json(formattedTournaments)
  } catch (error: any) {
    console.error('Error fetching tournaments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
      { status: 500 }
    )
  }
}

// Create a new tournament
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = createTournamentSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid tournament data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { title, description, startDate, endDate, maxParticipants, prizePool, entryFee, rules, rewards } = validationResult.data

    // Calculate status based on dates
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    let status: 'upcoming' | 'ongoing' | 'completed'
    if (now < start) {
      status = 'upcoming'
    } else if (now >= start && now <= end) {
      status = 'ongoing'
    } else {
      status = 'completed'
    }

    // Create tournament with related data in a transaction
    const tournament = await prisma.$transaction(async (tx) => {
      // Create the tournament
      const newTournament = await prisma.tournament.create({
        data: {
          title,
          description,
          status,
          startDate: start,
          endDate: end,
          maxParticipants,
          prizePool,
          entryFee,
          // Create rules
          rules: {
            create: rules.map(rule => ({
              description: rule
            }))
          },
          // Create rewards
          rewards: {
            create: rewards.map(reward => ({
              position: reward.position,
              prize: reward.prize
            }))
          }
        },
        include: {
          rules: true,
          rewards: true
        }
      })

      return newTournament
    })

    return NextResponse.json(tournament)
  } catch (error: any) {
    console.error('Error creating tournament:', error)
    return NextResponse.json(
      { error: 'Failed to create tournament' },
      { status: 500 }
    )
  }
} 