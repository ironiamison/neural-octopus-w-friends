'use client';

import { useState, useEffect } from 'react';
import { Book, Rocket, TrendingUp, Shield, Brain, Users, ArrowLeftRight, Infinity, GitBranch, Calculator, Layers, Network, Zap, Vote, Link } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LearningModule } from '../types/learning';
import dynamic from 'next/dynamic';
import { MotionDiv } from './motion';

const AnimatedCard = dynamic(() => import('./AnimatedCard'), { ssr: false });

const learningModules: LearningModule[] = [
  {
    id: 'crypto-basics',
    title: 'Crypto Trading Fundamentals',
    description: 'Learn the basics of cryptocurrency trading from a16z experts and industry leaders',
    icon: <Book className="w-6 h-6 text-blue-500" />,
    progress: 0,
    difficulty: 'Beginner',
    estimatedTime: '4 hours',
    topics: ['Blockchain Basics', 'Market Analysis', 'Risk Management'],
    source: 'a16z',
    resources: [
      {
        title: 'Binance Trading Masterclass',
        url: 'https://www.youtube.com/watch?v=ZE2HxTmxfrI',
        type: 'video',
        provider: 'Binance Academy',
        summary: 'Complete video course on cryptocurrency trading fundamentals by Binance. Covers order types, chart analysis, and trading psychology.'
      },
      {
        title: 'Technical Analysis Fundamentals',
        url: 'https://www.youtube.com/watch?v=tfn6mhqGYvs',
        type: 'video',
        provider: 'Benjamin Cowen',
        summary: 'In-depth technical analysis tutorial from a respected crypto analyst. Learn about key indicators and market cycles.'
      },
      {
        title: 'Crypto Trading Guide 2024',
        url: 'https://academy.binance.com/en/articles/crypto-trading-basic-types-of-cryptocurrency-orders',
        type: 'course',
        provider: 'Binance Academy',
        summary: 'Updated comprehensive guide covering modern trading strategies, risk management, and market analysis.'
      }
    ]
  },
  {
    id: 'defi-trading',
    title: 'DeFi Trading Strategies',
    description: 'Master advanced DeFi trading techniques and yield optimization',
    icon: <Rocket className="w-6 h-6 text-purple-500" />,
    progress: 0,
    difficulty: 'Advanced',
    estimatedTime: '6 hours',
    topics: ['Liquidity Pools', 'Yield Optimization', 'Smart Contract Interaction'],
    source: 'a16z',
    resources: [
      {
        title: 'DeFi Trading Masterclass',
        url: 'https://www.youtube.com/watch?v=ClnnLI1SClA',
        type: 'video',
        provider: 'Finematics',
        summary: 'High-quality animated explanations of DeFi trading concepts. Includes practical examples and advanced strategies.'
      },
      {
        title: 'Uniswap V3 Deep Dive',
        url: 'https://www.youtube.com/watch?v=Ehm-OYBmlPM',
        type: 'video',
        provider: 'Uniswap',
        summary: 'Official Uniswap tutorial on concentrated liquidity and advanced trading strategies.'
      },
      {
        title: 'DeFi Risk Analysis',
        url: 'https://research.paradigm.xyz/risk',
        type: 'research',
        provider: 'Paradigm Research',
        summary: 'Professional research on DeFi risks and mitigation strategies by leading crypto researchers.'
      }
    ]
  },
  {
    id: 'technical-analysis',
    title: 'Technical Analysis Mastery',
    description: 'Advanced technical analysis techniques for crypto markets',
    icon: <TrendingUp className="w-6 h-6 text-green-500" />,
    progress: 0,
    difficulty: 'Intermediate',
    estimatedTime: '8 hours',
    topics: ['Chart Patterns', 'Indicators', 'Trade Setup'],
    source: 'a16z',
    resources: [
      {
        title: 'Advanced Chart Patterns',
        url: 'https://www.youtube.com/watch?v=7PM4rNDr4oI',
        type: 'video',
        provider: 'RaoulGMI',
        summary: 'Professional technical analysis course by Raoul Pal. Covers advanced patterns and market structure.'
      },
      {
        title: 'Wyckoff Method in Crypto',
        url: 'https://www.youtube.com/watch?v=H5DGk3fhgNs',
        type: 'video',
        provider: 'CryptoCred',
        summary: 'Comprehensive guide to applying Wyckoff methodology to cryptocurrency markets.'
      },
      {
        title: 'On-Chain Technical Analysis',
        url: 'https://academy.glassnode.com/market-analysis',
        type: 'course',
        provider: 'Glassnode',
        summary: 'Advanced course combining traditional TA with on-chain metrics for better market timing.'
      }
    ]
  },
  {
    id: 'risk-management',
    title: 'Risk Management & Security',
    description: 'Essential risk management strategies for crypto trading',
    icon: <Shield className="w-6 h-6 text-red-500" />,
    progress: 0,
    difficulty: 'Beginner',
    estimatedTime: '3 hours',
    topics: ['Position Sizing', 'Stop Loss Strategies', 'Portfolio Management'],
    source: 'a16z',
    resources: [
      {
        title: 'Risk Management Masterclass',
        url: 'https://www.youtube.com/watch?v=uFv_aGkk1TE',
        type: 'video',
        provider: 'TraderSZ',
        summary: 'Professional trader explains risk management strategies, position sizing, and portfolio balance.'
      },
      {
        title: 'Advanced Order Types Tutorial',
        url: 'https://www.youtube.com/watch?v=7_yAJ7T6J2Y',
        type: 'video',
        provider: 'Bybit Official',
        summary: 'Comprehensive guide to using advanced order types for risk management, including trailing stops and OCO orders.'
      },
      {
        title: 'Crypto Security Guide 2024',
        url: 'https://ethereum.org/en/security/',
        type: 'guide',
        provider: 'Ethereum.org',
        summary: 'Latest security practices for crypto traders, including wallet security, smart contract risks, and operational security.'
      }
    ]
  },
  {
    id: 'market-psychology',
    title: 'Trading Psychology',
    description: 'Master the mental aspects of successful trading',
    icon: <Brain className="w-6 h-6 text-yellow-500" />,
    progress: 0,
    difficulty: 'Intermediate',
    estimatedTime: '4 hours',
    topics: ['Emotional Control', 'Decision Making', 'Discipline'],
    source: 'a16z',
    resources: [
      {
        title: 'Trading Psychology Deep Dive',
        url: 'https://www.youtube.com/watch?v=QgJ8FOX5axY',
        type: 'video',
        provider: 'Mark Douglas',
        summary: 'Legendary trading psychologist explains how to develop a winning mindset and overcome emotional trading.'
      },
      {
        title: 'Managing Trading Emotions',
        url: 'https://www.youtube.com/watch?v=J6rNRq7WkC4',
        type: 'video',
        provider: 'Chat With Traders',
        summary: 'Expert traders share their strategies for maintaining discipline and managing psychology in volatile markets.'
      },
      {
        title: 'Market Psychology Indicators',
        url: 'https://alternative.me/crypto/fear-and-greed-index/',
        type: 'tool',
        provider: 'Alternative.me',
        summary: 'Learn to use sentiment indicators like the Fear & Greed Index for better market timing.'
      }
    ]
  },
  {
    id: 'onchain-analysis',
    title: 'On-Chain Analysis',
    description: 'Learn to analyze blockchain data for trading insights',
    icon: <Users className="w-6 h-6 text-indigo-500" />,
    progress: 0,
    difficulty: 'Advanced',
    estimatedTime: '6 hours',
    topics: ['Blockchain Analytics', 'Wallet Analysis', 'Flow Tracking'],
    source: 'a16z',
    resources: [
      {
        title: 'On-Chain Analysis Masterclass',
        url: 'https://www.youtube.com/watch?v=59Iq3dVHxA4',
        type: 'video',
        provider: 'Willy Woo',
        summary: 'Expert on-chain analyst explains how to use blockchain data for market analysis and trading decisions.'
      },
      {
        title: 'Dune Analytics Tutorial',
        url: 'https://www.youtube.com/watch?v=S-cctFmR828',
        type: 'video',
        provider: 'Dune',
        summary: 'Step-by-step guide to using Dune Analytics for creating custom dashboards and tracking on-chain metrics.'
      },
      {
        title: 'Smart Money Flow Analysis',
        url: 'https://www.nansen.ai/guides/research',
        type: 'guide',
        provider: 'Nansen',
        summary: 'Professional methods for tracking whale activity and institutional movements in crypto markets.'
      }
    ]
  },
  {
    id: 'arbitrage-strategies',
    title: 'Cross-Exchange Arbitrage',
    description: 'Master advanced arbitrage strategies across CEX and DEX platforms',
    icon: <ArrowLeftRight className="w-6 h-6 text-blue-400" />,
    progress: 0,
    difficulty: 'Advanced',
    estimatedTime: '5 hours',
    topics: ['CEX vs DEX', 'Price Differentials', 'Flash Loans'],
    source: 'a16z',
    resources: [
      {
        title: 'Flash Loan Arbitrage Guide',
        url: 'https://docs.aave.com/developers/guides/flash-loans',
        type: 'documentation',
        provider: 'Aave',
        summary: 'Comprehensive guide to executing flash loan arbitrage. Learn about atomic transactions and cross-protocol opportunities.'
      },
      {
        title: 'CEX-DEX Arbitrage Strategies',
        url: 'https://research.paradigm.xyz',
        type: 'research',
        provider: 'Paradigm',
        summary: 'Deep dive into price discrepancies between centralized and decentralized exchanges. Includes mathematical models and execution strategies.'
      },
      {
        title: 'Cross-Chain Arbitrage',
        url: 'https://docs.chain.link/docs/architecture-overview/',
        type: 'guide',
        provider: 'Chainlink',
        summary: 'Guide to monitoring and executing cross-chain arbitrage opportunities using oracles and bridges.'
      }
    ]
  },
  {
    id: 'perpetuals-mastery',
    title: 'Perpetual Futures Trading',
    description: 'Advanced strategies for trading perpetual futures contracts',
    icon: <Infinity className="w-6 h-6 text-pink-500" />,
    progress: 0,
    difficulty: 'Advanced',
    estimatedTime: '7 hours',
    topics: ['Funding Rates', 'Basis Trading', 'Position Management'],
    source: 'a16z',
    resources: [
      {
        title: 'Perpetual Protocol Deep Dive',
        url: 'https://docs.perp.com/learning/perpetual-futures',
        type: 'documentation',
        provider: 'Perpetual Protocol',
        summary: 'Comprehensive guide to perpetual futures, including funding rates, mark price mechanics, and advanced trading strategies.'
      },
      {
        title: 'Basis Trading Strategies',
        url: 'https://www.cmcmarkets.com/en/trading-guides/basis-trading',
        type: 'guide',
        provider: 'CMC Markets',
        summary: 'Expert guide to basis trading in crypto markets. Learn to profit from price differences between spot and futures markets.'
      },
      {
        title: 'dYdX Trading Handbook',
        url: 'https://help.dydx.exchange/articles/perpetual-trading-guide',
        type: 'course',
        provider: 'dYdX',
        summary: 'Professional handbook for trading perpetuals on decentralized platforms. Includes position sizing and risk management.'
      }
    ]
  },
  {
    id: 'options-strategies',
    title: 'Options Trading Strategies',
    description: 'Learn advanced options trading and volatility strategies',
    icon: <GitBranch className="w-6 h-6 text-orange-500" />,
    progress: 0,
    difficulty: 'Advanced',
    estimatedTime: '8 hours',
    topics: ['Greeks', 'Volatility Surface', 'Options Structures'],
    source: 'a16z',
    resources: [
      {
        title: 'Deribit Options Guide',
        url: 'https://insights.deribit.com/options-course/',
        type: 'course',
        provider: 'Deribit',
        summary: 'Professional options trading course covering Greeks, implied volatility, and advanced option structures specific to crypto markets.'
      },
      {
        title: 'Volatility Trading Strategies',
        url: 'https://www.ledgerx.com/education/volatility-trading',
        type: 'guide',
        provider: 'LedgerX',
        summary: 'Advanced guide to trading volatility in crypto markets. Learn about volatility surface analysis and options pricing models.'
      },
      {
        title: 'Options Risk Management',
        url: 'https://www.deltaneutral.com/strategy-guide',
        type: 'interactive',
        provider: 'Delta Neutral',
        summary: 'Interactive tool for understanding options risk management. Practice building delta-neutral portfolios and hedging strategies.'
      }
    ]
  },
  {
    id: 'quant-strategies',
    title: 'Quantitative Trading',
    description: 'Build and implement quantitative trading strategies',
    icon: <Calculator className="w-6 h-6 text-violet-500" />,
    progress: 0,
    difficulty: 'Advanced',
    estimatedTime: '10 hours',
    topics: ['Algorithmic Trading', 'Statistical Arbitrage', 'Machine Learning'],
    source: 'a16z',
    resources: [
      {
        title: 'Quantitative Trading Systems',
        url: 'https://www.quantconnect.com/tutorials/strategy-library',
        type: 'interactive',
        provider: 'QuantConnect',
        summary: 'Comprehensive guide to building quantitative trading systems. Includes backtesting frameworks and strategy optimization.'
      },
      {
        title: 'Machine Learning in Trading',
        url: 'https://research.paradigm.xyz/machine-learning',
        type: 'research',
        provider: 'Paradigm',
        summary: 'Advanced research on applying machine learning to crypto trading. Covers feature engineering and model development.'
      },
      {
        title: 'Statistical Arbitrage',
        url: 'https://www.hudsonriver.com/research/statistical-arbitrage',
        type: 'course',
        provider: 'Hudson River',
        summary: 'Professional course on statistical arbitrage strategies in crypto markets. Learn about pairs trading and mean reversion.'
      }
    ]
  },
  {
    id: 'market-making',
    title: 'Market Making Strategies',
    description: 'Learn professional market making techniques',
    icon: <Layers className="w-6 h-6 text-cyan-500" />,
    progress: 0,
    difficulty: 'Advanced',
    estimatedTime: '6 hours',
    topics: ['Spread Management', 'Inventory Control', 'Risk Metrics'],
    source: 'a16z',
    resources: [
      {
        title: 'Professional Market Making',
        url: 'https://www.wintermute.com/market-making-guide',
        type: 'guide',
        provider: 'Wintermute',
        summary: 'Professional guide to market making in crypto markets. Learn about spread management and inventory optimization.'
      },
      {
        title: 'DEX Market Making',
        url: 'https://docs.uniswap.org/concepts/protocol/market-making',
        type: 'documentation',
        provider: 'Uniswap',
        summary: 'Technical guide to market making on decentralized exchanges. Includes concentrated liquidity strategies.'
      },
      {
        title: 'Risk Management for Market Makers',
        url: 'https://www.jump.com/research/market-making-risk',
        type: 'research',
        provider: 'Jump Trading',
        summary: 'Advanced research on risk management for market makers. Covers hedging strategies and position management.'
      }
    ]
  },
  {
    id: 'defi-derivatives',
    title: 'DeFi Derivatives',
    description: 'Explore advanced DeFi derivative instruments',
    icon: <Network className="w-6 h-6 text-emerald-500" />,
    progress: 0,
    difficulty: 'Advanced',
    estimatedTime: '7 hours',
    topics: ['Synthetic Assets', 'Power Perpetuals', 'Yield Derivatives'],
    source: 'a16z',
    resources: [
      {
        title: 'Synthetic Assets Guide',
        url: 'https://docs.synthetix.io/synthetic-assets',
        type: 'documentation',
        provider: 'Synthetix',
        summary: 'Comprehensive guide to synthetic assets in DeFi. Learn about collateralization and trading strategies.'
      },
      {
        title: 'Power Perpetuals',
        url: 'https://research.paradigm.xyz/power-perpetuals',
        type: 'research',
        provider: 'Paradigm',
        summary: 'Technical deep dive into power perpetuals. Understanding squared price exposure and hedging strategies.'
      },
      {
        title: 'Yield Derivatives',
        url: 'https://docs.pendle.finance/introduction',
        type: 'documentation',
        provider: 'Pendle',
        summary: 'Advanced guide to trading yield derivatives. Learn about yield tokenization and fixed-rate strategies.'
      }
    ]
  },
  {
    id: 'mev-strategies',
    title: 'MEV & Frontrunning',
    description: 'Understanding MEV opportunities and protection',
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    progress: 0,
    difficulty: 'Advanced',
    estimatedTime: '5 hours',
    topics: ['Sandwich Attacks', 'Flashbots', 'MEV Protection'],
    source: 'a16z',
    resources: [
      {
        title: 'MEV Research',
        url: 'https://docs.flashbots.net/flashbots-protect',
        type: 'documentation',
        provider: 'Flashbots',
        summary: 'Technical guide to MEV, including sandwich attacks, arbitrage opportunities, and protection strategies.'
      },
      {
        title: 'Frontrunning Protection',
        url: 'https://blog.chain.link/defi-security-best-practices',
        type: 'guide',
        provider: 'Chainlink',
        summary: 'Comprehensive guide to protecting against frontrunning and MEV exploitation in DeFi trading.'
      },
      {
        title: 'MEV Opportunities',
        url: 'https://www.blocknative.com/blog/mev-research',
        type: 'research',
        provider: 'Blocknative',
        summary: 'Research on identifying and capitalizing on MEV opportunities while maintaining ethical trading practices.'
      }
    ]
  },
  {
    id: 'governance-trading',
    title: 'Governance & Token Trading',
    description: 'Trading strategies around governance events',
    icon: <Vote className="w-6 h-6 text-purple-400" />,
    progress: 0,
    difficulty: 'Advanced',
    estimatedTime: '4 hours',
    topics: ['Governance Analysis', 'Token Economics', 'Event Trading'],
    source: 'a16z',
    resources: [
      {
        title: 'Governance Trading Guide',
        url: 'https://messari.io/report/governance-trading',
        type: 'research',
        provider: 'Messari',
        summary: 'Professional guide to trading around governance events. Learn to analyze proposals and predict market impact.'
      },
      {
        title: 'Token Economics',
        url: 'https://multicoin.capital/token-economics',
        type: 'research',
        provider: 'Multicoin Capital',
        summary: 'Deep dive into token economics and how governance structures affect token value and trading opportunities.'
      },
      {
        title: 'Event-Driven Strategies',
        url: 'https://www.theblockresearch.com/event-trading',
        type: 'guide',
        provider: 'The Block',
        summary: 'Guide to trading around significant protocol events and governance decisions. Includes case studies.'
      }
    ]
  },
  {
    id: 'cross-chain-trading',
    title: 'Cross-Chain Trading',
    description: 'Master multi-chain trading strategies',
    icon: <Link className="w-6 h-6 text-teal-500" />,
    progress: 0,
    difficulty: 'Advanced',
    estimatedTime: '6 hours',
    topics: ['Bridge Mechanics', 'Cross-Chain DEX', 'Liquidity Management'],
    source: 'a16z',
    resources: [
      {
        title: 'Cross-Chain DEX Guide',
        url: 'https://docs.thorchain.org/trading',
        type: 'documentation',
        provider: 'THORChain',
        summary: 'Comprehensive guide to cross-chain DEX trading. Learn about native asset swaps and liquidity provision.'
      },
      {
        title: 'Bridge Security',
        url: 'https://li.fi/knowledge-hub/bridge-security',
        type: 'guide',
        provider: 'Li.Fi',
        summary: 'Technical guide to bridge security and best practices for cross-chain trading. Includes risk assessment.'
      },
      {
        title: 'Multi-Chain Strategy',
        url: 'https://research.thetie.io/cross-chain-trading',
        type: 'research',
        provider: 'The Tie',
        summary: 'Research on developing and executing multi-chain trading strategies. Covers arbitrage and liquidity optimization.'
      }
    ]
  }
];

export default function CryptoLearning() {
  const initialUnlockedModules = learningModules.slice(0, 3).map(m => m.id);
  const [mounted, setMounted] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [unlockedModules, setUnlockedModules] = useState<string[]>(initialUnlockedModules);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    setMounted(true);
    // Load data from localStorage only on client side
    const savedCompleted = localStorage.getItem('completed-modules');
    const savedUnlocked = localStorage.getItem('unlocked-modules');
    const savedProgress = localStorage.getItem('module-progress');

    if (savedCompleted) {
      try {
        setCompletedModules(JSON.parse(savedCompleted));
      } catch (error) {
        console.error('Error loading completed modules:', error);
        localStorage.removeItem('completed-modules');
      }
    }

    if (savedUnlocked) {
      try {
        setUnlockedModules(JSON.parse(savedUnlocked));
      } catch (error) {
        console.error('Error loading unlocked modules:', error);
        localStorage.removeItem('unlocked-modules');
      }
    }

    if (savedProgress) {
      try {
        setUserProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Error loading progress:', error);
        localStorage.removeItem('module-progress');
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('completed-modules', JSON.stringify(completedModules));
      localStorage.setItem('unlocked-modules', JSON.stringify(unlockedModules));
      localStorage.setItem('module-progress', JSON.stringify(userProgress));
    }
  }, [mounted, completedModules, unlockedModules, userProgress]);

  const handleModuleComplete = (moduleId: string) => {
    const newCompleted = Array.from(new Set([...completedModules, moduleId]));
    setCompletedModules(newCompleted);

    const newProgress = {
      ...userProgress,
      [moduleId]: 100
    };
    setUserProgress(newProgress);

    if (newCompleted.length === 3) {
      const allModuleIds = learningModules.map(m => m.id);
      setUnlockedModules(allModuleIds);
    }
  };

  const handleProgressUpdate = (moduleId: string, progress: number) => {
    const newProgress = {
      ...userProgress,
      [moduleId]: progress
    };
    setUserProgress(newProgress);

    // Check if module is complete
    if (progress === 100) {
      handleModuleComplete(moduleId);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {learningModules.map((module, index) => {
        // Ensure we have a valid array of unlocked module IDs
        const currentUnlocked = Array.isArray(unlockedModules) 
          ? unlockedModules 
          : initialUnlockedModules;

        const isLocked = !currentUnlocked.includes(module.id);
        const currentProgress = userProgress[module.id] || 0;

        return (
          <AnimatedCard
            key={module.id}
            module={{
              ...module,
              progress: currentProgress
            }}
            index={index}
            isLocked={isLocked}
            onModuleComplete={() => handleModuleComplete(module.id)}
            onProgressUpdate={(progress: number) => handleProgressUpdate(module.id, progress)}
          />
        );
      })}
    </div>
  );
} 