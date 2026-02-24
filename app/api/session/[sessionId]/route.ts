import { NextResponse } from 'next/server'
import { getSession, setChart, clearChart } from '@/lib/session-store'
import { pusherServer, sessionChannel } from '@/lib/pusher'
import { transposeChart, keyFromSemitones } from '@/lib/transpose'
import type { Chart, TextChart } from '@/types/session'

type Params = { params: Promise<{ sessionId: string }> }

// GET — return current session state (for late joiners)
export async function GET(_req: Request, { params }: Params) {
  const { sessionId } = await params
  const session = getSession(sessionId)
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  return NextResponse.json({ chart: session.chart })
}

// POST — host pushes a chart or key change
export async function POST(req: Request, { params }: Params) {
  const { sessionId } = await params
  const session = getSession(sessionId)
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const channel = sessionChannel(sessionId)

  if (body.action === 'push_chart') {
    const chart: Chart = body.chart
    setChart(sessionId, chart)
    await pusherServer.trigger(channel, 'chart-pushed', { chart })
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'change_key') {
    const current = session.chart
    if (!current || current.type !== 'text') {
      return NextResponse.json({ error: 'No text chart active' }, { status: 400 })
    }
    const { semitones } = body as { semitones: number }
    const tc = current as TextChart
    const newKey = keyFromSemitones(tc.originalKey, semitones)
    const newContent = transposeChart(tc.content, semitones - tc.semitones, newKey)

    const updated: TextChart = { ...tc, key: newKey, semitones, content: newContent }
    setChart(sessionId, updated)
    await pusherServer.trigger(channel, 'key-changed', { chart: updated })
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'clear') {
    clearChart(sessionId)
    await pusherServer.trigger(channel, 'chart-cleared', {})
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
