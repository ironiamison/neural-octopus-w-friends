'use client'

import { Home, LineChart, Trophy, Settings, User } from 'lucide-react'
import Link from 'next/link'

export default function SidebarIcons() {
  const icons = [
    { icon: Home, href: '/', label: 'Home' },
    { icon: LineChart, href: '/trade', label: 'Trade' },
    { icon: Trophy, href: '/trader-progression', label: 'Progress' },
    { icon: Settings, href: '/settings', label: 'Settings' },
    { icon: User, href: '/profile', label: 'Profile' },
  ]

  return (
    <div className="flex flex-col items-center gap-6">
      {icons.map(({ icon: Icon, href, label }) => (
        <Link
          key={href}
          href={href}
          className="text-[#848E9C] hover:text-white transition-colors"
          title={label}
        >
          <Icon className="w-6 h-6" />
        </Link>
      ))}
    </div>
  )
} 