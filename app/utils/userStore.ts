'use client'

import { prisma } from './db'

interface Portfolio {
  tokenAddress: string
  amount: number
  value: number
}

interface User {
  id: string
  walletAddress: string
  balance: number
  portfolio: Portfolio[]
  totalXp: number
  currentLevel: number
  createdAt: Date
  updatedAt: Date
}

export async function createUser(walletAddress: string): Promise<User> {
  return prisma.user.create({
    data: {
      walletAddress,
      balance: 10000, // Starting balance
      portfolio: [],
      totalXp: 0,
      currentLevel: 1,
    }
  })
}

export async function updateUser(walletAddress: string, updates: Partial<User>) {
  return prisma.user.update({
    where: { walletAddress },
    data: {
      ...updates,
      updatedAt: new Date()
    }
  })
}

export async function getUserByWallet(walletAddress: string) {
  return prisma.user.findUnique({
    where: { walletAddress },
    include: {
      achievements: true,
      positions: true,
      tradeHistory: true
    }
  })
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      achievements: true,
      positions: true,
      tradeHistory: true
    }
  })
}

export async function getLeaderboard() {
  const users = await prisma.user.findMany({
    orderBy: {
      balance: 'desc'
    },
    select: {
      id: true,
      walletAddress: true,
      balance: true,
      totalXp: true,
      currentLevel: true
    },
    take: 100
  })

  return users.map((user, index) => ({
    rank: index + 1,
    ...user
  }))
}

export async function updateUserBalance(walletAddress: string, amount: number) {
  return prisma.user.update({
    where: { walletAddress },
    data: {
      balance: { increment: amount },
      updatedAt: new Date()
    }
  })
}

export async function addToPortfolio(walletAddress: string, tokenAddress: string, amount: number, value: number) {
  const user = await getUserByWallet(walletAddress)
  if (!user) throw new Error('User not found')

  const portfolio = [...(user.portfolio as Portfolio[])]
  const existingToken = portfolio.find(t => t.tokenAddress === tokenAddress)

  if (existingToken) {
    existingToken.amount += amount
    existingToken.value += value
  } else {
    portfolio.push({ tokenAddress, amount, value })
  }

  return updateUser(walletAddress, { portfolio })
}

export async function removeFromPortfolio(walletAddress: string, tokenAddress: string, amount: number, value: number) {
  const user = await getUserByWallet(walletAddress)
  if (!user) throw new Error('User not found')

  const portfolio = [...(user.portfolio as Portfolio[])]
  const tokenIndex = portfolio.findIndex(t => t.tokenAddress === tokenAddress)

  if (tokenIndex === -1) throw new Error('Token not found in portfolio')

  const token = portfolio[tokenIndex]
  if (token.amount < amount) throw new Error('Insufficient token balance')

  token.amount -= amount
  token.value -= value

  if (token.amount === 0) {
    portfolio.splice(tokenIndex, 1)
  }

  return updateUser(walletAddress, { portfolio })
} 