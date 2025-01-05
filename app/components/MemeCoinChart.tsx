'use client'

import { useEffect, useState } from 'react';
import TradingViewWidget from './TradingViewWidget';

interface MemeCoin {
  id: string;
  name: string;
  symbol: string;
  price: number;
}

export default function MemeCoinChart() {
  const [memeCoins, setMemeCoins] = useState<MemeCoin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>('dogecoin');

  useEffect(() => {
    const fetchMemeCoins = async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
      const data = await response.json();
      const memeCoinsData = data.filter((coin: any) => ['dogecoin', 'shiba-inu', 'floki', 'safemoon', 'dogelon', 'akitas', 'kishu', 'hoge', 'poodle', 'pika'].includes(coin.id));
      setMemeCoins(memeCoinsData);
    };

    fetchMemeCoins();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center">Top 10 Meme Coins</h2>
      <div className="flex justify-center space-x-4 mb-4">
        {memeCoins.map((coin) => (
          <button
            key={coin.id}
            onClick={() => setSelectedCoin(coin.id)}
            className={`px-4 py-2 rounded ${selectedCoin === coin.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {coin.name}
          </button>
        ))}
      </div>
      <TradingViewWidget symbol={`BINANCE:${selectedCoin.toUpperCase()}USDT`} />
    </div>
  );
} 