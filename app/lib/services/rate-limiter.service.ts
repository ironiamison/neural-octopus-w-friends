interface RateLimit {
  count: number
  lastReset: number
}

const WINDOW_MS = 60000 // 1 minute
const MAX_REQUESTS = {
  TRADE: 10,
  AUTH: 5,
  DEFAULT: 30
}

class RateLimiter {
  private limits: Map<string, RateLimit>

  constructor() {
    this.limits = new Map()
  }

  private getKey(userId: string, action: string): string {
    return `${userId}:${action}`
  }

  private getRateLimit(key: string): RateLimit {
    const now = Date.now()
    let limit = this.limits.get(key)

    if (!limit || now - limit.lastReset > WINDOW_MS) {
      limit = { count: 0, lastReset: now }
      this.limits.set(key, limit)
    }

    return limit
  }

  async checkRateLimit(userId: string, action: string): Promise<boolean> {
    const key = this.getKey(userId, action)
    const limit = this.getRateLimit(key)
    const maxRequests = MAX_REQUESTS[action as keyof typeof MAX_REQUESTS] || MAX_REQUESTS.DEFAULT

    if (limit.count >= maxRequests) {
      return false
    }

    limit.count++
    return true
  }

  async resetLimit(userId: string, action: string): Promise<void> {
    const key = this.getKey(userId, action)
    this.limits.delete(key)
  }
}

export const rateLimiter = new RateLimiter() 