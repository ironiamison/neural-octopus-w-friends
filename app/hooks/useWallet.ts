'use client';

import { useState, useEffect, createContext, useContext } from 'react';

interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isPhantomInstalled: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  publicKey: null,
  isConnected: false,
  isConnecting: false,
  isPhantomInstalled: false,
  connect: async () => {},
  disconnect: async () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);

  useEffect(() => {
    const checkPhantom = async () => {
      // @ts-ignore
      const isPhantom = window?.phantom?.solana?.isPhantom;
      setIsPhantomInstalled(!!isPhantom);
    };

    checkPhantom();
  }, []);

  const connect = async () => {
    try {
      setIsConnecting(true);
      // @ts-ignore
      const { solana } = window?.phantom;

      if (solana) {
        const response = await solana.connect();
        const publicKey = response.publicKey.toString();
        setPublicKey(publicKey);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      // @ts-ignore
      const { solana } = window?.phantom;
      
      if (solana) {
        await solana.disconnect();
        setPublicKey(null);
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error disconnecting from Phantom wallet:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        isConnected,
        isConnecting,
        isPhantomInstalled,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
} 