'use client'

import { useState, useRef } from 'react'
import type { TextChart, ImageChart, Chart } from '@/types/session'
import { ALL_KEYS } from '@/lib/transpose'
import ChartLibrary from './ChartLibrary'
import CameraCapture from './CameraCapture'
import type { StandardChart } from '@/lib/charts-db'

type Tab = 'library' | 'text' | 'image'

interface Props {
  sessionId: string
  currentChart: Chart | null
  onChartUpdate: (chart: Chart) => void
  onClear: () => void
}

export default function HostControls({ sessionId, currentChart, onChartUpdate, onClear }: Props) {
  const [tab, setTab] = useState<Tab>('library')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [key, setKey] = useState('C')
  const [pushing, setPushing] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [ocrRunning, setOcrRunning] = useState(false)
  const [ocrBanner, setOcrBanner] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Push a TextChart to the session
  async function pushTextChart(chart: TextChart) {
    setPushing(true)
    await fetch(`/api/session/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'push_chart', chart }),
    })
    onChartUpdate(chart)
    setPushing(false)
  }

  // Library: user picks a standard
  async function handleLibrarySelect(standard: StandardChart) {
    const chart: TextChart = {
      type: 'text',
      title: standard.title,
      content: standard.content,
      key: standard.key,
      originalKey: standard.key,
      semitones: 0,
    }
    await pushTextChart(chart)
  }

  // Text tab: manual entry
  async function handleManualPush() {
    if (!title.trim() || !content.trim()) return
    await pushTextChart({
      type: 'text',
      title: title.trim(),
      content: content.trim(),
      key,
      originalKey: key,
      semitones: 0,
    })
  }

  // Image tab: process file (from picker or camera)
  async function processImageFile(file: File) {
    setUploadingFile(true)
    setOcrBanner(false)
    setShowCamera(false)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title.trim() || file.name.replace(/\.[^.]+$/, ''))
    formData.append('sessionId', sessionId)

    const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
    const { url } = await uploadRes.json()

    setOcrRunning(true)
    const ocrRes = await fetch('/api/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: url }),
    })
    const ocrData = await ocrRes.json()
    setOcrRunning(false)

    if (ocrData.content) {
      // OCR succeeded — switch to text tab with pre-filled content
      const k = ocrData.detectedKey ?? 'C'
      setTitle(t => t || 'Handwritten chart')
      setContent(ocrData.content)
      setKey(k)
      setTab('text')
      setOcrBanner(true)
    } else {
      // OCR failed — push raw image
      const chart: ImageChart = {
        type: 'image',
        title: title.trim() || 'Chart',
        url,
      }
      await fetch(`/api/session/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'push_chart', chart }),
      })
      onChartUpdate(chart)
    }
    setUploadingFile(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function changeKey(semitones: number) {
    if (!currentChart || currentChart.type !== 'text') return
    const res = await fetch(`/api/session/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'change_key', semitones }),
    })
    const data = await res.json()
    if (data.chart) onChartUpdate(data.chart)
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
  const currentKey = isTextChart ? (currentChart as TextChart).key : ''

  return (
    <>
      {/* Camera overlay */}
      {showCamera && (
        <CameraCapture
          onCapture={processImageFile}
          onClose={() => setShowCamera(false)}
        />
      )}

      <div className="space-y-4">
        {/* Modulation bar */}
        {isTextChart && (
          <div className="flex items-center gap-2 p-3 bg-zinc-800 rounded-xl">
            <span className="text-zinc-400 text-sm">Key:</span>
            <span className="font-mono font-bold text-white text-lg w-8">{currentKey}</span>
            <div className="flex gap-1 ml-auto">
              {([-2, -1] as const).map(s => (
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
              {([1, 2] as const).map(s => (
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

        {/* OCR success banner */}
        {ocrBanner && (
          <div className="bg-indigo-950 border border-indigo-500/40 rounded-xl p-3 text-sm flex items-start justify-between gap-2">
            <p className="text-indigo-300">
              AI read your chart. Converted to text — key modulation is now available. Edit if needed, then push.
            </p>
            <button onClick={() => setOcrBanner(false)} className="text-indigo-500 hover:text-indigo-300 flex-shrink-0">×</button>
          </div>
        )}

        {/* Panel */}
        <div className="bg-zinc-800 rounded-xl p-4 space-y-3">
          {/* Tabs */}
          <div className="flex gap-1">
            {(['library', 'text', 'image'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  tab === t ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t === 'library' ? 'Library' : t === 'text' ? 'Type chart' : 'Photo / file'}
              </button>
            ))}
          </div>

          {/* Library */}
          {tab === 'library' && (
            <ChartLibrary onSelect={handleLibrarySelect} />
          )}

          {/* Manual text */}
          {tab === 'text' && (
            <>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
              />
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
                placeholder={`[Verse]\nCmaj7  Am7  | Dm7  G7`}
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm font-mono outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
              <button
                onClick={handleManualPush}
                disabled={pushing || !title.trim() || !content.trim()}
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium text-sm transition-colors"
              >
                {pushing ? 'Pushing...' : 'Push to all devices'}
              </button>
            </>
          )}

          {/* Image / camera */}
          {tab === 'image' && (
            <>
              <input
                type="text"
                placeholder="Title (optional)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-xs text-zinc-500">
                AI will read the chart and convert it to text so you can modulate the key.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCamera(true)}
                  disabled={uploadingFile || ocrRunning}
                  className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium text-sm transition-colors"
                >
                  Camera
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingFile || ocrRunning}
                  className="flex-1 py-2.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 text-white font-medium text-sm transition-colors"
                >
                  {ocrRunning ? 'AI reading...' : uploadingFile ? 'Uploading...' : 'Upload file'}
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) processImageFile(file)
                }}
              />
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
    </>
  )
}
