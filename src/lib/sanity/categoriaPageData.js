import { CATEGORY_DATA } from '../../app/categoria/categoriaMockData'
import { formatArticleDate } from './articleView'

function tagLineFromDoc(doc) {
  return Array.isArray(doc.tagNames) ? doc.tagNames.filter(Boolean).join(' · ') : ''
}

function mapDocToHero(doc, sectionTitle) {
  const mins = doc.readingTimeMinutes
  const timeRead = typeof mins === 'number' ? `${mins} min de lectura` : '—'
  return {
    cat: doc.categoryName || sectionTitle,
    topic: tagLineFromDoc(doc) || '—',
    title: doc.title || '',
    deck: doc.deck || '',
    date: formatArticleDate(doc.publishedAt),
    time: timeRead,
    href: `/articulos/${doc.slug}`
  }
}

function mapDocToItem(doc, sectionTitle) {
  const mins = doc.readingTimeMinutes
  const timeShort = typeof mins === 'number' ? `${mins} min` : '—'
  return {
    cat: doc.categoryName || sectionTitle,
    topic: tagLineFromDoc(doc) || '—',
    title: doc.title || '',
    excerpt: doc.deck || '',
    date: formatArticleDate(doc.publishedAt),
    time: timeShort,
    href: `/articulos/${doc.slug}`
  }
}

function normalizeTopic(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function topicLineMatchesLabel(topicLine, label) {
  if (!label) return true
  return normalizeTopic(topicLine).includes(normalizeTopic(label))
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

function filterMockCategory(mock, temaLabel) {
  if (!temaLabel) return { mockSlice: mock, feedEmpty: false }

  const heroOk = topicLineMatchesLabel(mock.hero.topic, temaLabel)
  const itemMatches = mock.items.filter(i => topicLineMatchesLabel(i.topic, temaLabel))

  if (!heroOk && itemMatches.length === 0) {
    return {
      mockSlice: {
        ...mock,
        stats: [
          { label: 'Artículos publicados', val: '0' },
          { label: 'Más reciente', val: '—' },
          mock.stats[2]
        ],
        hero: null,
        items: []
      },
      feedEmpty: true
    }
  }

  if (heroOk) {
    return {
      mockSlice: {
        ...mock,
        stats: [
          { label: 'Artículos publicados', val: String(1 + itemMatches.length) },
          { label: 'Más reciente', val: mock.hero.date },
          mock.stats[2]
        ],
        hero: mock.hero,
        items: itemMatches
      },
      feedEmpty: false
    }
  }

  const [first, ...rest] = itemMatches
  return {
    mockSlice: {
      ...mock,
      stats: [
        { label: 'Artículos publicados', val: String(itemMatches.length) },
        { label: 'Más reciente', val: first.date },
        mock.stats[2]
      ],
      hero: {
        cat: first.cat,
        topic: first.topic,
        title: first.title,
        deck: first.excerpt,
        date: first.date,
        time: /min/.test(first.time) ? `${first.time} de lectura` : `${first.time} min de lectura`,
        href: first.href
      },
      items: rest
    },
    feedEmpty: false
  }
}

/**
 * @param {string} key - URL segment: analisis | reflexiones | newsletter | redes
 * @param {{ name?: string, description?: string } | null} sanityCategory
 * @param {Array<Record<string, unknown>>} sanityArticles
 * @param {{ tagFilterActive?: boolean, sanityConfigured?: boolean, temaLabel?: string | null, crossCategorySidebarArticles?: Array<Record<string, unknown>> | null, crossCategoryTitle?: string | null }} [ctx]
 */
export function mergeCategoriaPage(key, sanityCategory, sanityArticles, ctx = {}) {
  const {
    tagFilterActive = false,
    sanityConfigured = false,
    temaLabel = null,
    crossCategorySidebarArticles = null,
    crossCategoryTitle = null
  } = ctx
  const mock = CATEGORY_DATA[key] || null
  const title = sanityCategory?.name?.trim() || mock?.title || 'Categoría'
  const desc = sanityCategory?.description?.trim() || mock?.desc || ''
  const thirdStat = mock?.stats?.[2] || { label: 'Secciones', val: '—' }

  if (sanityArticles.length > 0) {
    const hero = mapDocToHero(sanityArticles[0], title)
    const items = sanityArticles.slice(1).map(d => mapDocToItem(d, title))
    const latest = formatArticleDate(sanityArticles[0].publishedAt)
    const stats = [
      { label: 'Artículos publicados', val: String(sanityArticles.length) },
      { label: 'Más reciente', val: latest },
      { label: thirdStat.label, val: thirdStat.val }
    ]
    const { sidebar, sidebarSectionTitle } = buildCrossCategorySidebar(
      crossCategorySidebarArticles,
      crossCategoryTitle
    )

    return { title, desc, stats, hero, items, sidebar, sidebarSectionTitle, feedEmpty: false }
  }

  if (tagFilterActive && sanityConfigured) {
    const { sidebar, sidebarSectionTitle } = buildCrossCategorySidebar(
      crossCategorySidebarArticles,
      crossCategoryTitle
    )
    return {
      title,
      desc,
      stats: [
        { label: 'Artículos publicados', val: '0' },
        { label: 'Más reciente', val: '—' },
        { label: thirdStat.label, val: thirdStat.val }
      ],
      hero: null,
      items: [],
      sidebar,
      sidebarSectionTitle,
      feedEmpty: true
    }
  }

  if (tagFilterActive && temaLabel) {
    if (!mock) {
      return {
        title,
        desc,
        stats: [
          { label: 'Artículos publicados', val: '0' },
          { label: 'Más reciente', val: '—' },
          thirdStat
        ],
        hero: null,
        items: [],
        sidebar: null,
        sidebarSectionTitle: null,
        feedEmpty: true
      }
    }
    const { mockSlice, feedEmpty } = filterMockCategory(mock, temaLabel)
    return {
      title,
      desc,
      stats: mockSlice.stats,
      hero: mockSlice.hero,
      items: mockSlice.items,
      sidebar: null,
      sidebarSectionTitle: null,
      feedEmpty
    }
  }

  return {
    title,
    desc,
    stats: mock?.stats || [thirdStat],
    hero: mock?.hero || null,
    items: mock?.items || [],
    sidebar: null,
    sidebarSectionTitle: null,
    feedEmpty: false
  }
}
