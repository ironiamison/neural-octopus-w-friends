'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'

interface WalletContextType {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  isConnected: boolean
  isConnecting: boolean
  isPhantomInstalled: boolean
  walletAddress: string | null
}

const WalletContext = createContext<WalletContextType>({
  connect: async () => {},
  disconnect: async () => {},
  isConnected: false,
  isConnecting: false,
  isPhantomInstalled: false,
  walletAddress: null,
})

export const useWallet = () => useContext(WalletContext)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  function generateRandomUsername() {
    const adjectives = ["Swift", "Clever", "Brave", "Mighty"];
    const animals = ["Lion", "Eagle", "Shark", "Wolf"];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    return `${randomAdjective}${randomAnimal}${Math.floor(Math.random() * 1000)}`;
  }

  // Create or get user profile
  const handleUserProfile = async (address: string) => {
    try {
      const username = generateRandomUsername();
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          username
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to create/get user profile')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error handling user profile:', error)
      toast.error('Failed to create user profile. Please try again.')
      throw error
    }
  }

  useEffect(() => {
    const checkPhantom = async () => {
      // @ts-ignore
      const isPhantom = window?.phantom?.solana?.isPhantom
      setIsPhantomInstalled(!!isPhantom)

      // Try to auto-connect if previously connected
      if (isPhantom) {
        try {
          // @ts-ignore
          const { solana } = window.phantom
          if (solana.isConnected) {
            const response = await solana.connect({ onlyIfTrusted: true })
            const address = response.publicKey.toString()
            await handleUserProfile(address)
            setWalletAddress(address)
            setIsConnected(true)
            toast.success('Wallet reconnected successfully')
          }
        } catch (error) {
          console.error('Auto-connect error:', error)
        }
      }
    }
    checkPhantom()

    // Set up wallet change listeners
    const handleWalletChange = () => {
      checkPhantom()
    }
    window.addEventListener('load', handleWalletChange)
    return () => {
      window.removeEventListener('load', handleWalletChange)
    }
  }, [])

  // Set up connection event listeners
  useEffect(() => {
    if (!isPhantomInstalled) return

    // @ts-ignore
    const { solana } = window.phantom

    const handleConnect = async (publicKey: any) => {
      try {
        const address = publicKey.toString()
        await handleUserProfile(address)
        setWalletAddress(address)
        setIsConnected(true)
        setIsConnecting(false)
        toast.success('Wallet connected successfully')
      } catch (error) {
        console.error('Connection error:', error)
        setIsConnected(false)
        setWalletAddress(null)
        setIsConnecting(false)
        toast.error('Failed to connect wallet. Please try again.')
      }
    }

    const handleDisconnect = () => {
      setWalletAddress(null)
      setIsConnected(false)
      toast.info('Wallet disconnected')
    }

    solana.on('connect', handleConnect)
    solana.on('disconnect', handleDisconnect)

    return () => {
      solana.off('connect', handleConnect)
      solana.off('disconnect', handleDisconnect)
    }
  }, [isPhantomInstalled])

  const connect = async () => {
    try {
      setIsConnecting(true)
      // @ts-ignore
      const { solana } = window.phantom

      const response = await solana.connect()
      const address = response.publicKey.toString()
      await handleUserProfile(address)
      setWalletAddress(address)
      setIsConnected(true)
      toast.success('Wallet connected successfully')
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error)
      setIsConnected(false)
      setWalletAddress(null)
      toast.error('Failed to connect wallet. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = async () => {
    try {
      // @ts-ignore
      const { solana } = window.phantom
      await solana.disconnect()
      setWalletAddress(null)
      setIsConnected(false)
      toast.info('Wallet disconnected')
    } catch (error) {
      console.error('Error disconnecting from Phantom wallet:', error)
      toast.error('Failed to disconnect wallet. Please try again.')
    }
  }

  return (
    <WalletContext.Provider
      value={{
        connect,
        disconnect,
        isConnected,
        isConnecting,
        isPhantomInstalled,
        walletAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
} 