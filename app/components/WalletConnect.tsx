'use client'

import { useWallet } from '../providers/WalletProvider'
import { motion } from 'framer-motion'

export default function WalletConnect() {
  const { connect, disconnect, isConnected, walletAddress } = useWallet()

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={isConnected ? disconnect : connect}
      className="px-6 py-3 bg-[#1E222D] text-white font-medium rounded-lg hover:bg-[#1E222D]/80 transition-colors duration-200"
    >
      {isConnected ? (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
        </span>
      ) : (
        'Connect Wallet'
      )}
    </motion.button>
  )
} 