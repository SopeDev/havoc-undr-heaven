import { getSanityClient } from './client'
import { formatArticleDate } from './articleView'
import {
  articleBySlugQuery,
  articlesByCategorySlugAndTagSlugQuery,
  articlesByCategorySlugAndTagSlugRangeQuery,
  articlesByCategorySlugLimitedQuery,
  articlesByCategorySlugQuery,
  articlesByCategorySlugRangeQuery,
  articlesByTagSlugRangeQuery,
  articleSlugsQuery,
  categoryBySlugQuery,
  countArticlesByCategorySlugAndTagSlugQuery,
  countArticlesByCategorySlugQuery,
  homePageArticlesQuery,
  homePageArticlesRangeQuery,
  recentArticlesQuery,
  relatedArticlesQuery,
  searchArticlesQuery
} from './queries'

export async function fetchArticleBySlug(slug) {
  const client = getSanityClient()
  if (!client) return null
  return client.fetch(articleBySlugQuery, { slug })
}

export async function fetchArticleSlugs() {
  const client = getSanityClient()
  if (!client) return []
  return client.fetch(articleSlugsQuery)
}

export async function fetchRecentArticles(limit = 12) {
  const client = getSanityClient()
  if (!client) return []
  return client.fetch(recentArticlesQuery, { limit })
}

/**
 * @param {number} [limit]
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function fetchHomeArticles(limit = 12) {
  const client = getSanityClient()
  if (!client) return []
  const n = Math.max(1, Math.min(50, Number(limit) || 12))
  return client.fetch(homePageArticlesQuery, { limit: n })
}

/**
 * Homepage article rows for a half-open index range [start, end).
 * @param {number} start
 * @param {number} end
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function fetchHomeArticlesRange(start, end) {
  const client = getSanityClient()
  if (!client) return []
  const s = Math.max(0, Math.floor(Number(start) || 0))
  const e = Math.max(s, Math.floor(Number(end) || 0))
  if (e === s) return []
  return client.fetch(homePageArticlesRangeQuery, { start: s, end: e })
}

/**
 * @param {string} categorySlug
 * @param {number} start
 * @param {number} end
 * @param {{ tagSlug?: string }} [options]
 */
export async function fetchArticlesByCategoryRange(categorySlug, start, end, options = {}) {
  const client = getSanityClient()
  if (!client) return []
  const s = Math.max(0, Math.floor(Number(start) || 0))
  const e = Math.max(s, Math.floor(Number(end) || 0))
  if (e === s) return []
  const tagSlug = typeof options.tagSlug === 'string' && options.tagSlug.trim() ? options.tagSlug.trim() : null
  if (tagSlug) {
    return client.fetch(articlesByCategorySlugAndTagSlugRangeQuery, {
      categorySlug,
      tagSlug,
      start: s,
      end: e
    })
  }
  return client.fetch(articlesByCategorySlugRangeQuery, { categorySlug, start: s, end: e })
}

/**
 * @param {string} categorySlug
 * @param {{ tagSlug?: string }} [options]
 * @returns {Promise<number>}
 */
export async function countArticlesByCategorySlug(categorySlug, options = {}) {
  const client = getSanityClient()
  if (!client) return 0
  const tagSlug = typeof options.tagSlug === 'string' && options.tagSlug.trim() ? options.tagSlug.trim() : null
  const n = tagSlug
    ? await client.fetch(countArticlesByCategorySlugAndTagSlugQuery, { categorySlug, tagSlug })
    : await client.fetch(countArticlesByCategorySlugQuery, { categorySlug })
  return typeof n === 'number' ? n : 0
}

/**
 * @param {string} tagSlug
 * @param {number} start
 * @param {number} end
 */
export async function fetchArticlesByTagSlugRange(tagSlug, start, end) {
  const client = getSanityClient()
  if (!client) return []
  const slug = typeof tagSlug === 'string' && tagSlug.trim() ? tagSlug.trim() : ''
  if (!slug) return []
  const s = Math.max(0, Math.floor(Number(start) || 0))
  const e = Math.max(s, Math.floor(Number(end) || 0))
  if (e === s) return []
  return client.fetch(articlesByTagSlugRangeQuery, { tagSlug: slug, start: s, end: e })
}

export async function fetchRelatedArticles(slug) {
  const client = getSanityClient()
  if (!client) return []
  return client.fetch(relatedArticlesQuery, { slug })
}

export async function fetchCategoryBySlug(slug) {
  const client = getSanityClient()
  if (!client) return null
  return client.fetch(categoryBySlugQuery, { slug })
}

/**
 * @param {string} categorySlug
 * @param {{ tagSlug?: string }} [options] - When set, only articles that reference a tag with this slug
 */
export async function fetchArticlesByCategorySlug(categorySlug, options = {}) {
  const client = getSanityClient()
  if (!client) return []
  const tagSlug = typeof options.tagSlug === 'string' && options.tagSlug.trim() ? options.tagSlug.trim() : null
  if (tagSlug) {
    return client.fetch(articlesByCategorySlugAndTagSlugQuery, { categorySlug, tagSlug })
  }
  return client.fetch(articlesByCategorySlugQuery, { categorySlug })
}

/**
 * @param {string} categorySlug
 * @param {number} [limit]
 */
export async function fetchArticlesByCategorySlugLimited(categorySlug, limit = 3) {
  const client = getSanityClient()
  if (!client) return []
  const n = Math.max(1, Math.min(20, Number(limit) || 3))
  return client.fetch(articlesByCategorySlugLimitedQuery, { categorySlug, limit: n })
}

/**
 * @returns {Array<{ cat: string, tags: string, title: string, excerpt: string, date: string, ts: number, time: string, url: string }>}
 */
export async function fetchArticlesForSearch() {
  const client = getSanityClient()
  if (!client) return []
  const rows = await client.fetch(searchArticlesQuery)
  return rows.map(doc => {
    const publishedAt = doc.publishedAt
    const sec = publishedAt ? Math.floor(new Date(publishedAt).getTime() / 1000) : 0
    const time =
      typeof doc.readingTimeMinutes === 'number' ? `${doc.readingTimeMinutes} min` : '—'
    const tagLine = Array.isArray(doc.tagNames)
      ? doc.tagNames.filter(Boolean).join(' · ')
      : ''
    return {
      cat: doc.cat || 'Análisis',
      tags: tagLine || '—',
      title: doc.title || '',
      excerpt: doc.deck || '',
      date: formatArticleDate(publishedAt),
      ts: sec,
      time,
      url: `/articulos/${doc.slug}`
    }
  })
}
