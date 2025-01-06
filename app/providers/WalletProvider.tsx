'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface WalletContextType {
  isConnected: boolean
  isConnecting: boolean
  walletAddress: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  isConnecting: false,
  walletAddress: null,
  connect: async () => {},
  disconnect: async () => {}
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    // Check if wallet was previously connected
    const checkConnection = async () => {
      try {
        const phantom = window.phantom?.solana
        if (phantom && phantom.isConnected) {
          const response = await phantom.connect()
          setWalletAddress(response.publicKey.toString())
          setIsConnected(true)
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }

    checkConnection()
  }, [])

  const connect = async () => {
    try {
      setIsConnecting(true)
      const phantom = window.phantom?.solana
      
      if (!phantom) {
        toast.error('Please install Phantom wallet')
        return
      }

      const response = await phantom.connect()
      const address = response.publicKey.toString()
      
      setWalletAddress(address)
      setIsConnected(true)
      
      // Send wallet address to backend
      const authResponse = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      })

      if (!authResponse.ok) {
        throw new Error('Failed to authenticate wallet')
      }

      const userData = await authResponse.json()
      toast.success(`Welcome back, ${userData.username}!`)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
      setWalletAddress(null)
      setIsConnected(false)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = async () => {
    try {
      const phantom = window.phantom?.solana
      if (phantom) {
        await phantom.disconnect()
      }
      setWalletAddress(null)
      setIsConnected(false)
      toast.success('Wallet disconnected')
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
      toast.error('Failed to disconnect wallet')
    }
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        walletAddress,
        connect,
        disconnect
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
} 