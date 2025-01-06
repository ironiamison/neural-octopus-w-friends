import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { WalletProvider } from '@/providers/WalletProvider'
import Navbar from '@/components/nav/Navbar'
import './globals.css'

const inter = Inter({
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Neural Octopus',
  description: 'AI-powered crypto trading platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ErrorBoundary>
          <WalletProvider>
            <div className="flex">
              <Navbar />
              <main className="flex-1 ml-[240px] min-h-screen">
                {children}
              </main>
              <Toaster richColors position="top-right" />
            </div>
          </WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
