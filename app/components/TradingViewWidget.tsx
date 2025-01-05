'use client'

import { useEffect, useRef } from 'react'

let tvScriptLoadingPromise: Promise<void>

interface TradingViewWidgetProps {
  symbol: string
}

export default function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const onLoadScriptRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    onLoadScriptRef.current = createWidget
    
    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script')
        script.id = 'tradingview-widget-loading-script'
        script.src = 'https://s3.tradingview.com/tv.js'
        script.type = 'text/javascript'
        script.onload = resolve as () => void

        document.head.appendChild(script)
      })
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current())

    return () => {
      onLoadScriptRef.current = null
    }
  }, [symbol])

  function createWidget() {
    if (document.getElementById('tradingview_chart') && 'TradingView' in window) {
      new (window as any).TradingView.widget({
        autosize: true,
        symbol: `${symbol}USD`,
        interval: '1',
        timezone: 'exchange',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        save_image: false,
        container_id: 'tradingview_chart',
      })
    }
  }

  return (
    <div className='tradingview-widget-container' style={{ height: '500px' }}>
      <div id='tradingview_chart' style={{ height: '100%', width: '100%' }} />
    </div>
  )
} 