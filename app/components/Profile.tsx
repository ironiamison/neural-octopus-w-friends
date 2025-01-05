import { motion } from 'framer-motion';
import ClientOnly from './ClientOnly';

export default function Profile() {
  return (
    <ClientOnly>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {/* Profile content */}
      </motion.div>
    </ClientOnly>
  );
} 