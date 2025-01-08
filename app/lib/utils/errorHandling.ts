export class TradingError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'low' | 'medium' | 'high' = 'medium',
    public userMessage?: string
  ) {
    super(message)
    this.name = 'TradingError'
  }
}

export const ERROR_CODES = {
  WALLET_CONNECTION: 'WALLET_001',
  INSUFFICIENT_BALANCE: 'TRADE_001',
  INVALID_AMOUNT: 'TRADE_002',
  PRICE_FETCH_FAILED: 'PRICE_001',
  ORDER_FAILED: 'ORDER_001',
  CHART_ERROR: 'CHART_001',
  SIMULATION_ERROR: 'SIM_001',
} as const

export function handleError(error: unknown, context: string): TradingError {
  console.error(`Error in ${context}:`, error)

  if (error instanceof TradingError) {
    return error
  }

  if (error instanceof Error) {
    return new TradingError(
      error.message,
      'UNKNOWN_001',
      'medium',
      'An unexpected error occurred. Please try again.'
    )
  }

  return new TradingError(
    'Unknown error occurred',
    'UNKNOWN_002',
    'low',
    'Something went wrong. Please try again.'
  )
}

export function getUserFriendlyMessage(error: TradingError): string {
  return error.userMessage || 'An unexpected error occurred. Please try again.'
}

// Helper to log errors to a monitoring service (implement this later)
export function logError(error: TradingError, context: string): void {
  // TODO: Implement error logging service integration
  console.error(`[${error.code}] Error in ${context}:`, error.message)
} 