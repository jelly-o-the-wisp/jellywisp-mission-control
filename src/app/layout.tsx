import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jellywisp Mission Control',
  description: 'JellyByte command centre for OpenClaw agents',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
