'use client'

import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

interface Portfolio {
  id: string
  userId: string
  balance: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface User {
  id: string
  walletAddress: string
  username: string
  portfolio: Portfolio | null
  totalXp: number
  currentLevel: number
  createdAt: Date
  updatedAt: Date
}

interface LeaderboardEntry {
  rank: number
  id: string
  username: string
  walletAddress: string
  totalXp: number
  currentLevel: number
  balance: number
  createdAt: Date
  updatedAt: Date
}

export async function createUser(walletAddress: string) {
  try {
    const user = await prisma.user.create({
      data: {
        walletAddress,
        username: `trader_${Math.random().toString(36).substring(2, 8)}`,
        portfolio: {
          create: {
            balance: 10000, // Starting balance
          },
        },
      },
      include: {
        portfolio: true,
      },
    })
    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export async function updateUser(walletAddress: string, updates: Prisma.UserUpdateInput) {
  try {
    return await prisma.user.update({
      where: { walletAddress },
      data: updates,
      include: {
        portfolio: true,
      },
    })
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export async function getUserByWallet(walletAddress: string) {
  try {
    return await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        portfolio: true,
      },
    })
  } catch (error) {
    console.error('Error getting user:', error)
    throw error
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const users = await prisma.user.findMany({
      include: {
        portfolio: true,
      },
      orderBy: {
        totalXp: 'desc',
      },
      take: 100,
      where: {
        username: {
          not: null,
        },
      },
    })

    return users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username!,
      walletAddress: user.walletAddress,
      totalXp: user.totalXp,
      currentLevel: user.currentLevel,
      balance: user.portfolio?.balance || 0,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    throw error
  }
} 