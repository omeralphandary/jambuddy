import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session-store'
import { pusherServer, sessionChannel } from '@/lib/pusher'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

type Params = { params: Promise<{ sessionId: string }> }

// POST — AI context coach: tap a chord, get improv tips
export async function POST(req: Request, { params }: Params) {
  const { sessionId } = await params
  const session = getSession(sessionId)
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

  const { chord, progression, key } = await req.json().catch(() => ({}))
  if (!chord) return NextResponse.json({ error: 'chord required' }, { status: 400 })

  const prompt = `You are a music theory coach at a live jam session. A musician just tapped on the chord "${chord}" in a ${key} chart.
${progression ? `The surrounding progression is: ${progression}` : ''}

Give a tight, practical improv tip — 2-3 sentences max. Include:
1. The best scale(s) to use over this specific chord
2. One specific note or interval to target
3. A quick feel cue (e.g. "dark and tense", "bright and resolved")

No preamble. Just the tip. Keep it short enough to read at a glance during a jam.`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    messages: [{ role: 'user', content: prompt }],
  })

  const tip = (message.content[0] as { type: string; text: string }).text.trim()

  // Broadcast the tip to all session members
  await pusherServer.trigger(sessionChannel(sessionId), 'ai-tip', { chord, tip })

  return NextResponse.json({ tip })
}
