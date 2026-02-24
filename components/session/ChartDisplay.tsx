'use client'

import type { Chart, TextChart, ImageChart } from '@/types/session'

interface Props {
  chart: Chart | null
}

function TextChartView({ chart }: { chart: TextChart }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{chart.title}</h2>
        <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm font-mono font-bold">
          {chart.key}
        </span>
      </div>
      <pre className="text-white font-mono text-lg leading-relaxed whitespace-pre-wrap break-words">
        {chart.content}
      </pre>
    </div>
  )
}

function ImageChartView({ chart }: { chart: ImageChart }) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-white mb-4">{chart.title}</h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={chart.url}
        alt={chart.title}
        className="w-full rounded-lg object-contain max-h-[70vh]"
      />
    </div>
  )
}

export default function ChartDisplay({ chart }: Props) {
  if (!chart) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
        <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <p className="text-sm">Waiting for the host to push a chart...</p>
      </div>
    )
  }

  return chart.type === 'text'
    ? <TextChartView chart={chart} />
    : <ImageChartView chart={chart} />
}
