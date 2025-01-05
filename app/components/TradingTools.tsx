'use client'

import { useState } from 'react'
import { Tab } from '@headlessui/react'

const INDICATORS = [
  { name: 'RSI', description: 'Relative Strength Index' },
  { name: 'MACD', description: 'Moving Average Convergence Divergence' },
  { name: 'BB', description: 'Bollinger Bands' },
  { name: 'EMA', description: 'Exponential Moving Average' },
  { name: 'SMA', description: 'Simple Moving Average' },
]

const DRAWING_TOOLS = [
  { name: 'Line', icon: '━' },
  { name: 'Horizontal', icon: '―' },
  { name: 'Vertical', icon: '|' },
  { name: 'Fibonacci', icon: '⌒' },
  { name: 'Rectangle', icon: '□' },
]

interface TradingToolsProps {
  onAddIndicator: (name: string) => void
  onSelectDrawingTool: (name: string) => void
}

export default function TradingTools({ onAddIndicator, onSelectDrawingTool }: TradingToolsProps) {
  const [selectedTab, setSelectedTab] = useState(0)

  return (
    <div className="bg-[#1E222D] rounded-lg p-4">
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-2 mb-4">
          <Tab className={({ selected }) => `
            flex-1 py-2 text-sm font-medium rounded-lg
            ${selected 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }
          `}>
            Indicators
          </Tab>
          <Tab className={({ selected }) => `
            flex-1 py-2 text-sm font-medium rounded-lg
            ${selected 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }
          `}>
            Drawing Tools
          </Tab>
          <Tab className={({ selected }) => `
            flex-1 py-2 text-sm font-medium rounded-lg
            ${selected 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }
          `}>
            Alerts
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <div className="space-y-2">
              {INDICATORS.map((indicator) => (
                <button
                  key={indicator.name}
                  onClick={() => onAddIndicator(indicator.name)}
                  className="w-full p-3 text-left rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <p className="font-medium">{indicator.name}</p>
                  <p className="text-sm text-gray-400">{indicator.description}</p>
                </button>
              ))}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className="grid grid-cols-5 gap-2">
              {DRAWING_TOOLS.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => onSelectDrawingTool(tool.name)}
                  className="p-3 text-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <p className="text-xl mb-1">{tool.icon}</p>
                  <p className="text-sm">{tool.name}</p>
                </button>
              ))}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-800">
                <h3 className="font-medium mb-2">Price Alerts</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Above $0.1500</span>
                    <button className="text-red-500 hover:text-red-400">Remove</button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Below $0.1000</span>
                    <button className="text-red-500 hover:text-red-400">Remove</button>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">
                  Add Alert
                </button>
              </div>

              <div className="p-4 rounded-lg bg-gray-800">
                <h3 className="font-medium mb-2">Indicator Alerts</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>RSI Overbought (>70)</span>
                    <button className="text-red-500 hover:text-red-400">Remove</button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>MACD Crossover</span>
                    <button className="text-red-500 hover:text-red-400">Remove</button>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">
                  Add Alert
                </button>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
} 