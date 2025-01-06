'use client';

import { useState, useEffect } from 'react';
import { Book, Rocket, TrendingUp, Shield, Brain, Users, ArrowLeftRight, Infinity, GitBranch, Calculator, Layers, Network, Zap, Vote, Link, Lock, Bot, Palette, Repeat, ChartBar, Gem, Coins, LineChart, Workflow, Lightbulb, Target, Code, Cpu, Boxes, Radar } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LearningModule, Resource } from '../types/learning';
import { MotionDiv } from './motion';
import { useWallet } from '../providers/WalletProvider';
import { userService } from '../lib/services/user.service';
import AnimatedCard from './AnimatedCard';

const newModules: LearningModule[] = [
  {
    id: 'layer2-trading',
    title: 'Layer 2 Trading Mastery',
    description: 'Master trading strategies for Layer 2 networks and rollups',
    icon: <Layers className="w-6 h-6 text-purple-400" />,
    progress: 0,
    difficulty: 'Advanced' as const,
    estimatedTime: '8 hours',
    topics: ['Rollups', 'Bridges', 'Gas Optimization', 'MEV on L2'],
    source: 'platform' as const,
    resources: [
      {
        title: 'Layer 2 Trading Guide',
        url: 'https://docs.arbitrum.io/getting-started',
        type: 'documentation',
        provider: 'Arbitrum',
        summary: 'Comprehensive guide to trading on Layer 2 networks.'
      },
      {
        title: 'Optimistic Rollups',
        url: 'https://community.optimism.io/docs/protocol/',
        type: 'documentation',
        provider: 'Optimism',
        summary: 'Understanding and trading on Optimistic rollups.'
      },
      {
        title: 'Bridge Strategies',
        url: 'https://docs.hop.exchange/getting-started',
        type: 'documentation',
        provider: 'Hop Protocol',
        summary: 'Advanced strategies for cross-L2 arbitrage using bridges.'
      }
    ]
  },
  {
    id: 'quant-trading',
    title: 'Quantitative Trading',
    description: 'Learn advanced quantitative trading strategies and analysis',
    icon: <Calculator className="w-6 h-6 text-blue-400" />,
    progress: 0,
    difficulty: 'Advanced' as const,
    estimatedTime: '15 hours',
    topics: ['Statistical Analysis', 'Portfolio Theory', 'Risk Models', 'Python Trading'],
    source: 'platform' as const,
    resources: [
      {
        title: 'Quantitative Trading Course',
        url: 'https://www.quantconnect.com/tutorials/',
        type: 'course',
        provider: 'QuantConnect',
        summary: 'Comprehensive course on quantitative trading strategies.'
      },
      {
        title: 'Statistical Arbitrage',
        url: 'https://www.youtube.com/watch?v=g-qvFD3fUoY',
        type: 'video',
        provider: 'QuantInsti',
        summary: 'Advanced statistical arbitrage strategies for crypto.'
      },
      {
        title: 'Portfolio Optimization',
        url: 'https://www.youtube.com/watch?v=9fXm3rzkn8w',
        type: 'video',
        provider: 'Hudson & Thames',
        summary: 'Modern portfolio theory applied to crypto markets.'
      }
    ]
  },
  {
    id: 'smart-contract-analysis',
    title: 'Smart Contract Analysis',
    description: 'Learn to analyze smart contracts for trading opportunities',
    icon: <Code className="w-6 h-6 text-green-400" />,
    progress: 0,
    difficulty: 'Advanced' as const,
    estimatedTime: '12 hours',
    topics: ['Solidity', 'Security Analysis', 'Contract Interaction', 'MEV'],
    source: 'platform' as const,
    resources: [
      {
        title: 'Smart Contract Security',
        url: 'https://consensys.github.io/smart-contract-best-practices/',
        type: 'documentation',
        provider: 'ConsenSys',
        summary: 'Best practices for smart contract security analysis.'
      },
      {
        title: 'MEV Bot Development',
        url: 'https://www.flashbots.net/builders',
        type: 'documentation',
        provider: 'Flashbots',
        summary: 'Learn to build MEV bots and analyze opportunities.'
      },
      {
        title: 'Contract Analysis Tools',
        url: 'https://tenderly.co/documentation',
        type: 'documentation',
        provider: 'Tenderly',
        summary: 'Professional tools for smart contract analysis.'
      }
    ]
  },
  {
    id: 'ai-trading',
    title: 'AI Trading Systems',
    description: 'Build advanced AI-powered trading systems',
    icon: <Cpu className="w-6 h-6 text-red-400" />,
    progress: 0,
    difficulty: 'Advanced' as const,
    estimatedTime: '20 hours',
    topics: ['Machine Learning', 'Neural Networks', 'NLP', 'Reinforcement Learning'],
    source: 'platform' as const,
    resources: [
      {
        title: 'ML for Trading',
        url: 'https://www.youtube.com/watch?v=OQdezFqYZKM',
        type: 'video',
        provider: 'Siraj Raval',
        summary: 'Building machine learning models for crypto trading.'
      },
      {
        title: 'Deep Learning in Finance',
        url: 'https://www.coursera.org/learn/deep-learning-in-finance',
        type: 'course',
        provider: 'Coursera',
        summary: 'Advanced deep learning techniques for financial markets.'
      },
      {
        title: 'NLP for Market Analysis',
        url: 'https://www.tensorflow.org/tutorials/text/word_embeddings',
        type: 'documentation',
        provider: 'TensorFlow',
        summary: 'Using NLP to analyze market sentiment and news.'
      }
    ]
  },
  {
    id: 'defi-yield-strategies',
    title: 'Advanced DeFi Yield',
    description: 'Master complex DeFi yield optimization strategies',
    icon: <Boxes className="w-6 h-6 text-yellow-400" />,
    progress: 0,
    difficulty: 'Advanced' as const,
    estimatedTime: '10 hours',
    topics: ['Yield Farming', 'LP Strategies', 'Risk Assessment', 'Protocol Analysis'],
    source: 'platform' as const,
    resources: [
      {
        title: 'Advanced Yield Strategies',
        url: 'https://docs.yearn.finance/',
        type: 'documentation',
        provider: 'Yearn Finance',
        summary: 'Professional yield optimization strategies.'
      },
      {
        title: 'LP Position Management',
        url: 'https://docs.aave.com/developers/',
        type: 'documentation',
        provider: 'Aave',
        summary: 'Managing liquidity positions across protocols.'
      },
      {
        title: 'Risk Analysis Framework',
        url: 'https://medium.com/risk-dao',
        type: 'article',
        provider: 'Risk DAO',
        summary: 'Framework for analyzing DeFi protocol risks.'
      }
    ]
  },
  {
    id: 'cross-chain-trading',
    title: 'Cross-Chain Trading',
    description: 'Master cross-chain trading and arbitrage strategies',
    icon: <Radar className="w-6 h-6 text-indigo-400" />,
    progress: 0,
    difficulty: 'Advanced' as const,
    estimatedTime: '12 hours',
    topics: ['Bridge Mechanics', 'Cross-Chain DEX', 'Security', 'Arbitrage'],
    source: 'platform' as const,
    resources: [
      {
        title: 'Cross-Chain Fundamentals',
        url: 'https://docs.thorchain.org/',
        type: 'documentation',
        provider: 'THORChain',
        summary: 'Understanding cross-chain trading mechanics.'
      },
      {
        title: 'Bridge Security',
        url: 'https://docs.multichain.org/getting-started',
        type: 'documentation',
        provider: 'Multichain',
        summary: 'Security considerations for cross-chain trading.'
      },
      {
        title: 'Arbitrage Strategies',
        url: 'https://docs.synapse.network/',
        type: 'documentation',
        provider: 'Synapse',
        summary: 'Advanced cross-chain arbitrage techniques.'
      }
    ]
  }
];

const learningModules: LearningModule[] = [
  {
    id: 'crypto-basics',
    title: 'Crypto Trading Fundamentals',
    description: 'Learn the basics of cryptocurrency trading from a16z experts and industry leaders',
    icon: <Book className="w-6 h-6 text-indigo-400" />,
    progress: 0,
    difficulty: 'Beginner' as const,
    estimatedTime: '4 hours',
    topics: ['Blockchain Basics', 'Market Analysis', 'Risk Management'],
    source: 'a16z' as const,
    resources: [
      {
        title: 'a16z Crypto Canon',
        url: 'https://a16z.com/crypto-canon/',
        type: 'course',
        provider: 'a16z',
        summary: 'Essential readings and resources for understanding crypto from a16z experts.'
      },
      // ... other resources
    ]
  },
  {
    id: 'nft-trading',
    title: 'NFT Trading Mastery',
    description: 'Learn advanced NFT trading strategies and market analysis',
    icon: <Palette className="w-6 h-6 text-pink-400" />,
    progress: 0,
    difficulty: 'Intermediate' as const,
    estimatedTime: '6 hours',
    topics: ['NFT Valuation', 'Collection Analysis', 'Rarity Tools', 'Market Timing'],
    source: 'platform' as const,
    resources: [
      {
        title: 'NFT Trading Fundamentals',
        url: 'https://opensea.io/blog/guides/nft-trading-guide/',
        type: 'guide',
        provider: 'OpenSea',
        summary: 'Comprehensive guide to NFT trading fundamentals and market dynamics.'
      },
      {
        title: 'NFT Valuation Masterclass',
        url: 'https://nftvaluations.com/masterclass',
        type: 'course',
        provider: 'NFT Valuations',
        summary: 'Learn professional NFT valuation techniques and market analysis.'
      },
      {
        title: 'Rarity Tools Guide',
        url: 'https://rarity.tools/guide',
        type: 'documentation',
        provider: 'Rarity Tools',
        summary: 'Master the use of rarity tools for NFT trading decisions.'
      }
    ]
  },
  {
    id: 'arbitrage-strategies',
    title: 'Cross-Exchange Arbitrage',
    description: 'Master cross-exchange and DEX arbitrage strategies',
    icon: <Repeat className="w-6 h-6 text-indigo-400" />,
    progress: 0,
    difficulty: 'Advanced' as const,
    estimatedTime: '8 hours',
    topics: ['Price Differentials', 'Exchange APIs', 'Gas Optimization', 'Risk Management'],
    source: 'platform' as const,
    resources: [
      {
        title: 'DEX Arbitrage Guide',
        url: 'https://docs.1inch.io/docs/arbitrage/',
        type: 'documentation',
        provider: '1inch',
        summary: 'Complete guide to DEX arbitrage opportunities and execution.'
      },
      {
        title: 'Cross-Exchange Trading',
        url: 'https://www.youtube.com/watch?v=wD3IU_Bdx_g',
        type: 'video',
        provider: 'Crypto Trading Pro',
        summary: 'Advanced strategies for cross-exchange arbitrage trading.'
      },
      {
        title: 'Gas Optimization Techniques',
        url: 'https://ethereum.org/en/developers/docs/gas-optimization/',
        type: 'documentation',
        provider: 'Ethereum',
        summary: 'Learn to optimize gas usage for profitable arbitrage trades.'
      }
    ]
  },
  {
    id: 'memecoin-analysis',
    title: 'Memecoin Trading Strategies',
    description: 'Advanced analysis techniques for memecoin trading',
    icon: <Coins className="w-6 h-6 text-yellow-400" />,
    progress: 0,
    difficulty: 'Advanced' as const,
    estimatedTime: '6 hours',
    topics: ['Social Sentiment', 'Momentum Analysis', 'Risk Management', 'Exit Strategies'],
    source: 'platform' as const,
    resources: [
      {
        title: 'Memecoin Market Analysis',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        type: 'video',
        provider: 'CryptoU',
        summary: 'Advanced techniques for analyzing memecoin market dynamics.'
      },
      {
        title: 'Social Sentiment Analysis',
        url: 'https://lunarcrush.com/learn',
        type: 'course',
        provider: 'LunarCrush',
        summary: 'Learn to analyze social media sentiment for trading decisions.'
      },
      {
        title: 'Risk Management in Volatile Markets',
        url: 'https://academy.binance.com/en/articles/a-guide-to-cryptocurrency-trading-for-beginners',
        type: 'article',
        provider: 'Binance Academy',
        summary: 'Essential risk management strategies for highly volatile markets.'
      }
    ]
  },
  {
    id: 'trend-analysis',
    title: 'Advanced Trend Analysis',
    description: 'Master modern trend analysis and prediction techniques',
    icon: <LineChart className="w-6 h-6 text-green-400" />,
    progress: 0,
    difficulty: 'Advanced' as const,
    estimatedTime: '8 hours',
    topics: ['Trend Identification', 'Momentum Indicators', 'Pattern Recognition', 'AI Integration'],
    source: 'platform' as const,
    resources: [
      {
        title: 'Advanced Trend Analysis',
        url: 'https://www.tradingview.com/education/technicalanalysis/',
        type: 'course',
        provider: 'TradingView',
        summary: 'Comprehensive guide to modern trend analysis techniques.'
      },
      {
        title: 'AI in Technical Analysis',
        url: 'https://www.youtube.com/watch?v=u6XAPnuFjJc',
        type: 'video',
        provider: 'Crypto Data Science',
        summary: 'Learn to integrate AI models into your trend analysis.'
      },
      {
        title: 'Pattern Recognition Mastery',
        url: 'https://www.investopedia.com/articles/technical/112601.asp',
        type: 'article',
        provider: 'Investopedia',
        summary: 'Master the art of pattern recognition in crypto markets.'
      }
    ]
  },
  {
    id: 'dex-trading',
    title: 'DEX Trading Mastery',
    description: 'Advanced decentralized exchange trading strategies',
    icon: <Workflow className="w-6 h-6 text-purple-400" />,
    progress: 0,
    difficulty: 'Advanced' as const,
    estimatedTime: '8 hours',
    topics: ['AMM Mechanics', 'Impermanent Loss', 'MEV Protection', 'Gas Optimization'],
    source: 'platform' as const,
    resources: [
      {
        title: 'DEX Trading Fundamentals',
        url: 'https://docs.uniswap.org/concepts/introduction/protocol-overview',
        type: 'documentation',
        provider: 'Uniswap',
        summary: 'Comprehensive overview of DEX trading mechanics.'
      },
      {
        title: 'Advanced DEX Strategies',
        url: 'https://academy.binance.com/en/articles/what-is-a-decentralized-exchange-dex',
        type: 'article',
        provider: 'Binance Academy',
        summary: 'Advanced trading strategies for decentralized exchanges.'
      },
      {
        title: 'MEV Protection Strategies',
        url: 'https://docs.flashbots.net/',
        type: 'documentation',
        provider: 'Flashbots',
        summary: 'Learn to protect your trades from MEV extraction.'
      }
    ]
  },
  {
    id: 'gem-hunting',
    title: 'Early Gem Detection',
    description: 'Learn to identify promising early-stage crypto projects',
    icon: <Gem className="w-6 h-6 text-blue-400" />,
    progress: 0,
    difficulty: 'Advanced' as const,
    estimatedTime: '10 hours',
    topics: ['Project Analysis', 'Team Evaluation', 'Tokenomics', 'Risk Assessment'],
    source: 'platform' as const,
    resources: [
      {
        title: 'Fundamental Analysis',
        url: 'https://research.binance.com/en/analysis',
        type: 'research',
        provider: 'Binance Research',
        summary: 'Learn to analyze crypto projects using fundamental analysis.'
      },
      {
        title: 'Tokenomics Deep Dive',
        url: 'https://messari.io/research',
        type: 'research',
        provider: 'Messari',
        summary: 'Understanding and evaluating crypto project tokenomics.'
      },
      {
        title: 'Due Diligence Guide',
        url: 'https://docs.google.com/document/d/1IiC0v5h7YMwkbwLp4E_L9RqADiGPMkfv8RgKxeVVRPA/',
        type: 'guide',
        provider: 'Community',
        summary: 'Comprehensive due diligence checklist for crypto projects.'
      }
    ]
  },
  {
    id: 'market-making',
    title: 'Market Making Strategies',
    description: 'Learn professional market making and liquidity provision',
    icon: <ChartBar className="w-6 h-6 text-indigo-400" />,
    progress: 0,
    difficulty: 'Advanced' as const,
    estimatedTime: '12 hours',
    topics: ['Spread Management', 'Inventory Control', 'Risk Metrics', 'Automation'],
    source: 'platform' as const,
    resources: [
      {
        title: 'Market Making Fundamentals',
        url: 'https://www.youtube.com/watch?v=Kl4-VJ2K8Ik',
        type: 'video',
        provider: 'Crypto Trading Pro',
        summary: 'Introduction to market making strategies and concepts.'
      },
      {
        title: 'Professional Market Making',
        url: 'https://docs.hummingbot.org/',
        type: 'documentation',
        provider: 'Hummingbot',
        summary: 'Learn to use professional market making tools and strategies.'
      },
      {
        title: 'Risk Management for Market Makers',
        url: 'https://www.cmegroup.com/education/courses/market-making-fundamentals.html',
        type: 'course',
        provider: 'CME Group',
        summary: 'Advanced risk management techniques for market makers.'
      }
    ]
  },
  ...newModules
];

export default function CryptoLearning() {
  const { isConnected, publicKey } = useWallet();
  const initialUnlockedModules = learningModules.slice(0, 3).map((m: LearningModule) => m.id);
  const [mounted, setMounted] = useState<boolean>(false);
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    const savedCompleted = localStorage.getItem('completed-modules');
    if (savedCompleted) {
      try {
        const parsed = JSON.parse(savedCompleted);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [unlockedModules, setUnlockedModules] = useState<string[]>(() => {
    // Initialize with initial modules and any saved modules from localStorage
    const savedUnlocked = localStorage.getItem('unlocked-modules');
    if (savedUnlocked) {
      try {
        const parsed = JSON.parse(savedUnlocked);
        return Array.isArray(parsed) ? parsed : initialUnlockedModules;
      } catch {
        return initialUnlockedModules;
      }
    }
    return initialUnlockedModules;
  });
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [completedResources, setCompletedResources] = useState<Set<number>>(new Set());
  const [moduleUnlockTimers, setModuleUnlockTimers] = useState<Record<string, NodeJS.Timeout>>({});
  const [pendingUnlocks, setPendingUnlocks] = useState<Record<string, number>>({});

  // Load progress from both localStorage and user profile
  useEffect(() => {
    setMounted(true);
    
    // Load from localStorage
    const loadFromLocalStorage = () => {
      const savedCompleted = localStorage.getItem('completed-modules');
      const savedUnlocked = localStorage.getItem('unlocked-modules');
      const savedProgress = localStorage.getItem('module-progress');
      const savedResources = localStorage.getItem('completed-resources');

      if (savedCompleted) {
        try {
          const parsed = JSON.parse(savedCompleted);
          setCompletedModules(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.error('Error loading completed modules:', error);
          localStorage.removeItem('completed-modules');
          setCompletedModules([]);
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

      if (savedResources) {
        try {
          setCompletedResources(new Set(JSON.parse(savedResources)));
        } catch (error) {
          console.error('Error loading completed resources:', error);
          localStorage.removeItem('completed-resources');
        }
      }
    };

    // Load from user profile
    const loadFromProfile = async () => {
      if (!publicKey) return;
      
      try {
        const profile = await userService.getProfile(publicKey.toString());
        if (profile?.learningProgress) {
          const { completedModules: profileCompleted, unlockedModules: profileUnlocked, progress: profileProgress, completedResources: profileResources } = profile.learningProgress;
          
          // Merge with localStorage data, preferring the most recent progress
          setCompletedModules(prev => 
            Array.from(new Set([...prev, ...profileCompleted]))
          );
          setUnlockedModules(prev => 
            Array.from(new Set([...prev, ...profileUnlocked]))
          );
          setUserProgress(prev => ({
            ...prev,
            ...profileProgress
          }));
          // Convert the array of numbers to a Set
          setCompletedResources(prev => {
            const newSet = new Set(prev);
            profileResources.forEach(idx => newSet.add(idx));
            return newSet;
          });

          // Update localStorage with merged data
          localStorage.setItem('completed-modules', JSON.stringify(completedModules));
          localStorage.setItem('unlocked-modules', JSON.stringify(unlockedModules));
          localStorage.setItem('module-progress', JSON.stringify(userProgress));
          localStorage.setItem('completed-resources', JSON.stringify(Array.from(completedResources)));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadFromLocalStorage();
    loadFromProfile();
  }, [publicKey]);

  // Save progress to user profile
  const saveToProfile = async () => {
    if (!publicKey) return;

    try {
      await userService.updateProfile(publicKey.toString(), {
        learningProgress: {
          completedModules,
          unlockedModules,
          progress: userProgress,
          completedResources: Array.from(completedResources)
        }
      });
    } catch (error) {
      console.error('Error saving to profile:', error);
    }
  };

  // Add a16z content validation
  const validateA16zContent = async (moduleId: string) => {
    const module = learningModules.find(m => m.id === moduleId);
    if (!module || module.source !== 'a16z') return true;

    try {
      const a16zResources = module.resources.filter(r => r.provider === 'a16z');
      const validationPromises = a16zResources.map(async resource => {
        try {
          const response = await fetch(resource.url, { method: 'HEAD' });
          return response.ok;
        } catch {
          return false;
        }
      });

      const results = await Promise.all(validationPromises);
      return results.every(result => result);
    } catch (error) {
      console.error('Error validating a16z content:', error);
      return false;
    }
  };

  // Update handleModuleComplete to include a16z validation
  const handleModuleComplete = async (moduleId: string) => {
    // Get module resources
    const module = learningModules.find(m => m.id === moduleId);
    if (!module) return;

    // Validate a16z content if applicable
    if (module.source === 'a16z') {
      const isValid = await validateA16zContent(moduleId);
      if (!isValid) {
        console.error('Failed to validate a16z content');
        return;
      }
    }

    // Check if module has 100% progress
    const progress = userProgress[moduleId] || 0;
    if (progress !== 100) return;

    // Check if all resources are completed
    const allResourcesCompleted = module.resources.every((_, idx) => completedResources.has(idx));
    if (!allResourcesCompleted) return;

    // Only now add to completedModules if not already there
    if (!completedModules.includes(moduleId)) {
      const newCompleted = [...completedModules, moduleId];
      setCompletedModules(newCompleted);
      localStorage.setItem('completed-modules', JSON.stringify(newCompleted));

      // Start 5-minute timer for next module unlock
      const currentIndex = learningModules.findIndex(m => m.id === moduleId);
      if (currentIndex < learningModules.length - 1) {
        const nextModuleId = learningModules[currentIndex + 1].id;
        if (!unlockedModules.includes(nextModuleId)) {
          // Set pending unlock time
          const unlockTime = Date.now() + 5 * 60 * 1000; // 5 minutes
          setPendingUnlocks(prev => ({ ...prev, [nextModuleId]: unlockTime }));
          
          // Clear existing timer if any
          if (moduleUnlockTimers[nextModuleId]) {
            clearTimeout(moduleUnlockTimers[nextModuleId]);
          }
          
          // Set new timer
          const timer = setTimeout(() => {
            const newUnlocked = [...unlockedModules, nextModuleId];
            setUnlockedModules(newUnlocked);
            localStorage.setItem('unlocked-modules', JSON.stringify(newUnlocked));
            setPendingUnlocks(prev => {
              const { [nextModuleId]: _, ...rest } = prev;
              return rest;
            });
            // Save to profile
            saveToProfile();
          }, 5 * 60 * 1000);
          
          setModuleUnlockTimers(prev => ({ ...prev, [nextModuleId]: timer }));
        }
      }

      // Save to profile
      saveToProfile();
    }
  };

  const handleProgressUpdate = (moduleId: string, progress: number) => {
    const newProgress = { ...userProgress, [moduleId]: progress };
    setUserProgress(newProgress);
    localStorage.setItem('module-progress', JSON.stringify(newProgress));

    // Check if module should be marked as complete
    const module = learningModules.find(m => m.id === moduleId);
    if (!module) return;

    const allResourcesCompleted = module.resources.every((_, idx) => completedResources.has(idx));
    if (progress === 100 && allResourcesCompleted) {
      handleModuleComplete(moduleId);
    }

    // Save to profile
    saveToProfile();
  };

  const handleResourceComplete = (moduleId: string, resourceIndex: number) => {
    const newCompletedResources = new Set(completedResources);
    newCompletedResources.add(resourceIndex);
    setCompletedResources(newCompletedResources);
    localStorage.setItem('completed-resources', JSON.stringify(Array.from(newCompletedResources)));

    // Check if module should be marked as complete
    const module = learningModules.find(m => m.id === moduleId);
    if (!module) return;

    const progress = userProgress[moduleId] || 0;
    const allResourcesCompleted = module.resources.every((_, idx) => newCompletedResources.has(idx));
    if (progress === 100 && allResourcesCompleted) {
      handleModuleComplete(moduleId);
    }

    // Save to profile
    saveToProfile();
  };

  // Helper function with proper type annotations and array validation
  const isModuleCompleted = (
    moduleId: string, 
    completed: string[], 
    progress: Record<string, number>, 
    resources: Set<number>
  ): boolean => {
    // Ensure completed is always an array
    const validCompleted = Array.isArray(completed) ? completed : [];
    
    const module = learningModules.find((m: LearningModule) => m.id === moduleId);
    if (!module) return false;

    const moduleProgress = progress[moduleId] || 0;
    if (moduleProgress !== 100) return false;

    const allResourcesCompleted = module.resources.every((_: Resource, idx: number) => resources.has(idx));
    if (!allResourcesCompleted) return false;

    return validCompleted.includes(moduleId);
  };

  // Helper function with proper type annotations and array validation
  const isModuleLocked = (
    moduleId: string, 
    index: number, 
    completed: string[], 
    unlocked: string[]
  ): boolean => {
    // Ensure arrays are always valid
    const validUnlocked = Array.isArray(unlocked) ? unlocked : [];
    const validCompleted = Array.isArray(completed) ? completed : [];
    
    if (index < 3) return false;
    if (validUnlocked.includes(moduleId)) return false;
    
    const previousModule = learningModules[index - 1];
    if (!previousModule) return true;
    
    return !validCompleted.includes(previousModule.id);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(moduleUnlockTimers).forEach(timer => clearTimeout(timer));
    };
  }, [moduleUnlockTimers]);

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {learningModules.map((module: LearningModule, index: number) => {
        const isLocked = isModuleLocked(module.id, index, completedModules, unlockedModules);
        const moduleProgress = userProgress[module.id] || 0;
        const isCompleted = isModuleCompleted(module.id, completedModules, userProgress, completedResources);
        const pendingUnlockTime = pendingUnlocks[module.id];

        return (
          <AnimatedCard
            key={module.id}
            module={{ ...module, progress: moduleProgress }}
            index={index}
            isLocked={isLocked}
            isCompleted={isCompleted}
            completedResources={completedResources}
            onModuleComplete={() => handleModuleComplete(module.id)}
            onProgressUpdate={(progress: number) => handleProgressUpdate(module.id, progress)}
            onResourceComplete={(resourceIndex: number) => handleResourceComplete(module.id, resourceIndex)}
            pendingUnlockTime={pendingUnlockTime}
          />
        );
      })}
    </div>
  );
} 