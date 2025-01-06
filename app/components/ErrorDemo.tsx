'use client'

import { useState } from 'react'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { ValidationError, AuthenticationError, NotFoundError } from '@/lib/services/error.service'
import { Button } from '@/components/ui/button'

export default function ErrorDemo() {
  const { handleError, wrapAsync } = useErrorHandler()
  const [loading, setLoading] = useState(false)

  // Simulated API call that might fail
  const simulateApiCall = async () => {
    setLoading(true)
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Randomly throw different types of errors
      const random = Math.random()
      if (random < 0.25) {
        throw new ValidationError('Invalid input data', {
          field: 'email',
          value: 'invalid-email',
        })
      } else if (random < 0.5) {
        throw new AuthenticationError('Session expired')
      } else if (random < 0.75) {
        throw new NotFoundError('Resource not found')
      } else {
        throw new Error('Unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  // Wrap the API call with error handling
  const handleClick = wrapAsync(simulateApiCall, {
    context: {
      component: 'ErrorDemo',
      action: 'simulateApiCall',
    },
  })

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Error Handling Demo</h2>
        
        <p className="text-gray-400 text-sm">
          Click the button below to simulate different types of errors. Each click will randomly
          generate one of the following:
        </p>

        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
          <li>Validation Error</li>
          <li>Authentication Error</li>
          <li>Not Found Error</li>
          <li>Unknown Error</li>
        </ul>

        <Button
          onClick={handleClick}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Simulating...' : 'Trigger Random Error'}
        </Button>

        <div className="text-xs text-gray-500">
          Check the console and toast notifications for error details.
        </div>
      </div>
    </div>
  )
} 