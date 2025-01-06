'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/utils/auth'
import { useTradingStore } from '@/utils/trading'
import { LoadingContainer } from '@/components/ui/loading'
import { useWallet } from '@/providers/WalletProvider'

export default function TradingInterface() {
  const { user } = useAuthStore()
  const { walletAddress } = useWallet()
  const { 
    isLoading,
    hasLoadedInitially,
    fetchPositions,
    startRealtimeUpdates,
    stopRealtimeUpdates,
    setHasLoadedInitially
  } = useTradingStore()

  useEffect(() => {
    if (user?.id && walletAddress && !hasLoadedInitially[walletAddress]) {
      fetchPositions(user.id).then(() => {
        setHasLoadedInitially(walletAddress)
      })
    }
    
    if (user?.id) {
      startRealtimeUpdates()
      return () => stopRealtimeUpdates()
    }
  }, [user?.id, walletAddress])

  if (isLoading && !hasLoadedInitially[walletAddress]) {
    return (
      <LoadingContainer>
        <div className="text-lg text-gray-400">Loading trading data...</div>
      </LoadingContainer>
    )
  }

  // Rest of your trading interface code...
} 