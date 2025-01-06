'use client'

import { Home, LineChart, Trophy, Settings, User, Wallet, History } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SidebarIcons() {
  const pathname = usePathname()
  
  const icons = [
    { icon: Home, href: '/', label: 'Home' },
    { icon: LineChart, href: '/trade', label: 'Trade' },
    { icon: Wallet, href: '/portfolio', label: 'Portfolio' },
    { icon: History, href: '/history', label: 'History' },
    { icon: Trophy, href: '/trader-progression', label: 'Progress' },
    { icon: Settings, href: '/settings', label: 'Settings' },
    { icon: User, href: '/profile', label: 'Profile' },
  ]

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {icons.map(({ icon: Icon, href, label }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-800/50 ${
              isActive ? 'text-blue-400 bg-gray-800/30' : 'text-gray-400 hover:text-white'
            }`}
            title={label}
          >
            <Icon className="w-6 h-6" />
          </Link>
        )
      })}
    </div>
  )
} 