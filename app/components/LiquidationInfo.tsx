'use client'

import { useEffect, useState } from 'react'
import { calculateLiquidationPrice, calculatePnL } from '../utils/liquidationEngine'
import { formatUSD, formatPercent } from '../utils/format'

interface LiquidationInfoProps {
  position: {
    size: number
    leverage: number
    entryPrice: number
    type: 'LONG' | 'SHORT'
    collateral: number
  }
  currentPrice: number
}

export default function LiquidationInfo({ position, currentPrice }: LiquidationInfoProps) {
  const [info, setInfo] = useState<any>(null)
  const [pnl, setPnL] = useState<{ pnlUSD: number; pnlPercent: number }>({ pnlUSD: 0, pnlPercent: 0 })

  useEffect(() => {
    try {
      const liquidationInfo = calculateLiquidationPrice(position)
      setInfo(liquidationInfo)
      const pnlInfo = calculatePnL(position, currentPrice)
      setPnL(pnlInfo)
    } catch (err) {
      console.error('Error calculating liquidation:', err)
    }
  }, [position, currentPrice])

  if (!info) return null

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-500'
      case 'MEDIUM': return 'text-yellow-500'
      case 'HIGH': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="bg-[#1E222D] rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-bold">Position Information</h3>
      
      {/* PnL Information */}
      <div className="flex justify-between items-center p-3 bg-[#161921] rounded-lg">
        <span className="text-gray-400">Unrealized PnL</span>
        <div className="text-right">
          <div className={pnl.pnlUSD >= 0 ? 'text-green-500' : 'text-red-500'}>
            {formatUSD(pnl.pnlUSD)}
          </div>
          <div className={`text-sm ${pnl.pnlUSD >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatPercent(pnl.pnlPercent)}
          </div>
        </div>
      </div>

      {/* Liquidation Information */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Liquidation Price</span>
          <span className="font-mono">{formatUSD(info.liquidationPrice)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Distance to Liquidation</span>
          <span className={getRiskColor(info.liquidationRisk)}>
            {formatPercent(Math.abs((info.liquidationPrice - currentPrice) / currentPrice * 100))}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Effective Leverage</span>
          <span className="font-mono">{info.effectiveLeverage.toFixed(2)}x</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Initial Margin</span>
          <span className="font-mono">{formatUSD(info.initialMargin)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Maintenance Margin</span>
          <span className="font-mono">{formatUSD(info.maintenanceMargin)}</span>
        </div>
      </div>

      {/* Risk Level */}
      <div className="flex justify-between items-center p-3 bg-[#161921] rounded-lg">
        <span className="text-gray-400">Liquidation Risk</span>
        <span className={`font-bold ${getRiskColor(info.liquidationRisk)}`}>
          {info.liquidationRisk}
        </span>
      </div>
    </div>
  )
} 