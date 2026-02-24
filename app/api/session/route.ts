import { NextResponse } from 'next/server'
import { createSession } from '@/lib/session-store'

function randomId(len = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function POST(req: Request) {
  const { hostId } = await req.json().catch(() => ({}))
  if (!hostId || typeof hostId !== 'string') {
    return NextResponse.json({ error: 'hostId required' }, { status: 400 })
  }

  const sessionId = randomId()
  createSession(sessionId, hostId)

  return NextResponse.json({ sessionId }, { status: 201 })
}
