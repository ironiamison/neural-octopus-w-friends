'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Token {
  symbol: string
  name: string
  price: string
  change: string
  volume: string
}

const popularTokens: Token[] = [
  { symbol: 'BONK/USD', name: 'Bonk', price: '$0.00001234', change: '+5.67%', volume: '$1.23M' },
  { symbol: 'WIF/USD', name: 'Friend', price: '$0.00002345', change: '-2.34%', volume: '$2.34M' },
  { symbol: 'MYRO/USD', name: 'Myro', price: '$0.00003456', change: '+8.90%', volume: '$3.45M' },
]

export default function TokenSelector() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:text-white"
      >
        <span className="text-lg font-medium">BONK/USD</span>
        <ChevronDown className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-[#1E2329] border border-[#2A2D35] rounded shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search markets..."
              className="w-full bg-[#0B0E11] rounded px-3 py-2 text-sm text-white placeholder-[#848E9C] outline-none"
            />
          </div>
          <div className="max-h-96 overflow-auto">
            {popularTokens.map((token) => (
              <button
                key={token.symbol}
                className="w-full px-4 py-2 flex items-center justify-between hover:bg-[#2A2D35] text-left"
              >
                <div>
                  <div className="text-sm font-medium text-white">{token.symbol}</div>
                  <div className="text-xs text-[#848E9C]">{token.name}</div>
                </div>
                <div>
                  <div className="text-sm text-white text-right">{token.price}</div>
                  <div className={`text-xs text-right ${
                    token.change.startsWith('+') ? 'text-[#02C076]' : 'text-[#F6465D]'
                  }`}>{token.change}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 