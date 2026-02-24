import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const sessionId = formData.get('sessionId') as string | null

  if (!file || !sessionId) {
    return NextResponse.json({ error: 'Missing file or sessionId' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = file.name.split('.').pop() ?? 'jpg'
  const filename = `${sessionId}-${Date.now()}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')

  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, filename), buffer)

  const url = `/uploads/${filename}`
  return NextResponse.json({ url })
}
