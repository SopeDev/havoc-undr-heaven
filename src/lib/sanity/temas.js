import { FEED_FIRST_PEEK_DOCS, FEED_PAGE_SIZE } from '../feedPagination'
import { getSanityClient } from './client'
import { categoryHrefSlug, formatArticleDate } from './articleView'
import {
  articlesByTagSlugRangeQuery,
  countArticlesByTagSlugQuery,
  tagBySlugQuery
} from './queries'

/** Last N articles (newest first) used to compute co-occurring tags */
const RELATED_ARTICLE_WINDOW = 20
const RELATED_TAGS_LIMIT = 6

function tagLineFromNames(names) {
  return Array.isArray(names) ? names.filter(Boolean).join(' · ') : ''
}

/**
 * From the newest articles that include the current tag, count other tags and
 * return the top RELATED_TAGS_LIMIT by frequency (desc), then name for ties.
 * @param {Array<{ tagList?: Array<{ name?: string, slug?: string }> }>} articles
 * @param {string} currentTagSlug
 * @returns {Array<{ name: string, slug: string }>}
 */
function deriveRelatedTags(articles, currentTagSlug) {
  const window = Array.isArray(articles) ? articles.slice(0, RELATED_ARTICLE_WINDOW) : []
  const counts = new Map()
  for (const a of window) {
    const list = Array.isArray(a.tagList) ? a.tagList : []
    for (const t of list) {
      const slug = typeof t?.slug === 'string' && t.slug.trim() ? t.slug.trim() : null
      const name = typeof t?.name === 'string' && t.name.trim() ? t.name.trim() : null
      if (!slug || slug === currentTagSlug) continue
      const prev = counts.get(slug)
      if (prev) prev.count += 1
      else counts.set(slug, { slug, name: name || slug, count: 1 })
    }
  }
  return [...counts.values()]
    .sort((x, y) => y.count - x.count || x.name.localeCompare(y.name, 'es'))
    .slice(0, RELATED_TAGS_LIMIT)
    .map(({ name, slug }) => ({ name, slug }))
}

function deriveSections(articles) {
  const cats = new Set()
  for (const a of articles) {
    if (a.categoryName) cats.add(a.categoryName)
  }
  return cats.size > 0 ? [...cats].join(' · ') : '—'
}

function mapArticleToHero(a) {
  const mins = a.readingTimeMinutes
  return {
    cat: a.categoryName || 'Análisis',
    categorySlug: categoryHrefSlug(a.categoryName, a.categorySlug),
    tags: tagLineFromNames(a.tagNames) || '—',
    title: a.title || '',
    deck: a.deck || '',
    date: formatArticleDate(a.publishedAt),
    time: typeof mins === 'number' ? `${mins} min de lectura` : '—',
    href: `/articulos/${a.slug}`
  }
}

export function mapArticleToFeedItem(a) {
  const mins = a.readingTimeMinutes
  return {
    cat: a.categoryName || 'Análisis',
    categorySlug: categoryHrefSlug(a.categoryName, a.categorySlug),
    tags: tagLineFromNames(a.tagNames) || '—',
    title: a.title || '',
    excerpt: a.deck || '',
    date: formatArticleDate(a.publishedAt),
    time: typeof mins === 'number' ? `${mins} min` : '—',
    href: `/articulos/${a.slug}`
  }
}

/**
 * Fetches tag + articles for a tema page and returns the shape
 * the page component expects, or null if CMS is off / tag not found.
 */
export async function fetchTemaPageData(temaSlug) {
  const client = getSanityClient()
  if (!client) return null

  const [tag, totalCount, metaArticles] = await Promise.all([
    client.fetch(tagBySlugQuery, { slug: temaSlug }),
    client.fetch(countArticlesByTagSlugQuery, { tagSlug: temaSlug }),
    client.fetch(articlesByTagSlugRangeQuery, {
      tagSlug: temaSlug,
      start: 0,
      end: Math.max(FEED_FIRST_PEEK_DOCS, RELATED_ARTICLE_WINDOW)
    })
  ])

  if (!tag?.slug) return null

  const safeArticles = Array.isArray(metaArticles) ? metaArticles : []
  const nTotal = typeof totalCount === 'number' ? totalCount : 0

  const latest = safeArticles.length > 0
    ? formatArticleDate(safeArticles[0].publishedAt)
    : '—'

  const feedSlice = safeArticles.slice(1, 1 + FEED_PAGE_SIZE).map(mapArticleToFeedItem)
  const feedHasMore = nTotal > 1 + FEED_PAGE_SIZE

  return {
    label: tag.name,
    desc: tag.description || '',
    count: nTotal,
    latest,
    sections: deriveSections(safeArticles),
    related: deriveRelatedTags(safeArticles, tag.slug),
    hero: safeArticles.length > 0 ? mapArticleToHero(safeArticles[0]) : null,
    articles: feedSlice,
    feedHasMore
  }
}
