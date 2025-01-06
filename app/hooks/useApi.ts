import { useState, useCallback } from 'react'
import { z } from 'zod'
import { useErrorHandler } from './useErrorHandler'
import { validateResponse } from '@/lib/utils/validateResponse'

interface ApiOptions<T> {
  schema: z.ZodType<T>
  errorMessage?: string
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface ApiState<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
}

export function useApi<T>(url: string, options: ApiOptions<T>) {
  const { schema, errorMessage, onSuccess, onError } = options
  const { handleError } = useErrorHandler()
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  })

  const fetchData = useCallback(async (requestInit?: RequestInit) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch(url, {
        ...requestInit,
        headers: {
          'Content-Type': 'application/json',
          ...requestInit?.headers,
        },
      })

      const data = await validateResponse(response, schema, {
        errorMessage,
        context: { url, method: requestInit?.method || 'GET' },
      })

      setState(prev => ({ ...prev, data, isLoading: false }))
      onSuccess?.(data)

      return data
    } catch (error) {
      const handledError = handleError(error as Error, {
        context: { url, method: requestInit?.method || 'GET' },
      })

      setState(prev => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }))

      onError?.(error as Error)
      return handledError
    }
  }, [url, schema, errorMessage, onSuccess, onError, handleError])

  const get = useCallback(async (params?: Record<string, string>) => {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : ''
    return fetchData({
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
  }, [fetchData])

  const post = useCallback(async (body: unknown) => {
    return fetchData({
      method: 'POST',
      body: JSON.stringify(body),
    })
  }, [fetchData])

  const put = useCallback(async (body: unknown) => {
    return fetchData({
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }, [fetchData])

  const del = useCallback(async () => {
    return fetchData({
      method: 'DELETE',
    })
  }, [fetchData])

  return {
    ...state,
    get,
    post,
    put,
    delete: del,
    refetch: get,
  }
}

// Example usage:
/*
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
})

function UserProfile({ userId }: { userId: string }) {
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useApi(`/api/users/${userId}`, {
    schema: userSchema,
    errorMessage: 'Failed to fetch user profile',
    onSuccess: (data) => {
      console.log('User data loaded:', data)
    },
    onError: (error) => {
      console.error('Error loading user:', error)
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return null

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  )
}
*/ 