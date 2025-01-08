'use client'

import { Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

interface LoadingContainerProps {
  children?: ReactNode
}

export function LoadingContainer({ children }: LoadingContainerProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        {children}
      </div>
    </div>
  )
} 