import { useCallback } from 'react'
import { errorService } from '@/lib/services/error.service'

interface ErrorHandlerOptions {
  context?: Record<string, any>
  rethrow?: boolean
}

export function useErrorHandler() {
  const handleError = useCallback((error: Error, options: ErrorHandlerOptions = {}) => {
    const { context, rethrow = false } = options

    // Handle the error using our error service
    const errorResponse = errorService.handleError(error, {
      ...context,
      source: 'component',
    })

    // Optionally rethrow the error (useful in async functions)
    if (rethrow) {
      throw error
    }

    return errorResponse
  }, [])

  const wrapAsync = useCallback(<T>(
    fn: (...args: any[]) => Promise<T>,
    options: ErrorHandlerOptions = {}
  ) => {
    return async (...args: any[]): Promise<T> => {
      try {
        return await fn(...args)
      } catch (error) {
        handleError(error as Error, options)
        throw error
      }
    }
  }, [handleError])

  return {
    handleError,
    wrapAsync,
  }
} 