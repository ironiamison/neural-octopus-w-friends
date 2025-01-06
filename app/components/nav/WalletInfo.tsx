'use client'

import { useWallet } from '@/providers/WalletProvider'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/utils/auth'
import { useEffect } from 'react'

export default function WalletInfo() {
  const { isConnected, isConnecting, walletAddress, disconnect } = useWallet()
  const { connect } = useAuthStore()

  useEffect(() => {
    if (walletAddress) {
      connect()
    }
  }, [walletAddress])

  const shortenAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 z-50">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-center">
        {isConnected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
              <Wallet className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">
                {shortenAddress(walletAddress || '')}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={disconnect}
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
            >
              Disconnect
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              onClick={() => connect()}
              disabled={isConnecting}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isConnecting ? (
                <>Connecting...</>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
} 