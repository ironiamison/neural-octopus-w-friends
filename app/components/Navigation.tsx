'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LineChart, GraduationCap, Settings } from 'lucide-react'
import WalletConnect from './WalletConnect'

export default function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/trade', label: 'Trade', icon: LineChart },
    { href: '/learn', label: 'Learn', icon: GraduationCap },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1C2127]/95 backdrop-blur-md border-b border-[#2A2D35]">
      <div className="max-w-[1920px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-[#4A72FF]">
              Neural Octopus
            </Link>

            <div className="hidden md:flex items-center gap-4">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    pathname === href
                      ? 'text-[#4A72FF] bg-[#4A72FF]/10'
                      : 'text-gray-400 hover:text-white hover:bg-[#2A2D35]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <WalletConnect />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1C2127]/95 backdrop-blur-md border-t border-[#2A2D35]">
        <div className="flex items-center justify-around py-3">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                pathname === href
                  ? 'text-[#4A72FF]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
} 