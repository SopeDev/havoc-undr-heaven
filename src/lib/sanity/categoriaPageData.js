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
 * @param {string} key - URL segment: analisis | reflexion | newsletter | redes
 * @param {{ name?: string, description?: string } | null} sanityCategory
 * @param {Array<Record<string, unknown>>} sanityArticles
 * @param {{ tagFilterActive?: boolean, sanityConfigured?: boolean, temaLabel?: string | null }} [ctx]
 */
export function mergeCategoriaPage(key, sanityCategory, sanityArticles, ctx = {}) {
  const { tagFilterActive = false, sanityConfigured = false, temaLabel = null } = ctx
  const mock = CATEGORY_DATA[key]
  const title = sanityCategory?.name?.trim() || mock.title
  const desc = sanityCategory?.description?.trim() || mock.desc

  if (sanityArticles.length > 0) {
    const hero = mapDocToHero(sanityArticles[0], title)
    const items = sanityArticles.slice(1).map(d => mapDocToItem(d, title))
    const latest = formatArticleDate(sanityArticles[0].publishedAt)
    const stats = [
      { label: 'Artículos publicados', val: String(sanityArticles.length) },
      { label: 'Más reciente', val: latest },
      { label: mock.stats[2].label, val: mock.stats[2].val }
    ]
    const sidebar =
      sanityArticles.length > 1
        ? sanityArticles.slice(1, 4).map(d => ({
            tags: tagLineFromDoc(d) || '—',
            title: d.title,
            date: formatArticleDate(d.publishedAt),
            href: `/articulos/${d.slug}`
          }))
        : null

    return { title, desc, stats, hero, items, sidebar, feedEmpty: false }
  }

  if (tagFilterActive && sanityConfigured) {
    return {
      title,
      desc,
      stats: [
        { label: 'Artículos publicados', val: '0' },
        { label: 'Más reciente', val: '—' },
        { label: mock.stats[2].label, val: mock.stats[2].val }
      ],
      hero: null,
      items: [],
      sidebar: null,
      feedEmpty: true
    }
  }

  if (tagFilterActive && temaLabel) {
    const { mockSlice, feedEmpty } = filterMockCategory(mock, temaLabel)
    return {
      title,
      desc,
      stats: mockSlice.stats,
      hero: mockSlice.hero,
      items: mockSlice.items,
      sidebar: null,
      feedEmpty
    }
  }

  return {
    title,
    desc,
    stats: mock.stats,
    hero: mock.hero,
    items: mock.items,
    sidebar: null,
    feedEmpty: false
  }
}
