'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const PaperMemes = dynamic(
  () => import('./papermemes'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ),
  }
);

export default function ClientWrapper() {
  return (
    <div className="w-full h-full">
      <PaperMemes />
    </div>
  );
} 