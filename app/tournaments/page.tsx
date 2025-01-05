'use client'

import { useState } from 'react'
import { Trophy, Users, Clock, TrendingUp, Award, ChevronRight, Star } from 'lucide-react'

interface Tournament {
  id: string
  title: string
  description: string
  status: 'upcoming' | 'ongoing' | 'completed'
  startDate: string
  endDate: string
  participants: number
  maxParticipants: number
  prizePool: string
  entryFee: string
  rules: string[]
  rewards: {
    position: string
    prize: string
  }[]
}

const tournaments: Tournament[] = [
  {
    id: '1',
    title: 'Meme Coin Trading Championship',
    description: 'Compete against the best traders in this high-stakes meme coin trading competition.',
    status: 'ongoing',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    participants: 128,
    maxParticipants: 256,
    prizePool: '10,000 USDC',
    entryFee: '50 USDC',
    rules: [
      'Start with 10,000 USDC paper trading balance',
      'Trade only from the approved meme coin list',
      'Maximum leverage: 10x',
      'Minimum 5 trades required',
      'No external funding allowed'
    ],
    rewards: [
      { position: '1st Place', prize: '5,000 USDC' },
      { position: '2nd Place', prize: '2,500 USDC' },
      { position: '3rd Place', prize: '1,500 USDC' },
      { position: '4th-10th Place', prize: '100 USDC' }
    ]
  },
  {
    id: '2',
    title: 'Weekly Trading Challenge',
    description: 'A fast-paced weekly competition focused on short-term trading strategies.',
    status: 'upcoming',
    startDate: '2024-02-15',
    endDate: '2024-02-22',
    participants: 64,
    maxParticipants: 128,
    prizePool: '5,000 USDC',
    entryFee: '25 USDC',
    rules: [
      'Start with 5,000 USDC paper trading balance',
      'All listed pairs available for trading',
      'Maximum leverage: 5x',
      'Minimum 3 trades required',
      'No external funding allowed'
    ],
    rewards: [
      { position: '1st Place', prize: '2,500 USDC' },
      { position: '2nd Place', prize: '1,500 USDC' },
      { position: '3rd Place', prize: '1,000 USDC' }
    ]
  }
]

export default function TournamentsPage() {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {selectedTournament ? (
          <>
            <button
              onClick={() => setSelectedTournament(null)}
              className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              Back to Tournaments
            </button>

            <div className="bg-[#1C2127]/50 rounded-xl p-6 backdrop-blur-md border border-[#2A2D35]/50 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-2xl font-bold">{selectedTournament.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedTournament.status === 'ongoing'
                        ? 'bg-green-500/20 text-green-400'
                        : selectedTournament.status === 'upcoming'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {selectedTournament.status.charAt(0).toUpperCase() + selectedTournament.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-400">{selectedTournament.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">{selectedTournament.prizePool}</div>
                  <div className="text-sm text-gray-400">Prize Pool</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#2A2D35]/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Users className="h-4 w-4" />
                    <span>Participants</span>
                  </div>
                  <div className="text-lg font-bold">
                    {selectedTournament.participants} / {selectedTournament.maxParticipants}
                  </div>
                </div>
                <div className="bg-[#2A2D35]/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Clock className="h-4 w-4" />
                    <span>Duration</span>
                  </div>
                  <div className="text-lg font-bold">
                    {new Date(selectedTournament.startDate).toLocaleDateString()} - {new Date(selectedTournament.endDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-[#2A2D35]/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Star className="h-4 w-4" />
                    <span>Entry Fee</span>
                  </div>
                  <div className="text-lg font-bold">{selectedTournament.entryFee}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-bold mb-4">Tournament Rules</h2>
                  <ul className="space-y-2">
                    {selectedTournament.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-400">
                        <div className="w-1 h-1 rounded-full bg-gray-400 mt-2" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-lg font-bold mb-4">Rewards</h2>
                  <div className="space-y-3">
                    {selectedTournament.rewards.map((reward, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#2A2D35]/50"
                      >
                        <div className="flex items-center gap-2">
                          <Award className={`h-5 w-5 ${
                            index === 0 ? 'text-yellow-400' :
                            index === 1 ? 'text-gray-400' :
                            index === 2 ? 'text-orange-400' :
                            'text-blue-400'
                          }`} />
                          <span>{reward.position}</span>
                        </div>
                        <span className="font-bold">{reward.prize}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedTournament.status === 'upcoming' && (
                <button className="w-full mt-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors font-bold">
                  Register Now
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Trading Tournaments</h1>
                <p className="text-gray-400 mt-2">Compete against other traders and win prizes</p>
              </div>
            </div>

            <div className="grid gap-4">
              {tournaments.map(tournament => (
                <button
                  key={tournament.id}
                  onClick={() => setSelectedTournament(tournament)}
                  className="block w-full bg-[#1C2127]/50 rounded-xl p-6 backdrop-blur-md border border-[#2A2D35]/50 hover:border-blue-500/50 transition-colors text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h2 className="text-xl font-bold">{tournament.title}</h2>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          tournament.status === 'ongoing'
                            ? 'bg-green-500/20 text-green-400'
                            : tournament.status === 'upcoming'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-4">{tournament.description}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-400" />
                          <span>{tournament.prizePool}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="h-4 w-4" />
                          <span>{tournament.participants} / {tournament.maxParticipants}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
} 