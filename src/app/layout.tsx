import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WhoseMLT — Most Likely To',
  description: 'A real-time multiplayer party game.',
}

export const viewport: Viewport = {
  width: 1280,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} antialiased bg-[#0c0818] text-[#f0ebff] font-sans min-h-screen selection:bg-[#7B2FFF] selection:text-white`}>
        {children}
      </body>
    </html>
  )
}
