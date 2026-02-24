'use client'

import { useState, useRef } from 'react'
import type { TextChart, ImageChart, Chart } from '@/types/session'
import { ALL_KEYS } from '@/lib/transpose'

interface Props {
  sessionId: string
  currentChart: Chart | null
  onChartUpdate: (chart: Chart) => void
  onClear: () => void
}

export default function HostControls({ sessionId, currentChart, onChartUpdate, onClear }: Props) {
  const [tab, setTab] = useState<'text' | 'image'>('text')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [key, setKey] = useState('C')
  const [uploading, setUploading] = useState(false)
  const [pushing, setPushing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function pushTextChart() {
    if (!title.trim() || !content.trim()) return
    setPushing(true)
    const chart: TextChart = {
      type: 'text',
      title: title.trim(),
      content: content.trim(),
      key,
      originalKey: key,
      semitones: 0,
    }
    await fetch(`/api/session/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'push_chart', chart }),
    })
    onChartUpdate(chart)
    setPushing(false)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !title.trim()) return
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title.trim())
    formData.append('sessionId', sessionId)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const { url } = await res.json()

    const chart: ImageChart = { type: 'image', title: title.trim(), url }
    await fetch(`/api/session/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'push_chart', chart }),
    })
    onChartUpdate(chart)
    setUploading(false)
  }

  async function changeKey(semitones: number) {
    if (!currentChart || currentChart.type !== 'text') return
    const res = await fetch(`/api/session/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'change_key', semitones }),
    })
    const { chart } = await res.json().catch(() => ({}))
    if (chart) onChartUpdate(chart)
  }

  async function handleClear() {
    await fetch(`/api/session/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'clear' }),
    })
    onClear()
  }

  const isTextChart = currentChart?.type === 'text'
  const currentSemitones = isTextChart ? (currentChart as TextChart).semitones : 0

  return (
    <div className="space-y-4">
      {/* Modulation bar — only shown when a text chart is active */}
      {isTextChart && (
        <div className="flex items-center gap-2 p-3 bg-zinc-800 rounded-xl">
          <span className="text-zinc-400 text-sm">Key:</span>
          <span className="font-mono font-bold text-white text-lg w-8">{(currentChart as TextChart).key}</span>
          <div className="flex gap-1 ml-auto">
            {[-2, -1].map(s => (
              <button
                key={s}
                onClick={() => changeKey(currentSemitones + s)}
                className="px-3 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-mono transition-colors"
              >
                {s}
              </button>
            ))}
            <button
              onClick={() => changeKey(0)}
              className="px-3 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-400 text-xs transition-colors"
            >
              reset
            </button>
            {[+1, +2].map(s => (
              <button
                key={s}
                onClick={() => changeKey(currentSemitones + s)}
                className="px-3 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-mono transition-colors"
              >
                +{s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Push a new chart */}
      <div className="bg-zinc-800 rounded-xl p-4 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => setTab('text')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'text' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            Text chart
          </button>
          <button
            onClick={() => setTab('image')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'image' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            Image / photo
          </button>
        </div>

        <input
          type="text"
          placeholder="Chart title (e.g. Autumn Leaves)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-3 py-2 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
        />

        {tab === 'text' && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-sm">Key:</span>
              <select
                value={key}
                onChange={e => setKey(e.target.value)}
                className="bg-zinc-700 text-white text-sm rounded-lg px-2 py-1 outline-none"
              >
                {ALL_KEYS.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <textarea
              placeholder={`[Verse]\nCmaj7  Am7  | Dm7  G7\n\n[Chorus]\nFmaj7  Em7  | Dm7  G7`}
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm font-mono outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
            <button
              onClick={pushTextChart}
              disabled={pushing || !title.trim() || !content.trim()}
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium text-sm transition-colors"
            >
              {pushing ? 'Pushing...' : 'Push to all devices'}
            </button>
          </>
        )}

        {tab === 'image' && (
          <>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading || !title.trim()}
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium text-sm transition-colors"
            >
              {uploading ? 'Uploading...' : 'Upload photo / scan'}
            </button>
          </>
        )}
      </div>

      {currentChart && (
        <button
          onClick={handleClear}
          className="w-full py-2 rounded-lg border border-zinc-700 hover:border-red-500 text-zinc-400 hover:text-red-400 text-sm transition-colors"
        >
          Clear chart
        </button>
      )}
    </div>
  )
}
