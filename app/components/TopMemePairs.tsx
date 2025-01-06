'use client'

import React from 'react'
import Image from 'next/image'
import { formatNumber } from '../utils/format'
import { MemeCoin } from '@/utils/memeCoins'

interface TopMemePairsProps {
  pairs: MemeCoin[]
  selectedPair?: string
  onPairSelect?: (pair: string) => void
}

export default function TopMemePairs({ pairs, selectedPair, onPairSelect }: TopMemePairsProps) {
  if (!pairs || pairs.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Trading Pairs</h2>
            <p className="text-sm text-gray-400">Loading trading pairs...</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Powered by</span>
            <Image
              src="/icons/raydium.svg"
              alt="Raydium"
              width={20}
              height={20}
              className="inline-block"
            />
          </div>
        </div>
        <div className="bg-[#1E222D] rounded-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700/50 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700/50 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Trading Pairs</h2>
          <p className="text-sm text-gray-400">Click on a pair to start trading</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Powered by</span>
          <Image
            src="/icons/raydium.svg"
            alt="Raydium"
            width={20}
            height={20}
            className="inline-block"
          />
        </div>
      </div>
      <div className="overflow-x-auto bg-[#1E222D] rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-700/50">
              <th className="py-3 pl-4">Pair</th>
              <th className="py-3">Price</th>
              <th className="py-3">24h %</th>
              <th className="py-3">24h Volume</th>
              <th className="py-3">Liquidity</th>
              <th className="py-3">Market Cap</th>
              <th className="py-3 pr-4">Contract</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair) => (
              <tr 
                key={pair.pairAddress} 
                className={`border-b border-gray-700/50 hover:bg-gray-800/50 cursor-pointer ${
                  selectedPair === pair.symbol ? 'bg-gray-800/50' : ''
                }`}
                onClick={() => onPairSelect?.(pair.symbol)}
              >
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                      <Image
                        src={pair.image || '/placeholder.png'}
                        alt={pair.symbol}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{pair.symbol}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Image
                          src="/icons/solana.svg"
                          alt="Solana"
                          width={14}
                          height={14}
                          className="inline-block opacity-50"
                        />
                        <Image
                          src={pair.dex.toLowerCase() === 'raydium' ? '/icons/raydium.svg' : '/icons/orca.svg'}
                          alt={pair.dex}
                          width={14}
                          height={14}
                          className="inline-block opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="font-medium">${formatNumber(pair.price)}</div>
                  <div className="text-xs text-gray-400">≈ {formatNumber(pair.price)} {pair.symbol.split('/')[1]}</div>
                </td>
                <td className={`py-4 ${pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatNumber(pair.change24h)}%
                </td>
                <td className="py-4">
                  <div className="font-medium">${formatNumber(pair.volume24h)}</div>
                  <div className="text-xs text-gray-400">{formatNumber(pair.volume24h / pair.price)} {pair.symbol.split('/')[0]}</div>
                </td>
                <td className="py-4">
                  <div className="font-medium">${formatNumber(pair.liquidity)}</div>
                  <div className="text-xs text-gray-400">TVL</div>
                </td>
                <td className="py-4">
                  <div className="font-medium">${formatNumber(pair.marketCap)}</div>
                  <div className="text-xs text-gray-400">FDV</div>
                </td>
                <td className="py-4 pr-4">
                  <div className="font-mono text-xs opacity-50">
                    {pair.tokenAddress?.slice(0, 4)}...{pair.tokenAddress?.slice(-4)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 