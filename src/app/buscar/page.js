import { Suspense } from 'react'
import BuscarClient from './BuscarClient'
import { fetchArticlesForSearch } from '../../lib/sanity/articles'
import { fetchNavLists } from '../../lib/sanity/navigation'

export const dynamic = 'force-dynamic'

export default async function BuscarPage() {
  const [cmsArticles, nav] = await Promise.all([fetchArticlesForSearch(), fetchNavLists()])

  return (
    <Suspense fallback={null}>
      <BuscarClient cmsArticles={cmsArticles} categories={nav.categories} tags={nav.tags} />
    </Suspense>
  )
}
