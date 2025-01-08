'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  Home,
  LineChart,
  BookOpen,
  Trophy,
  History,
  Wallet,
  Medal,
  Newspaper,
  Bell,
  Settings,
  BarChart2,
  ChevronRight
} from 'lucide-react'
import WalletInfo from './WalletInfo'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/trade', icon: LineChart, label: 'Trade' },
  { href: '/dex', icon: BarChart2, label: 'DEX' },
  { href: '/learn', icon: BookOpen, label: 'Learn' },
  { href: '/tournaments', icon: Trophy, label: 'Tournaments' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/portfolio', icon: Wallet, label: 'Portfolio' },
  { href: '/leaderboard', icon: Medal, label: 'Leaderboard' },
  { href: '/news', icon: Newspaper, label: 'News' },
  { href: '/signals', icon: Bell, label: 'Signals' },
  { href: '/settings', icon: Settings, label: 'Settings' }
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed left-0 top-0 h-screen w-[240px] bg-[#0A0C10]/40 backdrop-blur-2xl z-50 shadow-2xl shadow-black/20">
      {/* Gradient border */}
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
      
      <div className="flex flex-col h-full">
        {/* Logo Section with animated gradient background */}
        <div className="relative p-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient-x" />
          <div className="relative">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-[1px] shadow-xl">
                <div className="absolute inset-0 rounded-xl bg-black/50 backdrop-blur-xl" />
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain scale-90 group-hover:scale-95 transition-transform duration-500"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  papermemes
                </h1>
                <p className="text-[10px] text-gray-400 tracking-wider uppercase">Premium Trading</p>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Wallet Info with glass effect */}
        <div className="px-4 py-2">
          <div className="rounded-xl bg-white/5 backdrop-blur-lg p-3 shadow-xl">
            <WalletInfo />
          </div>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white hover:shadow-lg'
                }`}
              >
                <div className={`relative ${isActive ? 'animate-pulse-subtle' : ''}`}>
                  <Icon className={`h-4 w-4 transition-colors duration-300 ${
                    isActive ? 'text-blue-400' : 'group-hover:text-blue-400'
                  }`} />
                  {isActive && (
                    <div className="absolute inset-0 blur-lg bg-blue-400/30" />
                  )}
                </div>
                <span className="font-medium text-sm tracking-wide">{item.label}</span>
                {isActive && (
                  <>
                    <ChevronRight className="h-3 w-3 ml-auto text-blue-400" />
                    <div className="absolute left-0 top-[10%] bottom-[10%] w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 rounded-full" />
                  </>
                )}
              </Link>
            )
          })}
        </div>

        {/* Footer with glass effect */}
        <div className="p-4">
          <div className="rounded-lg bg-white/5 backdrop-blur-lg p-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-gray-400">Online</span>
              </div>
              <Link 
                href="/support" 
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 