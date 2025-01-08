'use client'

import Link from 'next/link'
import { BookOpen, FileText, Lightbulb, Rocket, Shield, Terminal } from 'lucide-react'

const sections = [
  {
    title: 'Getting Started',
    icon: Rocket,
    links: [
      { title: 'Platform Overview', href: '/docs/overview/platform' },
      { title: 'Quick Start Guide', href: '/docs/overview/quickstart' },
      { title: 'Technical Setup', href: '/docs/technical/setup' }
    ]
  },
  {
    title: 'Trading Features',
    icon: Terminal,
    links: [
      { title: 'AI Trading Signals', href: '/docs/whitepaper/ai-signals' },
      { title: 'Trading Features', href: '/docs/whitepaper/trading-features' },
      { title: 'XP Events', href: '/docs/whitepaper/trading-xp-events' }
    ]
  },
  {
    title: 'Security',
    icon: Shield,
    links: [
      { title: 'Security Overview', href: '/docs/whitepaper/security' },
      { title: 'Best Practices', href: '/docs/whitepaper/security#best-practices' },
      { title: 'Risk Management', href: '/docs/whitepaper/security#risk-management' }
    ]
  },
  {
    title: 'Mobile App',
    icon: Lightbulb,
    links: [
      { title: 'Mobile Overview', href: '/docs/mobile/overview' },
      { title: 'Installation Guide', href: '/docs/mobile/overview#installation' },
      { title: 'Features', href: '/docs/mobile/overview#features' }
    ]
  }
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold">Documentation</h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Learn how to use our AI-powered trading platform with comprehensive guides and documentation.
          </p>
        </div>

        {/* Documentation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <div key={section.title} className="bg-[#1E222D] rounded-xl p-6 border border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                <div className="space-y-3">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                      <FileText className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      <span>{link.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 