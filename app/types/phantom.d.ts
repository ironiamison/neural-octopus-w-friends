import { PublicKey, Transaction } from '@solana/web3.js'

interface PhantomEvent {
  publicKey: {
    toString(): string;
  };
}

interface PhantomProvider {
  connect(): Promise<PhantomEvent>;
  disconnect(): Promise<void>;
  isConnected: boolean;
  on(event: 'connect', callback: (args: PhantomEvent) => void): void;
  on(event: 'disconnect', callback: () => void): void;
  off(event: 'connect', callback: (args: PhantomEvent) => void): void;
  off(event: 'disconnect', callback: () => void): void;
}

interface Window {
  phantom?: {
    solana?: PhantomProvider;
  };
} 