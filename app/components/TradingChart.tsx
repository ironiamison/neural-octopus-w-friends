'use client'

import { useEffect, useRef } from 'react'
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts'

interface ChartData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

interface ChartProps {
  symbol: string
  data: ChartData[]
}

export default function TradingChart({ symbol, data }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1A1D1F' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: '#2A2E32' },
        horzLines: { color: '#2A2E32' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: '#6B7280',
          style: 3,
        },
        horzLine: {
          width: 1,
          color: '#6B7280',
          style: 3,
        },
      },
      timeScale: {
        borderColor: '#2A2E32',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#2A2E32',
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    })

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22C55E',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#22C55E',
      wickDownColor: '#EF4444',
    })

    // Add volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#6B7280',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    })

    // Configure volume series scale
    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
      visible: false,
    })

    // Format data for the chart
    const formattedData = data.map(item => ({
      ...item,
      time: item.time.split('T')[0] // Ensure date is in YYYY-MM-DD format
    }))

    // Set the data
    candlestickSeries.setData(formattedData)
    volumeSeries.setData(
      formattedData.map(item => ({
        time: item.time,
        value: item.volume || 0,
        color: item.close > item.open ? '#22C55E' : '#EF4444',
      }))
    )

    // Fit the chart content
    chart.timeScale().fitContent()

    // Store references
    chartRef.current = chart
    candlestickSeriesRef.current = candlestickSeries
    volumeSeriesRef.current = volumeSeries

    // Handle window resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [])

  // Update data when it changes
  useEffect(() => {
    if (candlestickSeriesRef.current && volumeSeriesRef.current) {
      // Format data for the chart
      const formattedData = data.map(item => ({
        ...item,
        time: item.time.split('T')[0] // Ensure date is in YYYY-MM-DD format
      }))

      candlestickSeriesRef.current.setData(formattedData)
      volumeSeriesRef.current.setData(
        formattedData.map(item => ({
          time: item.time,
          value: item.volume || 0,
          color: item.close > item.open ? '#22C55E' : '#EF4444',
        }))
      )
    }
  }, [data])

  return (
    <div className="w-full h-full">
      <div className="text-lg font-medium text-white mb-4">{symbol} Chart</div>
      <div ref={chartContainerRef} className="w-full h-[500px]" />
    </div>
  )
} 