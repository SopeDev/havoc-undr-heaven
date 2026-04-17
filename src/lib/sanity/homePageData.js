import { FEED_FIRST_PEEK_DOCS, FEED_PAGE_SIZE } from '../feedPagination'
import {
  getHottestSidebarRawDocs,
  HOTTEST_ASIDE_LIMIT,
  HOTTEST_SANITY_POOL,
  isUmamiAnalyticsConfigured
} from '../umami/hottestArticles'
import { categoryHrefSlug, formatArticleDate } from './articleView'
import { fetchHomeArticles, fetchHomeArticlesRange } from './articles'
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
    categorySlug: categoryHrefSlug(doc.categoryName, doc.categorySlug),
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
  const feedItems = rows.slice(1, 1 + FEED_PAGE_SIZE)
  const sidebarArticles = rows.slice(1 + FEED_PAGE_SIZE, 1 + FEED_PAGE_SIZE + 3)
  return { hero, feedItems, sidebarArticles }
}

/**
 * Same ranking / fallback as the home aside “En el Spotlight” block.
 * @param {Array<Record<string, unknown>>} docs raw rows from fetchHomeArticles
 * @returns {Promise<Array<ReturnType<typeof mapRawDocToHomeRow>>>}
 */
async function resolveSpotlightSidebarArticlesFromDocs(docs) {
  if (!Array.isArray(docs) || docs.length === 0) return []
  const articleRows = docs.map(mapRawDocToHomeRow)
  const { sidebarArticles: partitionSidebar } = partitionHomeArticles(articleRows)
  let sidebarArticles = partitionSidebar
  if (isUmamiAnalyticsConfigured()) {
    const excluded = new Set(
      articleRows
        .slice(0, 1 + FEED_PAGE_SIZE)
        .map(r => r.href?.replace(/^\/articulos\//, '') || '')
        .filter(Boolean)
        .map(s => s.toLowerCase())
    )
    const hottestDocs = await getHottestSidebarRawDocs(docs, excluded, HOTTEST_ASIDE_LIMIT)
    if (hottestDocs.length > 0) {
      sidebarArticles = hottestDocs.map(mapRawDocToHomeRow)
    }
  }
  return sidebarArticles
}

/** Fetches and ranks spotlight aside rows (for home, category pages, etc.). */
export async function fetchSpotlightSidebarArticles() {
  const articleLimit = isUmamiAnalyticsConfigured() ? HOTTEST_SANITY_POOL : 8
  const docs = await fetchHomeArticles(articleLimit)
  return resolveSpotlightSidebarArticlesFromDocs(docs)
}

export async function fetchHomePageData() {
  const articleLimit = isUmamiAnalyticsConfigured() ? HOTTEST_SANITY_POOL : 8

  const [nav, peekDocs, poolDocs, focos, dispatchItems] = await Promise.all([
    fetchNavLists(),
    fetchHomeArticlesRange(0, FEED_FIRST_PEEK_DOCS),
    fetchHomeArticles(articleLimit),
    fetchFocosSidebarByUpdated(5),
    fetchHomeDispatchItems()
  ])

  const categories = nav.categories
  const tags = nav.tags

  let focoRows = []
  if (Array.isArray(focos) && focos.length > 0) {
    focoRows = focos.map(f => ({
      name: f.name,
      region: f.region,
      kind: f.kind,
      slug: f.slug
    }))
  }

  const hero =
    Array.isArray(peekDocs) && peekDocs.length > 0 ? mapRawDocToHomeRow(peekDocs[0]) : null
  const feedItems =
    Array.isArray(peekDocs) && peekDocs.length > 1
      ? peekDocs.slice(1, 1 + FEED_PAGE_SIZE).map(mapRawDocToHomeRow)
      : []
  const feedHasMore = Array.isArray(peekDocs) && peekDocs.length > 1 + FEED_PAGE_SIZE

  const sidebarArticles = await resolveSpotlightSidebarArticlesFromDocs(poolDocs)

  return {
    categories,
    tags,
    hero,
    feedItems,
    feedHasMore,
    sidebarArticles,
    dispatchItems,
    focoRows
  }
}
