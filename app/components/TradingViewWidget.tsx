'use client'

import React, { useEffect, useRef } from 'react'

interface TradingViewWidgetProps {
  symbol: string
  theme?: 'light' | 'dark'
}

export default function TradingViewWidget({ symbol, theme = 'dark' }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined' && container.current) {
        new window.TradingView.widget({
          width: '100%',
          height: '100%',
          symbol: `BINANCE:${symbol}`,
          interval: '1',
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: false,
          container_id: container.current.id,
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      if (container.current) {
        container.current.innerHTML = ''
      }
    }
  }, [symbol, theme])

  return (
    <div 
      id={`tradingview_${Math.random().toString(36).substring(7)}`}
      ref={container} 
      className="w-full h-full"
    />
  )
} 