import { FEED_PAGE_SIZE } from '../feedPagination'
import { categoryHrefSlug, formatArticleDate } from './articleView'

function tagLineFromDoc(doc) {
  return Array.isArray(doc.tagNames) ? doc.tagNames.filter(Boolean).join(' · ') : ''
}

function mapDocToHero(doc, sectionTitle) {
  const mins = doc.readingTimeMinutes
  const timeRead = typeof mins === 'number' ? `${mins} min de lectura` : '—'
  return {
    cat: doc.categoryName || sectionTitle,
    categorySlug: categoryHrefSlug(doc.categoryName, doc.categorySlug),
    topic: tagLineFromDoc(doc) || '—',
    title: doc.title || '',
    deck: doc.deck || '',
    date: formatArticleDate(doc.publishedAt),
    time: timeRead,
    href: `/articulos/${doc.slug}`
  }
}

export function mapDocToItem(doc, sectionTitle) {
  const mins = doc.readingTimeMinutes
  const timeShort = typeof mins === 'number' ? `${mins} min` : '—'
  return {
    cat: doc.categoryName || sectionTitle,
    categorySlug: categoryHrefSlug(doc.categoryName, doc.categorySlug),
    topic: tagLineFromDoc(doc) || '—',
    title: doc.title || '',
    excerpt: doc.deck || '',
    date: formatArticleDate(doc.publishedAt),
    time: timeShort,
    href: `/articulos/${doc.slug}`
  }
}

function buildCrossCategorySidebar(docs, crossCategoryTitle) {
  if (!Array.isArray(docs) || docs.length === 0) {
    return { sidebar: null, sidebarSectionTitle: null }
  }
  return {
    sidebar: docs.map(d => ({
      tags: tagLineFromDoc(d) || '—',
      title: d.title,
      date: formatArticleDate(d.publishedAt),
      href: `/articulos/${d.slug}`
    })),
    sidebarSectionTitle: crossCategoryTitle || null
  }
}

const emptyStats = thirdStat => [
  { label: 'Artículos publicados', val: '0' },
  { label: 'Más reciente', val: '—' },
  thirdStat
]

/**
 * @param {{ name?: string, description?: string } | null} sanityCategory
 * @param {Array<Record<string, unknown>>} sanityArticles
 * @param {{ tagFilterActive?: boolean, sanityConfigured?: boolean, crossCategorySidebarArticles?: Array<Record<string, unknown>> | null, crossCategoryTitle?: string | null, articleTotalCount?: number }} [ctx]
 */
export function mergeCategoriaPage(sanityCategory, sanityArticles, ctx = {}) {
  const {
    tagFilterActive = false,
    sanityConfigured = false,
    crossCategorySidebarArticles = null,
    crossCategoryTitle = null,
    articleTotalCount: articleTotalCountOpt = null
  } = ctx
  const title = sanityCategory?.name?.trim() || 'Categoría'
  const desc = sanityCategory?.description?.trim() || ''
  const thirdStat = { label: 'Secciones', val: '—' }
  const cross = buildCrossCategorySidebar(crossCategorySidebarArticles, crossCategoryTitle)

  if (sanityArticles.length > 0) {
    const hero = mapDocToHero(sanityArticles[0], title)
    const items = sanityArticles
      .slice(1, 1 + FEED_PAGE_SIZE)
      .map(d => mapDocToItem(d, title))
    const latest = formatArticleDate(sanityArticles[0].publishedAt)
    const totalArticles =
      typeof articleTotalCountOpt === 'number' ? articleTotalCountOpt : sanityArticles.length
    const stats = [
      { label: 'Artículos publicados', val: String(totalArticles) },
      { label: 'Más reciente', val: latest },
      thirdStat
    ]
    return {
      title,
      desc,
      stats,
      hero,
      items,
      sidebar: cross.sidebar,
      sidebarSectionTitle: cross.sidebarSectionTitle,
      feedEmpty: false,
      feedHasMore: totalArticles > 1 + FEED_PAGE_SIZE
    }
  }

  if (tagFilterActive && sanityConfigured) {
    return {
      title,
      desc,
      stats: emptyStats(thirdStat),
      hero: null,
      items: [],
      sidebar: cross.sidebar,
      sidebarSectionTitle: cross.sidebarSectionTitle,
      feedEmpty: true,
      feedHasMore: false
    }
  }

  return {
    title,
    desc,
    stats: emptyStats(thirdStat),
    hero: null,
    items: [],
    sidebar: cross.sidebar,
    sidebarSectionTitle: cross.sidebarSectionTitle,
    feedEmpty: true,
    feedHasMore: false
  }
}
