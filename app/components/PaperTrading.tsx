'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '../utils/auth'
import { useDexStore } from '../utils/dexscreener'
import { useTradingStore } from '../utils/trading'
import { usePriceStore } from '../utils/priceFeed'
import { LoadingContainer } from './ui/loading'
import { ErrorContainer, ErrorMessage } from './ui/error'
import { LEVERAGE_TIERS } from '@/lib/constants/trading'
import { formatUSD } from '@/utils/format'

// Helper function to get leverage tier
function getLeverageTier(leverage: number) {
  return LEVERAGE_TIERS.find(tier => leverage <= tier.maxLeverage) || LEVERAGE_TIERS[0]
}

export default function PaperTrading() {
  const [mounted, setMounted] = useState(false)
  const startPriceSimulation = usePriceStore(state => state.startPriceSimulation)
  const { user, isLoading: isUserLoading } = useAuthStore()
  const { pairs, isLoading: isPairsLoading } = useDexStore()
  const { positions, openPosition, closePosition, isLoading: isSubmitting, error: submitError } = useTradingStore()
  usePriceStore()
  const [amount, setAmount] = useState('')
  const [selectedPair, setSelectedPair] = useState('')
  const [leverage, setLeverage] = useState(1)
  const [position, setPosition] = useState<'long' | 'short'>('long')

  useEffect(() => {
    setMounted(true)
    const cleanup = startPriceSimulation()
    return () => {
      cleanup()
    }
  }, [startPriceSimulation])

  if (!mounted) {
    return null
  }

  useEffect(() => {
    if (user) {
      useTradingStore.getState().fetchPositions(user.id)
    }
  }, [user])

  useEffect(() => {
    // Update positions with latest prices
    const prices = usePriceStore(state => state.prices)
    const priceMap = Object.fromEntries(
      Array.from(prices.entries()).map((entry) => {
        const [address, data] = entry as [string, {price: number}]
        return [
          pairs.find(p => p.pairAddress === address)?.baseToken.symbol || '',
          data.price
        ]
      })
    )
    useTradingStore.getState().updatePositions(priceMap)
  }, [pairs])

  if (isUserLoading || isPairsLoading) {
    return (
      <LoadingContainer>
        <div className="text-lg text-gray-400">Loading trading data...</div>
      </LoadingContainer>
    )
  }

  if (!user) {
    return (
      <ErrorContainer>
        <ErrorMessage message="Please connect your wallet to start trading" />
      </ErrorContainer>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const pair = pairs.find(p => p.pairAddress === selectedPair)
    if (!pair) return

    try {
      await openPosition({
        userId: user.id,
        pair: pair.baseToken.symbol,
        type: position,
        price: pair.priceUsd,
        size: parseFloat(amount),
        leverage: leverage
      })

      // Reset form
      setAmount('')
      setSelectedPair('')
      setLeverage(1)
    } catch (error) {
      console.error('Failed to open position:', error)
    }
  }

  const handleClosePosition = async (positionId: string) => {
    try {
      await closePosition(positionId)
    } catch (error) {
      console.error('Failed to close position:', error)
    }
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trading Form */}
        <div className="lg:col-span-4">
          <div className="bg-[#1C2128] rounded-lg border border-[#30363D] p-4">
            <h2 className="text-lg font-semibold mb-4 text-white">Open Position</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Trading Pair</label>
                <select
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className="w-full bg-[#22272E] text-white rounded-lg border border-[#30363D] p-2"
                  required
                >
                  <option value="">Select a pair</option>
                  {pairs.map((pair) => (
                    <option key={pair.pairAddress} value={pair.pairAddress}>
                      {pair.baseToken.symbol}/USD
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Amount (USDC)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#22272E] text-white rounded-lg border border-[#30363D] p-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Leverage</label>
                <input
                  type="number"
                  value={leverage}
                  onChange={(e) => setLeverage(parseInt(e.target.value))}
                  className="w-full bg-[#22272E] text-white rounded-lg border border-[#30363D] p-2"
                  required
                  min="1"
                  max="100"
                  step="1"
                />
                <div className="mt-1 text-xs text-gray-400">
                  {leverage}x Isolated Leverage - {getLeverageTier(leverage).name}
                </div>
              </div>

              <div className="text-sm text-gray-400 p-2 bg-[#1C2128] rounded-lg">
                <div className="flex justify-between mb-1">
                  <span>Required Margin:</span>
                  <span>{formatUSD(Number(amount) / Number(leverage), 2)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Position Size:</span>
                  <span>{formatUSD(Number(amount), 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Loss:</span>
                  <span className="text-red-400">{formatUSD(Number(amount) / Number(leverage), 2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPosition('long')}
                  className={`p-4 rounded-lg transition-colors ${
                    position === 'long'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-[#22272E] text-gray-400 border border-[#30363D]'
                  }`}
                >
                  Long
                </button>
                <button
                  type="button"
                  onClick={() => setPosition('short')}
                  className={`p-4 rounded-lg transition-colors ${
                    position === 'short'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-[#22272E] text-gray-400 border border-[#30363D]'
                  }`}
                >
                  Short
                </button>
              </div>

              {submitError && (
                <div className="text-red-400 text-sm">{submitError}</div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Opening Position...' : 'Open Position'}
              </button>
            </form>
          </div>
        </div>

        {/* Active Positions */}
        <div className="lg:col-span-8">
          <div className="bg-[#1C2128] rounded-lg border border-[#30363D] p-4">
            <h2 className="text-lg font-semibold mb-4 text-white">Active Positions</h2>
            <div className="space-y-4">
              {positions.map((position) => (
                <div
                  key={position.id}
                  className="p-4 bg-[#22272E] rounded-lg border border-[#30363D]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-white">
                        {position.pair}/USD
                      </span>
                      <span className={`ml-2 text-sm ${position.type === 'long' ? 'text-green-400' : 'text-red-400'}`}>
                        {position.type.toUpperCase()}
                      </span>
                      <span className="ml-2 text-sm text-gray-400">
                        {position.leverage}x
                      </span>
                    </div>
                    <button
                      onClick={() => handleClosePosition(position.id)}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded border border-red-500/30 hover:bg-red-500/30 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Size</div>
                      <div className="font-medium text-white">
                        ${(position.size * position.leverage).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Entry Price</div>
                      <div className="font-medium text-white">
                        ${position.entryPrice.toFixed(8)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">PnL</div>
                      <div className={`font-medium ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${position.pnl.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {positions.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  No active positions
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 