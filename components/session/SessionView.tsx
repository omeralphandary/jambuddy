'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { getPusherClient } from '@/lib/pusher-client'
import type { Chart } from '@/types/session'
import ChartDisplay from './ChartDisplay'
import HostControls from './HostControls'
import QRCode from './QRCode'
import AiTipCard from './AiTipCard'
import InstrumentSelect, { INSTRUMENTS } from './InstrumentSelect'

interface Props {
  sessionId: string
  isHost: boolean
  initialChart: Chart | null
}

export default function SessionView({ sessionId, isHost, initialChart }: Props) {
  const [chart, setChart] = useState<Chart | null>(initialChart)
  const [members, setMembers] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [aiTip, setAiTip] = useState<{ chord: string; tip: string } | null>(null)
  const [instrument, setInstrument] = useState('C')
  const [instrumentSemitones, setInstrumentSemitones] = useState(0)
  const chartRef = useRef<Chart | null>(initialChart)

  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/session/${sessionId}`
    : `/session/${sessionId}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(joinUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleChartUpdate = useCallback((c: Chart) => {
    setChart(c)
    chartRef.current = c
  }, [])
  const handleClear = useCallback(() => {
    setChart(null)
    chartRef.current = null
  }, [])

  const handleAiTip = useCallback((chord: string, tip: string) => {
    setAiTip({ chord, tip })
  }, [])

  useEffect(() => {
    const pusher = getPusherClient()
    const channelName = `presence-session-${sessionId}`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = pusher.subscribe(channelName) as any

    channel.bind('pusher:subscription_succeeded', () => {
      setMembers(channel.members.count)
    })
    channel.bind('pusher:member_added', () => {
      setMembers((c: number) => c + 1)
      // Host re-syncs state to late joiners
      if (isHost && chartRef.current) {
        fetch(`/api/session/${sessionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'push_chart', chart: chartRef.current }),
        })
      }
    })
    channel.bind('pusher:member_removed', () => setMembers((c: number) => Math.max(0, c - 1)))

    channel.bind('chart-pushed', ({ chart: c }: { chart: Chart }) => {
      setChart(c)
      chartRef.current = c
    })
    channel.bind('key-changed', ({ chart: c }: { chart: Chart }) => {
      setChart(c)
      chartRef.current = c
    })
    channel.bind('chart-cleared', () => {
      setChart(null)
      chartRef.current = null
    })
    channel.bind('ai-tip', ({ chord, tip }: { chord: string; tip: string }) => {
      setAiTip({ chord, tip })
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(channelName)
    }
  }, [sessionId, isHost])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight">JamBuddy</span>
            <span className="font-mono text-sm text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
              {sessionId}
            </span>
            {isHost && (
              <span className="text-xs text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded-full">host</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500 hidden sm:block">{members} online</span>
            <button
              onClick={() => setShowQR(v => !v)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
              title="Show QR code"
            >
              QR
            </button>
            <button
              onClick={copyLink}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
            >
              {copied ? 'Copied!' : 'Share link'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* QR panel */}
        {showQR && (
          <div className="bg-zinc-900 rounded-2xl p-5 flex flex-col items-center gap-3">
            <QRCode url={joinUrl} size={160} />
            <p className="text-sm text-zinc-400 font-mono">{joinUrl}</p>
          </div>
        )}

        {/* Instrument selector for guests */}
        {!isHost && (
          <div className="bg-zinc-900 rounded-xl px-4 py-3">
            <InstrumentSelect
              value={instrument}
              onChange={(val, semitones) => {
                setInstrument(val)
                setInstrumentSemitones(semitones)
              }}
            />
          </div>
        )}

        {/* Chart display */}
        <div className="bg-zinc-900 rounded-2xl p-5 min-h-48">
          <ChartDisplay
            chart={chart}
            instrumentSemitones={instrumentSemitones}
            sessionId={sessionId}
            onAiTip={handleAiTip}
          />
        </div>

        {/* Host controls */}
        {isHost && (
          <HostControls
            sessionId={sessionId}
            currentChart={chart}
            onChartUpdate={handleChartUpdate}
            onClear={handleClear}
          />
        )}
      </div>

      {/* AI tip card — floats above everything */}
      {aiTip && (
        <AiTipCard
          chord={aiTip.chord}
          tip={aiTip.tip}
          onClose={() => setAiTip(null)}
        />
      )}
    </div>
  )
}
