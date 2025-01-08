'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '../../providers/WalletProvider'

interface User {
  id: string
  address: string
}

export function useAuth() {
  const { walletAddress, isConnected } = useWallet()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isConnected && walletAddress) {
      setUser({
        id: walletAddress,
        address: walletAddress
      })
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }, [isConnected, walletAddress])

  return {
    user,
    isLoading
  }
} 