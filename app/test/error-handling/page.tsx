'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import ErrorDemo from '@/components/ErrorDemo'
import ApiDemo from '@/components/ApiDemo'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function ErrorHandlingTest() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Error Handling System Demo</h1>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="demo">Error Demo</TabsTrigger>
            <TabsTrigger value="api">API Demo</TabsTrigger>
            <TabsTrigger value="boundary">Error Boundary</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="prose prose-invert max-w-none">
              <h2>Error Handling Features</h2>
              
              <ul>
                <li>Centralized error handling through ErrorService</li>
                <li>Custom error types for different scenarios</li>
                <li>Integration with Sentry for error tracking</li>
                <li>User-friendly error notifications</li>
                <li>Error boundaries for component-level error handling</li>
                <li>Custom hook for handling errors in components</li>
                <li>API response validation with Zod</li>
                <li>Type-safe API hooks with error handling</li>
              </ul>

              <h3>Error Types</h3>
              
              <ul>
                <li><strong>ValidationError</strong> - For invalid input data</li>
                <li><strong>AuthenticationError</strong> - For authentication issues</li>
                <li><strong>AuthorizationError</strong> - For permission issues</li>
                <li><strong>NotFoundError</strong> - For missing resources</li>
                <li><strong>AppError</strong> - Base class for custom errors</li>
              </ul>

              <h3>Error Handling Process</h3>
              
              <ol>
                <li>Error is caught by error handler</li>
                <li>Error is logged with context</li>
                <li>Error is reported to Sentry in production</li>
                <li>User is notified via toast message</li>
                <li>Appropriate error response is returned</li>
              </ol>

              <h3>API Error Handling</h3>

              <ul>
                <li>Automatic response validation with Zod schemas</li>
                <li>Type-safe API responses</li>
                <li>Consistent error handling across all API calls</li>
                <li>Loading and error states management</li>
                <li>Retry and refresh capabilities</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="demo" className="mt-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <ErrorDemo />
            </div>
          </TabsContent>

          <TabsContent value="api" className="mt-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <ApiDemo />
            </div>
          </TabsContent>

          <TabsContent value="boundary" className="mt-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <ErrorBoundary>
                <BuggyCounter />
              </ErrorBoundary>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Buggy counter component to demonstrate error boundary
function BuggyCounter() {
  const [count, setCount] = useState(0)

  if (count === 5) {
    throw new Error('I crashed!')
  }

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-4">
        Error Boundary Demo
      </h3>
      
      <p className="text-gray-400 mb-4">
        This counter will crash when it reaches 5. The error will be caught by the error boundary.
      </p>

      <div className="text-4xl font-bold mb-4">
        {count}
      </div>

      <Button
        onClick={() => setCount((c: number) => c + 1)}
        className="w-full max-w-xs"
      >
        Increment Counter
      </Button>
    </div>
  )
} 