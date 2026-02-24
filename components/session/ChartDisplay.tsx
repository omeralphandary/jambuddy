'use client'

import { useState } from 'react'
import type { Chart, TextChart, ImageChart } from '@/types/session'
import { transposeChart, keyFromSemitones } from '@/lib/transpose'

interface Props {
  chart: Chart | null
  instrumentSemitones: number
  sessionId: string
  onAiTip: (chord: string, tip: string) => void
}

function TextChartView({
  chart,
  instrumentSemitones,
  sessionId,
  onAiTip,
}: {
  chart: TextChart
  instrumentSemitones: number
  sessionId: string
  onAiTip: (chord: string, tip: string) => void
}) {
  const [loadingChord, setLoadingChord] = useState<string | null>(null)

  // Apply per-instrument transposition on top of host's key
  const displayKey = instrumentSemitones !== 0
    ? keyFromSemitones(chart.key, instrumentSemitones)
    : chart.key
  const displayContent = instrumentSemitones !== 0
    ? transposeChart(chart.content, instrumentSemitones, displayKey)
    : chart.content

  async function handleChordTap(chord: string) {
    if (loadingChord) return
    setLoadingChord(chord)

    // Extract a short surrounding progression for context
    const lines = displayContent.split('\n').filter(l => l.trim() && !l.startsWith('['))
    const progression = lines.slice(0, 2).join(' | ')

    const res = await fetch(`/api/session/${sessionId}/chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chord, progression, key: displayKey }),
    })
    const { tip } = await res.json()
    if (tip) onAiTip(chord, tip)
    setLoadingChord(null)
  }

  // Render lines, making each chord token tappable
  const CHORD_TOKEN = /^([A-G][#b]?(?:maj|min|m|M|dim|aug|sus|add|no|omit)?(?:\d+)?(?:[#b]\d+)*(?:\/[A-G][#b]?)?)$/

  function renderLine(line: string, idx: number) {
    if (/^\[.*\]$/.test(line.trim())) {
      return (
        <div key={idx} className="text-indigo-400 text-xs font-bold uppercase tracking-widest mt-4 mb-1">
          {line.trim().replace(/[\[\]]/g, '')}
        </div>
      )
    }
    const tokens = line.split(/(\s+|\|)/)
    return (
      <div key={idx} className="flex flex-wrap gap-x-1 gap-y-0 leading-relaxed min-h-[1.8rem]">
        {tokens.map((token, ti) => {
          const trimmed = token.trim()
          if (trimmed === '|') return <span key={ti} className="text-zinc-600 select-none">|</span>
          if (!trimmed) return <span key={ti}>{token}</span>
          if (CHORD_TOKEN.test(trimmed)) {
            const isLoading = loadingChord === trimmed
            return (
              <button
                key={ti}
                onClick={() => handleChordTap(trimmed)}
                disabled={!!loadingChord}
                className={`font-mono font-bold text-lg px-1 rounded transition-colors
                  ${isLoading
                    ? 'text-indigo-300 bg-indigo-950 animate-pulse'
                    : 'text-white hover:text-indigo-300 hover:bg-indigo-950/50 active:bg-indigo-900'
                  }`}
              >
                {trimmed}
              </button>
            )
          }
          return <span key={ti} className="text-zinc-400 font-mono text-lg">{token}</span>
        })}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{chart.title}</h2>
        <div className="flex items-center gap-2">
          {instrumentSemitones !== 0 && (
            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
              {chart.key} → {displayKey}
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm font-mono font-bold">
            {displayKey}
          </span>
        </div>
      </div>
      <div className="space-y-0.5">
        {displayContent.split('\n').map((line, i) => renderLine(line, i))}
      </div>
      <p className="mt-4 text-xs text-zinc-600">Tap any chord for AI improv tips</p>
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

export default function ChartDisplay({ chart, instrumentSemitones, sessionId, onAiTip }: Props) {
  if (!chart) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
        <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <p className="text-sm">Waiting for host to push a chart...</p>
      </div>
    )
  }

  return chart.type === 'text'
    ? <TextChartView
        chart={chart}
        instrumentSemitones={instrumentSemitones}
        sessionId={sessionId}
        onAiTip={onAiTip}
      />
    : <ImageChartView chart={chart} />
}
