import { Bebas_Neue, Inter, Oswald, Playfair_Display } from 'next/font/google'
import './globals.css'

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
  title: 'HAVOC UNDR HEAVEN',
  description: 'Publicaciones de análisis geopolítico',
}

export default function RootLayout({ children }) {
  return (
    <html lang='es' className={fontVariables} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
