'use client'

import { useAuthStore } from '../utils/auth'
import { useTradingStore } from '../utils/paperTrading'
import { ErrorMessage, ErrorContainer } from './ui/error'
import { LoadingContainer } from './ui/loading'

export default function Portfolio() {
  const { user, isLoading: isUserLoading } = useAuthStore()
  const { positions, closePosition, isLoading: isClosing } = useTradingStore()

  if (isUserLoading) {
    return (
      <LoadingContainer>
        <div className="text-lg text-gray-400">Loading portfolio...</div>
      </LoadingContainer>
    )
  }

  if (!user) {
    return (
      <ErrorContainer>
        <ErrorMessage message="Please connect your wallet to view your portfolio" />
      </ErrorContainer>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Portfolio</h1>
      
      <div className="bg-[#1C2128] rounded-lg border border-[#30363D] p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-white">Account Overview</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <div className="text-gray-400">Total Balance</div>
            <div className="text-xl font-bold text-white">${user.balance.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-400">Total P&L</div>
            <div className={`text-xl font-bold ${user.balance > 10000 ? 'text-green-500' : user.balance < 10000 ? 'text-red-500' : 'text-gray-400'}`}>
              ${(user.balance - 10000).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Active Positions</div>
            <div className="text-xl font-bold text-white">{positions.length}</div>
          </div>
        </div>
      </div>

      <div className="bg-[#1C2128] rounded-lg border border-[#30363D]">
        <h2 className="text-lg font-semibold p-4 border-b border-[#30363D] text-white">Active Positions</h2>
        <div className="divide-y divide-[#30363D]">
          {positions.map((position) => (
            <div key={position.id} className="p-4 flex justify-between items-center">
              <div>
                <div className="font-medium text-white">{position.tokenAddress}</div>
                <div className="text-sm text-gray-400">
                  {position.isLong ? 'Long' : 'Short'} • ${position.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">
                  Entry: ${position.entryPrice.toFixed(4)}
                </div>
              </div>
              <button
                onClick={() => closePosition(position.id, position.entryPrice)}
                disabled={isClosing}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isClosing ? 'Closing...' : 'Close'}
              </button>
            </div>
          ))}
          {positions.length === 0 && (
            <div className="p-4 text-center text-gray-400">
              No active positions
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 