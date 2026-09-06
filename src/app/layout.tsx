import type { Metadata, Viewport } from 'next'
import { Libre_Baskerville } from 'next/font/google'
import localFont from 'next/font/local'
import Image from 'next/image'
import Link from 'next/link'
import { Facebook } from 'lucide-react'
import './globals.css'
import './styles.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { YearProvider } from '@/contexts/YearContext'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import WebViewDebugger from '@/components/WebViewDebugger'

// Keep the decorative font available for legacy assets; site text uses Helvetica Now Display.
const tagesschrift = localFont({
  src: '../../public/fonts/Tagesschrift.ttf',
  variable: '--font-decorative',
  display: 'swap',
})

// Keep the existing font preload for compatibility with legacy components.
const libreBaskerville = Libre_Baskerville({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-legacy-body',
})

export const metadata: Metadata = {
  title: 'Wtyczka - Wyjazd integracyjno-szkoleniowy',
  description: 'Oficjalna strona wydarzenia Wtyczka',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pl"
      className={`${tagesschrift.variable} ${libreBaskerville.variable}`}
    >
      <head>
        <link rel="icon" href="/logo.ico" />
      </head>
      <body className={`${libreBaskerville.className} text-white antialiased`}>
        <div className="background-container">
          <div className="background-content">
            <Image
              src="/cosmos/tlo.png"
              alt="Górski krajobraz pod rozgwieżdżonym niebem"
              className="background-svg"
              fill
              priority
            />
            <div className="background-overlay-top"></div>
            <div className="background-overlay-bottom"></div>
          </div>
        </div>
        <LanguageProvider>
          <YearProvider>
            <AuthProvider>
              <Navbar />
              <main className="relative z-10 min-h-screen">{children}</main>
              <footer className="cosmos-footer relative z-10 overflow-hidden">
                <Image
                  src="/cosmos/futer_aktualności.png"
                  alt=""
                  fill
                  className="cosmos-footer-texture"
                  aria-hidden="true"
                />
                <div className="cosmos-footer-content relative mx-auto flex max-w-3xl flex-col items-center px-5 py-14 text-center sm:py-16">
                  <h2 className="cosmos-footer-title text-2xl font-semibold md:text-3xl">
                    Nie przegap żadnych aktualności!
                  </h2>
                  <p className="cosmos-footer-copy mt-4 max-w-2xl text-base leading-relaxed md:text-lg">
                    Obserwuj naszą stronę na Facebooku, aby być na bieżąco z
                    wszystkimi informacjami dotyczącymi WTYCZKI 2026.
                  </p>
                  <Link
                    href="https://www.facebook.com/wtyczka.eeia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cosmos-footer-button mt-7 inline-flex w-full max-w-xl items-center justify-center gap-3 rounded-2xl px-6 py-3.5 text-sm font-semibold uppercase md:text-base"
                  >
                    <Facebook className="h-5 w-5" />
                    Odwiedź naszego Facebooka
                  </Link>
                  <p className="cosmos-footer-copyright mt-16 text-base md:text-lg">
                    © 2026 WTYCZKA
                  </p>
                </div>
              </footer>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  className: 'animate-toast-bottom',
                }}
              />
              <WebViewDebugger />
            </AuthProvider>
          </YearProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
