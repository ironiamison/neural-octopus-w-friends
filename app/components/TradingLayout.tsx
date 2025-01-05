'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface TradingLayoutProps {
  children: React.ReactNode;
}

export default function TradingLayout({ children }: TradingLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Trading</h2>
        </div>
        {children}
      </div>
    </div>
  );
} 