'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '../providers/WalletProvider';
import WalletConnect from '../components/WalletConnect';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { motion } from 'framer-motion';
import { Wallet, ChartBar, Trophy, BookOpen, ArrowRight, Lock } from 'lucide-react';
import { LearningModule, LearningProgress, LearningService } from '../lib/services/learning.service';
import ClientOnly from '../components/ClientOnly';

export default function ProfilePage() {
  const { publicKey, isConnected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [progress, setProgress] = useState<LearningProgress[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function getBalance() {
      if (publicKey) {
        try {
          // For demo purposes, setting a mock balance
          setBalance(Math.random() * 100);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(null);
        }
      }
    }

    getBalance();
  }, [publicKey]);

  useEffect(() => {
    async function loadLearningData() {
      if (publicKey) {
        try {
          const [modulesData, progressData] = await Promise.all([
            LearningService.getModules(),
            LearningService.getUserProgress(publicKey.toString())
          ]);
          setModules(modulesData);
          setProgress(progressData);
        } catch (error) {
          console.error('Error loading learning data:', error);
        }
      }
    }

    loadLearningData();
  }, [publicKey]);

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <ClientOnly>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                Welcome to PaperMemes
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Connect your wallet to access your personalized trading dashboard
              </p>
            </motion.div>
          </ClientOnly>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <ClientOnly>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-gray-700"
              >
                <Wallet className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Trading</h3>
                <p className="text-gray-400">Trade with confidence using your connected wallet</p>
              </motion.div>
            </ClientOnly>

            <ClientOnly>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-gray-700"
              >
                <ChartBar className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Track Performance</h3>
                <p className="text-gray-400">Monitor your trading history and analytics</p>
              </motion.div>
            </ClientOnly>

            <ClientOnly>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-gray-700"
              >
                <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
                <p className="text-gray-400">Complete challenges and earn rewards</p>
              </motion.div>
            </ClientOnly>
          </div>

          <ClientOnly>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center"
            >
              <WalletConnect />
            </motion.div>
          </ClientOnly>
        </div>
      </div>
    );
  }

  const learningContent = (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span>Learning Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {modules.map((module) => {
            const moduleProgress = progress.find(p => p.moduleId === module.id);
            const isAvailable = module.requiredModules.length === 0 || 
              module.requiredModules.every(reqId => 
                progress.some(p => p.moduleId === reqId && p.completed)
              );

            return (
              <div key={module.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div>
                      <h3 className="font-semibold flex items-center space-x-2">
                        <span>{module.title}</span>
                        {!isAvailable && <Lock className="w-4 h-4 text-gray-400" />}
                      </h3>
                      <p className="text-sm text-gray-400">{module.description}</p>
                    </div>
                  </div>
                  {moduleProgress ? (
                    <Badge className={moduleProgress.completed ? 'bg-green-500/20 text-green-400' : ''}>
                      {moduleProgress.progress}% Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {isAvailable ? 'Not Started' : 'Locked'}
                    </Badge>
                  )}
                </div>
                <Progress 
                  value={moduleProgress?.progress || 0} 
                  className={`bg-gray-700 ${!isAvailable ? 'opacity-50' : ''}`}
                />
                {moduleProgress && moduleProgress.quizScores && moduleProgress.quizScores.length > 0 && (
                  <div className="mt-2 text-sm text-gray-400">
                    Latest Quiz Score: {moduleProgress.quizScores[moduleProgress.quizScores.length - 1].score}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
              Your Profile
            </h1>
            <div className="flex items-center space-x-4">
              <p className="text-gray-400">
                Wallet: {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
              </p>
              {balance !== null && (
                <Badge variant="secondary" className="text-sm">
                  Balance: {balance.toFixed(2)} SOL
                </Badge>
              )}
            </div>
          </div>
          <WalletConnect />
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-gray-800/50 p-1 rounded-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-gray-700">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="learning" className="data-[state=active]:bg-gray-700">
              Learning
            </TabsTrigger>
            <TabsTrigger value="trading" className="data-[state=active]:bg-gray-700">
              Trading
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ChartBar className="w-5 h-5 text-blue-400" />
                    <span>Trading Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Win Rate</span>
                        <span className="font-semibold">65%</span>
                      </div>
                      <Progress value={65} className="bg-gray-700" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Trades</span>
                      <span className="font-semibold">42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Profit/Loss</span>
                      <span className="text-green-400 font-semibold">+2.45 ETH</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span>Recent Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-500/20 text-green-400">Completed</Badge>
                        <span>First Trade</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-500/20 text-green-400">Completed</Badge>
                        <span>5 Successful Trades</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">In Progress</Badge>
                        <span>Learning Module 1</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span>Your Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">Trading Master</h3>
                        <p className="text-sm text-gray-400">Complete 100 successful trades</p>
                      </div>
                      <Progress value={42} className="w-24 bg-gray-700" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">Diamond Hands</h3>
                        <p className="text-sm text-gray-400">Hold a position for 7 days</p>
                      </div>
                      <Progress value={85} className="w-24 bg-gray-700" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning">
            {learningContent}
          </TabsContent>

          <TabsContent value="trading">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChartBar className="w-5 h-5 text-blue-400" />
                  <span>Trading History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <h3 className="font-semibold">ETH/USDT</h3>
                      <p className="text-sm text-gray-400">Long @ 2,450</p>
                    </div>
                    <span className="text-green-400 font-semibold">+0.5 ETH</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <h3 className="font-semibold">BTC/USDT</h3>
                      <p className="text-sm text-gray-400">Short @ 45,000</p>
                    </div>
                    <span className="text-red-400 font-semibold">-0.2 BTC</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 