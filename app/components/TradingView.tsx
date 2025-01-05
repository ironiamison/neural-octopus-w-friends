'use client'

import { useEffect, useState } from 'react'
import { getTokenPrices, TokenPrice } from '../utils/api'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface TradingViewProps {
  token: string
}

export default function TradingView({ token }: TradingViewProps) {
  const [priceData, setPriceData] = useState<TokenPrice[]>([])
  const [formattedLabels, setFormattedLabels] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      setLoading(true)
      const prices = await getTokenPrices(token)
      setPriceData(prices)
      setFormattedLabels(prices.map(p => new Date(p.timestamp).toLocaleTimeString()))
      setLoading(false)
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Update every 30s

    return () => clearInterval(interval)
  }, [token])

  const chartData = {
    labels: formattedLabels,
    datasets: [{
      data: priceData.map(p => p.price),
      borderColor: '#02C076',
      backgroundColor: 'rgba(2, 192, 118, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 3,
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1E2329',
        titleColor: '#F0B90B',
        bodyColor: '#fff',
        borderColor: '#2A2D35',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#848E9C',
          font: {
            size: 10,
          },
        },
      },
      y: {
        display: true,
        position: 'right' as const,
        grid: {
          color: '#1E2329',
        },
        ticks: {
          color: '#848E9C',
          font: {
            size: 10,
          },
        },
      },
    },
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-[#848E9C]">
        Loading chart...
      </div>
    )
  }

  return (
    <div className="h-full">
      <Line data={chartData} options={options} />
    </div>
  )
} 