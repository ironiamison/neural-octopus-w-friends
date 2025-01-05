'use client'

import { create } from 'zustand'

interface PriceStore {
  currentPrice: number
  setPrice: (price: number) => void
  startPriceSimulation: () => () => void
}

export const usePriceStore = create<PriceStore>((set) => ({
  currentPrice: 0.00003597,
  setPrice: (price) => set({ currentPrice: price }),
  startPriceSimulation: () => {
    const interval = setInterval(() => {
      const currentPrice = usePriceStore.getState().currentPrice
      const change = (Math.random() - 0.5) * 0.0000001
      usePriceStore.getState().setPrice(currentPrice + change)
    }, 1000)
    return () => clearInterval(interval)
  }
})) 