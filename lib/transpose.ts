const SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const FLATS  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

// Keys that conventionally use flats
const FLAT_KEYS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Fm', 'Bbm', 'Ebm', 'Abm'])

export const ALL_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

function noteIndex(note: string): number {
  const si = SHARPS.indexOf(note)
  return si !== -1 ? si : FLATS.indexOf(note)
}

function transposeNote(note: string, semitones: number, targetKey: string): string {
  const idx = noteIndex(note)
  if (idx === -1) return note
  const newIdx = (idx + semitones + 12) % 12
  return FLAT_KEYS.has(targetKey) ? FLATS[newIdx] : SHARPS[newIdx]
}

// Matches a chord token: root + optional quality + optional slash bass
// e.g. Cmaj7, Dm7b5, G7#11, Bb/D, F#m
const CHORD_RE = /^([A-G][#b]?)((?:maj|min|m|M|dim|aug|sus|add|no|omit)?(?:\d+)?(?:[#b]\d+)*(?:sus\d?|add\d+)?)(\/([A-G][#b]?))?$/

export function transposeChord(chord: string, semitones: number, targetKey: string): string {
  if (semitones === 0) return chord
  const match = chord.match(CHORD_RE)
  if (!match) return chord

  const [, root, quality, , bass] = match
  const newRoot = transposeNote(root, semitones, targetKey)
  const newBass = bass ? '/' + transposeNote(bass, semitones, targetKey) : ''
  return `${newRoot}${quality}${newBass}`
}

export function transposeChart(content: string, semitones: number, targetKey: string): string {
  if (semitones === 0) return content

  // Split into lines, then process each token
  return content
    .split('\n')
    .map(line => {
      // Preserve section headers like [Verse], [Chorus]
      if (/^\[.*\]$/.test(line.trim())) return line

      // Tokenize — split by spaces and pipes, transpose chord tokens
      return line
        .split(/(\s+|\|)/)
        .map(token => {
          const trimmed = token.trim()
          if (!trimmed || trimmed === '|') return token
          // Only try to transpose if it starts with a note letter
          if (!/^[A-G]/.test(trimmed)) return token
          return transposeChord(trimmed, semitones, targetKey)
        })
        .join('')
    })
    .join('\n')
}

export function keyFromSemitones(originalKey: string, semitones: number): string {
  const idx = noteIndex(originalKey)
  if (idx === -1) return originalKey
  const newIdx = (idx + semitones + 12) % 12
  // Determine flat vs sharp based on the resulting key context
  const sharpKey = SHARPS[newIdx]
  const flatKey = FLATS[newIdx]
  return FLAT_KEYS.has(flatKey) ? flatKey : sharpKey
}
