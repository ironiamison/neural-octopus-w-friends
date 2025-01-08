import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registrationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  tournamentId: z.string().min(1, 'Tournament ID is required')
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = registrationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid registration data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { userId, tournamentId } = validationResult.data

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if tournament exists and is open for registration
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        participants: true
      }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      )
    }

    // Check if tournament is upcoming
    if (tournament.status !== 'upcoming') {
      return NextResponse.json(
        { error: 'Tournament is not open for registration' },
        { status: 400 }
      )
    }

    // Check if tournament is full
    if (tournament.participants.length >= tournament.maxParticipants) {
      return NextResponse.json(
        { error: 'Tournament is full' },
        { status: 400 }
      )
    }

    // Check if user is already registered
    const existingRegistration = tournament.participants.find(p => p.userId === userId)
    if (existingRegistration) {
      return NextResponse.json(
        { error: 'User is already registered for this tournament' },
        { status: 400 }
      )
    }

    // Register user for tournament
    const registration = await prisma.tournamentParticipant.create({
      data: {
        userId,
        tournamentId,
        registeredAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      registration
    })
  } catch (error: any) {
    console.error('Error registering for tournament:', error)
    return NextResponse.json(
      { error: 'Failed to register for tournament' },
      { status: 500 }
    )
  }
} 