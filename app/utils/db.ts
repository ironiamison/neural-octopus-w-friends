import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getUserProgress(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      achievements: true,
      skillProgress: true,
    },
  })
}

export async function updateUserXP(userId: string, xpToAdd: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) throw new Error('User not found')

  // Calculate new level based on XP
  const newTotalXp = user.totalXp + xpToAdd
  const newLevel = Math.floor(newTotalXp / 10000) + 1 // Simple level calculation

  return prisma.user.update({
    where: { id: userId },
    data: {
      totalXp: newTotalXp,
      currentLevel: newLevel,
    },
  })
}

export async function completeAchievement(userId: string, achievementId: string) {
  const achievement = await prisma.achievement.findFirst({
    where: { id: achievementId, userId: userId },
  })

  if (!achievement) throw new Error('Achievement not found')

  // Update achievement and user XP in a transaction
  return prisma.$transaction([
    prisma.achievement.update({
      where: { id: achievementId },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    }),
    updateUserXP(userId, achievement.xpReward),
  ])
}

export async function updateSkillProgress(
  userId: string,
  skillName: string,
  newProgress: number
) {
  return prisma.skillProgress.upsert({
    where: {
      userId_skillName: {
        userId: userId,
        skillName: skillName,
      },
    },
    update: {
      progress: newProgress,
    },
    create: {
      userId: userId,
      skillName: skillName,
      progress: newProgress,
    },
  })
}

export async function initializeUserAchievements(userId: string) {
  const defaultAchievements = [
    {
      name: "First Blood",
      description: "Make your first profitable trade",
      category: "Basics",
      xpReward: 100,
    },
    {
      name: "Diamond Hands",
      description: "Hold a position for 24 hours",
      category: "Basics",
      xpReward: 200,
    },
    {
      name: "To The Moon",
      description: "Achieve 100% profit on a single trade",
      category: "Basics",
      xpReward: 500,
    },
    {
      name: "Trend Rider",
      description: "Successfully trade with the trend 5 times",
      category: "Advanced",
      xpReward: 300,
    },
    {
      name: "Pattern Master",
      description: "Profit from 3 chart pattern trades",
      category: "Advanced",
      xpReward: 400,
    },
    {
      name: "Risk Manager",
      description: "Maintain positive risk-reward for 10 trades",
      category: "Advanced",
      xpReward: 600,
    },
    {
      name: "Market Wizard",
      description: "Achieve 1000% portfolio growth",
      category: "Expert",
      xpReward: 1000,
    },
    {
      name: "Trading Legend",
      description: "Complete all basic and advanced achievements",
      category: "Expert",
      xpReward: 2000,
    },
    {
      name: "Neural Master",
      description: "Successfully use AI predictions in 50 trades",
      category: "Expert",
      xpReward: 1500,
    },
  ]

  const achievements = await Promise.all(
    defaultAchievements.map((achievement) =>
      prisma.achievement.create({
        data: {
          ...achievement,
          userId: userId,
        },
      })
    )
  )

  return achievements
} 