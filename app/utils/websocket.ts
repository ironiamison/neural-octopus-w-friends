import { create } from 'zustand'

interface PriceStore {
  currentPrice: number
  setPrice: (price: number) => void
}

export const usePriceStore = create<PriceStore>((set) => ({
  currentPrice: 0.00003597, // Initial price
  setPrice: (price) => set({ currentPrice: price })
}))

// Simulate price updates
if (typeof window !== 'undefined') {
  setInterval(() => {
    const currentPrice = usePriceStore.getState().currentPrice
    const change = (Math.random() - 0.5) * 0.0000001 // Small random price changes
    usePriceStore.getState().setPrice(currentPrice + change)
  }, 1000)
} 