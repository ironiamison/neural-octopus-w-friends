'use client'

import { motion } from 'framer-motion'
import { Wallet, Shield, Zap } from 'lucide-react'
import { Button } from './ui/button'
import { useWallet } from '../providers/WalletProvider'
import ClientOnly from './ClientOnly'

const features = [
  {
    icon: <Wallet className="w-8 h-8 text-[#F0B90B]" />,
    title: "Secure Profile",
    description: "Your profile is securely linked to your wallet"
  },
  {
    icon: <Shield className="w-8 h-8 text-[#F0B90B]" />,
    title: "Privacy Control",
    description: "Full control over your profile visibility"
  },
  {
    icon: <Zap className="w-8 h-8 text-[#F0B90B]" />,
    title: "Track Progress",
    description: "Monitor your learning and trading journey"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const glowVariants = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 0.7, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export default function WalletConnect() {
  const { connect, isConnecting, isConnected, isPhantomInstalled } = useWallet();

  const handleConnect = async () => {
    if (!isPhantomInstalled) {
      window.open('https://phantom.app/', '_blank');
      return;
    }
    
    if (!isConnected && !isConnecting) {
      await connect();
    }
  };

  return (
    <ClientOnly>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="min-h-[600px] flex flex-col items-center justify-center p-8 relative">
          {/* Background glow effect */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F0B90B] rounded-full blur-[120px] opacity-5"
            variants={glowVariants}
            initial="initial"
            animate="animate"
          />

          <motion.div
            className="relative z-10 max-w-2xl w-full text-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Icon */}
            <motion.div 
              className="flex justify-center"
              variants={itemVariants}
            >
              <div className="p-4 rounded-full bg-[#1E222D] border border-[#2A2D35]">
                <Wallet className="w-12 h-12 text-[#F0B90B]" />
              </div>
            </motion.div>

            {/* Title and description */}
            <motion.div 
              className="space-y-4"
              variants={itemVariants}
            >
              <h1 className="text-3xl font-bold tracking-tight">
                {!isPhantomInstalled 
                  ? 'Install Phantom Wallet'
                  : 'Connect your Phantom wallet'
                }
              </h1>
              <p className="text-lg text-muted-foreground">
                {!isPhantomInstalled
                  ? 'Install Phantom wallet to access your profile and start trading'
                  : 'Access your profile settings and start tracking your progress'
                }
              </p>
            </motion.div>

            {/* Features grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
              variants={itemVariants}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="p-6 rounded-xl bg-[#1E222D] border border-[#2A2D35] hover:border-[#F0B90B]/50 transition-colors"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 rounded-full bg-[#131722]">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Connect button */}
            <motion.div
              variants={itemVariants}
              className="mt-12"
            >
              <Button
                size="lg"
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black font-semibold px-8 py-6 h-auto text-lg rounded-xl"
              >
                {isConnecting ? 'Connecting...' : 
                  !isPhantomInstalled ? 'Install Phantom' : 
                  'Connect Wallet'
                }
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </ClientOnly>
  )
} 