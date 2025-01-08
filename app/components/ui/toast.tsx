'use client'

import { useEffect } from 'react'
import { useToastStore } from './use-toast'
import { X } from 'lucide-react'

export function Toast() {
  const { toast, hideToast } = useToastStore()

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [toast, hideToast])

  if (!toast) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`${
          toast.variant === 'destructive'
            ? 'bg-red-500'
            : 'bg-green-500'
        } text-white px-6 py-4 rounded-lg shadow-lg flex items-start gap-4`}
      >
        <div>
          <h3 className="font-semibold">{toast.title}</h3>
          <p className="text-sm opacity-90">{toast.description}</p>
        </div>
        <button
          onClick={hideToast}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
} 