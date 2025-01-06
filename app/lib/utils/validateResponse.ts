import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  AppError,
} from '@/lib/services/error.service'
import { z } from 'zod'

export async function validateResponse<T>(
  response: Response,
  schema: z.ZodType<T>,
  options: {
    errorMessage?: string
    context?: Record<string, any>
  } = {}
): Promise<T> {
  const { errorMessage = 'Invalid response from server', context } = options

  if (!response.ok) {
    let errorData: any
    try {
      errorData = await response.json()
    } catch {
      errorData = { message: response.statusText }
    }

    const status = response.status
    let message = errorData.message || errorMessage

    // Handle specific status codes
    switch (status) {
      case 400:
        throw new ValidationError(message, { ...context, ...errorData })
      case 401:
        throw new AuthenticationError(message, { ...context, ...errorData })
      case 403:
        throw new AuthorizationError(message, { ...context, ...errorData })
      case 404:
        throw new NotFoundError(message, { ...context, ...errorData })
      default:
        throw new AppError(message, 'API_ERROR', status, { ...context, ...errorData })
    }
  }

  let data: unknown
  try {
    data = await response.json()
  } catch (error) {
    throw new ValidationError('Invalid JSON response', {
      ...context,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }

  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Response validation failed', {
        ...context,
        validationErrors: error.errors,
      })
    }
    throw error
  }
}

// Example usage:
/*
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
})

// In an API call:
const response = await fetch('/api/user/123')
const user = await validateResponse(response, userSchema, {
  errorMessage: 'Failed to fetch user',
  context: { userId: '123' },
})
*/ 