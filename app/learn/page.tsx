'use client';

import { Award } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import dynamic from 'next/dynamic';
import { MotionDiv } from '../components/motion';

const CryptoLearning = dynamic(() => import('../components/CryptoLearning'), {
  ssr: false,
  loading: () => <LoadingState />
});

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <Card className="bg-[#1E222D] border-[#2A2D35] h-full opacity-50">
            <CardHeader>
              <div className="h-6 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-2 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-6 bg-gray-700 rounded w-20"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

function Header() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div>
        <h2 className="text-3xl font-bold mb-2">Crypto Trading Academy</h2>
        <p className="text-muted-foreground">
          Learn from a16z experts and leading industry resources to master cryptocurrency trading
        </p>
      </div>
      <Badge variant="outline" className="bg-[#1E222D] border-[#2A2D35]">
        <Award className="w-4 h-4 mr-1 text-[#F0B90B]" />
        <span>Expert Curated</span>
      </Badge>
    </MotionDiv>
  );
}

export default function LearnPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Header />
      <CryptoLearning />
    </div>
  );
} 