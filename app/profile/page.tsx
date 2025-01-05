'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

export default function ProfilePage() {
  const { publicKey, isConnected, connection } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    async function getBalance() {
      if (publicKey && connection) {
        try {
          const solanaPublicKey = new PublicKey(publicKey);
          const balance = await connection.getBalance(solanaPublicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(null);
        }
      }
    }

    getBalance();
  }, [publicKey, connection]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
        <p className="text-gray-400">Connect your Phantom wallet to view your profile</p>
        <WalletConnect />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-gray-400">Manage your profile and settings</p>
          {balance !== null && (
            <p className="text-sm text-gray-400 mt-1">
              Balance: {balance.toFixed(4)} SOL
            </p>
          )}
        </div>
        <WalletConnect />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Trading Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Win Rate</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} />
                  <div className="flex justify-between">
                    <span>Total Trades</span>
                    <span>42</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit/Loss</span>
                    <span className="text-green-500">+2.45 ETH</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>First Trade</span>
                    <Badge>Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>5 Successful Trades</span>
                    <Badge>Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Learning Module 1</span>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Achievement items will be mapped here */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Trading Master</h3>
                    <p className="text-sm text-gray-400">Complete 100 successful trades</p>
                  </div>
                  <Progress value={42} className="w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Learning modules will be mapped here */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Trading Basics</h3>
                    <Badge>75% Complete</Badge>
                  </div>
                  <Progress value={75} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading">
          <Card>
            <CardHeader>
              <CardTitle>Trading History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Trading history will be mapped here */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">ETH/USDT</h3>
                    <p className="text-sm text-gray-400">Long @ 2,450</p>
                  </div>
                  <span className="text-green-500">+0.5 ETH</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 