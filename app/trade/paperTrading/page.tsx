'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../utils/auth'
import PaperTrading from '../../components/PaperTrading'
import TradingInterface from '../../components/TradingInterface'
import ClientOnly from '../../components/ClientOnly'

export default function PaperTradingPage() {
  const router = useRouter()
  const { publicKey } = useWallet()
  const { user } = useAuthStore()

  // Redirect to trade page if wallet is not connected
  useEffect(() => {
    if (!publicKey) {
      router.push('/trade')
    }
  }, [publicKey, router])

  if (!publicKey || !user) {
    return null
  }

  return (
    <ClientOnly>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="space-y-8">
          {/* User Stats */}
          <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-md border border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Available Balance</h3>
                <p className="text-2xl font-bold text-white">${user.balance?.toLocaleString() ?? '0.00'}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Total XP</h3>
                <p className="text-2xl font-bold text-white">{user.totalXp?.toLocaleString() ?? '0'} XP</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Current Level</h3>
                <p className="text-2xl font-bold text-white">Level {user.currentLevel ?? '1'}</p>
              </div>
            </div>
          </div>

          {/* Trading Interface */}
          <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-md border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6">Paper Trading</h2>
            <TradingInterface />
          </div>

          {/* Trading Chart and Positions */}
          <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-md border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6">Positions & Analytics</h2>
            <PaperTrading />
          </div>
        </div>
      </motion.div>
    </ClientOnly>
  )
} 