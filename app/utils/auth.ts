'use client'

import { create } from 'zustand'

interface UserProfile {
  id: string
  username: string
  walletAddress: string
  createdAt: Date
  updatedAt: Date
}

interface AuthState {
  user: UserProfile | null
  isLoading: boolean
  error: string | null
  connect: () => Promise<UserProfile | null>
  disconnect: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  connect: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (!response.ok) {
        throw new Error('Authentication failed')
      }
      
      const user = await response.json()
      set({ user, isLoading: false })
      return user
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      return null
    }
  },
  disconnect: () => {
    set({ user: null, error: null })
  }
})) 