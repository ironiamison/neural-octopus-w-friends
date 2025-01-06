import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Achievement {
  id: string
  userId: string
  type: string
  name: string
  description: string
  xpReward: number
  unlockedAt: string
}

interface AchievementsState {
  achievements: Achievement[]
  isLoading: boolean
  error: string | null
}

interface AchievementsActions {
  fetchAchievements: (userId: string) => Promise<void>
  unlockAchievement: (params: {
    userId: string
    type: string
    name: string
    description: string
    xpReward: number
  }) => Promise<void>
}

type AchievementsStore = AchievementsState & AchievementsActions

export const useAchievementsStore = create<AchievementsStore>()(
  persist(
    (set) => ({
      // State
      achievements: [],
      isLoading: false,
      error: null,

      // Actions
      fetchAchievements: async (userId: string) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await fetch(`/api/achievements?userId=${userId}`)
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to fetch achievements')
          }
          
          const achievements = await response.json()
          set({ achievements, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      unlockAchievement: async ({ userId, type, name, description, xpReward }) => {
        try {
          set({ isLoading: true, error: null })

          const response = await fetch('/api/achievements', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId,
              type,
              name,
              description,
              xpReward
            })
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to unlock achievement')
          }

          const { achievement } = await response.json()

          set(state => ({
            achievements: [...state.achievements, achievement],
            isLoading: false
          }))

          return achievement
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      }
    }),
    {
      name: 'achievements-store'
    }
  )
) 