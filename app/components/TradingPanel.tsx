'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ORDER_TYPES, POSITION_SIDES, DEFAULT_TRADING_CONFIG } from '../lib/constants/trading';

interface TradingPanelProps {
  symbol: string;
  lastPrice: number;
  balance: number;
  onPlaceOrder: (order: any) => void;
}

export default function TradingPanel({ symbol, lastPrice, balance, onPlaceOrder }: TradingPanelProps) {
  const [orderType, setOrderType] = useState<keyof typeof ORDER_TYPES>('MARKET');
  const [side, setSide] = useState<keyof typeof POSITION_SIDES>('LONG');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState(lastPrice.toString());
  const [leverage, setLeverage] = useState(1);
  const [useTPSL, setUseTPSL] = useState(false);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');

  const maxSize = balance * leverage;
  const estimatedLiquidationPrice = side === 'LONG'
    ? lastPrice * (1 - 1 / leverage)
    : lastPrice * (1 + 1 / leverage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const order = {
      symbol,
      type: orderType,
      side,
      size: parseFloat(size),
      price: orderType === 'MARKET' ? lastPrice : parseFloat(price),
      leverage,
      ...(useTPSL && {
        takeProfit: parseFloat(takeProfit),
        stopLoss: parseFloat(stopLoss),
      }),
    };

    onPlaceOrder(order);
    
    // Reset form
    setSize('');
    if (orderType !== 'MARKET') setPrice(lastPrice.toString());
    if (useTPSL) {
      setTakeProfit('');
      setStopLoss('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#1C2128] border border-[#30363D] rounded-lg p-4"
    >
      <Tabs defaultValue="market" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger
            value="market"
            onClick={() => setOrderType('MARKET')}
          >
            Market
          </TabsTrigger>
          <TabsTrigger
            value="limit"
            onClick={() => setOrderType('LIMIT')}
          >
            Limit
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Side Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={side === 'LONG' ? 'default' : 'outline'}
              onClick={() => setSide('LONG')}
              className={side === 'LONG' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              Long
            </Button>
            <Button
              type="button"
              variant={side === 'SHORT' ? 'default' : 'outline'}
              onClick={() => setSide('SHORT')}
              className={side === 'SHORT' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              Short
            </Button>
          </div>

          {/* Size Input */}
          <div className="space-y-2">
            <Label>Size (USDC)</Label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="0.00"
                min="0"
                max={maxSize.toString()}
                step="0.01"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setSize((maxSize * 0.25).toString())}
              >
                25%
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSize((maxSize * 0.5).toString())}
              >
                50%
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSize((maxSize * 0.75).toString())}
              >
                75%
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSize(maxSize.toString())}
              >
                100%
              </Button>
            </div>
          </div>

          {/* Price Input (for Limit Orders) */}
          {orderType === 'LIMIT' && (
            <div className="space-y-2">
              <Label>Limit Price</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.0001"
                required
              />
            </div>
          )}

          {/* Leverage Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Leverage</Label>
              <span className="text-sm text-gray-400">{leverage}x</span>
            </div>
            <Slider
              value={[leverage]}
              onValueChange={([value]) => setLeverage(value)}
              min={1}
              max={20}
              step={1}
            />
          </div>

          {/* TP/SL Switch */}
          <div className="flex items-center justify-between">
            <Label>Take Profit / Stop Loss</Label>
            <Switch
              checked={useTPSL}
              onCheckedChange={setUseTPSL}
            />
          </div>

          {/* TP/SL Inputs */}
          {useTPSL && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Take Profit</Label>
                <Input
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  placeholder="0.00"
                  min={side === 'LONG' ? lastPrice : '0'}
                  max={side === 'SHORT' ? lastPrice : undefined}
                  step="0.0001"
                />
              </div>
              <div className="space-y-2">
                <Label>Stop Loss</Label>
                <Input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="0.00"
                  min={side === 'SHORT' ? lastPrice : '0'}
                  max={side === 'LONG' ? lastPrice : undefined}
                  step="0.0001"
                />
              </div>
            </div>
          )}

          {/* Order Info */}
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Margin Required</span>
              <span>${(parseFloat(size || '0') / leverage).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Leverage</span>
              <span>{leverage}x</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Liquidation Price</span>
              <span>${estimatedLiquidationPrice.toFixed(4)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={`w-full ${
              side === 'LONG'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {side === 'LONG' ? 'Long' : 'Short'} {symbol}
          </Button>
        </form>
      </Tabs>
    </motion.div>
  );
} 