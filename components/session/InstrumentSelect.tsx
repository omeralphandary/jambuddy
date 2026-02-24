'use client'

export const INSTRUMENTS = [
  { label: 'Concert (C)',      value: 'C',  semitones: 0  },
  { label: 'Bb (trumpet, tenor sax, clarinet)', value: 'Bb', semitones: 2  },
  { label: 'Eb (alto sax, bari sax)',           value: 'Eb', semitones: -3 },
  { label: 'F (french horn)',  value: 'F',  semitones: -7 },
  { label: 'Bass clef',        value: 'BC', semitones: 0  },
]

interface Props {
  value: string
  onChange: (value: string, semitones: number) => void
}

export default function InstrumentSelect({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-zinc-400 text-xs">Instrument:</span>
      <select
        value={value}
        onChange={e => {
          const inst = INSTRUMENTS.find(i => i.value === e.target.value)!
          onChange(inst.value, inst.semitones)
        }}
        className="bg-zinc-800 text-white text-xs rounded-lg px-2 py-1.5 outline-none border border-zinc-700"
      >
        {INSTRUMENTS.map(i => (
          <option key={i.value} value={i.value}>{i.label}</option>
        ))}
      </select>
    </div>
  )
}
