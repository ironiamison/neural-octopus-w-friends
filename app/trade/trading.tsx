import { useWallet } from '@solana/wallet-adapter-react';
import TradingInterface from '../components/TradingInterface';
import PaperTrading from '../components/PaperTrading';
import ClientOnly from '../components/ClientOnly';

export default function TradingPage() {
  const { publicKey } = useWallet();

  return (
    <ClientOnly>
      <div className="container mx-auto px-4 py-8">
        {publicKey ? (
          <>
            <TradingInterface />
            <PaperTrading />
          </>
        ) : (
          <p>Please connect your wallet to access the trading interface.</p>
        )}
      </div>
    </ClientOnly>
  );
} 