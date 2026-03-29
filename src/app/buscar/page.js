import { Suspense } from 'react'
import BuscarClient from './BuscarClient'
import { fetchArticlesForSearch } from '../../lib/sanity/articles'
import { isSanityConfigured } from '../../lib/sanity/client'
import { fetchNavLists } from '../../lib/sanity/navigation'

export const dynamic = 'force-dynamic'

export default async function BuscarPage() {
  const sanityOn = isSanityConfigured()
  const [cmsArticles, nav] = sanityOn
    ? await Promise.all([fetchArticlesForSearch(), fetchNavLists()])
    : [[], { categories: [], tags: [] }]

  return (
    <Suspense fallback={null}>
      <BuscarClient cmsArticles={cmsArticles} categories={nav.categories} tags={nav.tags} />
    </Suspense>
  )
}
