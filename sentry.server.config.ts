import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  // Enable performance monitoring
  enableTracing: true,

  // Capture errors in development
  enabled: process.env.NODE_ENV === 'production',

  // Configure sampling rates
  sampleRate: 1.0,
  profilesSampleRate: 1.0,

  // Set environment
  environment: process.env.NODE_ENV,

  // Configure source maps
  includeLocalVariables: true,

  // Add custom tags
  tags: {
    service: 'neural-octopus-api',
  },

  // Configure error grouping
  beforeSend(event) {
    // Don't send errors in development
    if (process.env.NODE_ENV === 'development') {
      return null
    }

    // Clean sensitive data
    if (event.request?.headers) {
      delete event.request.headers['authorization']
      delete event.request.headers['cookie']
    }

    return event
  },
}) 