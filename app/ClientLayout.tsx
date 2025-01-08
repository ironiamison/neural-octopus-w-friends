'use client'

import { WalletProvider } from './providers/WalletProvider'
import { Toast } from './components/ui/toast'
import Navbar from './components/nav/Navbar'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WalletProvider>
      <div className="flex min-h-screen bg-[#0D1117]">
        <Navbar />
        <main className="flex-1 ml-[240px] p-4">
          {children}
        </main>
        <Toast />
      </div>
    </WalletProvider>
  )
} 