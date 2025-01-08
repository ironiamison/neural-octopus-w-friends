export interface Tournament {
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
  highlight: string
  liveStats: {
    totalVolume: string
    topROI: string
    averageProfit: string
  }
  rules: string[]
  rewards: {
    position: string
    prize: string
  }[]
  specialPerks: string[]
}

export const mockTournaments: Tournament[] = [
  {
    id: 'mega-bull-run-2024',
    title: '🚀 Mega Bull Run Challenge 2024',
    description: 'The ultimate trading showdown! Trade your way to glory in this high-stakes competition where only the boldest traders survive. Will you become the next trading legend?',
    status: 'upcoming',
    startDate: '2024-03-25',
    endDate: '2024-04-25',
    participants: 892,
    maxParticipants: 1000,
    prizePool: '$250,000 USDT',
    entryFee: 'FREE',
    highlight: 'Last winner made 3,427% ROI!',
    liveStats: {
      totalVolume: '$14.2M',
      topROI: '427%',
      averageProfit: '$1,892'
    },
    rules: [
      'Start with $100,000 virtual capital',
      'Trade any pairs on supported DEXes',
      'No leverage restrictions - Go as wild as you dare!',
      'Real-time leaderboard updates',
      'Top 100 traders get verified badges'
    ],
    rewards: [
      { position: '🥇 Champion', prize: '$100,000 USDT + NFT Trophy' },
      { position: '🥈 Runner-up', prize: '$50,000 USDT + Rare Badge' },
      { position: '🥉 Third Place', prize: '$25,000 USDT' },
      { position: 'Top 10', prize: '$5,000 USDT Each' },
      { position: 'Top 100', prize: '$500 USDT Each' }
    ],
    specialPerks: [
      'Exclusive Discord access',
      'Strategy mentoring sessions',
      'Early access to new features',
      'Custom profile badges'
    ]
  },
  {
    id: 'diamond-hands-league',
    title: '💎 Diamond Hands League',
    description: 'ONGOING: Watch live as traders battle it out! Join next season and prove you have what it takes to hold through any market condition.',
    status: 'ongoing',
    startDate: '2024-02-01',
    endDate: '2024-03-01',
    participants: 1000,
    maxParticipants: 1000,
    prizePool: '$150,000 USDT',
    entryFee: 'FREE',
    highlight: 'Current leader up 892%!',
    liveStats: {
      totalVolume: '$28.7M',
      topROI: '892%',
      averageProfit: '$2,341'
    },
    rules: [
      'Minimum hold time: 24 hours',
      'Maximum 10 positions at once',
      'No stop losses allowed',
      'Weekly challenges for bonus points',
      'Community voting on best trades'
    ],
    rewards: [
      { position: '🏆 Ultimate Diamond Hand', prize: '$75,000 USDT + Legendary NFT' },
      { position: '🏅 Silver Holder', prize: '$30,000 USDT' },
      { position: '🎖️ Bronze Holder', prize: '$15,000 USDT' },
      { position: 'Top 20', prize: '$1,000 USDT Each' }
    ],
    specialPerks: [
      'Diamond Hands NFT Collection',
      'Private Trading Group Access',
      'Strategy Masterclass',
      'Premium API Access'
    ]
  },
  {
    id: 'meme-trading-madness',
    title: '🎭 Meme Trading Madness',
    description: 'The most entertaining trading competition ever! Trade meme coins, earn hilarious badges, and become a legendary meme trader.',
    status: 'upcoming',
    startDate: '2024-04-01',
    endDate: '2024-04-20',
    participants: 420,
    maxParticipants: 1000,
    prizePool: '$69,420 USDT',
    entryFee: 'FREE',
    highlight: 'Includes Rare Pepe NFT Collection!',
    liveStats: {
      totalVolume: '$4.2M',
      topROI: '169%',
      averageProfit: '$789'
    },
    rules: [
      'Only meme coins allowed',
      'Earn bonus points for dank trades',
      'Meme creation challenges',
      'Community voting on best memes',
      'Daily random airdrops'
    ],
    rewards: [
      { position: '🐸 Meme Lord', prize: '$42,069 USDT + Rare Pepe NFT' },
      { position: '🎭 Meme Knight', prize: '$15,000 USDT + Common Pepe NFT' },
      { position: '😎 Meme Squire', prize: '$7,500 USDT' },
      { position: 'Top 69', prize: '$69 USDT + Meme Badge' }
    ],
    specialPerks: [
      'Meme Creation Tools',
      'Exclusive Meme NFTs',
      'Meme Trading Masterclass',
      'Custom Meme Profile Frames'
    ]
  },
  {
    id: 'crypto-legends-showdown',
    title: '⚔️ Crypto Legends Showdown',
    description: 'COMPLETED: The most epic trading battle of 2024! Witness the incredible results and prepare for the next season.',
    status: 'completed',
    startDate: '2024-01-01',
    endDate: '2024-02-01',
    participants: 1000,
    maxParticipants: 1000,
    prizePool: '$200,000 USDT',
    entryFee: 'FREE',
    highlight: 'Winner achieved 2,456% ROI!',
    liveStats: {
      totalVolume: '$45.3M',
      topROI: '2456%',
      averageProfit: '$3,241'
    },
    rules: [
      'All trading pairs allowed',
      'Leverage up to 100x',
      'Daily challenges',
      'Strategy sharing required',
      'Live streaming bonus points'
    ],
    rewards: [
      { position: '👑 Legendary Trader', prize: '$100,000 USDT + Crown NFT' },
      { position: '⚔️ Epic Trader', prize: '$50,000 USDT' },
      { position: '🛡️ Rare Trader', prize: '$25,000 USDT' },
      { position: 'Top 50', prize: '$500 USDT Each' }
    ],
    specialPerks: [
      'Legendary Trader Badge',
      'Private Discord Channel',
      'Strategy Book Feature',
      'Custom Trading Dashboard'
    ]
  }
]

export const exclusiveTournaments: Tournament[] = [
  {
    id: 'whale-wars-2024',
    title: '🐋 Whale Wars: Elite Edition',
    description: '⚡️ REGISTRATION OPENING SOON: The most brutal trading competition ever created. Only the top 1% of traders dare to enter. $1M prize pool, but beware - one wrong move and you\'re out. No second chances.',
    status: 'upcoming',
    startDate: '2024-05-01',
    endDate: '2024-06-01',
    participants: 0,
    maxParticipants: 100,
    prizePool: '$1,000,000 USDT',
    entryFee: '$10,000 USDT',
    highlight: 'Top 10 traders get verified "Whale" status!',
    liveStats: {
      totalVolume: '$0',
      topROI: '0%',
      averageProfit: '$0'
    },
    rules: [
      '💀 Sudden Death Mode: Drop below -10% and you\'re eliminated',
      '🔥 Minimum trade size: $100,000',
      '⚔️ Direct PvP trading battles',
      '🎯 Real-time position mirroring for followers',
      '🏆 Winner takes control of $10M community fund for 1 month'
    ],
    rewards: [
      { position: '🐋 Alpha Whale', prize: '$500,000 USDT + Whale NFT + Fund Management' },
      { position: '🦈 Beta Whale', prize: '$250,000 USDT + Exclusive Signals Access' },
      { position: '🐬 Delta Whale', prize: '$100,000 USDT + Private Group' },
      { position: 'Top 10', prize: '$15,000 USDT + Verified Status' }
    ],
    specialPerks: [
      'Direct line to exchange founders',
      'Private whale group membership',
      'Early access to new trading pairs',
      'Custom trading terminal'
    ]
  },
  {
    id: 'quantum-quant-challenge',
    title: '🤖 Quantum Quant Challenge',
    description: '🔒 REGISTRATION OPENING SOON: The first-ever AI vs Human trading showdown. Prove that human intuition can beat machine learning. Compete against our most advanced trading algorithms.',
    status: 'upcoming',
    startDate: '2024-06-15',
    endDate: '2024-07-15',
    participants: 0,
    maxParticipants: 500,
    prizePool: '$500,000 USDT',
    entryFee: '$5,000 USDT',
    highlight: 'Beat the AI, get hired as a quant!',
    liveStats: {
      totalVolume: '$0',
      topROI: '0%',
      averageProfit: '$0'
    },
    rules: [
      '🧠 Real-time competition against AI traders',
      '📊 Advanced statistical analysis required',
      '⚡ Sub-millisecond trading allowed',
      '🔍 All trades publicly audited',
      '🤝 Form teams with other quants'
    ],
    rewards: [
      { position: '🥇 Quantum Master', prize: '$200,000 USDT + Quant Position Offer' },
      { position: '🥈 AI Slayer', prize: '$100,000 USDT + GPU Cluster Access' },
      { position: '🥉 Data Sage', prize: '$50,000 USDT + API Package' },
      { position: 'Top 20', prize: '$7,500 USDT + ML Model Access' }
    ],
    specialPerks: [
      'Access to proprietary ML models',
      'High-frequency trading servers',
      'Real-time market data feeds',
      'Quantum computing time slots'
    ]
  },
  {
    id: 'defi-deathmatch',
    title: '💀 DeFi Deathmatch',
    description: '⚠️ REGISTRATION OPENING SOON: The most hardcore DeFi trading competition. Navigate the depths of DeFi, exploit arbitrage opportunities, and master the art of yield farming. Not for the faint of heart.',
    status: 'upcoming',
    startDate: '2024-07-01',
    endDate: '2024-08-01',
    participants: 0,
    maxParticipants: 300,
    prizePool: '$750,000 USDT',
    entryFee: '$7,500 USDT',
    highlight: 'First-ever cross-chain trading competition!',
    liveStats: {
      totalVolume: '$0',
      topROI: '0%',
      averageProfit: '$0'
    },
    rules: [
      '🌊 Trade across 15 different chains',
      '🔄 Flash loan mastery required',
      '🏃‍♂️ MEV opportunities enabled',
      '🎭 Anonymous trading allowed',
      '🔥 Weekly elimination rounds'
    ],
    rewards: [
      { position: '👑 DeFi King', prize: '$300,000 USDT + Protocol Tokens' },
      { position: '⚔️ Yield Lord', prize: '$150,000 USDT + Validator Nodes' },
      { position: '🛡️ Chain Master', prize: '$75,000 USDT + NFT Collection' },
      { position: 'Top 30', prize: '$7,500 USDT + Governance Tokens' }
    ],
    specialPerks: [
      'Zero-fee trading on all DEXes',
      'Priority transaction processing',
      'Custom smart contract deployment',
      'Direct bridge access'
    ]
  },
  {
    id: 'leverage-legends',
    title: '📈 Leverage Legends: Extreme Edition',
    description: '🔥 REGISTRATION OPENING SOON: 100x leverage trading competition. The ultimate test of nerve and skill. One perfect trade could make you a millionaire, one wrong move could wipe you out.',
    status: 'upcoming',
    startDate: '2024-08-15',
    endDate: '2024-09-15',
    participants: 0,
    maxParticipants: 200,
    prizePool: '$2,000,000 USDT',
    entryFee: '$15,000 USDT',
    highlight: 'Previous winner turned $10K into $5.2M!',
    liveStats: {
      totalVolume: '$0',
      topROI: '0%',
      averageProfit: '$0'
    },
    rules: [
      '💣 Mandatory 50x minimum leverage',
      '⚡ Lightning-fast position changes',
      '🎯 No stop losses allowed',
      '🔄 Perpetual futures only',
      '🏆 Daily leaderboard resets'
    ],
    rewards: [
      { position: '🌟 Leverage God', prize: '$1,000,000 USDT + Private Island NFT' },
      { position: '💫 Risk Master', prize: '$500,000 USDT + Lambo NFT' },
      { position: '⭐ Margin King', prize: '$250,000 USDT + Rolex NFT' },
      { position: 'Top 10', prize: '$25,000 USDT + Diamond Hands NFT' }
    ],
    specialPerks: [
      'Personal risk management advisor',
      'Direct line to liquidation desk',
      'Custom leverage limits',
      'Insurance pool access'
    ]
  }
] 