'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { TradingError, ERROR_CODES, handleError } from '../lib/utils/errorHandling'

interface WalletContextType {
  walletAddress: string | null
  isConnecting: boolean
  isConnected: boolean
  balance: number
  connect: () => Promise<void>
  disconnect: () => void
  error: TradingError | null
}

const WalletContext = createContext<WalletContextType>({
  walletAddress: null,
  isConnecting: false,
  isConnected: false,
  balance: 10000,
  connect: async () => {},
  disconnect: () => {},
  error: null
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState(10000)
  const [error, setError] = useState<TradingError | null>(null)

  // Check for existing connection on mount
  useEffect(() => {
    try {
      const savedAddress = localStorage.getItem('walletAddress')
      const savedBalance = localStorage.getItem('paperBalance')
      
      if (savedAddress) {
        setWalletAddress(savedAddress)
        setIsConnected(true)
      }
      
      if (savedBalance) {
        const parsedBalance = Number(savedBalance)
        if (isNaN(parsedBalance)) {
          throw new TradingError(
            'Invalid saved balance',
            ERROR_CODES.WALLET_CONNECTION,
            'medium',
            'Could not restore previous balance. Starting with default.'
          )
        }
        setBalance(parsedBalance)
      }
    } catch (err) {
      const error = handleError(err, 'WalletProvider:init')
      setError(error)
      // Reset to default state
      setWalletAddress(null)
      setIsConnected(false)
      setBalance(10000)
    }
  }, [])

  const connect = async () => {
    try {
      setIsConnecting(true)
      setError(null)

      // Validate localStorage availability
      if (!window.localStorage) {
        throw new TradingError(
          'localStorage not available',
          ERROR_CODES.WALLET_CONNECTION,
          'high',
          'Browser storage is not available. Please enable cookies.'
        )
      }

      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate a random wallet address for simulation
      const simulatedAddress = Array.from({length: 32}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')

      // Validate address format
      if (!/^[0-9a-f]{32}$/.test(simulatedAddress)) {
        throw new TradingError(
          'Invalid wallet address format',
          ERROR_CODES.WALLET_CONNECTION,
          'high',
          'Failed to generate valid wallet address.'
        )
      }

      setWalletAddress(simulatedAddress)
      setIsConnected(true)
      
      // Save to localStorage
      try {
        localStorage.setItem('walletAddress', simulatedAddress)
        localStorage.setItem('paperBalance', balance.toString())
      } catch (storageErr) {
        throw new TradingError(
          'Failed to save wallet data',
          ERROR_CODES.WALLET_CONNECTION,
          'medium',
          'Could not save wallet data. Your session may not persist.'
        )
      }

      // Show success toast
      ;(window as any).showToast?.({
        type: 'success',
        message: 'Wallet connected successfully!',
        duration: 3000
      })

    } catch (err) {
      const error = handleError(err, 'WalletProvider:connect')
      setError(error)
      // Show error toast
      ;(window as any).showToast?.({
        type: 'error',
        message: error.userMessage || 'Failed to connect wallet',
        duration: 5000
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    try {
      setWalletAddress(null)
      setIsConnected(false)
      setBalance(10000)
      setError(null)
      
      // Clear localStorage
      localStorage.removeItem('walletAddress')
      localStorage.removeItem('paperBalance')
      
      // Show success toast
      ;(window as any).showToast?.({
        type: 'info',
        message: 'Wallet disconnected',
        duration: 3000
      })
    } catch (err) {
      const error = handleError(err, 'WalletProvider:disconnect')
      setError(error)
      // Show error toast
      ;(window as any).showToast?.({
        type: 'error',
        message: error.userMessage || 'Failed to disconnect wallet properly',
        duration: 5000
      })
    }
  }

  // Save balance changes to localStorage
  useEffect(() => {
    if (isConnected) {
      try {
        localStorage.setItem('paperBalance', balance.toString())
      } catch (err) {
        const error = handleError(err, 'WalletProvider:saveBalance')
        setError(error)
        // Show error toast
        ;(window as any).showToast?.({
          type: 'warning',
          message: 'Failed to save balance. Your session may not persist.',
          duration: 5000
        })
      }
    }
  }, [balance, isConnected])

  return (
    <WalletContext.Provider 
      value={{ 
        walletAddress, 
        isConnecting, 
        isConnected,
        balance,
        connect, 
        disconnect,
        error
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext) 