'use client';

import { Award, Bot, BookOpen, Star } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import dynamic from 'next/dynamic';
import { MotionDiv } from '../components/motion';
import { useWallet } from '../providers/WalletProvider';

const CryptoLearning = dynamic(() => import('../components/CryptoLearning'), {
  ssr: false,
  loading: () => <LoadingState />
});

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <Card className="bg-[#1E222D]/50 backdrop-blur-md border-gray-800 hover:border-indigo-500/50 transition-all duration-300 h-full">
            <CardHeader>
              <div className="h-6 bg-gray-700/50 rounded w-1/4 mb-2"></div>
              <div className="h-8 bg-gray-700/50 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-2 bg-gray-700/50 rounded"></div>
                <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-6 bg-gray-700/50 rounded w-20"></div>
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
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Crypto Trading Academy
          </h2>
          <p className="text-gray-400">
            Learn from a16z experts and leading industry resources to master cryptocurrency trading
          </p>
        </div>
        <Badge variant="outline" className="bg-[#1E222D]/50 backdrop-blur-md border-indigo-500/50">
          <Award className="w-4 h-4 mr-1 text-indigo-400" />
          <span className="text-indigo-400">Expert Curated</span>
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800 hover:border-indigo-500/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-500/20 p-3 rounded-xl">
              <Bot className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold">AI-Enhanced</h3>
              <p className="text-sm text-gray-400">Learning Experience</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Personalized learning paths and adaptive content powered by AI
          </p>
        </div>

        <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800 hover:border-indigo-500/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/20 p-3 rounded-xl">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold">Expert Content</h3>
              <p className="text-sm text-gray-400">Industry Leaders</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Curated content from top traders and industry experts
          </p>
        </div>

        <div className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-6 border border-gray-800 hover:border-indigo-500/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-pink-500/20 p-3 rounded-xl">
              <Star className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold">Earn Rewards</h3>
              <p className="text-sm text-gray-400">Learn & Earn</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Complete modules to earn XP and unlock exclusive rewards
          </p>
        </div>
      </div>
    </MotionDiv>
  );
}

export default function LearnPage() {
  const { isConnected } = useWallet();

  return (
    <div className="space-y-8">
      <Header />
      <CryptoLearning />
    </div>
  );
} 