'use client'

import { useWallet } from '@/providers/WalletProvider'
import { Button } from './ui/button'
import { motion } from 'framer-motion'

export function WalletStatus() {
  const { walletAddress, isConnecting, isConnected, balance, connect, disconnect, error } = useWallet()

  return (
    <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          {isConnected && (
            <motion.button
              onClick={disconnect}
              className="text-sm text-red-400 hover:text-red-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Disconnect
            </motion.button>
          )}
        </div>

        {/* Wallet Address */}
        {isConnected && walletAddress && (
          <div className="p-3 bg-gray-900/50 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">Wallet Address</div>
            <div className="font-mono text-sm text-gray-300 break-all">
              {walletAddress}
            </div>
          </div>
        )}

        {/* Balance */}
        {isConnected && (
          <div className="p-3 bg-gray-900/50 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">Paper Trading Balance</div>
            <div className="text-xl font-bold text-white">
              ${balance.toLocaleString()}
            </div>
          </div>
        )}

        {/* Connect Button */}
        {!isConnected && (
          <Button
            onClick={connect}
            isLoading={isConnecting}
            className="w-full"
          >
            Connect Wallet
          </Button>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-400 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  )
} 