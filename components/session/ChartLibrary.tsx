'use client'

import { useState } from 'react'
import { searchCharts, type StandardChart } from '@/lib/charts-db'

interface Props {
  onSelect: (chart: StandardChart) => void
}

export default function ChartLibrary({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const results = searchCharts(query)

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search by title, key, or style..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        autoFocus
        className="w-full px-3 py-2 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
      />

      <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
        {results.length === 0 && (
          <p className="text-zinc-500 text-sm text-center py-4">No matches</p>
        )}
        {results.map(chart => (
          <button
            key={chart.title}
            onClick={() => onSelect(chart)}
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium group-hover:text-indigo-300 transition-colors">
                {chart.title}
              </span>
              <span className="font-mono text-xs text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">
                {chart.key}
              </span>
            </div>
            <span className="text-zinc-500 text-xs">{chart.style}</span>
          </button>
        ))}
      </div>

      <p className="text-zinc-600 text-xs text-center">{STANDARDS_COUNT} standards in library</p>
    </div>
  )
}

import { STANDARDS } from '@/lib/charts-db'
const STANDARDS_COUNT = STANDARDS.length
