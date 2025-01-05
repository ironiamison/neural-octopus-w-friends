'use client'

import { useEffect, useRef } from 'react'
import { useDexStore } from '../utils/dexscreener'

let tvScriptLoadingPromise: Promise<void>

export default function TradingViewWidget() {
  const { selectedPair } = useDexStore()
  const onLoadScriptRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    onLoadScriptRef.current = createWidget
    
    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script')
        script.id = 'tradingview-widget-loading-script'
        script.src = 'https://s3.tradingview.com/tv.js'
        script.type = 'text/javascript'
        script.onload = resolve as any
        document.head.appendChild(script)
      })
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current())

    return () => {
      onLoadScriptRef.current = null
    }
  }, [selectedPair])

  function createWidget() {
    if (document.getElementById('tradingview_chart') && 'TradingView' in window) {
      new (window as any).TradingView.widget({
        autosize: true,
        symbol: selectedPair ? `RAYDIUM:${selectedPair.baseToken.symbol}${selectedPair.quoteToken.symbol}` : 'RAYDIUM:BONKUSDC',
        interval: '1D',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#1E222D',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'tradingview_chart',
        hide_volume: false,
        backgroundColor: '#1E222D',
        toolbar_text: '#D1D5DB',
        hide_side_toolbar: false,
        details: true,
        hotlist: false,
        calendar: false,
        studies: [
          'Volume@tv-basicstudies'
        ],
        show_popup_button: false,
        popup_width: '1000',
        popup_height: '650',
        timeframes: [
          { text: '1m', resolution: '1' },
          { text: '30m', resolution: '30' },
          { text: '1h', resolution: '60' },
          { text: '1D', resolution: 'D' },
        ],
        overrides: {
          'mainSeriesProperties.candleStyle.upColor': '#26a69a',
          'mainSeriesProperties.candleStyle.downColor': '#ef5350',
          'mainSeriesProperties.candleStyle.borderUpColor': '#26a69a',
          'mainSeriesProperties.candleStyle.borderDownColor': '#ef5350',
          'mainSeriesProperties.candleStyle.wickUpColor': '#26a69a',
          'mainSeriesProperties.candleStyle.wickDownColor': '#ef5350',
          'paneProperties.background': '#1E222D',
          'paneProperties.vertGridProperties.color': '#26303e',
          'paneProperties.horzGridProperties.color': '#26303e',
          'scalesProperties.textColor': '#999999',
          'scalesProperties.backgroundColor': '#1E222D',
          'mainSeriesProperties.showPriceLine': true,
          'volumePaneSize': 'medium'
        },
        loading_screen: {
          backgroundColor: '#1E222D',
          foregroundColor: '#2962FF'
        }
      })
    }
  }

  return (
    <div className="tradingview-widget-container bg-[#1E222D] rounded-lg overflow-hidden">
      <div id="tradingview_chart" className="h-[calc(100vh-12rem)]" />
      <div className="h-6 flex items-center justify-center text-sm text-gray-500 border-t border-gray-800">
        Powered by TradingView
      </div>
    </div>
  )
} 