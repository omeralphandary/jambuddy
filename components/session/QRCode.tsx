'use client'

import { QRCodeSVG } from 'qrcode.react'

interface Props {
  url: string
  size?: number
}

export default function QRCode({ url, size = 140 }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-white p-2 rounded-xl">
        <QRCodeSVG value={url} size={size} />
      </div>
      <p className="text-xs text-zinc-500">Scan to join</p>
    </div>
  )
}
