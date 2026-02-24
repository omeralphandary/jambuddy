import { NextResponse } from 'next/server'
import { pusherServer } from '@/lib/pusher'

export async function POST(req: Request) {
  const body = await req.text()
  const params = new URLSearchParams(body)
  const socketId = params.get('socket_id')
  const channel = params.get('channel_name')

  if (!socketId || !channel) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  // For presence channels, attach user data
  // In a real app this would come from session auth
  const userId = params.get('user_id') ?? `user_${Math.random().toString(36).slice(2, 8)}`
  const userName = params.get('user_name') ?? 'Musician'

  const authResponse = pusherServer.authorizeChannel(socketId, channel, {
    user_id: userId,
    user_info: { name: userName },
  })

  return NextResponse.json(authResponse)
}
