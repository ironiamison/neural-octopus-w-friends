'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

function NeuralOctopusModel() {
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

export default function NeuralOctopus() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ background: '#000011' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <NeuralOctopusModel />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        <Environment preset="night" />
        <EffectComposer>
          <Bloom 
            intensity={1.5}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
} 