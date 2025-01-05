'use client'

export default function Stats() {
  return (
    <div className="p-4 bg-gray-800/50 shadow-md rounded-lg border border-gray-700/50 backdrop-blur-md">
      <h2 className="text-2xl font-bold text-white">Market Stats</h2>
      <ul className="mt-2 text-gray-300">
        <li>Current Price: $100</li>
        <li>24h Change: +5%</li>
        <li>Market Cap: $1M</li>
      </ul>
    </div>
  )
}
