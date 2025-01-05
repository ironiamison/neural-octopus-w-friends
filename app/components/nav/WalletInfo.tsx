'use client'

import { useWallet } from '@/app/providers/WalletProvider'
import { Button } from '@/app/components/ui/button'
import { Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import UserProfile from './UserProfile'

export default function WalletInfo() {
  const { connect, disconnect, isConnected, isConnecting, walletAddress } = useWallet()

  const shortenAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div>
      {isConnected ? (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          {/* Wallet Address */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2A2D35]/50">
              <Wallet className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">
                {shortenAddress(walletAddress || '')}
              </span>
            </div>
          </div>

          {/* User Profile Data */}
          <UserProfile />

          {/* Disconnect Button */}
          <div className="px-4 py-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
              onClick={disconnect}
            >
              Disconnect
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="px-4 py-3">
          <Button
            className="w-full justify-start gap-2 bg-blue-500 hover:bg-blue-400 text-white"
            onClick={connect}
            disabled={isConnecting}
          >
            <Wallet className="h-4 w-4" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </div>
      )}
    </div>
  )
} 