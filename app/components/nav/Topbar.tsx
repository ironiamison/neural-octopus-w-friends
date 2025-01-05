'use client'

import {
  MousePointer2,
  Pencil,
  Type,
  Ruler,
  Shapes,
  BarChart2,
  LineChart,
  Settings
} from 'lucide-react'

const tools = [
  { icon: MousePointer2, label: 'Cursor' },
  { icon: Pencil, label: 'Draw' },
  { icon: Type, label: 'Text' },
  { icon: Ruler, label: 'Measure' },
  { icon: Shapes, label: 'Shapes' },
  { icon: BarChart2, label: 'Indicators' },
  { icon: LineChart, label: 'Chart Type' },
  { icon: Settings, label: 'Settings' }
]

export default function Topbar() {
  return (
    <div className="fixed top-0 left-16 right-0 h-16 bg-[#1C2127]/95 backdrop-blur-md border-b border-[#2A2D35]/50">
      <div className="h-full flex items-center px-4">
        <div className="flex items-center space-x-2">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.label}
                className="p-2 rounded-lg text-gray-400 hover:bg-[#2A2D35]/50 hover:text-white transition-colors relative group"
              >
                <Icon className="h-5 w-5" />
                <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1C2127] rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {tool.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
} 