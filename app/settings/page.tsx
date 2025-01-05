'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Book, TrendingUp, ChartBar, Trophy, Wallet } from 'lucide-react';
import ProfileSettings from '../components/ProfileSettings';
import LearningProgress from '../components/LearningProgress';
import { TradingStats } from '../components/TradingStats';
import { useWallet } from '../providers/WalletProvider';
import WalletConnect from '../components/WalletConnect';

const tabs = [
  { id: 'profile', label: 'Profile', icon: Settings },
  { id: 'learning', label: 'Learning Progress', icon: Book },
  { id: 'trading', label: 'Trading Stats', icon: TrendingUp },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
              Customize Your Experience
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Connect your wallet to access your profile settings and preferences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-gray-700"
            >
              <Wallet className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Profile</h3>
              <p className="text-gray-400">Your profile is securely linked to your wallet</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-gray-700"
            >
              <ChartBar className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-400">Monitor your learning and trading journey</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-gray-700"
            >
              <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Achievements</h3>
              <p className="text-gray-400">View and unlock trading achievements</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <WalletConnect />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pl-[240px]">
      <div className="container mx-auto py-8">
        <div className="flex flex-col space-y-8">
          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                    activeTab === tab.id
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'learning' && <LearningProgress />}
            {activeTab === 'trading' && <TradingStats />}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 