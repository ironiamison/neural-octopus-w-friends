'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import TradingChart from './TradingChart';
import OrderBook from './OrderBook';
import { TRADING_TOKENS, ORDER_TYPES, POSITION_SIDES } from '../lib/constants/trading';
import { TradingService, Position } from '../lib/services/trading.service';
import ClientOnly from './ClientOnly';

interface TradingInterfaceProps {
  className?: string;
}

export default function TradingInterface({ className = '' }: TradingInterfaceProps) {
  const { publicKey } = useWallet();
  const [selectedToken, setSelectedToken] = useState(TRADING_TOKENS[0]);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>(ORDER_TYPES.MARKET);
  const [side, setSide] = useState<'LONG' | 'SHORT'>(POSITION_SIDES.LONG);
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(() => generateMockData());

  useEffect(() => {
    if (publicKey) {
      loadPositions();
    }
  }, [publicKey]);

  // Generate mock data for the chart
  function generateMockData() {
    const data = [];
    let currentPrice = 100;
    const now = new Date();

    for (let i = 0; i < 100; i++) {
      const time = new Date(now.getTime() - (100 - i) * 60000);
      const open = currentPrice;
      const high = open + Math.random() * 2;
      const low = open - Math.random() * 2;
      const close = low + Math.random() * (high - low);
      const volume = Math.random() * 1000 + 100;

      data.push({
        time: time.toISOString(),
        open,
        high,
        low,
        close,
        volume
      });

      currentPrice = close;
    }

    return data;
  }

  const loadPositions = async () => {
    try {
      // In a real implementation, we would fetch positions from the backend
      // For now, we'll use mock data
      const mockPositions: Position[] = [
        {
          id: '1',
          userId: publicKey?.toBase58() || '',
          symbol: 'AI16Z',
          side: 'LONG',
          size: 100,
          leverage: 5,
          entryPrice: 95,
          markPrice: 100,
          liquidationPrice: 80,
          unrealizedPnl: 250,
          marginUsed: 20,
          openedAt: new Date()
        },
        {
          id: '2',
          userId: publicKey?.toBase58() || '',
          symbol: 'FARTCOIN',
          side: 'SHORT',
          size: 50,
          leverage: 3,
          entryPrice: 110,
          markPrice: 105,
          liquidationPrice: 120,
          unrealizedPnl: 75,
          marginUsed: 16.67,
          openedAt: new Date()
        }
      ];

      setPositions(mockPositions);
    } catch (error) {
      console.error('Error loading positions:', error);
    }
  };

  const handleSubmitOrder = async () => {
    if (!publicKey) return;

    try {
      setLoading(true);

      const order = {
        symbol: selectedToken.symbol,
        type: orderType,
        side,
        size: parseFloat(size),
        price: orderType === ORDER_TYPES.MARKET ? undefined : parseFloat(price),
        leverage
      };

      // Submit order through the trading service
      // This will be implemented when we connect to the backend

      setSize('');
      setPrice('');
      await loadPositions();
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePosition = async (positionId: string) => {
    try {
      setLoading(true);
      // In a real implementation, we would call the trading service to close the position
      // For now, we'll just remove it from the local state
      setPositions(positions.filter(p => p.id !== positionId));
    } catch (error) {
      console.error('Error closing position:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <ClientOnly>
      <div className={`flex flex-col gap-4 ${className}`}>
        {/* Token Selection */}
        <div className="flex gap-2 p-4 bg-gray-800 rounded-lg">
          {TRADING_TOKENS.map(token => (
            <motion.button
              key={token.symbol}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedToken(token)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                selectedToken.symbol === token.symbol
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              <img src={token.icon} alt={token.name} className="w-6 h-6" />
              <span>{token.symbol}</span>
            </motion.button>
          ))}
        </div>

        {/* Chart and Orderbook */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-gray-800 rounded-lg p-4">
            <TradingChart symbol={selectedToken.symbol} data={chartData} />
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <OrderBook symbol={selectedToken.symbol} />
          </div>
        </div>

        {/* Trading Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            {/* Order Type Selection */}
            <div className="flex gap-2 mb-4">
              {Object.values(ORDER_TYPES).map(type => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOrderType(type)}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    orderType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {type}
                </motion.button>
              ))}
            </div>

            {/* Side Selection */}
            <div className="flex gap-2 mb-4">
              {Object.values(POSITION_SIDES).map(positionSide => (
                <motion.button
                  key={positionSide}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSide(positionSide)}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    side === positionSide
                      ? positionSide === 'LONG'
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {positionSide}
                </motion.button>
              ))}
            </div>

            {/* Size Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Size
              </label>
              <input
                type="number"
                value={size}
                onChange={e => setSize(e.target.value)}
                min={selectedToken.minOrderSize}
                step={selectedToken.tickSize}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={`Min: ${selectedToken.minOrderSize}`}
              />
            </div>

            {/* Price Input (for Limit Orders) */}
            {orderType === ORDER_TYPES.LIMIT && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  step={selectedToken.tickSize}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter price"
                />
              </div>
            )}

            {/* Leverage Slider */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Leverage: {leverage}x
              </label>
              <input
                type="range"
                min={selectedToken.minLeverage}
                max={selectedToken.maxLeverage}
                value={leverage}
                onChange={e => setLeverage(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmitOrder}
              disabled={!publicKey || loading || !size || (orderType === ORDER_TYPES.LIMIT && !price)}
              className={`w-full px-6 py-3 rounded-lg font-medium ${
                !publicKey || loading || !size || (orderType === ORDER_TYPES.LIMIT && !price)
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : side === 'LONG'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {loading ? 'Processing...' : `Place ${side} Order`}
            </motion.button>
          </div>

          {/* Positions */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-4">Open Positions</h3>
            {positions.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No open positions</p>
            ) : (
              <div className="space-y-4">
                {positions.map(position => (
                  <motion.div
                    key={position.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={TRADING_TOKENS.find(t => t.symbol === position.symbol)?.icon}
                          alt={position.symbol}
                          className="w-6 h-6"
                        />
                        <span className="text-white font-medium">{position.symbol}</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          position.side === 'LONG'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {position.side}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-400">Size:</span>
                        <span className="text-white ml-2">${formatNumber(position.size)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Leverage:</span>
                        <span className="text-white ml-2">{position.leverage}x</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Entry:</span>
                        <span className="text-white ml-2">${formatNumber(position.entryPrice)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Mark:</span>
                        <span className="text-white ml-2">${formatNumber(position.markPrice)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Liq. Price:</span>
                        <span className="text-white ml-2">
                          ${formatNumber(position.liquidationPrice)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">PnL:</span>
                        <span
                          className={`ml-2 ${
                            position.unrealizedPnl >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          ${formatNumber(position.unrealizedPnl)}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleClosePosition(position.id)}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                    >
                      Close Position
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientOnly>
  );
} 