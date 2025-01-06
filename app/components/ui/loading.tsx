import { Loader2 } from 'lucide-react'

interface LoadingContainerProps {
  children?: React.ReactNode
}

export function LoadingContainer({ children }: LoadingContainerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-[#1C2128] rounded-lg border border-[#30363D]">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
      {children}
    </div>
  )
}

export function LoadingSpinner() {
  return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
}

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-[#1C2128]/80 backdrop-blur-sm flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  )
} 