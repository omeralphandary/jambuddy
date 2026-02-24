export type ChartType = 'text' | 'image'

export interface TextChart {
  type: 'text'
  title: string
  content: string
  key: string
  originalKey: string
  semitones: number
}

export interface ImageChart {
  type: 'image'
  title: string
  url: string
}

export type Chart = TextChart | ImageChart

export interface SessionMember {
  id: string
  name: string
  isHost: boolean
}

export interface Session {
  id: string
  hostId: string
  createdAt: number
  chart: Chart | null
}

export type PusherEvent =
  | { type: 'chart_pushed'; chart: Chart }
  | { type: 'key_changed'; semitones: number; currentKey: string; content: string }
  | { type: 'chart_cleared' }
  | { type: 'state_sync'; chart: Chart | null }
