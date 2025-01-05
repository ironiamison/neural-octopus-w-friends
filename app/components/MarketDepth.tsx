'use client'

import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'

interface MarketDepthProps {
  token: string
}

export default function MarketDepth({ token }: MarketDepthProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generateData = () => {
      const labels = Array.from({length: 20}, (_, i) => (0.00001234 - (i * 0.0000001)).toFixed(8))
      const bids = Array.from({length: 20}, (_, i) => Math.random() * 1000000 + 500000)
      const asks = Array.from({length: 20}, (_, i) => Math.random() * 1000000 + 500000)

      const newChartData = {
        labels,
        datasets: [
          {
            label: 'Bids',
            data: bids,
            borderColor: '#02C076',
            backgroundColor: 'rgba(2, 192, 118, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            label: 'Asks',
            data: asks,
            borderColor: '#F6465D',
            backgroundColor: 'rgba(246, 70, 93, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
          }
        ]
      }

      setChartData(newChartData)
      setIsLoading(false)
    }

    generateData()
  }, [token])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#848E9C',
          boxWidth: 12,
          padding: 8,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1E2329',
        titleColor: '#F0B90B',
        bodyColor: '#fff',
        borderColor: '#2A2D35',
        borderWidth: 1,
        padding: 8,
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

  if (isLoading || !chartData) {
    return (
      <div className="h-full flex items-center justify-center text-[#848E9C]">
        Loading market depth...
      </div>
    )
  }

  return (
    <div className="h-full">
      <Line data={chartData} options={options} />
    </div>
  )
} 