'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Book, TrendingUp } from 'lucide-react';
import { ProfileSettings } from '../components/ProfileSettings';
import { LearningProgress } from '../components/LearningProgress';
import { TradingStats } from '../components/TradingStats';

const tabs = [
  { id: 'profile', label: 'Profile', icon: Settings },
  { id: 'learning', label: 'Learning Progress', icon: Book },
  { id: 'trading', label: 'Trading Stats', icon: TrendingUp },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

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