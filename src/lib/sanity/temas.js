import { getSanityClient } from './client'
import { formatArticleDate } from './articleView'
import {
  tagBySlugQuery,
  articlesByTagSlugQuery,
  focosByTagSlugQuery
} from './queries'

const FOCO_DOT_COLOR = {
  hot: 'var(--red)',
  warm: 'var(--orange)',
  cold: 'var(--blue)'
}

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
    tags: tagLineFromNames(a.tagNames) || '—',
    title: a.title || '',
    deck: a.deck || '',
    date: formatArticleDate(a.publishedAt),
    time: typeof mins === 'number' ? `${mins} min de lectura` : '—',
    href: `/articulos/${a.slug}`
  }
}

function mapArticleToFeedItem(a) {
  const mins = a.readingTimeMinutes
  return {
    cat: a.categoryName || 'Análisis',
    tags: tagLineFromNames(a.tagNames) || '—',
    title: a.title || '',
    excerpt: a.deck || '',
    date: formatArticleDate(a.publishedAt),
    time: typeof mins === 'number' ? `${mins} min` : '—',
    href: `/articulos/${a.slug}`
  }
}

function mapFocoToSidebar(f) {
  const status = f.status === 'hot' || f.status === 'cold' ? f.status : 'warm'
  const tagNames = Array.isArray(f.tagNames) ? f.tagNames.filter(Boolean) : []
  const lines = Array.isArray(f.titleLines)
    ? f.titleLines.filter(x => typeof x === 'string' && x.trim())
    : []
  const name = lines.length > 0 ? lines.join(' ') : f.title || f.slug
  const region =
    (typeof f.regionLineOverride === 'string' && f.regionLineOverride.trim()) ||
    (tagNames.length ? tagNames.join(' · ') : '—')
  return {
    name,
    region,
    color: FOCO_DOT_COLOR[status] || FOCO_DOT_COLOR.warm,
    slug: f.slug
  }
}

/**
 * Fetches tag + articles + focos for a tema page and returns the shape
 * the page component expects, or null if CMS is off / tag not found.
 */
export async function fetchTemaPageData(temaSlug) {
  const client = getSanityClient()
  if (!client) return null

  const [tag, articles, focos] = await Promise.all([
    client.fetch(tagBySlugQuery, { slug: temaSlug }),
    client.fetch(articlesByTagSlugQuery, { tagSlug: temaSlug }),
    client.fetch(focosByTagSlugQuery, { tagSlug: temaSlug })
  ])

  if (!tag?.slug) return null

  const safeArticles = Array.isArray(articles) ? articles : []
  const safeFocos = Array.isArray(focos) ? focos : []

  const latest = safeArticles.length > 0
    ? formatArticleDate(safeArticles[0].publishedAt)
    : '—'

  return {
    label: tag.name,
    desc: tag.description || '',
    count: safeArticles.length,
    latest,
    sections: deriveSections(safeArticles),
    related: deriveRelatedTags(safeArticles, tag.slug),
    hero: safeArticles.length > 0 ? mapArticleToHero(safeArticles[0]) : null,
    articles: safeArticles.slice(1).map(mapArticleToFeedItem),
    sidebar: safeArticles.slice(1, 4).map(a => ({
      tags: tagLineFromNames(a.tagNames) || '—',
      title: a.title || '',
      date: formatArticleDate(a.publishedAt)
    })),
    focos: safeFocos.map(mapFocoToSidebar)
  }
}
