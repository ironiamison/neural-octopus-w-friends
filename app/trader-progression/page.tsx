'use client'

import React from 'react';
import TraderProgression from '../components/TraderProgression';
import Navbar from '../components/ui/Navbar';

const TraderProgressionPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <TraderProgression />
    </div>
  );
};

export default TraderProgressionPage; 