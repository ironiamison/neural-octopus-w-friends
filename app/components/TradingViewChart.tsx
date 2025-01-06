'use client'

import { useEffect, useRef } from 'react'

interface Position {
  id: number
  price: number
  type: 'buy' | 'sell'
  timestamp: string
  stopLoss?: number
  takeProfit?: number
}

interface TradingViewChartProps {
  symbol?: string
  theme?: 'light' | 'dark'
  autosize?: boolean
  height?: number
  positions?: Position[]
  onChartReady?: () => void
}

declare global {
  interface Window {
    TradingView: any
  }
}

const TradingViewChart = ({
  symbol = 'BTCUSDT',
  theme = 'dark',
  autosize = true,
  height = 500,
  positions = [],
  onChartReady
}: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)

  // Function to draw position lines
  const drawPositionLines = () => {
    if (!chartRef.current) return

    // Clear existing lines
    chartRef.current.activeChart().removeAllShapes()

    // Draw lines for each position
    positions.forEach((position) => {
      const entryColor = position.type === 'buy' ? '#8B5CF6' : '#EF4444' // Purple for buy, Red for sell
      
      // Draw entry line
      chartRef.current.activeChart().createShape({
        time: position.timestamp,
        price: position.price,
        overrides: {
          linecolor: entryColor,
          linewidth: 2,
          linestyle: 0,
          showLabel: true,
          text: `${position.type.toUpperCase()} Entry`,
          textcolor: entryColor,
          fontsize: 12,
        }
      }, {
        shape: 'horizontal_line',
        lock: true,
        disableSelection: true,
      })

      // Draw stop loss line if set
      if (position.stopLoss) {
        chartRef.current.activeChart().createShape({
          time: position.timestamp,
          price: position.stopLoss,
          overrides: {
            linecolor: '#EF4444', // Red
            linewidth: 1,
            linestyle: 1, // Dashed
            showLabel: true,
            text: 'Stop Loss',
            textcolor: '#EF4444',
            fontsize: 10,
          }
        }, {
          shape: 'horizontal_line',
          lock: true,
          disableSelection: true,
        })
      }

      // Draw take profit line if set
      if (position.takeProfit) {
        chartRef.current.activeChart().createShape({
          time: position.timestamp,
          price: position.takeProfit,
          overrides: {
            linecolor: '#22C55E', // Green
            linewidth: 1,
            linestyle: 1, // Dashed
            showLabel: true,
            text: 'Take Profit',
            textcolor: '#22C55E',
            fontsize: 10,
          }
        }, {
          shape: 'horizontal_line',
          lock: true,
          disableSelection: true,
        })
      }
    })
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        const widget = new window.TradingView.widget({
          container: containerRef.current,
          symbol: `BINANCE:${symbol}`,
          interval: '1',  // 1 minute candles for more real-time feel
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          save_image: false,
          height: height,
          autosize: autosize,
          hide_side_toolbar: false,
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          container_id: 'tradingview_chart',
          disabled_features: ['header_symbol_search'],
          enabled_features: ['hide_left_toolbar_by_default'],
          overrides: {
            "mainSeriesProperties.candleStyle.upColor": "#22c55e",
            "mainSeriesProperties.candleStyle.downColor": "#ef4444",
            "mainSeriesProperties.candleStyle.wickUpColor": "#22c55e",
            "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
          },
          onChartReady: () => {
            chartRef.current = widget
            drawPositionLines()
            if (onChartReady) onChartReady()
          }
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [symbol, theme, autosize, height, onChartReady])

  // Update position lines when positions change
  useEffect(() => {
    drawPositionLines()
  }, [positions])

  return (
    <div 
      id="tradingview_chart"
      ref={containerRef}
      className="w-full h-full"
    />
  )
}

export default TradingViewChart 