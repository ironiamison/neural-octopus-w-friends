'use client'

import { motion } from 'framer-motion'
import WalletInfo from './nav/WalletInfo'

interface Feature {
  title: string
  description: string
  icon: string
}

interface ConnectWalletPromptProps {
  title: string
  description: string
  features: Feature[]
}

export function ConnectWalletPrompt({ title, description, features }: ConnectWalletPromptProps) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          {title}
        </h1>
        <p className="text-xl text-gray-400">
          {description}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            className="bg-[#1E222D]/50 backdrop-blur-md rounded-xl p-8 border border-gray-800 hover:border-indigo-500/50 transition-all duration-300"
          >
            <div className="text-4xl mb-4 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center"
      >
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] rounded-lg">
          <WalletInfo />
        </div>
      </motion.div>
    </div>
  )
} 