'use client'

import { NextStudio } from 'next-sanity/studio/client-component'
import config from '../../../../sanity.config.mjs'

export default function StudioPage() {
  return <NextStudio config={config} />
}
