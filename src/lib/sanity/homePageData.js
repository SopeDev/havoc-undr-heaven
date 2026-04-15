import {
  getHottestSidebarRawDocs,
  HOTTEST_ASIDE_LIMIT,
  HOTTEST_SANITY_POOL,
  isUmamiAnalyticsConfigured
} from '../umami/hottestArticles'
import { formatArticleDate } from './articleView'
import { fetchHomeArticles } from './articles'
import { fetchFocosSidebarByUpdated } from './focos'
import { fetchHomeDispatchItems } from './newsletterIssues'
import { fetchNavLists } from './navigation'

function tagLineFromNames(names) {
  return Array.isArray(names) ? names.filter(Boolean).join(' · ') : ''
}

export function mapRawDocToHomeRow(doc) {
  const mins = doc.readingTimeMinutes
  return {
    cat: doc.categoryName || 'Análisis',
    topic: tagLineFromNames(doc.tagNames) || '—',
    title: doc.title || '',
    excerpt: doc.deck || '',
    dateStr: formatArticleDate(doc.publishedAt),
    timeStr: typeof mins === 'number' ? `${mins} min` : '—',
    timeReadStr: typeof mins === 'number' ? `${mins} min de lectura` : '—',
    href: `/articulos/${doc.slug}`
  }
}

/** @param {Array<ReturnType<typeof mapRawDocToHomeRow>>} rows */
export function partitionHomeArticles(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { hero: null, feedItems: [], sidebarArticles: [] }
  }
  const hero = rows[0]
  const feedItems = rows.slice(1, 5)
  const sidebarArticles = rows.slice(5, 8)
  return { hero, feedItems, sidebarArticles }
}

export async function fetchHomePageData() {
  const articleLimit = isUmamiAnalyticsConfigured() ? HOTTEST_SANITY_POOL : 8

  const [nav, docs, focos, dispatchItems] = await Promise.all([
    fetchNavLists(),
    fetchHomeArticles(articleLimit),
    fetchFocosSidebarByUpdated(5),
    fetchHomeDispatchItems()
  ])

  const categories = nav.categories
  const tags = nav.tags
  const articleRows =
    Array.isArray(docs) && docs.length > 0 ? docs.map(mapRawDocToHomeRow) : []

  let focoRows = []
  if (Array.isArray(focos) && focos.length > 0) {
    focoRows = focos.map(f => ({
      name: f.name,
      region: f.region,
      kind: f.kind,
      slug: f.slug
    }))
  }

  const { hero, feedItems, sidebarArticles: partitionSidebar } = partitionHomeArticles(articleRows)

  let sidebarArticles = partitionSidebar
  if (isUmamiAnalyticsConfigured() && Array.isArray(docs) && docs.length > 0) {
    const heroSlug = articleRows[0]?.href?.replace(/^\/articulos\//, '') || null
    const feedSlugs = articleRows.slice(1, 5).map(r => r.href?.replace(/^\/articulos\//, '') || '')
    const excluded = new Set([heroSlug, ...feedSlugs].filter(Boolean))
    const hottestDocs = await getHottestSidebarRawDocs(docs, excluded, HOTTEST_ASIDE_LIMIT)
    if (hottestDocs.length > 0) {
      sidebarArticles = hottestDocs.map(mapRawDocToHomeRow)
    }
  }

  return {
    categories,
    tags,
    hero,
    feedItems,
    sidebarArticles,
    dispatchItems,
    focoRows
  }
}
