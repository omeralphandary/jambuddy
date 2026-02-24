import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { readFile } from 'fs/promises'
import path from 'path'

const client = new Anthropic()

export async function POST(req: Request) {
  const { imageUrl } = await req.json().catch(() => ({}))
  if (!imageUrl) return NextResponse.json({ error: 'imageUrl required' }, { status: 400 })

  // Load image — local /uploads/* path or external URL
  let imageData: string
  let mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' = 'image/jpeg'

  if (imageUrl.startsWith('/uploads/')) {
    const filePath = path.join(process.cwd(), 'public', imageUrl)
    const buffer = await readFile(filePath)
    imageData = buffer.toString('base64')
    const ext = imageUrl.split('.').pop()?.toLowerCase()
    if (ext === 'png') mediaType = 'image/png'
    else if (ext === 'webp') mediaType = 'image/webp'
  } else {
    // External URL — fetch and convert
    const res = await fetch(imageUrl)
    const buffer = await res.arrayBuffer()
    imageData = Buffer.from(buffer).toString('base64')
    const ct = res.headers.get('content-type') ?? ''
    if (ct.includes('png')) mediaType = 'image/png'
    else if (ct.includes('webp')) mediaType = 'image/webp'
  }

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: imageData },
          },
          {
            type: 'text',
            text: `This is a handwritten or printed chord chart / lead sheet.
Extract the chord chart as plain text, preserving:
- Section labels like [Verse], [Chorus], [Bridge], [Intro], [A], [B] etc.
- Chord symbols exactly as written (e.g. Cmaj7, Dm7b5, G7alt, Bb/D)
- Bar structure using | separators where visible
- Line breaks between phrases

Output ONLY the chart text — no explanation, no preamble. If you can identify the song title, put it on the first line.
If the image is not a chord chart, return exactly: NOT_A_CHART`,
          },
        ],
      },
    ],
  })

  const text = (message.content[0] as { type: string; text: string }).text.trim()

  if (text === 'NOT_A_CHART') {
    return NextResponse.json({ error: 'Image does not appear to be a chord chart' }, { status: 422 })
  }

  // Try to extract a key from the parsed chart
  const keyMatch = text.match(/\bkey\s+of\s+([A-G][#b]?)/i) ?? text.match(/^([A-G][#b]?)\s*(?:major|minor|maj|min)?\b/m)
  const detectedKey = keyMatch?.[1] ?? 'C'

  return NextResponse.json({ content: text, detectedKey })
}
