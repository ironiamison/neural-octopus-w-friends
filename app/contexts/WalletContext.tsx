'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  isPhantomInstalled: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  connection: Connection | null;
}

const WalletContext = createContext<WalletContextType>({
  publicKey: null,
  isConnected: false,
  isPhantomInstalled: false,
  connect: async () => {},
  disconnect: async () => {},
  connection: null,
});

export function useWallet() {
  return useContext(WalletContext);
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isPhantomInstalled, setIsPhantomInstalled] = useState<boolean>(false);
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    // Initialize Solana connection
    const conn = new Connection('https://api.mainnet-beta.solana.com');
    setConnection(conn);

    const provider = window.phantom?.solana;
    if (provider) {
      setIsPhantomInstalled(true);
      // Check if there's already a connection
      if (provider.isConnected) {
        provider.connect().then(({ publicKey }) => {
          setPublicKey(publicKey.toString());
        });
      }

      // Listen for connection events
      const handleConnect = (args: { publicKey: { toString(): string } }) => {
        setPublicKey(args.publicKey.toString());
      };

      const handleDisconnect = () => {
        setPublicKey(null);
      };

      provider.on('connect', handleConnect);
      provider.on('disconnect', handleDisconnect);

      return () => {
        provider.off('connect', handleConnect);
        provider.off('disconnect', handleDisconnect);
      };
    }
  }, []);

  const connect = async () => {
    try {
      const provider = window.phantom?.solana;
      if (provider) {
        const { publicKey } = await provider.connect();
        setPublicKey(publicKey.toString());
      }
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
    }
  };

  const disconnect = async () => {
    try {
      const provider = window.phantom?.solana;
      if (provider) {
        await provider.disconnect();
        setPublicKey(null);
      }
    } catch (error) {
      console.error('Error disconnecting from Phantom wallet:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        isConnected: !!publicKey,
        isPhantomInstalled,
        connect,
        disconnect,
        connection,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
} 