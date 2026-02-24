'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [starting, setStarting] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [joinError, setJoinError] = useState('')

  async function startSession() {
    setStarting(true)
    const hostId = `host_${Math.random().toString(36).slice(2, 10)}`
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostId }),
    })
    const { sessionId } = await res.json()
    router.push(`/session/${sessionId}?host=1`)
  }

  async function joinSession() {
    const code = joinCode.trim().toUpperCase()
    if (!code) return
    const res = await fetch(`/api/session/${code}`)
    if (!res.ok) {
      setJoinError('Session not found. Check the code and try again.')
      return
    }
    router.push(`/session/${code}`)
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Brand */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">JamBuddy</h1>
          <p className="mt-2 text-zinc-400 text-sm">
            One chart, every device, instantly.
          </p>
        </div>

        {/* Start session */}
        <button
          onClick={startSession}
          disabled={starting}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-lg transition-colors"
        >
          {starting ? 'Starting...' : 'Start a Jam'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-zinc-600 text-xs">or join with a code</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Join session */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ENTER CODE"
              value={joinCode}
              onChange={e => { setJoinCode(e.target.value.toUpperCase()); setJoinError('') }}
              onKeyDown={e => e.key === 'Enter' && joinSession()}
              maxLength={6}
              className="flex-1 px-4 py-3 bg-zinc-800 rounded-xl text-white font-mono text-center text-lg tracking-widest placeholder-zinc-600 outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={joinSession}
              disabled={!joinCode.trim()}
              className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white rounded-xl font-medium transition-colors"
            >
              Join
            </button>
          </div>
          {joinError && <p className="text-red-400 text-xs text-center">{joinError}</p>}
        </div>
      </div>
    </main>
  )
}
