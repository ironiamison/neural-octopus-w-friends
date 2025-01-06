'use client'

import { create } from 'zustand'

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

      console.log('Wallet connected:', walletAddress) // Debug log

      // First try to fetch existing user
      const userResponse = await fetch(`/api/users?walletAddress=${walletAddress}`)
      
      if (userResponse.ok) {
        // Existing user found
        const user = await userResponse.json()
        console.log('Existing user found:', user) // Debug log
        set({ user, isLoading: false })
        return
      }
      
      // If user doesn't exist, create new one with generated username
      const username = `trader_${Math.random().toString(36).substring(2, 8)}`
      const createResponse = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, username })
      })

      if (!createResponse.ok) {
        throw new Error('Failed to create user')
      }

      const newUser = await createResponse.json()
      console.log('New user created:', newUser) // Debug log
      set({ user: newUser, isLoading: false })
    } catch (error: any) {
      console.error('Error connecting wallet:', error) // Debug log
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