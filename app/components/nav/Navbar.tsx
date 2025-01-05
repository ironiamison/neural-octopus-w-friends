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
    <nav className="fixed left-0 top-0 h-screen w-16 bg-[#1C2127]/95 backdrop-blur-md border-r border-[#2A2D35]/50">
      <div className="flex flex-col items-center py-4 space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`p-3 rounded-lg transition-colors relative group ${
                isActive
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:bg-[#2A2D35]/50 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-[#1C2127] rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 