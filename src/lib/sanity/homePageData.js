import { FEED_FIRST_PEEK_DOCS, FEED_PAGE_SIZE } from '../feedPagination'
import {
  getHottestSidebarRawDocs,
  HOTTEST_SANITY_POOL,
  isUmamiAnalyticsConfigured
} from '../umami/hottestArticles'
import { isSanityConfigured } from './client'
import { categoryHrefSlug, formatArticleDate } from './articleView'
import { urlForCardImage } from './image'
import { fetchHomeArticles, fetchHomeArticlesRange } from './articles'
import { fetchFocosSidebarByUpdated } from './focos'
import { fetchHomeDispatchItems } from './newsletterIssues'
import { fetchNavLists } from './navigation'

/** Hard cap for “En el Spotlight” on home, categoría, and tema sidebars. */
export const SPOTLIGHT_MAX_ARTICLES = 5

function capSpotlightRows(rows) {
  if (!Array.isArray(rows)) return []
  return rows.slice(0, SPOTLIGHT_MAX_ARTICLES)
}

function tagLineFromNames(names) {
  return Array.isArray(names) ? names.filter(Boolean).join(' · ') : ''
}

export function mapRawDocToHomeRow(doc) {
  const mins = doc.readingTimeMinutes
  const altFromCms =
    doc.coverImage && typeof doc.coverImage.alt === 'string' ? doc.coverImage.alt.trim() : ''
  return {
    cat: doc.categoryName || 'Análisis',
    categorySlug: categoryHrefSlug(doc.categoryName, doc.categorySlug),
    topic: tagLineFromNames(doc.tagNames) || '—',
    title: doc.title || '',
    excerpt: doc.deck || '',
    dateStr: formatArticleDate(doc.publishedAt),
    timeStr: typeof mins === 'number' ? `${mins} min` : '—',
    timeReadStr: typeof mins === 'number' ? `${mins} min de lectura` : '—',
    href: `/articulos/${doc.slug}`,
    coverUrl: urlForCardImage(doc.coverImage) || null,
    coverAlt: altFromCms || doc.title || ''
  }
}

/**
 * Spotlight aside: independent of hero/feed indices — may overlap the main feed.
 * With Umami: rank pool by traffic (no exclusions). Otherwise: most recent first.
 */
async function resolveSpotlightSidebarArticlesFromDocs(docs) {
  if (!Array.isArray(docs) || docs.length === 0) return []

  if (isUmamiAnalyticsConfigured()) {
    const hottestDocs = await getHottestSidebarRawDocs(docs, new Set(), SPOTLIGHT_MAX_ARTICLES)
    if (hottestDocs.length > 0) {
      return capSpotlightRows(hottestDocs.map(mapRawDocToHomeRow))
    }
  }

  const n = Math.min(SPOTLIGHT_MAX_ARTICLES, docs.length)
  return docs.slice(0, n).map(mapRawDocToHomeRow)
}

/** Fetches spotlight rows for sidebars (home, category, tema). */
export async function fetchSpotlightSidebarArticles() {
  const poolLimit = isUmamiAnalyticsConfigured() ? HOTTEST_SANITY_POOL : SPOTLIGHT_MAX_ARTICLES
  const docs = await fetchHomeArticles(poolLimit)
  return capSpotlightRows(await resolveSpotlightSidebarArticlesFromDocs(docs))
}

export async function fetchHomePageData() {
  const [nav, peekDocs, spotlightFromPool, focos, dispatchItems] = await Promise.all([
    fetchNavLists(),
    fetchHomeArticlesRange(0, FEED_FIRST_PEEK_DOCS),
    fetchSpotlightSidebarArticles(),
    fetchFocosSidebarByUpdated(5),
    fetchHomeDispatchItems()
  ])

  let sidebarArticles = Array.isArray(spotlightFromPool) ? spotlightFromPool : []

  /** Same articles as hero/feed peek — guarantees Spotlight when the pool fetch failed or returned []. */
  const usedPeekFallback =
    sidebarArticles.length === 0 &&
    Array.isArray(peekDocs) &&
    peekDocs.length > 0

  if (usedPeekFallback) {
    const n = Math.min(SPOTLIGHT_MAX_ARTICLES, peekDocs.length)
    sidebarArticles = peekDocs.slice(0, n).map(mapRawDocToHomeRow)
  }

  sidebarArticles = capSpotlightRows(sidebarArticles)

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
