'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function DexPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000) // Redirect after 3 seconds

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-[#131722] flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-[#1E222D] rounded-lg border border-gray-800 p-12 text-center"
      >
        <motion.h1 
          className="text-4xl font-bold text-white mb-4"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Coming Soon
        </motion.h1>
        <p className="text-gray-400 text-lg">
          Our DEX is under construction. Redirecting you to home...
        </p>
      </motion.div>
    </div>
  )
} 