import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from '../lib/providers'
import PWAInstaller from '../components/PWAInstaller'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
})

export const viewport: Viewport = {
  themeColor: '#ffffff',
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
      <body className={`${poppins.className} bg-white text-slate-800 antialiased selection:bg-blue-500/20 selection:text-blue-900`}>
        <Providers>
          <PWAInstaller />
          {children}
        </Providers>
      </body>
    </html>
  )
}
