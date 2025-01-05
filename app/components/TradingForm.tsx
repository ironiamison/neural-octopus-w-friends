'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Slider } from './ui/slider'

interface TradingFormProps {
  onSubmit: (data: any) => void
}

export default function TradingForm({ onSubmit }: TradingFormProps) {
  const [amount, setAmount] = useState<number>(0)
  const [leverage, setLeverage] = useState<number>(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ amount, leverage })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min={0}
          step={0.1}
          required
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
          max={10}
          step={1}
        />
      </div>
      <Button type="submit">Place Order</Button>
    </form>
  )
} 