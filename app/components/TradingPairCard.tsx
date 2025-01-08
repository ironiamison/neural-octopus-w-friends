import React from 'react'
import { TradingPair } from '@/types/trading'
import { formatNumber } from '@/lib/utils/format'

interface TradingPairCardProps {
  pair: TradingPair
  onSelect: (pair: TradingPair) => void
  isSelected: boolean
}

export function TradingPairCard({ pair, onSelect, isSelected }: TradingPairCardProps) {
  return (
    <div 
      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-blue-500/20 border border-blue-500'
          : 'bg-gray-800/40 border border-gray-700 hover:border-gray-600'
      }`}
      onClick={() => onSelect(pair)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <img 
            src={pair.icon || '/images/default-token.png'} 
            alt={pair.symbol}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-white">{pair.name}</h3>
            <p className="text-sm text-gray-400">{pair.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg text-white">
            ${formatNumber(pair.price)}
          </p>
          <p className={`text-sm ${pair.color}`}>
            {pair.change}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div>
          <p className="text-gray-400">24h Volume</p>
          <p className="font-medium text-white">{pair.volume}</p>
        </div>
        <div>
          <p className="text-gray-400">Liquidity</p>
          <p className="font-medium text-white">
            ${formatNumber(pair.poolSize || 0)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-2">
          {pair.hasOrderBook && (
            <span className="px-2 py-1 rounded bg-green-500/20 text-green-400">
              Order Book
            </span>
          )}
          {pair.hasChart && (
            <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">
              Live Chart
            </span>
          )}
        </div>
        {pair.poolSource && (
          <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400">
            {pair.poolSource === 'jupiter' ? 'Jupiter' : 'Birdeye'} Pool
          </span>
        )}
      </div>

      {pair.warning && (
        <div className="mt-4 p-2 rounded bg-yellow-500/20 text-yellow-400 text-xs">
          ⚠️ {pair.warning}
        </div>
      )}
    </div>
  )
} 