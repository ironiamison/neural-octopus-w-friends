'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const NeuralOctopus = dynamic(
  () => import('./neural-octopus'),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-blue-400 text-2xl">Entering ecosystem...</div>
      </div>
    )
  }
);

export default function ClientWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <NeuralOctopus />
    </div>
  );
} 