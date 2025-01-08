'use client'

import { useState, useEffect } from 'react'
import { Trophy, Users, Clock, TrendingUp, Award, ChevronRight, Star, ArrowLeft, Sparkles, Flame, Zap, Crown, Lock } from 'lucide-react'
import { useToast } from '../components/ui/use-toast'
import { useWallet } from '../providers/WalletProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { mockTournaments, exclusiveTournaments, Tournament } from '../lib/mock/tournaments'
import { ConnectWalletPrompt } from '../components/ConnectWalletPrompt'

const MotionDiv = motion.div

export default function TournamentsPage() {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { isConnected, walletAddress } = useWallet()

  useEffect(() => {
    // Simulate loading delay for dramatic effect
    setTimeout(() => {
      setTournaments(isConnected ? exclusiveTournaments : [])
      setIsLoading(false)
    }, 1500)
  }, [isConnected])

  const handleRegister = async (tournamentId: string) => {
    if (!isConnected) {
      toast({
        title: '🔒 Wallet Connection Required',
        description: 'Connect your wallet to unlock exclusive tournament rewards!',
        variant: 'destructive'
      })
      return
    }

    try {
      const response = await fetch('/api/tournaments/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress,
          tournamentId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register for tournament')
      }

      toast({
        title: '🎉 Registration Successful!',
        description: 'Welcome to the tournament! Get ready to trade and win big!',
        variant: 'default'
      })

      // Refresh tournaments to update participant count
      const updatedTournaments = tournaments.map(t => 
        t.id === tournamentId 
          ? { ...t, participants: t.participants + 1 }
          : t
      )
      setTournaments(updatedTournaments)
    } catch (error: any) {
      console.error('Error registering for tournament:', error)
      toast({
        title: '❌ Registration Failed',
        description: error.message || 'Failed to register. Please try again later.',
        variant: 'destructive'
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-white p-8 flex flex-col items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-8 border-blue-500/20 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-t-8 border-blue-500 animate-spin"></div>
          <Trophy className="absolute inset-0 m-auto h-12 w-12 text-blue-500 animate-bounce" />
        </div>
        <h2 className="mt-8 text-2xl font-bold animate-pulse">Loading Epic Tournaments...</h2>
        <p className="mt-2 text-gray-400">Prepare for glory!</p>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <ConnectWalletPrompt 
            title="Elite Trading Tournaments"
            description="Connect your wallet to access exclusive high-stakes trading competitions"
            features={[
              {
                title: "Massive Prize Pools",
                description: "Compete for prize pools up to $2M USDT",
                icon: "💰"
              },
              {
                title: "Elite Status",
                description: "Join the top 1% of traders",
                icon: "👑"
              },
              {
                title: "Exclusive Rewards",
                description: "Win NFTs, special access, and more",
                icon: "🏆"
              }
            ]}
          />
        </div>
      </div>
    )
  }

  // Authenticated user view
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0E11] to-[#1C2127] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Your Tournaments</h1>
              <p className="mt-2 text-gray-400">Compete in exclusive high-stakes trading competitions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="text-yellow-500 font-semibold">Elite Trader</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Trophy className="h-5 w-5 text-blue-500" />
                <span className="text-blue-500 font-semibold">$4.25M Won</span>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1C2127]/50 rounded-xl p-6 border border-[#2A2D35] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Trophy className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">12</h3>
                  <p className="text-gray-400">Tournaments Won</p>
                </div>
              </div>
            </div>
            <div className="bg-[#1C2127]/50 rounded-xl p-6 border border-[#2A2D35] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">892%</h3>
                  <p className="text-gray-400">Best Tournament ROI</p>
                </div>
              </div>
            </div>
            <div className="bg-[#1C2127]/50 rounded-xl p-6 border border-[#2A2D35] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Top 1%</h3>
                  <p className="text-gray-400">Global Ranking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Tournaments */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Active & Upcoming Tournaments</h2>
            <div className="grid gap-6">
              {tournaments.map((tournament, index) => (
                <MotionDiv
                  key={tournament.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-20 group-hover:opacity-100 transition-opacity blur"></div>
                  <div className="relative bg-[#1C2127]/90 rounded-xl p-6 backdrop-blur-xl border border-[#2A2D35]/50">
                    <div className="absolute top-0 right-0 mt-6 mr-6">
                      <div className="px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/20 animate-pulse">
                        <span className="text-blue-400 font-semibold">{tournament.highlight}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <Trophy className="h-12 w-12 text-yellow-400" />
                        <div className="absolute inset-0 text-yellow-400 animate-ping opacity-20">
                          <Trophy className="h-12 w-12" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-2xl font-bold">{tournament.title}</h3>
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-400 border border-purple-500/20">
                            Registration Opening Soon
                          </span>
                        </div>
                        <p className="text-gray-400 mb-4">{tournament.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-400" />
                            <span className="font-bold text-yellow-400">{tournament.prizePool}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-400" />
                            <span className="text-blue-400">{tournament.participants}/{tournament.maxParticipants}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-green-400" />
                            <span className="text-green-400">{new Date(tournament.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-purple-400" />
                            <span className="text-purple-400">{tournament.entryFee}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setSelectedTournament(tournament)}
                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white font-semibold transition-colors flex items-center gap-2 group"
                          >
                            View Details
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button
                            className="px-6 py-3 rounded-lg bg-yellow-500/20 text-yellow-500 font-semibold transition-colors flex items-center gap-2"
                            disabled
                          >
                            <Lock className="h-4 w-4" />
                            Registration Opening Soon
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>

          {/* Tournament History */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Tournament History</h2>
            <div className="bg-[#1C2127]/50 rounded-xl overflow-hidden border border-[#2A2D35]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A2D35]">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Tournament</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Position</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Prize</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#2A2D35]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        <span className="font-semibold">Mega Bull Run 2023</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">Dec 15, 2023</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">
                        1st Place 🏆
                      </span>
                    </td>
                    <td className="px-6 py-4 text-green-400 font-semibold">$125,000 USDT</td>
                    <td className="px-6 py-4 text-green-400">+892%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-5 w-5 text-gray-400" />
                        <span className="font-semibold">DeFi Masters League</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">Nov 30, 2023</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/20">
                        3rd Place 🥉
                      </span>
                    </td>
                    <td className="px-6 py-4 text-green-400 font-semibold">$50,000 USDT</td>
                    <td className="px-6 py-4 text-green-400">+456%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 