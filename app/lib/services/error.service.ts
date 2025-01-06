import { toast } from 'sonner';
import * as Sentry from '@sentry/nextjs';

// Custom error types
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, metadata);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, 'AUTHENTICATION_ERROR', 401, metadata);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, 'AUTHORIZATION_ERROR', 403, metadata);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, metadata?: Record<string, any>) {
    super(message, 'NOT_FOUND_ERROR', 404, metadata);
    this.name = 'NotFoundError';
  }
}

// Error reporting service configuration
interface ErrorReportingConfig {
  environment: 'development' | 'production' | 'test';
  sentryDsn?: string;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

class ErrorService {
  private config: ErrorReportingConfig;

  constructor(config: ErrorReportingConfig) {
    this.config = config;
    this.initializeSentry();
  }

  // Initialize Sentry
  private initializeSentry() {
    if (this.config.environment === 'production' && this.config.sentryDsn) {
      Sentry.init({
        dsn: this.config.sentryDsn,
        environment: this.config.environment,
        tracesSampleRate: 1.0,
        debug: false,
        enabled: true,
      });
    }
  }

  // Main error handling method
  handleError(error: Error | AppError, context?: Record<string, any>) {
    // Log the error
    this.logError(error, context);

    // Report to Sentry in production
    if (this.config.environment === 'production') {
      this.reportToSentry(error, context);
    }

    // Show user-friendly notification
    this.notifyUser(error);

    // Return appropriate error response
    return this.formatErrorResponse(error);
  }

  // Log error with appropriate level
  private logError(error: Error | AppError, context?: Record<string, any>) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
      ...(error instanceof AppError && {
        code: error.code,
        statusCode: error.statusCode,
        metadata: error.metadata,
      }),
    };

    if (this.config.logLevel === 'debug') {
      console.debug('Error details:', errorLog);
    } else {
      console.error('Error occurred:', errorLog);
    }
  }

  // Report error to Sentry
  private reportToSentry(error: Error | AppError, context?: Record<string, any>) {
    if (this.config.environment === 'production') {
      Sentry.withScope((scope) => {
        // Add additional context
        if (context) {
          scope.setExtras(context);
        }

        // Add error metadata if available
        if (error instanceof AppError) {
          scope.setTags({
            code: error.code,
            statusCode: error.statusCode.toString(),
          });
          if (error.metadata) {
            scope.setExtras(error.metadata);
          }
        }

        // Capture the error
        Sentry.captureException(error);
      });
    }
  }

  // Show user-friendly notification
  private notifyUser(error: Error | AppError) {
    let message = 'An unexpected error occurred';
    let description = 'Please try again later';

    if (error instanceof ValidationError) {
      message = 'Invalid Input';
      description = error.message;
    } else if (error instanceof AuthenticationError) {
      message = 'Authentication Failed';
      description = 'Please sign in again';
    } else if (error instanceof AuthorizationError) {
      message = 'Access Denied';
      description = 'You do not have permission to perform this action';
    } else if (error instanceof NotFoundError) {
      message = 'Not Found';
      description = error.message;
    }

    toast.error(message, {
      description,
      duration: 5000,
    });
  }

  // Format error for API responses
  private formatErrorResponse(error: Error | AppError) {
    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(this.config.environment === 'development' && {
            stack: error.stack,
            metadata: error.metadata,
          }),
        },
        statusCode: error.statusCode,
      };
    }

    // Generic error response
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        ...(this.config.environment === 'development' && {
          stack: error.stack,
        }),
      },
      statusCode: 500,
    };
  }
}

// Create and export singleton instance
export const errorService = new ErrorService({
  environment: process.env.NODE_ENV as 'development' | 'production' | 'test',
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  logLevel: (process.env.LOG_LEVEL as 'error' | 'warn' | 'info' | 'debug') || 'error',
}); 