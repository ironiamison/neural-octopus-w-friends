import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from './providers/WalletProvider'
import Navbar from './components/nav/Navbar'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'papermemes.fun',
  description: 'Learn and trade with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="min-h-screen bg-[#131722]">
            <Navbar />
            <main className="pl-[240px]">
              {children}
            </main>
          </div>
          <Toaster 
            position="top-right" 
            theme="dark"
            closeButton
            richColors
          />
        </WalletProvider>
      </body>
    </html>
  )
}
