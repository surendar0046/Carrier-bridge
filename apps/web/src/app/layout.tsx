import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from '../lib/providers'
import PWAInstaller from '../components/PWAInstaller'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Career Bridge - AI Driven Career OS',
  description: 'Enterprise-scale Career Operating System guiding users through their career journey.',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#020617] text-slate-200 antialiased selection:bg-blue-500/30 selection:text-blue-200`}>
        <Providers>
          <PWAInstaller />
          {children}
        </Providers>
      </body>
    </html>
  )
}
