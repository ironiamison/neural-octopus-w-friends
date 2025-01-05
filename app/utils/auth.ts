'use client'

import { create } from 'zustand'

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

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  connect: async () => {
    try {
      set({ isLoading: true, error: null })

      // Check if Phantom is installed
      const phantom = window.phantom?.solana
      if (!phantom) {
        throw new Error('Please install Phantom wallet')
      }

      // Connect to Phantom
      const response = await phantom.connect()
      const walletAddress = response.publicKey.toString()

      // Get or create user
      const userResponse = await fetch(`/api/auth?walletAddress=${walletAddress}`)
      
      if (userResponse.status === 404) {
        // Create new user
        const createResponse = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress })
        })

        if (!createResponse.ok) {
          throw new Error('Failed to create user')
        }

        const user = await createResponse.json()
        set({ user, isLoading: false })
      } else if (userResponse.ok) {
        const user = await userResponse.json()
        set({ user, isLoading: false })
      } else {
        throw new Error('Failed to fetch user data')
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  disconnect: async () => {
    try {
      set({ isLoading: true, error: null })

      // Disconnect from Phantom
      const phantom = window.phantom?.solana
      if (phantom) {
        await phantom.disconnect()
      }

      set({ user: null, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  }
})) 