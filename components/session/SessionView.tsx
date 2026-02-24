'use client'

import { useEffect, useState, useCallback } from 'react'
import { getPusherClient } from '@/lib/pusher-client'
import type { Chart } from '@/types/session'
import ChartDisplay from './ChartDisplay'
import HostControls from './HostControls'

interface Props {
  sessionId: string
  isHost: boolean
  initialChart: Chart | null
}

export default function SessionView({ sessionId, isHost, initialChart }: Props) {
  const [chart, setChart] = useState<Chart | null>(initialChart)
  const [members, setMembers] = useState<number>(0)
  const [copied, setCopied] = useState(false)

  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/session/${sessionId}`
    : `/session/${sessionId}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(joinUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleChartUpdate = useCallback((c: Chart) => setChart(c), [])
  const handleClear = useCallback(() => setChart(null), [])

  useEffect(() => {
    const pusher = getPusherClient()
    const channel = pusher.subscribe(`presence-session-${sessionId}`) as ReturnType<typeof pusher.subscribe> & {
      members: { count: number }
    }

    channel.bind('pusher:subscription_succeeded', () => {
      setMembers(channel.members.count)
    })
    channel.bind('pusher:member_added', () => setMembers(c => c + 1))
    channel.bind('pusher:member_removed', () => setMembers(c => Math.max(0, c - 1)))

    channel.bind('chart-pushed', ({ chart: c }: { chart: Chart }) => setChart(c))
    channel.bind('key-changed', ({ chart: c }: { chart: Chart }) => setChart(c))
    channel.bind('chart-cleared', () => setChart(null))

    // If host joins, re-push current state to late joiners
    if (isHost) {
      channel.bind('pusher:member_added', () => {
        if (chart) {
          fetch(`/api/session/${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'push_chart', chart }),
          })
        }
      })
    }

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(`presence-session-${sessionId}`)
    }
  }, [sessionId, isHost, chart])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tracking-tight">JamBuddy</span>
          <span className="font-mono text-sm text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
            {sessionId}
          </span>
          {isHost && (
            <span className="text-xs text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded-full">host</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-500">{members} in session</span>
          <button
            onClick={copyLink}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
          >
            {copied ? 'Copied!' : 'Share link'}
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Chart display — everyone sees this */}
        <div className="bg-zinc-900 rounded-2xl p-5 min-h-48">
          <ChartDisplay chart={chart} />
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
    </div>
  )
}
