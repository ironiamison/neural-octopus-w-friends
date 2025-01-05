import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`px-3 py-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  )
} 