// In-memory store — works for local dev and single-instance deployments.
// For multi-instance production: swap for Upstash Redis or Vercel KV.
import type { Chart } from '@/types/session'

interface SessionState {
  hostId: string
  createdAt: number
  chart: Chart | null
}

const store = new Map<string, SessionState>()

export function createSession(sessionId: string, hostId: string): void {
  store.set(sessionId, { hostId, createdAt: Date.now(), chart: null })
}

export function getSession(sessionId: string): SessionState | null {
  return store.get(sessionId) ?? null
}

export function setChart(sessionId: string, chart: Chart): void {
  const s = store.get(sessionId)
  if (s) s.chart = chart
}

export function clearChart(sessionId: string): void {
  const s = store.get(sessionId)
  if (s) s.chart = null
}

// Prune sessions older than 12 hours
export function pruneOldSessions(): void {
  const cutoff = Date.now() - 12 * 60 * 60 * 1000
  for (const [id, s] of store.entries()) {
    if (s.createdAt < cutoff) store.delete(id)
  }
}
