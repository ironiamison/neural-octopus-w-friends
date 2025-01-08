import React from 'react'
import { Position } from '@/types/trading'
import { formatNumber } from '@/lib/utils/format'

interface PositionsListProps {
  positions: Position[]
}

export default function PositionsList({ positions }: PositionsListProps) {
  if (positions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No open positions
      </div>
    )
  }

  return (
    <div className="space-y-2 overflow-auto max-h-[calc(100%-2rem)]">
      {positions.map((position) => (
        <div
          key={position.id}
          className="bg-gray-700/50 rounded-lg p-3 border border-gray-600"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{position.pair.name}</span>
            <span className={position.type === 'long' ? 'text-green-400' : 'text-red-400'}>
              {position.type.toUpperCase()}
            </span>
          </div>
          <div className="text-sm text-gray-400 mt-1">
            <div className="flex justify-between">
              <span>Size:</span>
              <span>${formatNumber(position.size)}</span>
            </div>
            <div className="flex justify-between">
              <span>Entry:</span>
              <span>${formatNumber(position.entryPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>PnL:</span>
              <span className={position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                ${formatNumber(position.pnl)} ({position.pnlPercentage.toFixed(2)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Leverage:</span>
              <span>{position.leverage}x</span>
            </div>
            <div className="flex justify-between">
              <span>Liquidation:</span>
              <span className="text-red-400">${formatNumber(position.liquidationPrice)}</span>
            </div>
            {position.stopLoss && (
              <div className="flex justify-between">
                <span>Stop Loss:</span>
                <span className="text-yellow-400">${formatNumber(position.stopLoss)}</span>
              </div>
            )}
            {position.takeProfit && (
              <div className="flex justify-between">
                <span>Take Profit:</span>
                <span className="text-green-400">${formatNumber(position.takeProfit)}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 