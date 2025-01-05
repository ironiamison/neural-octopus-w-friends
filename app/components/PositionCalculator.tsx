'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Slider } from './ui/slider'

export default function PositionCalculator() {
  const [amount, setAmount] = useState<number>(1000)
  const [leverage, setLeverage] = useState<number>(5)
  const [stopLoss, setStopLoss] = useState<number>(5)
  const [takeProfit, setTakeProfit] = useState<number>(10)

  const positionSize = amount * leverage
  const maxLoss = (amount * stopLoss) / 100
  const potentialProfit = (amount * takeProfit) / 100
  const riskRewardRatio = takeProfit / stopLoss

  return (
    <Card>
      <CardHeader>
        <CardTitle>Position Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount (USDC)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={0}
              step={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Leverage: {leverage}x
            </label>
            <Slider
              value={[leverage]}
              onValueChange={([value]) => setLeverage(value)}
              min={1}
              max={100}
              step={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Stop Loss: {stopLoss}%
            </label>
            <Slider
              value={[stopLoss]}
              onValueChange={([value]) => setStopLoss(value)}
              min={1}
              max={50}
              step={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Take Profit: {takeProfit}%
            </label>
            <Slider
              value={[takeProfit]}
              onValueChange={([value]) => setTakeProfit(value)}
              min={1}
              max={100}
              step={1}
            />
          </div>

          <div className="pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Position Size</span>
              <span>${positionSize.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Max Loss</span>
              <span className="text-red-500">-${maxLoss.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Potential Profit</span>
              <span className="text-green-500">
                +${potentialProfit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Risk/Reward Ratio</span>
              <span>1:{riskRewardRatio.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 