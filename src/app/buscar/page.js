import { Suspense } from 'react'
import BuscarClient from './BuscarClient'
import { fetchArticlesForSearch } from '../../lib/sanity/articles'
import { isSanityConfigured } from '../../lib/sanity/client'

export const dynamic = 'force-dynamic'

export default async function BuscarPage() {
  const cmsArticles = isSanityConfigured() ? await fetchArticlesForSearch() : []

  return (
    <Suspense fallback={null}>
      <BuscarClient cmsArticles={cmsArticles} />
    </Suspense>
  )
}
