import { create } from 'zustand'

interface Toast {
  title: string
  description: string
  variant?: 'default' | 'destructive'
}

interface ToastStore {
  toast: Toast | null
  showToast: (toast: Toast) => void
  hideToast: () => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toast: null,
  showToast: (toast) => set({ toast }),
  hideToast: () => set({ toast: null })
}))

export const useToast = () => {
  const { showToast } = useToastStore()
  return {
    toast: (toast: Toast) => {
      showToast(toast)
      setTimeout(() => {
        useToastStore.getState().hideToast()
      }, 5000)
    }
  }
} 