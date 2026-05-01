'use client'

import { useEffect } from 'react'

/**
 * Dev-only: logs what the Home page received for “En el Spotlight” (browser console).
 * Server-side logs use `[havoc/home][server]` in the terminal where `next dev` runs.
 */
export default function HomeSpotlightDebug({ count, titles }) {
  useEffect(() => {
    console.info('[havoc/home][browser] En el Spotlight props', { count, titles })
    if (count === 0) {
      console.warn(
        '[havoc/home] Spotlight count is 0 — open the terminal running `npm run dev` and look for [havoc/home][server]'
      )
    }
  }, [count, titles])

  return null
}
