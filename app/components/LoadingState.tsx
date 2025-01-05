import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Analyzing market data...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <motion.div
        className="relative w-24 h-24"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full" />
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent" />
      </motion.div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-blue-600">
          {message}
        </h3>
        <p className="text-sm text-gray-600">
          Powered by AI16Z™ Advanced Market Intelligence
        </p>
      </div>

      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <span>Real-time market analysis in progress</span>
      </div>
    </div>
  );
} 