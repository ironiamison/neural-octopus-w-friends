'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import WalletConnect from './WalletConnect'

const navItems = [
  { name: 'Trade', href: '/trade' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'History', href: '/history' },
  { name: 'Learn', href: '/learn' },
  { name: 'Settings', href: '/settings' }
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1E222D] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              Neural Octopus
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  )
} 