import { Suspense } from 'react'
import BuscarClient from './BuscarClient'

export default function BuscarPage() {
  return (
    <Suspense fallback={null}>
      <BuscarClient />
    </Suspense>
  )
}
