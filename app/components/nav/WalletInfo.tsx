'use client'

import { useWallet } from '../../providers/WalletProvider'
import { Button } from '../ui/button'

export default function WalletInfo() {
  const { walletAddress, balance, isConnected, connect, disconnect } = useWallet()

  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <Button 
        onClick={connect}
        className="w-full text-xs py-1.5 h-auto bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg"
      >
        Connect Wallet
      </Button>
    )
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">Wallet</span>
        <Button
          onClick={disconnect}
          className="text-[10px] h-auto py-0.5 px-2 text-gray-400 hover:text-white hover:bg-white/5"
        >
          Disconnect
        </Button>
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-xs font-medium text-gray-300">
            {formatAddress(walletAddress || '')}
          </span>
        </div>
        <span className="text-xs font-medium text-blue-400">
          ${balance.toFixed(2)}
        </span>
      </div>
    </div>
  )
} 