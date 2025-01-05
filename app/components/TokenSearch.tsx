'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface TokenSearchProps {
  onSelect: (token: string) => void
}

export default function TokenSearch({ onSelect }: TokenSearchProps) {
  const [search, setSearch] = useState('')

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-[#1E2329] rounded px-3 py-1.5">
        <Search className="w-4 h-4 text-[#848E9C]" />
        <input
          type="text"
          placeholder="Search tokens..."
          className="bg-transparent border-none outline-none text-sm text-white placeholder-[#848E9C] w-48"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  )
} 