import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from './contexts/WalletContext'
import Navbar from './components/nav/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Neural Octopus - Advanced Meme Trading Platform',
  description: 'Advanced meme coin trading platform with paper trading, learning resources, and real-time market data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-b from-[#0B0E11] to-[#131722] text-white antialiased min-h-screen`}>
        <WalletProvider>
          <div className="flex min-h-screen">
            <Navbar />
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </WalletProvider>
      </body>
    </html>
  )
}
