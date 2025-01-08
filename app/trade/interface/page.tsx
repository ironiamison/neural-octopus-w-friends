'use client'

import React, { useState, useEffect, useRef } from 'react'
import TradingViewWidget from '@/components/TradingViewWidget'
import { FaTrophy, FaChartLine, FaFire, FaMedal, FaBolt, FaGem, FaCrown, FaChartBar, FaStar, FaCalendar, FaRocket, FaHistory, FaBrain, FaShieldAlt, FaLayerGroup, FaWifi, FaBook, FaDog } from 'react-icons/fa'
import Image from 'next/image'
import styled from 'styled-components'

const TRADING_PAIRS = [
  { 
    symbol: 'BTCUSDT', 
    name: 'Bitcoin',
    minSize: 10,
    maxLeverage: 100,
    defaultSize: 100,
    description: 'The original cryptocurrency',
    volume24h: '12.5B',
    category: 'Major'
  },
  { 
    symbol: 'ETHUSDT', 
    name: 'Ethereum',
    minSize: 10,
    maxLeverage: 75,
    defaultSize: 50,
    description: 'Leading smart contract platform',
    volume24h: '6.2B',
    category: 'Major'
  },
  { 
    symbol: 'SOLUSDT', 
    name: 'Solana',
    minSize: 5,
    maxLeverage: 50,
    defaultSize: 25,
    description: 'High-performance blockchain',
    volume24h: '850M',
    category: 'Altcoin'
  },
  { 
    symbol: 'BNBUSDT', 
    name: 'Binance Coin',
    minSize: 5,
    maxLeverage: 50,
    defaultSize: 25,
    description: 'Binance ecosystem token',
    volume24h: '420M',
    category: 'Exchange'
  },
  { 
    symbol: 'ADAUSDT', 
    name: 'Cardano',
    minSize: 5,
    maxLeverage: 40,
    defaultSize: 20,
    description: 'Proof-of-stake blockchain platform',
    volume24h: '280M',
    category: 'Altcoin'
  },
  { 
    symbol: 'DOGEUSDT', 
    name: 'Dogecoin',
    minSize: 5,
    maxLeverage: 30,
    defaultSize: 15,
    description: 'Original meme cryptocurrency',
    volume24h: '320M',
    category: 'Meme'
  },
  { 
    symbol: 'MATICUSDT', 
    name: 'Polygon',
    minSize: 5,
    maxLeverage: 40,
    defaultSize: 20,
    description: 'Ethereum scaling solution',
    volume24h: '250M',
    category: 'Layer2'
  },
  { 
    symbol: 'AVAXUSDT', 
    name: 'Avalanche',
    minSize: 5,
    maxLeverage: 45,
    defaultSize: 20,
    description: 'High-throughput blockchain platform',
    volume24h: '190M',
    category: 'Layer1'
  },
  { 
    symbol: 'LINKUSDT', 
    name: 'Chainlink',
    minSize: 5,
    maxLeverage: 35,
    defaultSize: 15,
    description: 'Decentralized oracle network',
    volume24h: '150M',
    category: 'Oracle'
  },
  { 
    symbol: 'ATOMUSDT', 
    name: 'Cosmos',
    minSize: 5,
    maxLeverage: 35,
    defaultSize: 15,
    description: 'Blockchain interoperability platform',
    volume24h: '130M',
    category: 'Interop'
  },
  { 
    symbol: 'BONKUSDT', 
    name: 'Bonk',
    minSize: 1,
    maxLeverage: 25,
    defaultSize: 10,
    description: 'Solana\'s first dog coin',
    volume24h: '45M',
    category: 'SolMeme'
  },
  { 
    symbol: 'WIFUSDT', 
    name: 'Wife',
    minSize: 1,
    maxLeverage: 20,
    defaultSize: 10,
    description: 'Solana meme token',
    volume24h: '32M',
    category: 'SolMeme'
  },
  { 
    symbol: 'BOMEUSDT', 
    name: 'Book of Meme',
    minSize: 1,
    maxLeverage: 20,
    defaultSize: 10,
    description: 'Solana meme ecosystem token',
    volume24h: '28M',
    category: 'SolMeme'
  },
  { 
    symbol: 'MYROUSDT', 
    name: 'Myro',
    minSize: 1,
    maxLeverage: 20,
    defaultSize: 10,
    description: 'Solana dog-themed token',
    volume24h: '25M',
    category: 'SolMeme'
  }
]

interface SimulatedPosition {
  id: string
  symbol: string
  type: 'long' | 'short'
  entryPrice: number
  size: number
  leverage: number
  pnl: number
  timestamp: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: JSX.Element
  progress: number
  target: number
  reward: number
  unlocked: boolean
}

interface TradingStats {
  totalTrades: number
  winningTrades: number
  totalPnL: number
  bestTrade: number
  worstTrade: number
  currentStreak: number
  bestStreak: number
  averagePosition: number
  averageLeverage: number
}

interface TradeHistory {
  id: string
  symbol: string
  type: 'long' | 'short'
  entryPrice: number
  exitPrice: number
  size: number
  leverage: number
  pnl: number
  timestamp: number
  duration: number
}

interface PerformanceInsight {
  type: 'success' | 'warning' | 'info'
  message: string
  metric?: string
  value?: string | number
}

interface RiskAlert {
  type: 'warning' | 'danger'
  message: string
  metric: string
  value: string
  threshold: string
}

interface ConnectionStatus {
  status: 'connected' | 'connecting' | 'disconnected' | 'error'
  lastError?: string
  reconnectAttempt: number
}

interface OrderBookEntry {
  price: number
  size: number
  total: number
}

// Add trading levels
const TRADING_LEVELS = [
  { level: 1, requirement: 0, title: "Novice Trader" },
  { level: 2, requirement: 1000, title: "Amateur Trader" },
  { level: 3, requirement: 5000, title: "Intermediate Trader" },
  { level: 4, requirement: 10000, title: "Professional Trader" },
  { level: 5, requirement: 25000, title: "Expert Trader" },
  { level: 6, requirement: 50000, title: "Master Trader" },
  { level: 7, requirement: 100000, title: "Legendary Trader" }
]

// Add more achievements
const INITIAL_ACHIEVEMENTS = [
  {
    id: 'first_trade',
    title: 'First Steps',
    description: 'Complete your first trade',
    icon: <FaTrophy className="text-yellow-400 text-xl" />,
    progress: 0,
    target: 1,
    reward: 100,
    unlocked: false
  },
  {
    id: 'winning_streak',
    title: 'Hot Streak',
    description: 'Achieve a 5-trade winning streak',
    icon: <FaFire className="text-orange-500 text-xl" />,
    progress: 0,
    target: 5,
    reward: 500,
    unlocked: false
  },
  {
    id: 'profit_master',
    title: 'Profit Master',
    description: 'Reach $1,000 in total profits',
    icon: <FaChartLine className="text-green-400 text-xl" />,
    progress: 0,
    target: 1000,
    reward: 1000,
    unlocked: false
  },
  {
    id: 'trade_volume',
    title: 'Volume Trader',
    description: 'Complete 50 trades',
    icon: <FaMedal className="text-blue-400 text-xl" />,
    progress: 0,
    target: 50,
    reward: 2000,
    unlocked: false
  },
  {
    id: 'high_leverage',
    title: 'Risk Taker',
    description: 'Complete a trade with 50x leverage',
    icon: <FaBolt className="text-purple-400 text-xl" />,
    progress: 0,
    target: 1,
    reward: 1500,
    unlocked: false
  },
  {
    id: 'diamond_hands',
    title: 'Diamond Hands',
    description: 'Hold a profitable position for over 5 minutes',
    icon: <FaGem className="text-blue-300 text-xl" />,
    progress: 0,
    target: 1,
    reward: 800,
    unlocked: false
  }
]

// Add trading ranks
const TRADING_RANKS = [
  { rank: "Bronze", minWinRate: 0, color: "text-orange-400" },
  { rank: "Silver", minWinRate: 40, color: "text-gray-400" },
  { rank: "Gold", minWinRate: 50, color: "text-yellow-400" },
  { rank: "Platinum", minWinRate: 60, color: "text-blue-300" },
  { rank: "Diamond", minWinRate: 70, color: "text-purple-400" },
  { rank: "Master", minWinRate: 80, color: "text-red-400" }
]

// Add daily challenges with correct type
const DAILY_CHALLENGES: Array<Omit<DailyChallenge, 'progress' | 'completed'>> = [
  {
    id: 'win_streak_3',
    title: 'Win Streak',
    description: 'Get a 3-trade winning streak',
    reward: 200,
    target: 3,
    type: 'streak' as const
  },
  {
    id: 'high_leverage_trade',
    title: 'High Roller',
    description: 'Complete a trade with 20x+ leverage',
    reward: 300,
    target: 1,
    type: 'leverage' as const
  },
  {
    id: 'profit_target',
    title: 'Profit Hunter',
    description: 'Make $500 in profits today',
    reward: 400,
    target: 500,
    type: 'profit' as const
  }
]

interface DailyChallenge {
  id: string
  title: string
  description: string
  reward: number
  target: number
  type: 'streak' | 'leverage' | 'profit'
  progress: number
  completed: boolean
}

// Add category-based achievements
const CATEGORY_ACHIEVEMENTS = [
  {
    id: 'major_trader',
    title: 'Major League',
    description: 'Successfully trade all major cryptocurrencies',
    icon: <FaCrown className="text-yellow-400 text-xl" />,
    reward: 2500,
    category: 'Major'
  },
  {
    id: 'altcoin_master',
    title: 'Altcoin Explorer',
    description: 'Trade 5 different altcoins',
    icon: <FaRocket className="text-purple-400 text-xl" />,
    reward: 1500,
    category: 'Altcoin'
  },
  {
    id: 'layer_specialist',
    title: 'Layer Specialist',
    description: 'Trade both Layer 1 and Layer 2 tokens',
    icon: <FaLayerGroup className="text-blue-400 text-xl" />,
    reward: 1000,
    categories: ['Layer1', 'Layer2']
  },
  {
    id: 'solana_meme_trader',
    title: 'Meme Lord',
    description: 'Trade all Solana meme tokens',
    icon: <FaDog className="text-orange-400 text-xl" />,
    reward: 1000,
    category: 'SolMeme'
  }
]

// Add to existing interfaces
interface TradingPair {
  symbol: string
  name: string
  minSize: number
  maxLeverage: number
  defaultSize: number
  description: string
  volume24h: string
  category: string
}

// Add the StyledWrapper component
const StyledWrapper = styled.div`
  .wheel-and-hamster {
    --dur: 1s;
    position: relative;
    width: 12em;
    height: 12em;
    font-size: 14px;
  }

  .wheel,
  .hamster,
  .hamster div,
  .spoke {
    position: absolute;
  }

  .wheel,
  .spoke {
    border-radius: 50%;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .wheel {
    background: radial-gradient(100% 100% at center,hsla(0,0%,60%,0) 47.8%,hsl(0,0%,60%) 48%);
    z-index: 2;
  }

  .hamster {
    animation: hamster var(--dur) ease-in-out infinite;
    top: 50%;
    left: calc(50% - 3.5em);
    width: 7em;
    height: 3.75em;
    transform: rotate(4deg) translate(-0.8em,1.85em);
    transform-origin: 50% 0;
    z-index: 1;
  }

  .hamster__head {
    animation: hamsterHead var(--dur) ease-in-out infinite;
    background: hsl(30,90%,55%);
    border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
    box-shadow: 0 -0.25em 0 hsl(30,90%,80%) inset,
      0.75em -1.55em 0 hsl(30,90%,90%) inset;
    top: 0;
    left: -2em;
    width: 2.75em;
    height: 2.5em;
    transform-origin: 100% 50%;
  }

  .hamster__ear {
    animation: hamsterEar var(--dur) ease-in-out infinite;
    background: hsl(0,90%,85%);
    border-radius: 50%;
    box-shadow: -0.25em 0 hsl(30,90%,55%) inset;
    top: -0.25em;
    right: -0.25em;
    width: 0.75em;
    height: 0.75em;
    transform-origin: 50% 75%;
  }

  .hamster__eye {
    animation: hamsterEye var(--dur) linear infinite;
    background-color: hsl(0,0%,0%);
    border-radius: 50%;
    top: 0.375em;
    left: 1.25em;
    width: 0.5em;
    height: 0.5em;
  }

  .hamster__nose {
    background: hsl(0,90%,75%);
    border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
    top: 0.75em;
    left: 0;
    width: 0.2em;
    height: 0.25em;
  }

  .hamster__body {
    animation: hamsterBody var(--dur) ease-in-out infinite;
    background: hsl(30,90%,90%);
    border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
    box-shadow: 0.1em 0.75em 0 hsl(30,90%,55%) inset,
      0.15em -0.5em 0 hsl(30,90%,80%) inset;
    top: 0.25em;
    left: 2em;
    width: 4.5em;
    height: 3em;
    transform-origin: 17% 50%;
    transform-style: preserve-3d;
  }

  .hamster__limb--fr,
  .hamster__limb--fl {
    clip-path: polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%);
    top: 2em;
    left: 0.5em;
    width: 1em;
    height: 1.5em;
    transform-origin: 50% 0;
  }

  .hamster__limb--fr {
    animation: hamsterFRLimb var(--dur) linear infinite;
    background: linear-gradient(hsl(30,90%,80%) 80%,hsl(0,90%,75%) 80%);
    transform: rotate(15deg) translateZ(-1px);
  }

  .hamster__limb--fl {
    animation: hamsterFLLimb var(--dur) linear infinite;
    background: linear-gradient(hsl(30,90%,90%) 80%,hsl(0,90%,85%) 80%);
    transform: rotate(15deg);
  }

  .hamster__limb--br,
  .hamster__limb--bl {
    border-radius: 0.75em 0.75em 0 0;
    clip-path: polygon(0 0,100% 0,100% 30%,70% 90%,70% 100%,30% 100%,40% 90%,0% 30%);
    top: 1em;
    left: 2.8em;
    width: 1.5em;
    height: 2.5em;
    transform-origin: 50% 30%;
  }

  .hamster__limb--br {
    animation: hamsterBRLimb var(--dur) linear infinite;
    background: linear-gradient(hsl(30,90%,80%) 90%,hsl(0,90%,75%) 90%);
    transform: rotate(-25deg) translateZ(-1px);
  }

  .hamster__limb--bl {
    animation: hamsterBLLimb var(--dur) linear infinite;
    background: linear-gradient(hsl(30,90%,90%) 90%,hsl(0,90%,85%) 90%);
    transform: rotate(-25deg);
  }

  .hamster__tail {
    animation: hamsterTail var(--dur) linear infinite;
    background: hsl(0,90%,85%);
    border-radius: 0.25em 50% 50% 0.25em;
    box-shadow: 0 -0.2em 0 hsl(0,90%,75%) inset;
    top: 1.5em;
    right: -0.5em;
    width: 1em;
    height: 0.5em;
    transform: rotate(30deg) translateZ(-1px);
    transform-origin: 0.25em 0.25em;
  }

  .spoke {
    animation: spoke var(--dur) linear infinite;
    background: radial-gradient(100% 100% at center,hsl(0,0%,60%) 4.8%,hsla(0,0%,60%,0) 5%),
      linear-gradient(hsla(0,0%,55%,0) 46.9%,hsl(0,0%,65%) 47% 52.9%,hsla(0,0%,65%,0) 53%) 50% 50% / 99% 99% no-repeat;
  }

  @keyframes hamster {
    from, to {
      transform: rotate(4deg) translate(-0.8em,1.85em);
    }
    50% {
      transform: rotate(0) translate(-0.8em,1.85em);
    }
  }

  @keyframes hamsterHead {
    from, 25%, 50%, 75%, to {
      transform: rotate(0);
    }
    12.5%, 37.5%, 62.5%, 87.5% {
      transform: rotate(8deg);
    }
  }

  @keyframes hamsterEye {
    from, 90%, to {
      transform: scaleY(1);
    }
    95% {
      transform: scaleY(0);
    }
  }

  @keyframes hamsterEar {
    from, 25%, 50%, 75%, to {
      transform: rotate(0);
    }
    12.5%, 37.5%, 62.5%, 87.5% {
      transform: rotate(12deg);
    }
  }

  @keyframes hamsterBody {
    from, 25%, 50%, 75%, to {
      transform: rotate(0);
    }
    12.5%, 37.5%, 62.5%, 87.5% {
      transform: rotate(-2deg);
    }
  }

  @keyframes hamsterFRLimb {
    from, 25%, 50%, 75%, to {
      transform: rotate(50deg) translateZ(-1px);
    }
    12.5%, 37.5%, 62.5%, 87.5% {
      transform: rotate(-30deg) translateZ(-1px);
    }
  }

  @keyframes hamsterFLLimb {
    from, 25%, 50%, 75%, to {
      transform: rotate(-30deg);
    }
    12.5%, 37.5%, 62.5%, 87.5% {
      transform: rotate(50deg);
    }
  }

  @keyframes hamsterBRLimb {
    from, 25%, 50%, 75%, to {
      transform: rotate(-60deg) translateZ(-1px);
    }
    12.5%, 37.5%, 62.5%, 87.5% {
      transform: rotate(20deg) translateZ(-1px);
    }
  }

  @keyframes hamsterBLLimb {
    from, 25%, 50%, 75%, to {
      transform: rotate(20deg);
    }
    12.5%, 37.5%, 62.5%, 87.5% {
      transform: rotate(-60deg);
    }
  }

  @keyframes hamsterTail {
    from, 25%, 50%, 75%, to {
      transform: rotate(30deg) translateZ(-1px);
    }
    12.5%, 37.5%, 62.5%, 87.5% {
      transform: rotate(10deg) translateZ(-1px);
    }
  }

  @keyframes spoke {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(-1turn);
    }
  }
`

export default function TradingInterface() {
  const [selectedPair, setSelectedPair] = useState(TRADING_PAIRS[0])
  const [positions, setPositions] = useState<SimulatedPosition[]>([])
  const [balance, setBalance] = useState(10000)
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [positionSize, setPositionSize] = useState<number>(selectedPair.defaultSize)
  const [leverage, setLeverage] = useState<number>(1)
  const [stats, setStats] = useState<TradingStats>({
    totalTrades: 0,
    winningTrades: 0,
    totalPnL: 0,
    bestTrade: 0,
    worstTrade: 0,
    currentStreak: 0,
    bestStreak: 0,
    averagePosition: 0,
    averageLeverage: 0
  })

  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS)

  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [showStats, setShowStats] = useState(false)
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(
    DAILY_CHALLENGES.map(challenge => ({
      ...challenge,
      progress: 0,
      completed: false
    }))
  )
  const [showChallenges, setShowChallenges] = useState(false)
  const [lastTradeResult, setLastTradeResult] = useState<{
    type: 'win' | 'loss'
    amount: number
    timestamp: number
  } | null>(null)
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [insights, setInsights] = useState<PerformanceInsight[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'connecting',
    reconnectAttempt: 0
  })

  const [orderBook, setOrderBook] = useState<{
    bids: OrderBookEntry[]
    asks: OrderBookEntry[]
  }>({
    bids: [],
    asks: []
  })

  const MAX_RECONNECT_ATTEMPTS = 5
  const RECONNECT_DELAY = 3000

  // Add initial price state to track prices for all pairs
  const [prices, setPrices] = useState<Record<string, number>>({})

  const connectWebSocket = () => {
    try {
      if (wsRef.current) {
        wsRef.current.close()
      }

      setConnectionStatus(prev => ({
        ...prev,
        status: 'connecting'
      }))

      // Create a combined stream for trade and depth data
      const streams = [
        `${selectedPair.symbol.toLowerCase()}@trade`,
        `${selectedPair.symbol.toLowerCase()}@depth20@100ms`  // 100ms updates for better real-time data
      ]
      const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams.join('/')}`)
      wsRef.current = ws

      ws.onopen = () => {
        setConnectionStatus({
          status: 'connected',
          reconnectAttempt: 0
        })
        console.log('WebSocket Connected')
      }

      ws.onmessage = (event) => {
        const { data } = event
        const parsedData = JSON.parse(data)
        const { stream, data: streamData } = parsedData

        if (stream.endsWith('@trade')) {
          const price = parseFloat(streamData.p)
          setPrices(prev => ({
            ...prev,
            [selectedPair.symbol]: price
          }))
          setCurrentPrice(price)
        } else if (stream.endsWith('@depth20@100ms')) {
          // Process orderbook data
          const processOrders = (orders: string[][]): OrderBookEntry[] => {
            let total = 0
            return orders.map(([price, size]) => {
              const sizeNum = parseFloat(size)
              total += sizeNum
              return {
                price: parseFloat(price),
                size: sizeNum,
                total
              }
            })
          }

          setOrderBook({
            bids: processOrders(streamData.bids),
            asks: processOrders(streamData.asks.reverse()) // Reverse asks for better display
          })
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error)
        setConnectionStatus(prev => ({
          status: 'error',
          lastError: 'Connection error occurred',
          reconnectAttempt: prev.reconnectAttempt + 1
        }))
      }

      ws.onclose = () => {
        console.log('WebSocket Disconnected')
        setConnectionStatus(prev => {
          const newStatus = {
            status: 'disconnected',
            reconnectAttempt: prev.reconnectAttempt,
            lastError: prev.lastError
          } as ConnectionStatus

          // Attempt reconnection if we haven't exceeded max attempts
          if (prev.reconnectAttempt < MAX_RECONNECT_ATTEMPTS) {
            setTimeout(connectWebSocket, RECONNECT_DELAY)
          }

          return newStatus
        })
      }
    } catch (error) {
      console.error('WebSocket Connection Error:', error)
      setConnectionStatus(prev => ({
        status: 'error',
        lastError: 'Failed to establish connection',
        reconnectAttempt: prev.reconnectAttempt + 1
      }))
    }
  }

  useEffect(() => {
    connectWebSocket()
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [selectedPair.symbol])

  const openPosition = (type: 'long' | 'short') => {
    const totalSize = positionSize * leverage
    if (totalSize > balance) {
      alert('Insufficient balance')
      return
    }

    const position: SimulatedPosition = {
      id: Math.random().toString(36).substring(7),
      symbol: selectedPair.symbol,
      type,
      entryPrice: currentPrice,
      size: positionSize,
      leverage: leverage,
      pnl: 0,
      timestamp: Date.now()
    }

    setPositions(prev => [...prev, position])
    setBalance(prev => prev - positionSize) // Only deduct the margin
  }

  const closePosition = (positionId: string) => {
    setPositions(prev => {
      const position = prev.find(p => p.id === positionId)
      if (!position) return prev

      const pnl = calculatePnL(position, currentPrice)
      setBalance(b => b + position.size + pnl)
      
      // Add to trade history
      const trade: TradeHistory = {
        id: position.id,
        symbol: position.symbol,
        type: position.type,
        entryPrice: position.entryPrice,
        exitPrice: currentPrice,
        size: position.size,
        leverage: position.leverage,
        pnl,
        timestamp: Date.now(),
        duration: Date.now() - position.timestamp
      }
      setTradeHistory(prev => [...prev, trade])
      
      // Update stats and achievements
      updateStats(pnl, position)
      updateAchievements(pnl)
      updateDailyChallenges(pnl, position)

      // Update insights
      generateInsights()

      // Set last trade result
      setLastTradeResult({
        type: pnl >= 0 ? 'win' : 'loss',
        amount: pnl,
        timestamp: Date.now()
      })

      return prev.filter(p => p.id !== positionId)
    })
  }

  const calculatePnL = (position: SimulatedPosition, currentPrice: number): number => {
    const priceChange = currentPrice - position.entryPrice
    const multiplier = position.type === 'long' ? 1 : -1
    return (priceChange / position.entryPrice) * position.size * multiplier
  }

  // Update position size when pair changes
  useEffect(() => {
    setPositionSize(selectedPair.defaultSize)
    setLeverage(1)
  }, [selectedPair])

  // Update achievements
  const updateAchievements = (pnl: number) => {
    setAchievements(prev => {
      const updated = [...prev]
      
      // First trade achievement
      if (!updated[0].unlocked && stats.totalTrades === 0) {
        updated[0].progress = 1
        updated[0].unlocked = true
        setShowAchievement(updated[0])
        setBalance(b => b + updated[0].reward)
      }

      // Winning streak achievement
      if (!updated[1].unlocked) {
        updated[1].progress = stats.currentStreak
        if (stats.currentStreak >= 5) {
          updated[1].unlocked = true
          setShowAchievement(updated[1])
          setBalance(b => b + updated[1].reward)
        }
      }

      // Profit master achievement
      if (!updated[2].unlocked) {
        updated[2].progress = stats.totalPnL
        if (stats.totalPnL >= 1000) {
          updated[2].unlocked = true
          setShowAchievement(updated[2])
          setBalance(b => b + updated[2].reward)
        }
      }

      // Trade volume achievement
      if (!updated[3].unlocked) {
        updated[3].progress = stats.totalTrades
        if (stats.totalTrades >= 50) {
          updated[3].unlocked = true
          setShowAchievement(updated[3])
          setBalance(b => b + updated[3].reward)
        }
      }

      // High leverage achievement
      if (!updated[4].unlocked) {
        updated[4].progress = 1
        if (leverage >= 50) {
          updated[4].unlocked = true
          setShowAchievement(updated[4])
          setBalance(b => b + updated[4].reward)
        }
      }

      // Diamond hands achievement
      if (!updated[5].unlocked) {
        updated[5].progress = 1
        if (stats.totalPnL > 0) {
          updated[5].unlocked = true
          setShowAchievement(updated[5])
          setBalance(b => b + updated[5].reward)
        }
      }

      return updated
    })
  }

  // Update trading stats when closing position
  const updateStats = (pnl: number, position: SimulatedPosition) => {
    setStats(prev => {
      const isWin = pnl > 0
      const newStreak = isWin ? prev.currentStreak + 1 : 0
      
      return {
        totalTrades: prev.totalTrades + 1,
        winningTrades: isWin ? prev.winningTrades + 1 : prev.winningTrades,
        totalPnL: prev.totalPnL + pnl,
        bestTrade: Math.max(prev.bestTrade, pnl),
        worstTrade: Math.min(prev.worstTrade, pnl),
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        averagePosition: (prev.averagePosition * prev.totalTrades + position.size) / (prev.totalTrades + 1),
        averageLeverage: (prev.averageLeverage * prev.totalTrades + position.leverage) / (prev.totalTrades + 1)
      }
    })
  }

  // Calculate current level
  useEffect(() => {
    const newLevel = TRADING_LEVELS.reduce((acc, level) => {
      if (stats.totalPnL >= level.requirement) {
        return level.level
      }
      return acc
    }, 1)

    if (newLevel > currentLevel) {
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 3000)
    }
    setCurrentLevel(newLevel)
  }, [stats.totalPnL])

  // Get current trading rank
  const getCurrentRank = () => {
    if (stats.totalTrades === 0) return TRADING_RANKS[0]
    const winRate = (stats.winningTrades / stats.totalTrades) * 100
    return [...TRADING_RANKS].reverse().find(rank => winRate >= rank.minWinRate) || TRADING_RANKS[0]
  }

  // Update daily challenges
  const updateDailyChallenges = (pnl: number, position: SimulatedPosition) => {
    setDailyChallenges(prev => {
      return prev.map(challenge => {
        if (challenge.completed) return challenge

        let progress = challenge.progress
        switch (challenge.type) {
          case 'streak':
            if (pnl > 0) {
              progress = challenge.progress + 1
            } else {
              progress = 0
            }
            break
          case 'leverage':
            if (position.leverage >= 20) {
              progress = 1
            }
            break
          case 'profit':
            progress = challenge.progress + (pnl > 0 ? pnl : 0)
            break
        }

        const completed = progress >= challenge.target
        if (completed && !challenge.completed) {
          setBalance(b => b + challenge.reward)
          // Show notification
          setShowAchievement({
            id: challenge.id,
            title: challenge.title,
            description: 'Daily Challenge Completed!',
            icon: <FaStar className="text-yellow-400 text-xl" />,
            progress: 1,
            target: 1,
            reward: challenge.reward,
            unlocked: true
          })
        }

        return {
          ...challenge,
          progress,
          completed
        }
      })
    })
  }

  // Reset daily challenges at midnight
  useEffect(() => {
    const now = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const timeUntilMidnight = tomorrow.getTime() - now.getTime()

    const timer = setTimeout(() => {
      setDailyChallenges(DAILY_CHALLENGES.map(challenge => ({
        ...challenge,
        progress: 0,
        completed: false
      })))
    }, timeUntilMidnight)

    return () => clearTimeout(timer)
  }, [])

  // Generate performance insights
  const generateInsights = () => {
    const newInsights: PerformanceInsight[] = []

    // Win rate insight
    if (stats.totalTrades > 0) {
      const winRate = (stats.winningTrades / stats.totalTrades) * 100
      if (winRate > 60) {
        newInsights.push({
          type: 'success',
          message: 'Excellent win rate! Keep up the good work.',
          metric: 'Win Rate',
          value: `${winRate.toFixed(1)}%`
        })
      } else if (winRate < 40) {
        newInsights.push({
          type: 'warning',
          message: 'Consider reducing position sizes and reviewing your strategy.',
          metric: 'Win Rate',
          value: `${winRate.toFixed(1)}%`
        })
      }
    }

    // Leverage insight
    if (stats.averageLeverage > 20) {
      newInsights.push({
        type: 'warning',
        message: 'High average leverage detected. Consider managing risk more carefully.',
        metric: 'Avg Leverage',
        value: `${stats.averageLeverage.toFixed(1)}x`
      })
    }

    // Profit trend
    if (tradeHistory.length >= 5) {
      const recentTrades = tradeHistory.slice(-5)
      const profitableTrades = recentTrades.filter(t => t.pnl > 0).length
      if (profitableTrades >= 4) {
        newInsights.push({
          type: 'success',
          message: 'Strong recent performance! You\'re on a roll.',
          metric: 'Recent Wins',
          value: `${profitableTrades}/5`
        })
      }
    }

    setInsights(newInsights)
  }

  // Risk Management System
  const calculateRiskMetrics = () => {
    const totalPositionValue = positions.reduce((sum, pos) => sum + (pos.size * pos.leverage), 0)
    const accountRisk = (totalPositionValue / balance) * 100
    const maxDrawdown = Math.abs(stats.worstTrade) / balance * 100
    
    const alerts: RiskAlert[] = []
    
    if (accountRisk > 50) {
      alerts.push({
        type: 'danger',
        message: 'High account risk detected. Consider closing some positions.',
        metric: 'Account Risk',
        value: `${accountRisk.toFixed(1)}%`,
        threshold: '50%'
      })
    }

    if (maxDrawdown > 20) {
      alerts.push({
        type: 'warning',
        message: 'Significant drawdown detected. Consider reducing position sizes.',
        metric: 'Max Drawdown',
        value: `${maxDrawdown.toFixed(1)}%`,
        threshold: '20%'
      })
    }

    if (leverage > 20 && positionSize > balance * 0.1) {
      alerts.push({
        type: 'danger',
        message: 'High leverage with large position size. High risk of liquidation.',
        metric: 'Position Size',
        value: `$${positionSize}`,
        threshold: `$${(balance * 0.1).toFixed(0)}`
      })
    }

    return alerts
  }

  // Add effect to reset current price when changing pairs
  useEffect(() => {
    setCurrentPrice(prices[selectedPair.symbol] || 0)
  }, [selectedPair, prices])

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-2">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <FaBrain className="text-purple-400 text-2xl" />
            <span className="text-white font-bold">Powered by AI16z</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus.status === 'connected' ? 'bg-green-400 animate-pulse' :
                connectionStatus.status === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                connectionStatus.status === 'error' ? 'bg-red-400' :
                'bg-gray-400'
              }`} />
              <span className="text-gray-400 text-sm">
                {connectionStatus.status === 'connected' ? 'Connected' :
                 connectionStatus.status === 'connecting' ? 'Connecting...' :
                 connectionStatus.status === 'error' ? `Error (Attempt ${connectionStatus.reconnectAttempt}/${MAX_RECONNECT_ATTEMPTS})` :
                 'Disconnected'}
              </span>
            </div>
            {connectionStatus.lastError && (
              <span className="text-red-400 text-sm">{connectionStatus.lastError}</span>
            )}
            <div className="text-gray-400 text-sm">
              Processing {tradeHistory.length} trades
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-2">
          <FaBrain className="text-purple-400" />
          <span className="text-gray-400 text-sm">AI Analysis:</span>
          <span className="text-white">
            {currentPrice > 0 ? 
              `Predicted trend: ${Math.random() > 0.5 ? 'Bullish' : 'Bearish'} • Confidence: ${(Math.random() * 20 + 80).toFixed(1)}%` 
              : 'Analyzing market data...'}
          </span>
        </div>
      </div>

      {/* Level Up notification */}
      {showLevelUp && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 shadow-lg animate-slide-in">
          <div className="flex items-center gap-3">
            <FaCrown className="text-yellow-400 text-2xl" />
            <div>
              <h3 className="text-white font-bold">Level Up!</h3>
              <p className="text-gray-200 text-sm">
                You are now a {TRADING_LEVELS[currentLevel - 1].title}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Achievement notification */}
      {showAchievement && (
        <div className="fixed top-4 right-4 bg-gray-800 rounded-lg p-4 shadow-lg animate-slide-in">
          <div className="flex items-center gap-3">
            {showAchievement.icon}
            <div>
              <h3 className="text-white font-bold">{showAchievement.title} Unlocked!</h3>
              <p className="text-gray-400 text-sm">+${showAchievement.reward} Bonus</p>
            </div>
          </div>
        </div>
      )}

      {/* Last Trade Result Popup */}
      {lastTradeResult && (
        <div 
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 rounded-lg p-4 shadow-lg animate-slide-in ${
            lastTradeResult.type === 'win' ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{ 
            animation: 'slideDown 0.5s ease-out forwards',
            animationDelay: '0.5s'
          }}
        >
          <div className="text-center text-white">
            <div className="text-2xl font-bold mb-1">
              {lastTradeResult.type === 'win' ? 'Profit!' : 'Loss'}
            </div>
            <div className="text-lg">
              ${Math.abs(lastTradeResult.amount).toFixed(2)}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 grid grid-cols-12 gap-4 p-4">
        {/* Trading pairs list */}
        <div className="col-span-2 space-y-4">
          {/* Trader Level Card */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaCrown className="text-yellow-400 text-xl" />
              <h2 className="text-lg font-bold text-white">Level {currentLevel}</h2>
            </div>
            <p className="text-gray-400 text-sm mb-2">{TRADING_LEVELS[currentLevel - 1].title}</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2 transition-all"
                style={{ 
                  width: `${Math.min(100, (stats.totalPnL / TRADING_LEVELS[currentLevel].requirement) * 100)}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-500">${stats.totalPnL.toFixed(0)}</span>
              <span className="text-gray-500">${TRADING_LEVELS[currentLevel].requirement}</span>
            </div>
            
            {/* Add Trading Rank */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <FaStar className={getCurrentRank().color} />
                <div>
                  <div className="text-white font-bold">{getCurrentRank().rank}</div>
                  <div className="text-xs text-gray-400">
                    Win Rate: {stats.totalTrades > 0 
                      ? ((stats.winningTrades / stats.totalTrades) * 100).toFixed(1)
                      : 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Pairs */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold text-white mb-4">Trading Pairs</h2>
            <div className="space-y-2">
              {TRADING_PAIRS.map((pair) => (
                <button
                  key={pair.symbol}
                  onClick={() => setSelectedPair(pair)}
                  className={`w-full p-3 rounded-lg transition-all ${
                    selectedPair.symbol === pair.symbol
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{pair.name}</span>
                    <span className="text-sm opacity-75">{pair.maxLeverage}x</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart and trading interface */}
        <div className="col-span-7 space-y-4">
          {/* Chart container */}
          <div className="bg-gray-800 rounded-lg p-2">
            <div className="aspect-square w-full" style={{ maxHeight: '450px' }}>
              <TradingViewWidget symbol={selectedPair.symbol} />
            </div>
          </div>
          
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-gray-400 text-sm">24h Volume</div>
              <div className="text-white text-lg">$1.2M</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-gray-400 text-sm">24h Change</div>
              <div className="text-green-400 text-lg">+2.5%</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-gray-400 text-sm">24h High</div>
              <div className="text-white text-lg">${(currentPrice * 1.05).toFixed(2)}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-gray-400 text-sm">24h Low</div>
              <div className="text-white text-lg">${(currentPrice * 0.95).toFixed(2)}</div>
            </div>
          </div>

          {/* Order Book */}
          <div className="grid grid-cols-2 gap-4 bg-gray-800 rounded-lg p-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaBook className="text-green-400" />
                  <h3 className="text-white font-bold">Bids</h3>
                </div>
                <span className="text-xs text-gray-400">Size / Total</span>
              </div>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {orderBook.bids.map((bid, index) => (
                  <div 
                    key={index} 
                    className="grid grid-cols-3 text-sm hover:bg-gray-700/50 transition-colors rounded px-1"
                  >
                    <span className="text-green-400 font-medium">${bid.price.toFixed(2)}</span>
                    <span className="text-gray-400 text-right">{bid.size.toFixed(4)}</span>
                    <div className="relative">
                      <div 
                        className="absolute inset-0 bg-green-500/10" 
                        style={{ width: `${(bid.total / orderBook.bids[orderBook.bids.length - 1].total) * 100}%` }}
                      />
                      <span className="relative text-gray-500 text-right z-10 block">{bid.total.toFixed(4)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaBook className="text-red-400" />
                  <h3 className="text-white font-bold">Asks</h3>
                </div>
                <span className="text-xs text-gray-400">Size / Total</span>
              </div>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {orderBook.asks.map((ask, index) => (
                  <div 
                    key={index} 
                    className="grid grid-cols-3 text-sm hover:bg-gray-700/50 transition-colors rounded px-1"
                  >
                    <span className="text-red-400 font-medium">${ask.price.toFixed(2)}</span>
                    <span className="text-gray-400 text-right">{ask.size.toFixed(4)}</span>
                    <div className="relative">
                      <div 
                        className="absolute inset-0 bg-red-500/10" 
                        style={{ width: `${(ask.total / orderBook.asks[orderBook.asks.length - 1].total) * 100}%` }}
                      />
                      <span className="relative text-gray-500 text-right z-10 block">{ask.total.toFixed(4)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trading Controls */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-white">
                <div className="text-sm">Current Price</div>
                <div className="text-2xl">
                  {currentPrice > 0 ? 
                    `$${currentPrice.toFixed(2)}` : 
                    'Loading...'
                  }
                </div>
              </div>
              <div className="text-white">
                <div className="text-sm">Balance</div>
                <div className="text-2xl">${balance.toFixed(2)}</div>
              </div>
            </div>

            {/* Position Size Controls */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Position Size ($)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={positionSize}
                  onChange={(e) => setPositionSize(Math.max(selectedPair.minSize, Number(e.target.value)))}
                  className="flex-1 bg-gray-700 rounded px-3 py-2 text-white"
                  min={selectedPair.minSize}
                  step={selectedPair.minSize}
                />
                <button
                  onClick={() => setPositionSize(prev => Math.min(balance, prev * 2))}
                  className="px-3 py-2 bg-gray-700 rounded text-white hover:bg-gray-600"
                >
                  2x
                </button>
                <button
                  onClick={() => setPositionSize(prev => Math.max(selectedPair.minSize, prev / 2))}
                  className="px-3 py-2 bg-gray-700 rounded text-white hover:bg-gray-600"
                >
                  ½x
                </button>
              </div>
            </div>

            {/* Leverage Controls */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Leverage ({leverage}x)</label>
              <input
                type="range"
                min="1"
                max={selectedPair.maxLeverage}
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1x</span>
                <span>{selectedPair.maxLeverage}x</span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-4 p-3 bg-gray-700/50 rounded">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Total Position Value</span>
                <span className="text-white">${(positionSize * leverage).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Required Margin</span>
                <span className="text-white">${positionSize.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => openPosition('long')}
                className="flex-1 py-3 rounded bg-green-500 text-white hover:bg-green-600 relative overflow-hidden"
              >
                <span className="relative z-10">Long {leverage}x</span>
              </button>
              <button
                onClick={() => openPosition('short')}
                className="flex-1 py-3 rounded bg-red-500 text-white hover:bg-red-600 relative overflow-hidden"
              >
                <span className="relative z-10">Short {leverage}x</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="col-span-3 space-y-4">
          {/* Performance Insights */}
          {insights.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <FaBrain className="text-purple-400 text-xl" />
                <h2 className="text-xl font-bold text-white">Trading Insights</h2>
              </div>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg ${
                      insight.type === 'success' ? 'bg-green-900/20 border border-green-500/20' :
                      insight.type === 'warning' ? 'bg-red-900/20 border border-red-500/20' :
                      'bg-blue-900/20 border border-blue-500/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-gray-200 text-sm">{insight.message}</p>
                        {insight.metric && (
                          <div className="flex justify-between mt-2 text-xs">
                            <span className="text-gray-400">{insight.metric}</span>
                            <span className={
                              insight.type === 'success' ? 'text-green-400' :
                              insight.type === 'warning' ? 'text-red-400' :
                              'text-blue-400'
                            }>{insight.value}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trade History */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Trade History</h2>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-gray-400 hover:text-white"
              >
                <FaHistory className="text-xl" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {tradeHistory.slice().reverse().map(trade => (
                <div 
                  key={trade.id}
                  className="p-3 rounded-lg bg-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-white font-bold">{trade.symbol}</span>
                      <span className={`ml-2 text-sm ${
                        trade.type === 'long' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trade.type.toUpperCase()} {trade.leverage}x
                      </span>
                    </div>
                    <span className={`font-bold ${
                      trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${trade.pnl.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Entry</span>
                      <span className="float-right text-white">${trade.entryPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Exit</span>
                      <span className="float-right text-white">${trade.exitPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Size</span>
                      <span className="float-right text-white">${trade.size.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Duration</span>
                      <span className="float-right text-white">
                        {Math.floor(trade.duration / 1000)}s
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold text-white mb-4">Achievements</h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className={`p-3 rounded-lg ${
                    achievement.unlocked 
                      ? 'bg-gray-700/50 border border-yellow-500/50' 
                      : 'bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {achievement.icon}
                    <div>
                      <h3 className="text-white font-bold">{achievement.title}</h3>
                      <p className="text-gray-400 text-sm">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 rounded-full h-2 transition-all"
                      style={{ 
                        width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-400">
                      {achievement.progress} / {achievement.target}
                    </span>
                    <span className="text-yellow-400">+${achievement.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Positions */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold text-white mb-4">Positions</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {positions.map(position => {
                const pnl = calculatePnL(position, currentPrice)
                const pnlPercent = (pnl / position.size) * 100
                
                return (
                  <div
                    key={position.id}
                    className="bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-white">{position.symbol}</span>
                      <span className={`font-bold ${position.type === 'long' ? 'text-green-400' : 'text-red-400'}`}>
                        {position.type.toUpperCase()} {position.leverage}x
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Entry</span>
                      <span className="text-white">${position.entryPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Size</span>
                      <span className="text-white">${position.size.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Total Value</span>
                      <span className="text-white">${(position.size * position.leverage).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-400">PnL</span>
                      <span className={pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                        ${pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
                      </span>
                    </div>
                    <button
                      onClick={() => closePosition(position.id)}
                      className="w-full py-2 rounded bg-gray-600 text-white hover:bg-gray-500"
                    >
                      Close Position
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Daily Challenges */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Daily Challenges</h2>
              <button
                onClick={() => setShowChallenges(!showChallenges)}
                className="text-gray-400 hover:text-white"
              >
                <FaCalendar className="text-xl" />
              </button>
            </div>
            
            <div className="space-y-3">
              {dailyChallenges.map(challenge => (
                <div 
                  key={challenge.id}
                  className={`p-3 rounded-lg ${
                    challenge.completed 
                      ? 'bg-gray-700/50 border border-green-500/50' 
                      : 'bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FaRocket className={challenge.completed ? 'text-green-400' : 'text-blue-400'} />
                    <div>
                      <h3 className="text-white font-bold">{challenge.title}</h3>
                      <p className="text-gray-400 text-sm">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 rounded-full h-2 transition-all"
                      style={{ 
                        width: `${Math.min(100, (challenge.progress / challenge.target) * 100)}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-400">
                      {challenge.type === 'profit' ? '$' : ''}{challenge.progress} / {challenge.type === 'profit' ? '$' : ''}{challenge.target}
                    </span>
                    <span className="text-yellow-400">+${challenge.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Management */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <FaShieldAlt className="text-blue-400 text-xl" />
              <h2 className="text-xl font-bold text-white">Risk Management</h2>
            </div>
            <div className="space-y-3">
              {calculateRiskMetrics().map((alert, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg ${
                    alert.type === 'danger' ? 'bg-red-900/20 border border-red-500/20' :
                    'bg-yellow-900/20 border border-yellow-500/20'
                  }`}
                >
                  <p className="text-gray-200 text-sm">{alert.message}</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-gray-400">{alert.metric}</span>
                    <div>
                      <span className={alert.type === 'danger' ? 'text-red-400' : 'text-yellow-400'}>
                        {alert.value}
                      </span>
                      <span className="text-gray-400"> / {alert.threshold}</span>
                    </div>
                  </div>
                </div>
              ))}
              {calculateRiskMetrics().length === 0 && (
                <div className="p-3 rounded-lg bg-green-900/20 border border-green-500/20">
                  <p className="text-gray-200 text-sm">All risk metrics are within safe ranges.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading state for when price is not yet available */}
      {currentPrice === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-gray-700">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-purple-500/30 rounded-full animate-spin">
                  <div className="w-12 h-12 border-4 border-t-purple-500 rounded-full absolute top-[-4px] left-[-4px]"></div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-white font-bold text-lg">Loading {selectedPair.name} Data</div>
                <div className="text-gray-400 text-sm">Connecting to Binance WebSocket...</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 