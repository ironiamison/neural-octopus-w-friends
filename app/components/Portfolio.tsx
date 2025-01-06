'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/utils/auth'
import { useTradingStore } from '@/utils/trading'
import { LoadingContainer } from '@/components/ui/loading'
import { ErrorContainer, ErrorMessage } from '@/components/ui/error'
import { useWallet } from '@/providers/WalletProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown, ArrowUp } from 'lucide-react'

export default function Portfolio() {
  const { user, isLoading: isUserLoading } = useAuthStore()
  const { 
    positions, 
    closePosition, 
    startRealtimeUpdates, 
    stopRealtimeUpdates,
    lastUpdate 
  } = useTradingStore()

  useEffect(() => {
    if (user?.id) {
      startRealtimeUpdates()
      return () => stopRealtimeUpdates()
    }
  }, [user?.id])

  if (isUserLoading) {
    return (
      <LoadingContainer>
        <div className="text-lg text-gray-400">Loading portfolio...</div>
      </LoadingContainer>
    )
  }

  if (!user || !user.portfolio) {
    return (
      <ErrorContainer>
        <ErrorMessage message="Please connect your wallet to view your portfolio" />
      </ErrorContainer>
    )
  }

  const isWalletConnected = user.walletAddress !== null && user.walletAddress !== undefined
  const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0)
  const usedMargin = positions.reduce((sum, pos) => sum + pos.margin, 0)
  const availableBalance = user.portfolio.balance - usedMargin

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Portfolio</h1>
      
      <div className={`relative ${!isWalletConnected ? 'filter blur-sm' : ''}`}>
        {!isWalletConnected && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-[#1C2128] rounded-lg border border-[#30363D] p-4 text-white text-center">
              <p>Connect your wallet to view your portfolio</p>
            </div>
          </div>
        )}
        
        <div className="bg-[#1C2128] rounded-lg border border-[#30363D] p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-white">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-gray-400">Total Balance</div>
              <motion.div 
                key={lastUpdate}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold text-white"
              >
                ${(user.portfolio.balance + totalPnl).toLocaleString()}
              </motion.div>
            </div>
            <div>
              <div className="text-gray-400">Available Balance</div>
              <motion.div 
                key={lastUpdate}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold text-white"
              >
                ${availableBalance.toLocaleString()}
              </motion.div>
            </div>
            <div>
              <div className="text-gray-400">Total P&L</div>
              <motion.div 
                key={lastUpdate}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 0.3 }}
                className={`text-xl font-bold ${
                  totalPnl > 0 
                    ? 'text-green-500' 
                    : totalPnl < 0 
                      ? 'text-red-500' 
                      : 'text-gray-400'
                }`}
              >
                {totalPnl >= 0 ? '+' : ''}{totalPnl.toLocaleString()}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="bg-[#1C2128] rounded-lg border border-[#30363D]">
          <h2 className="text-lg font-semibold p-4 border-b border-[#30363D] text-white">Active Positions</h2>
          <div className="divide-y divide-[#30363D]">
            <AnimatePresence>
              {positions.map((position) => (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-4 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium text-white">{position.pair}</div>
                    <div className="text-sm text-gray-400">
                      {position.type === 'long' ? 'Long' : 'Short'} • ${position.size.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">
                      Entry: ${position.entryPrice.toFixed(4)}
                    </div>
                    <motion.div 
                      key={`${position.id}-${lastUpdate}`}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 0.3 }}
                      className="text-sm"
                    >
                      Current: ${position.currentPrice.toFixed(4)}
                      <span className="ml-2">
                        {position.currentPrice > position.entryPrice ? (
                          <ArrowUp className="inline w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDown className="inline w-4 h-4 text-red-500" />
                        )}
                      </span>
                    </motion.div>
                    <motion.div 
                      key={`${position.id}-pnl-${lastUpdate}`}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 0.3 }}
                      className={`text-sm ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}
                    >
                      PnL: {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(2)}%)
                    </motion.div>
                  </div>
                  <button
                    onClick={() => closePosition(position.id, position.currentPrice)}
                    disabled={!isWalletConnected}
                    className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Close
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {positions.length === 0 && (
              <div className="p-4 text-center text-gray-400">
                No active positions
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 