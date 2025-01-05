'use client';

import dynamic from 'next/dynamic';

const NeuralOctopus = dynamic(
  () => import('../components/neural-octopus'),
  { ssr: false }
);

export default function EcosystemPage() {
  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden">
      <NeuralOctopus />
    </main>
  );
} 