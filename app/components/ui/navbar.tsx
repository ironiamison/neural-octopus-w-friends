'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="bg-gray-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">papermemes.fun</div>
        <div className="space-x-4">
          <div className="relative inline-block text-left">
            <div>
              <button
                onClick={() => setIsTradeOpen(!isTradeOpen)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Trade
              </button>
            </div>
            {isTradeOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
                <Link href="#trade" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Market Orders</Link>
                <Link href="#trade" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Limit Orders</Link>
                <Link href="#trade" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Paper Trading</Link>
              </div>
            )}
          </div>

          <div className="relative inline-block text-left">
            <div>
              <button
                onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Analytics
              </button>
            </div>
            {isAnalyticsOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
                <Link href="#analytics" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Performance Metrics</Link>
                <Link href="#analytics" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Market Trends</Link>
              </div>
            )}
          </div>

          <div className="relative inline-block text-left">
            <div>
              <button
                onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Portfolio
              </button>
            </div>
            {isPortfolioOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
                <Link href="#portfolio" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">My Holdings</Link>
                <Link href="#portfolio" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Transaction History</Link>
              </div>
            )}
          </div>

          <div className="relative inline-block text-left">
            <div>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Settings
              </button>
            </div>
            {isSettingsOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
                <Link href="#settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Account Settings</Link>
                <Link href="#settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">API Keys</Link>
              </div>
            )}
          </div>

          <div className="relative inline-block text-left">
            <div>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Profile
              </button>
            </div>
            {isProfileOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg">
                <Link href="/trader-progression" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Trader Progression</Link>
                <Link href="#settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Settings</Link>
                <Link href="/trading-achievements" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Trading Achievements</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 