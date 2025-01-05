'use client'

import { useEffect, useRef } from 'react'
import { formatCompactNumber } from '../utils/format'

interface Position {
  entryPrice: number
  type: 'LONG' | 'SHORT'
  openTime: string
  size: number
}

interface TradingChartProps {
  pair: string
  positions?: Position[]
  marketCap?: number
  tokenAddress?: string
}

declare global {
  interface Window {
    TradingView: any
  }
}

export default function TradingChart({ 
  pair, 
  positions = [], 
  marketCap,
  tokenAddress = 'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC' // AI16Z default
}: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Format symbol for TradingView - using exact format from TradingView
    const base = pair.split('/')[0]
    const symbol = `${base}USD` // e.g. AI16ZUSD, BONKUSD

    // Load TradingView script if not already loaded
    if (!window.TradingView) {
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/tv.js'
      script.async = true
      document.head.appendChild(script)
      script.onload = initWidget
    } else {
      initWidget()
    }

    function initWidget() {
      // Clear container before creating new widget
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild)
        }
      }

      widgetRef.current = new window.TradingView.widget({
        container_id: 'tradingview_chart',
        symbol: symbol,
        interval: '15',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        enable_publishing: false,
        hide_legend: false,
        hide_side_toolbar: false,
        hide_volume: false,
        backgroundColor: '#1E222D',
        toolbar_bg: '#1E222D',
        studies: [
          'Volume@tv-basicstudies',
          'RSI@tv-basicstudies',
          'MAExp@tv-basicstudies',
          'VWAP@tv-basicstudies'
        ],
        studies_overrides: {
          "RSI.height": 50,
          "Volume.height": 30
        },
        overrides: {
          "mainSeriesProperties.candleStyle.upColor": "#26a69a",
          "mainSeriesProperties.candleStyle.downColor": "#ef5350",
          "mainSeriesProperties.candleStyle.borderUpColor": "#26a69a",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350",
          "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
          "paneProperties.background": "#1E222D",
          "paneProperties.vertGridProperties.color": "#363c4e",
          "paneProperties.horzGridProperties.color": "#363c4e",
          "scalesProperties.textColor": "#AAA"
        },
        width: '100%',
        height: '100%',
        save_image: false,
        withdateranges: true,
        allow_symbol_change: true,
        details: true,
        hotlist: true,
        calendar: false,
        show_popup_button: true,
        popup_width: '1000',
        popup_height: '650',
        disabled_features: [
          "header_symbol_search"
        ],
        enabled_features: [
          "study_templates",
          "use_localstorage_for_settings",
          "volume_force_overlay"
        ],
        charts_storage_url: 'https://saveload.tradingview.com',
        client_id: 'tradingview.com',
        user_id: 'public_user',
        loading_screen: {
          backgroundColor: "#1E222D",
          foregroundColor: "#9333ea"
        },
        // Add positions when chart is ready
        onChartReady: function() {
          if (positions.length > 0) {
            const chart = widgetRef.current.activeChart()
            // Clear existing shapes
            chart.removeAllShapes()
            
            // Add positions
            positions.forEach(pos => {
              chart.createShape(
                { price: pos.entryPrice },
                {
                  shape: 'horizontal_line',
                  text: `${pos.type} Entry - $${pos.size.toLocaleString()}`,
                  textColor: '#9333ea',
                  backgroundColor: 'rgba(147, 51, 234, 0.1)',
                  borderColor: '#9333ea',
                  borderWidth: 2,
                  fontFamily: 'system-ui',
                  fontSize: 12,
                  showLabel: true,
                  showPrice: true
                }
              )
            })
          }
        }
      })

      // Add market cap overlay
      if (marketCap && container) {
        const marketCapOverlay = document.createElement('div')
        marketCapOverlay.className = 'absolute top-4 right-4 bg-[#1E222D]/80 px-4 py-2 rounded-lg'
        marketCapOverlay.innerHTML = `
          <div class="text-sm text-gray-400">Market Cap</div>
          <div class="font-bold">$${formatCompactNumber(marketCap)}</div>
        `
        container.appendChild(marketCapOverlay)
      }
    }

    return () => {
      // Clean up by removing all children from container
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild)
        }
      }
      // Reset widget ref
      widgetRef.current = null
    }
  }, [pair, positions, marketCap, tokenAddress])

  return (
    <div className="relative w-full aspect-square max-h-[500px] bg-[#1E222D]">
      <div id="tradingview_chart" ref={containerRef} className="w-full h-full" />
    </div>
  )
} 