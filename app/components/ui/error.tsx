import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-900/20 border border-red-500/50 rounded-md p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-400">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function ErrorContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[200px]">
      {children}
    </div>
  );
} 