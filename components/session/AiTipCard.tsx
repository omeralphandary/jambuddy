'use client'

interface Props {
  chord: string
  tip: string
  onClose: () => void
}

export default function AiTipCard({ chord, tip, onClose }: Props) {
  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-zinc-800 border border-indigo-500/40 rounded-2xl p-4 shadow-xl z-50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono font-bold text-indigo-400 text-sm">{chord}</span>
            <span className="text-xs text-zinc-500">AI coach</span>
          </div>
          <p className="text-sm text-zinc-200 leading-relaxed">{tip}</p>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white mt-0.5 flex-shrink-0 text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}
