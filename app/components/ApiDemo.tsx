'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useApi } from '@/hooks/useApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

// Define the user schema
const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  walletAddress: z.string(),
  portfolio: z.object({
    balance: z.number(),
  }).nullable(),
})

type User = z.infer<typeof userSchema>

export default function ApiDemo() {
  const [walletAddress, setWalletAddress] = useState('')
  
  const {
    data: user,
    error,
    isLoading,
    get: fetchUser,
  } = useApi<User>('/api/users', {
    schema: userSchema,
    errorMessage: 'Failed to fetch user data',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetchUser({ walletAddress })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">API Hook Demo</h2>
        <p className="text-gray-400 text-sm">
          Enter a wallet address to fetch user data. Try these scenarios:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-400 mt-2 space-y-1">
          <li>Valid address: Will fetch user data</li>
          <li>Invalid address: Will show validation error</li>
          <li>Non-existent address: Will show not found error</li>
          <li>Empty address: Will show validation error</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Enter wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Fetching...
            </>
          ) : (
            'Fetch User'
          )}
        </Button>
      </form>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-400">
            {error.message}
          </p>
        </div>
      )}

      {user && (
        <div className="p-4 bg-gray-800 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Username</span>
            <span className="font-medium">{user.username}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Wallet</span>
            <span className="font-medium">{user.walletAddress}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Balance</span>
            <span className="font-medium">
              {user.portfolio?.balance.toLocaleString()} USDC
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 