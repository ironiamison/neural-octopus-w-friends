'use client'

import { useState } from 'react'

interface TradeFormProps {
  token: string
  connected: boolean
}

export default function TradeForm({ token, connected }: TradeFormProps) {
  const [side, setSide] = useState<'long' | 'short'>('long')
  const [amount, setAmount] = useState('')
  const [leverage, setLeverage] = useState('10')

  if (!connected) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#848E9C] mb-4">Connect wallet to trade</p>
          <button className="px-8 py-2 bg-[#F0B90B] rounded text-black font-medium hover:bg-[#F0B90B]/90 transition-colors">
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4">
      <div className="flex gap-2 mb-4">
        <button
          className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
            side === 'long'
              ? 'bg-[#02C076] text-white'
              : 'bg-[#1E2329] text-[#848E9C] hover:text-white'
          }`}
          onClick={() => setSide('long')}
        >
          Long
        </button>
        <button
          className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
            side === 'short'
              ? 'bg-[#F6465D] text-white'
              : 'bg-[#1E2329] text-[#848E9C] hover:text-white'
          }`}
          onClick={() => setSide('short')}
        >
          Short
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-[#848E9C] mb-2">Amount (USDC)</label>
          <input
            type="text"
            className="w-full bg-[#1E2329] rounded px-3 py-2 text-sm text-white placeholder-[#848E9C] outline-none"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs text-[#848E9C] mb-2">Leverage</label>
          <select
            className="w-full bg-[#1E2329] rounded px-3 py-2 text-sm text-white outline-none"
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
          >
            <option value="1">1×</option>
            <option value="2">2×</option>
            <option value="5">5×</option>
            <option value="10">10×</option>
            <option value="20">20×</option>
          </select>
        </div>

        <button
          className={`w-full py-3 rounded font-medium ${
            side === 'long' ? 'bg-[#02C076]' : 'bg-[#F6465D]'
          } text-white`}
        >
          Place {side === 'long' ? 'Long' : 'Short'}
        </button>
      </div>
    </div>
  )
} 