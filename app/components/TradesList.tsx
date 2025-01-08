import React from 'react'
import { Trade } from '@/types/trading'
import { formatNumber } from '@/lib/utils/format'
import { formatDistanceToNow } from 'date-fns'

interface TradesListProps {
  trades: Trade[]
}

export default function TradesList({ trades }: TradesListProps) {
  if (trades.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No trades yet
      </div>
    )
  }

  return (
    <div className="space-y-2 overflow-auto max-h-[calc(100%-2rem)]">
      {trades.map((trade) => (
        <div
          key={trade.id}
          className="bg-gray-700/50 rounded-lg p-3 border border-gray-600"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{trade.pair.name}</span>
            <span className={trade.type === 'long' ? 'text-green-400' : 'text-red-400'}>
              {trade.type.toUpperCase()}
            </span>
          </div>
          <div className="text-sm text-gray-400 mt-1">
            <div className="flex justify-between">
              <span>Size:</span>
              <span>${formatNumber(trade.size)}</span>
            </div>
            <div className="flex justify-between">
              <span>Entry:</span>
              <span>${formatNumber(trade.entryPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Exit:</span>
              <span>${formatNumber(trade.exitPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>PnL:</span>
              <span className={trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                ${formatNumber(trade.pnl)} ({trade.pnlPercentage.toFixed(2)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Leverage:</span>
              <span>{trade.leverage}x</span>
            </div>
            {trade.xpEarned && (
              <div className="flex justify-between">
                <span>XP Earned:</span>
                <span className="text-purple-400">+{trade.xpEarned} XP</span>
              </div>
            )}
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-gray-500">
                {formatDistanceToNow(trade.timestamp)} ago
              </span>
              <span className={`px-2 py-1 rounded ${
                trade.status === 'closed'
                  ? 'bg-gray-500/20 text-gray-400'
                  : trade.status === 'liquidated'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-green-500/20 text-green-400'
              }`}>
                {trade.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 