'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { motion } from 'framer-motion'
import TradingInterface from '../components/TradingInterface'
import WalletConnect from '../components/WalletConnect'
import ClientOnly from '../components/ClientOnly'

export default function TradePage() {
  const { publicKey } = useWallet()

  return (
    <ClientOnly>
      <div className="container mx-auto px-4 py-8">
        {publicKey ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TradingInterface />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center min-h-[600px] bg-gray-800 rounded-lg p-8"
          >
            <h1 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
            <p className="text-gray-400 text-center mb-8 max-w-md">
              Connect your wallet to start paper trading with AI16Z, Fartcoin, and GOAT tokens.
              Experience risk-free trading and earn achievements as you learn.
            </p>
            <WalletConnect />
          </motion.div>
        )}
      </div>
    </ClientOnly>
  )
} 