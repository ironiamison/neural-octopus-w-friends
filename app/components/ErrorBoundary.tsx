'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { errorService } from '@/lib/services/error.service'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error
    errorService.handleError(error, {
      componentStack: errorInfo.componentStack,
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="max-w-md w-full mx-auto p-6">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              
              <h2 className="text-xl font-semibold text-white text-center mb-2">
                Something went wrong
              </h2>
              
              <p className="text-gray-400 text-center mb-6">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>

              <div className="space-y-4">
                <button
                  onClick={this.handleRetry}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  <span>Try again</span>
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Reload page
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-6 p-4 rounded-lg bg-gray-900 overflow-auto">
                  <pre className="text-xs text-gray-400">
                    {this.state.error.stack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 