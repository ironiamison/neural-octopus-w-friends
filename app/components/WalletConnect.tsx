'use client'

import { Button } from './ui/button'
import { Wallet } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'

export default function WalletConnect() {
  const { publicKey, isConnected, isPhantomInstalled, connect, disconnect } = useWallet()

  if (!isPhantomInstalled) {
    return (
      <Button
        variant="outline"
        onClick={() => window.open('https://phantom.app/', '_blank')}
      >
        <Wallet className="w-4 h-4 mr-2" />
        Install Phantom
      </Button>
    )
  }

  if (!isConnected) {
    return (
      <Button onClick={connect}>
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <Button variant="outline" onClick={disconnect}>
      <Wallet className="w-4 h-4 mr-2" />
      {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
    </Button>
  )
} 