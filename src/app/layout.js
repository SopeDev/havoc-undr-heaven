import { Bebas_Neue, Inter, Oswald, Playfair_Display } from 'next/font/google'
import './globals.css'
import { getSiteUrl } from '../lib/siteUrl'

const siteUrl = getSiteUrl()
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim()

const fontDisplay = Bebas_Neue({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-bebas',
})

const fontSerif = Playfair_Display({
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-playfair',
})

const fontBody = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
})

const fontCond = Oswald({
  weight: ['300', '400', '500'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-oswald',
})

const fontVariables = [fontDisplay.variable, fontSerif.variable, fontBody.variable, fontCond.variable].join(' ')

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'HAVOC UNDR HEAVEN',
    template: '%s — HAVOC UNDR HEAVEN'
  },
  description: 'Publicaciones de análisis geopolítico',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'HAVOC UNDR HEAVEN',
    title: 'HAVOC UNDR HEAVEN',
    description: 'Publicaciones de análisis geopolítico'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HAVOC UNDR HEAVEN',
    description: 'Publicaciones de análisis geopolítico'
  },
  alternates: {
    canonical: '/'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang='es' className={fontVariables} suppressHydrationWarning>
      <head>
        {umamiWebsiteId ? (
          <script defer src='https://cloud.umami.is/script.js' data-website-id={umamiWebsiteId} />
        ) : null}
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
