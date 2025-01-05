import React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min: number
  max: number
  step: number
  className?: string
}

export function Slider({ value, onValueChange, min, max, step, className = '' }: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={`relative flex items-center select-none touch-none w-full h-5 ${className}`}
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
    >
      <SliderPrimitive.Track className="bg-gray-700 relative grow rounded-full h-2">
        <SliderPrimitive.Range className="absolute bg-blue-500 rounded-full h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block w-5 h-5 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </SliderPrimitive.Root>
  )
} 