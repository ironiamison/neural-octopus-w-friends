'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

function PaperMemesModel() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color="#4a90e2"
        emissive="#2a4d7f"
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

export default function PaperMemes() {
  return (
    <div className="w-full h-full">
      <PaperMemesModel />
    </div>
  );
} 