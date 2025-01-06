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

  // Configure allowed domains for CSP
  allowUrls: [
    /https?:\/\/[^/]*neural-octopus\.com/,
    /https?:\/\/[^/]*vercel\.app/,
  ],

  // Ignore certain errors
  ignoreErrors: [
    // Random plugins/extensions
    'top.GLOBALS',
    'canvas.contentDocument',
    /^Script error\.?$/,
  ],
}) 