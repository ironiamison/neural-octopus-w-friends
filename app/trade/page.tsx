'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import TopMemePairs from '../components/TopMemePairs'
import TradingChart from '../components/TradingChart'
import TradingForm from '../components/TradingForm'
import TradingStats from '../components/TradingStats'
import PositionCalculator from '../components/PositionCalculator'
import TradingTools from '../components/TradingTools'
import Positions from '../components/Positions'
import OrderBook from '../components/OrderBook'
import Image from 'next/image'
import { MemeCoin, getTopMemeCoins } from '../utils/memeCoins'

interface Position {
  entryPrice: number
  type: 'LONG' | 'SHORT'
  openTime: string
  size: number
}

interface TokenInfo {
  address: string
  symbol: string
  name: string
}

const TOKEN_INFO: { [key: string]: TokenInfo } = {
  'AI16Z': {
    address: 'Ai16Z5bqJpHzwpEYX7XqZdWkqtPjG9CvDZKHEgXkGFLD',
    symbol: 'AI16Z',
    name: 'AI16Z'
  },
  'BOME': {
    address: '5jqTNKoK4jQhvoKxr6rV8rGGgdLmRrPPvqyD9qBRoXwn',
    symbol: 'BOME',
    name: 'BOME'
  },
  'BONK': {
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    symbol: 'BONK',
    name: 'Bonk'
  },
  'WIF': {
    address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    symbol: 'WIF',
    name: 'Wif'
  },
  'MYRO': {
    address: 'HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4',
    symbol: 'MYRO',
    name: 'Myro'
  },
  'POPCAT': {
    address: 'P0PCatYpv1xL8aDkHCahtUGFXG7NUbUhsweMJqgtpE3',
    symbol: 'POPCAT',
    name: 'PopCat'
  },
  'SLERF': {
    address: 'o1Gp7r4m38eRZn3qN5aXvHJHtxqm6oJMpASyxuoffhp',
    symbol: 'SLERF',
    name: 'Slerf'
  },
  'SAMO': {
    address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    symbol: 'SAMO',
    name: 'Samoyedcoin'
  },
  'BOOK': {
    address: 'BooKFc5A7SZcB7K2xqSqJvpBwY4YTxCpx9KXEfUrwffR',
    symbol: 'BOOK',
    name: 'Book'
  },
  'CAPS': {
    address: 'CAPSwtdqGqhGBnvnhQCf4nZnURPJNXdvKuXPUiJC7anj',
    symbol: 'CAPS',
    name: 'Caps'
  },
  'NEKO': {
    address: 'NEKo3YVXZmJHVhYBUwshvVj5brqbxSUBFkDiD9iZqFhj',
    symbol: 'NEKO',
    name: 'Neko'
  },
  'CRECK': {
    address: 'CRECKs3H4KQKDfvL6m4MQwzwQsP8cZgPVkD8DnLgcAVt',
    symbol: 'CRECK',
    name: 'Creck'
  },
  'GUAC': {
    address: 'AZsHEMXd36Bj1EMNXhowJajpUXzrKcK57wW4ZGXVa7yR',
    symbol: 'GUAC',
    name: 'Guac'
  },
  'MNGO': {
    address: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',
    symbol: 'MNGO',
    name: 'Mango'
  },
  'FORGE': {
    address: '6UeJYTqU6dJHZfPdkNUFNHR8FSjid2kKbJ1vxgLKhXvX',
    symbol: 'FORGE',
    name: 'Forge'
  },
  'CROWN': {
    address: 'GmY9sZhvWEqhyVfiYGXKhYMnzGJhJE7NfQTf2TY4rSZF',
    symbol: 'CROWN',
    name: 'Crown'
  },
  'BERN': {
    address: 'CkqWjejWK6eZxHY88aDsC5tYWGZ1TdyGwsZeHkrNZJxy',
    symbol: 'BERN',
    name: 'Bern'
  },
  'DGEN': {
    address: 'DGENf9phQvPd5BN3qgQWNYwEALVth9WXCxedVJHNpovD',
    symbol: 'DGEN',
    name: 'Dgen'
  },
  'JELLY': {
    address: 'GePFQaZKHcWE5vpxHfviQtH5jgxokSs51Y5Q4zgBiMDs',
    symbol: 'JELLY',
    name: 'Jelly'
  },
  'NANA': {
    address: '6vaRn1RxjEaxpGqDJHqk7zGAZS18Vo6JKJxU8R2KWxYk',
    symbol: 'NANA',
    name: 'Nana'
  }
}

export default function TradePage() {
  const searchParams = useSearchParams()
  const [pairs, setPairs] = useState<MemeCoin[]>([])
  const [selectedPair, setSelectedPair] = useState<string>(searchParams.get('symbol') || 'AI16Z/SOL')
  const [currentPrice, setCurrentPrice] = useState<number>(0.1234)
  const [userLevel, setUserLevel] = useState(1)
  const [userXP, setUserXP] = useState(0)
  const [nextLevelXP, setNextLevelXP] = useState(1000)
  const [marketCap, setMarketCap] = useState<number>(2210000000)
  const [positions, setPositions] = useState<Position[]>([])
  const [selectedToken, setSelectedToken] = useState<TokenInfo>(TOKEN_INFO['AI16Z'])

  useEffect(() => {
    async function fetchPairs() {
      try {
        const data = await getTopMemeCoins()
        setPairs(data || [])
      } catch (err) {
        console.error('Error fetching pairs:', err)
      }
    }

    fetchPairs()
    const interval = setInterval(fetchPairs, 15000)
    return () => clearInterval(interval)
  }, [])

  // Update token when pair changes
  useEffect(() => {
    const token = selectedPair.split('/')[0]
    if (TOKEN_INFO[token]) {
      setSelectedToken(TOKEN_INFO[token])
    }
  }, [selectedPair])

  const handleAddIndicator = (name: string) => {
    // TODO: Implement indicator addition
    console.log('Adding indicator:', name)
  }

  const handleSelectDrawingTool = (name: string) => {
    // TODO: Implement drawing tool selection
    console.log('Selected drawing tool:', name)
  }

  const handleTrade = (position: any) => {
    const newPosition = {
      entryPrice: currentPrice,
      type: position.type,
      openTime: new Date().toISOString(),
      size: position.amount
    }
    setPositions(prev => [...prev, newPosition])
    setUserXP(prev => prev + 100)
  }

  return (
    <main className="min-h-screen bg-[#0D1117] text-white">
      <div className="container mx-auto p-4">
        {/* User Stats Bar */}
        <div className="bg-[#1E222D]/50 rounded-lg p-4 mb-6 border border-purple-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src="/placeholder-avatar.png"
                  alt="User Avatar"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full px-2 py-0.5 text-xs font-bold">
                  Lvl {userLevel}
                </div>
              </div>
              <div>
                <h2 className="font-bold text-lg">@tradingpro</h2>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${(userXP / nextLevelXP) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{userXP}/{nextLevelXP} XP</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Rank</p>
                <p className="font-bold text-lg">#42</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Win Rate</p>
                <p className="font-bold text-lg text-green-500">64%</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">PnL</p>
                <p className="font-bold text-lg text-green-500">+2,450 USDC</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Balance</p>
                <p className="font-bold text-lg">10,000 USDC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Stats */}
        <TradingStats pair={selectedPair} />

        <div className="grid grid-cols-12 gap-6 mt-6">
          {/* Left sidebar - Trading Pairs */}
          <div className="col-span-12 lg:col-span-2">
            <TopMemePairs 
              pairs={pairs} 
              onPairSelect={(pair) => setSelectedPair(pair)}
              selectedPair={selectedPair}
            />
          </div>

          {/* Main content */}
          <div className="col-span-12 lg:col-span-7">
            {/* Chart and Trading Tools */}
            <div className="bg-[#1E222D] rounded-lg">
              <TradingChart 
                pair={selectedPair}
                positions={positions}
                marketCap={marketCap}
                tokenAddress={selectedToken.address}
              />
              <div className="p-4">
                <TradingForm 
                  pair={selectedPair}
                  onTrade={handleTrade}
                />
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <PositionCalculator 
              pair={selectedPair}
              currentPrice={currentPrice}
            />
            <OrderBook pair={selectedPair} />
          </div>
        </div>
      </div>
    </main>
  )
} 