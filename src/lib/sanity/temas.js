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

function tagLineFromNames(names) {
  return Array.isArray(names) ? names.filter(Boolean).join(' · ') : ''
}

function deriveRelatedTags(articles, currentTagName) {
  const current = (currentTagName || '').toLowerCase()
  const seen = new Set()
  const result = []
  for (const a of articles) {
    if (!Array.isArray(a.tagNames)) continue
    for (const t of a.tagNames) {
      if (!t || t.toLowerCase() === current || seen.has(t)) continue
      seen.add(t)
      result.push(t)
    }
  }
  return result.slice(0, 8)
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
    related: deriveRelatedTags(safeArticles, tag.name),
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
