import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { errorService } from './lib/services/error.service'

export async function middleware(request: NextRequest) {
  try {
    // Add request ID for tracking
    const requestId = crypto.randomUUID()
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-request-id', requestId)

    // Add basic security headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    
    // Content Security Policy
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' blob: data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:;"
    )

    return response
  } catch (error: any) {
    // Handle any errors that occur in middleware
    console.error('Middleware error:', error)
    
    const errorResponse = errorService.handleError(error, {
      endpoint: request.nextUrl.pathname,
      method: request.method,
    })

    return NextResponse.json(
      errorResponse.error,
      { status: errorResponse.statusCode }
    )
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 