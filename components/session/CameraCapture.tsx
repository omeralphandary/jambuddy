'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

interface Props {
  onCapture: (file: File) => void
  onClose: () => void
}

export default function CameraCapture({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [ready, setReady] = useState(false)
  const [captured, setCaptured] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => setReady(true)
      }
    } catch {
      setError('Camera not available. Use file upload instead.')
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [startCamera])

  function capture() {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')!.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setCaptured(dataUrl)
    streamRef.current?.getTracks().forEach(t => t.stop())
  }

  function retake() {
    setCaptured(null)
    setReady(false)
    startCamera()
  }

  function confirm() {
    if (!captured || !canvasRef.current) return
    canvasRef.current.toBlob(blob => {
      if (!blob) return
      const file = new File([blob], `chart-${Date.now()}.jpg`, { type: 'image/jpeg' })
      onCapture(file)
    }, 'image/jpeg', 0.92)
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <span className="text-white font-medium">Capture chart</span>
        <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl leading-none">×</button>
      </div>

      {/* Camera / preview */}
      <div className="flex-1 relative overflow-hidden bg-zinc-950">
        {error ? (
          <div className="flex items-center justify-center h-full text-zinc-400 text-sm px-6 text-center">
            {error}
          </div>
        ) : captured ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={captured} alt="Captured chart" className="w-full h-full object-contain" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        {/* Alignment guide overlay */}
        {!captured && !error && (
          <div className="absolute inset-4 border-2 border-white/20 rounded-xl pointer-events-none" />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="px-4 py-5 flex gap-3 border-t border-zinc-800">
        {captured ? (
          <>
            <button
              onClick={retake}
              className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-medium"
            >
              Retake
            </button>
            <button
              onClick={confirm}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
            >
              Use this photo
            </button>
          </>
        ) : (
          <button
            onClick={capture}
            disabled={!ready}
            className="w-full py-4 rounded-xl bg-white disabled:opacity-40 text-black font-bold text-lg"
          >
            {ready ? 'Capture' : 'Starting camera...'}
          </button>
        )}
      </div>
    </div>
  )
}
