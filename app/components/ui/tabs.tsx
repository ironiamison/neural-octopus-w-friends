import React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

interface TabsProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
}

export function Tabs({ defaultValue, children, className = '' }: TabsProps) {
  return (
    <TabsPrimitive.Root defaultValue={defaultValue} className={className}>
      {children}
    </TabsPrimitive.Root>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <TabsPrimitive.List className={`flex rounded-lg ${className}`}>
      {children}
    </TabsPrimitive.List>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={`px-4 py-2 text-sm font-medium transition-colors data-[state=active]:bg-[#1E222D] data-[state=active]:text-white ${className}`}
    >
      {children}
    </TabsPrimitive.Trigger>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  return (
    <TabsPrimitive.Content value={value} className={className}>
      {children}
    </TabsPrimitive.Content>
  )
} 