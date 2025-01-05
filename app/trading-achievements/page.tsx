'use client'

import React from 'react';
import TradingAchievements from '../components/TradingAchievements';
import Navbar from '../components/ui/Navbar';

const TradingAchievementsPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <TradingAchievements />
    </div>
  );
};

export default TradingAchievementsPage; 