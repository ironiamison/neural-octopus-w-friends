import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, ChevronRight, Rocket, Trophy, BarChart, Twitter } from 'lucide-react';

const features = [
  { 
    title: 'Advanced Trading Interface',
    description: 'Professional-grade charts with TradingView integration',
    icon: BarChart
  },
  { 
    title: 'Community-Chosen Tokens',
    description: 'Top 10 tokens selected by our community',
    icon: Trophy
  },
  { 
    title: 'AI-Powered Analytics',
    description: 'Real-time market analysis and trading signals',
    icon: Brain
  },
  { 
    title: 'Gamified Trading',
    description: 'Earn XP, unlock achievements, and compete globally',
    icon: Rocket
  }
];

export default function TradingAnimation() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3); // 3 seconds countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center"
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Welcome to AI16Z Trading
          </motion.h1>
          <motion.p 
            className="text-2xl text-gray-400 mb-8"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Redirecting to home in {countdown} seconds...
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 flex items-start gap-4 hover:border-blue-500/50 transition-colors"
            >
              <feature.icon className="w-8 h-8 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <a
            href="https://twitter.com/ai16z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Twitter className="w-5 h-5" />
            <span>Follow us for updates</span>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
} 