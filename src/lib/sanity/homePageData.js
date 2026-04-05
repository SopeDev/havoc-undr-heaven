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
  const [nav, docs, focos, dispatchItems] = await Promise.all([
    fetchNavLists(),
    fetchHomeArticles(8),
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

  const { hero, feedItems, sidebarArticles } = partitionHomeArticles(articleRows)

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
