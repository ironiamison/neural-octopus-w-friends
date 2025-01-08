'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '../providers/WalletProvider'
import { motion } from 'framer-motion'

export default function WalletConnect() {
  const { isConnecting, connect } = useWallet()

  const handleClick = async () => {
    try {
      await connect()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-lg blur-lg" />
      <WalletMultiButton 
        onClick={handleClick}
        className={`
          !bg-[#1E222D] !hover:bg-[#1E222D]/80 !transition-colors !duration-200 !rounded-lg !h-[46px]
          ${isConnecting ? 'opacity-75 cursor-not-allowed' : ''}
        `}
      >
        {isConnecting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Connecting...</span>
          </div>
        ) : null}
      </WalletMultiButton>
    </motion.div>
  )
} 