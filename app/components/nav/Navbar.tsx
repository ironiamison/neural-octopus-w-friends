'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  BarChart2
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
    <nav className="fixed left-0 top-0 h-screen w-[240px] bg-[#1C2127]/95 backdrop-blur-md border-r border-[#2A2D35]/50 z-50">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold text-blue-500 hover:text-blue-400 transition-colors">
            papermemes.fun
          </Link>
        </div>
        
        {/* Wallet Info */}
        <WalletInfo />
        
        <div className="flex-1 px-4 py-2">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-400 hover:bg-[#2A2D35] hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
} 