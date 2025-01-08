'use client'

import React, { useState } from 'react'
import { TradingPair, UserStats } from '@/types/trading'
import { formatNumber } from '@/lib/utils/format'
import { tradingService } from '@/lib/services/trading.service'

interface TradingFormProps {
  pair: TradingPair
  userStats: UserStats
  walletAddress: string | null
}

export default function TradingForm({ pair, userStats, walletAddress }: TradingFormProps) {
  const [orderType, setOrderType] = useState<'long' | 'short'>('long')
  const [amount, setAmount] = useState('')
  const [leverage, setLeverage] = useState(1)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletAddress) {
      setError('Please connect your wallet to trade')
      return
    }

    const tradeAmount = parseFloat(amount)
    if (isNaN(tradeAmount) || tradeAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (tradeAmount > userStats.balance) {
      setError('Insufficient balance')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      await tradingService.openPosition({
        walletAddress,
        pair,
        type: orderType,
        size: tradeAmount,
        leverage,
        price: pair.price
      })

      setAmount('')
      setLeverage(1)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOrderType('long')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            orderType === 'long'
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-gray-700/50 text-gray-400 border border-transparent hover:border-gray-600'
          }`}
        >
          Long
        </button>
        <button
          type="button"
          onClick={() => setOrderType('short')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            orderType === 'short'
              ? 'bg-red-500/20 text-red-400 border border-red-500/50'
              : 'bg-gray-700/50 text-gray-400 border border-transparent hover:border-gray-600'
          }`}
        >
          Short
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Amount (USD)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          placeholder="Enter amount..."
          min="0"
          step="0.01"
        />
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Balance: ${formatNumber(userStats.balance)}</span>
          <button
            type="button"
            onClick={() => setAmount(userStats.balance.toString())}
            className="text-blue-400 hover:text-blue-300"
          >
            Max
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Leverage: {leverage}x
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1x</span>
          <span>20x</span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-400">
        <div className="flex justify-between">
          <span>Entry Price</span>
          <span className="text-white">${formatNumber(pair.price)}</span>
        </div>
        {amount && (
          <>
            <div className="flex justify-between">
              <span>Position Size</span>
              <span className="text-white">
                ${formatNumber(parseFloat(amount) * leverage)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Required Margin</span>
              <span className="text-white">${formatNumber(parseFloat(amount))}</span>
            </div>
          </>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
        className={`w-full py-3 rounded-lg transition-colors ${
          orderType === 'long'
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-red-500 hover:bg-red-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSubmitting ? (
          'Opening Position...'
        ) : (
          `Open ${orderType === 'long' ? 'Long' : 'Short'} Position`
        )}
      </button>

      {error && (
        <div className="text-red-400 text-sm mt-2">{error}</div>
      )}
    </form>
  )
} 