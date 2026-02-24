import { notFound } from 'next/navigation'
import { getSession } from '@/lib/session-store'
import SessionView from '@/components/session/SessionView'

interface Props {
  params: Promise<{ sessionId: string }>
  searchParams: Promise<{ host?: string }>
}

export default async function SessionPage({ params, searchParams }: Props) {
  const { sessionId } = await params
  const { host } = await searchParams

  const session = getSession(sessionId)
  if (!session) notFound()

  const isHost = host === '1'

  return (
    <SessionView
      sessionId={sessionId}
      isHost={isHost}
      initialChart={session.chart}
    />
  )
}
