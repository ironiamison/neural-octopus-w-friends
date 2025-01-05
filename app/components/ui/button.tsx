import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-150 text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  )
} 