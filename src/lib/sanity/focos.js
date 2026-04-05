import { getSanityClient } from './client'
import { formatArticleDate } from './articleView'
import {
  articlesForFocoTagsQuery,
  articlesTagRefsQuery,
  focoBySlugQuery,
  focosIndexListQuery,
  focosLatestByUpdatedQuery
} from './queries'

const SIDEBAR_STATUS_COLOR = {
  hot: 'var(--red)',
  warm: 'var(--orange)',
  cold: 'var(--blue)'
}

function defaultStatusLabel(status) {
  if (status === 'hot') return 'Activo'
  if (status === 'cold') return 'Latente'
  return 'Tensión Elevada'
}

function normalizeKind(status) {
  return status === 'hot' || status === 'cold' ? status : 'warm'
}

function countMatchingArticles(tagIds, articleRows) {
  if (!Array.isArray(tagIds) || tagIds.length === 0) return 0
  const set = new Set(tagIds)
  let n = 0
  for (const row of articleRows) {
    const refs = row?.tagRefs
    if (!Array.isArray(refs)) continue
    if (refs.some(ref => set.has(ref))) n += 1
  }
  return n
}

/**
 * @param {Record<string, unknown>} doc
 * @param {number} articleCount
 */
export function mapSanityFocoToIndexCard(doc, articleCount) {
  const kind = normalizeKind(doc.status)
  const tagNames = Array.isArray(doc.tagNames) ? doc.tagNames.filter(Boolean) : []
  const regionLine =
    (typeof doc.regionLineOverride === 'string' && doc.regionLineOverride.trim()) ||
    (tagNames.length ? tagNames.join(' · ') : '—')
  const title = typeof doc.title === 'string' ? doc.title.trim() : ''
  const lines = Array.isArray(doc.titleLines) ? doc.titleLines.filter(x => typeof x === 'string' && x.trim()) : []
  const titleLines = lines.length > 0 ? lines : title ? [title] : [String(doc.slug || '')]

  return {
    slug: doc.slug,
    kind,
    label:
      (typeof doc.statusLabel === 'string' && doc.statusLabel.trim()) || defaultStatusLabel(kind),
    titleLines,
    regionLine,
    summary: typeof doc.summary === 'string' ? doc.summary : '',
    updated: formatArticleDate(doc.updatedAt),
    articleCount,
    featured: Boolean(doc.featured)
  }
}

/**
 * @returns {Promise<{ cards: ReturnType<typeof mapSanityFocoToIndexCard>[], stats: { total: number, hot: number, warm: number, cold: number, lastUpdatedLabel: string } } | null>}
 */
export async function fetchFocosIndexData() {
  const client = getSanityClient()
  if (!client) return null

  const [focoDocs, articleRows] = await Promise.all([
    client.fetch(focosIndexListQuery),
    client.fetch(articlesTagRefsQuery)
  ])

  if (!Array.isArray(focoDocs) || focoDocs.length === 0) return null

  const articles = Array.isArray(articleRows) ? articleRows : []
  let latestIso = null

  const cards = focoDocs.map(doc => {
    if (doc.updatedAt && (!latestIso || new Date(doc.updatedAt) > new Date(latestIso))) {
      latestIso = doc.updatedAt
    }
    const count = countMatchingArticles(doc.tagIds, articles)
    return mapSanityFocoToIndexCard(doc, count)
  })

  const hot = cards.filter(c => c.kind === 'hot').length
  const warm = cards.filter(c => c.kind === 'warm').length
  const cold = cards.filter(c => c.kind === 'cold').length

  return {
    cards,
    stats: {
      total: cards.length,
      hot,
      warm,
      cold,
      lastUpdatedLabel: formatArticleDate(latestIso)
    }
  }
}

/**
 * @param {NonNullable<Awaited<ReturnType<typeof fetchFocosIndexData>>>['cards']} cards
 */
export function pickFeaturedIndexCard(cards) {
  if (!cards?.length) return null
  const flagged = cards.find(c => c.featured)
  return flagged || cards[0]
}

const STANCE_UI = {
  aggressive: { stanceClass: 'stance-agresivo', label: 'Asertivo' },
  defensive: { stanceClass: 'stance-defensivo', label: 'Defensivo' },
  ambiguous: { stanceClass: 'stance-ambiguo', label: 'Ambiguo' },
  observer: { stanceClass: 'stance-observador', label: 'Observador activo' }
}

function stanceLabelWithPrefix(label) {
  return `Postura: ${label}`
}

function extractFocoContextPortable(doc) {
  const raw = doc?.contextPortable ?? doc?.context
  if (!Array.isArray(raw) || raw.length === 0) return null
  const blocks = raw.filter(
    item =>
      item &&
      typeof item === 'object' &&
      (item._type === 'block' || item._type === 'image')
  )
  return blocks.length > 0 ? blocks : null
}

const TIMELINE_DOT_BY_ACCENT = {
  hot: 'var(--red)',
  warm: 'var(--orange)',
  cold: 'var(--blue)'
}

function valClassFromLevel(level) {
  if (level === 'high') return 'val-high'
  if (level === 'low') return 'val-low'
  return 'val-med'
}

function tensionLevelLabel(level) {
  if (level === 'high') return 'Alta'
  if (level === 'low') return 'Baja'
  return 'Media'
}

function regionLineFromDoc(doc) {
  const tagNames = Array.isArray(doc.tagNames) ? doc.tagNames.filter(Boolean) : []
  const override =
    typeof doc.regionLineOverride === 'string' && doc.regionLineOverride.trim()
      ? doc.regionLineOverride.trim()
      : ''
  if (override) return override
  if (tagNames.length) return tagNames.join(' · ')
  return '—'
}

function titleLinesFromDoc(doc) {
  const title = typeof doc.title === 'string' ? doc.title.trim() : ''
  const lines = Array.isArray(doc.titleLines)
    ? doc.titleLines.filter(x => typeof x === 'string' && x.trim())
    : []
  if (lines.length > 0) return lines
  if (title) return [title]
  return [String(doc.slug || '')]
}

function archivoCatFromArticle(row) {
  if (row.isNewsletterEdition) return 'Newsletter'
  const n = row.categoryName || 'Análisis'
  if (n === 'Reflexiones' || n === 'Reflexión') return 'Reflexiones'
  if (n === 'Newsletter' || n === 'Análisis') return n
  return 'Análisis'
}

function mapArticlesToArchivo(rows) {
  if (!Array.isArray(rows)) return []
  return rows.map(row => {
    const cat = archivoCatFromArticle(row)
    const dateStr = formatArticleDate(row.publishedAt)
    const mins = row.readingTimeMinutes
    const meta =
      mins && Number(mins) > 0 ? `${dateStr} · ${mins} min de lectura` : dateStr || '—'
    return {
      cat,
      title: row.title || 'Sin título',
      excerpt: typeof row.deck === 'string' ? row.deck : '',
      meta,
      href: `/articulos/${row.slug}`
    }
  })
}

function defaultActorsFallback() {
  return [
    {
      name: 'Actores regionales',
      role: 'Completá actores en Sanity para este foco.',
      stanceClass: 'stance-observador',
      stanceLabel: stanceLabelWithPrefix(STANCE_UI.observer.label)
    }
  ]
}

function defaultIndicatorsFallback() {
  return [
    { label: 'Actividad', val: '—', valClass: 'val-med' },
    { label: 'Diplomacia', val: '—', valClass: 'val-med' },
    { label: 'Riesgo', val: '—', valClass: 'val-med' }
  ]
}

function mapSanityActors(actors) {
  if (!Array.isArray(actors) || actors.length === 0) return defaultActorsFallback()
  return actors.map(a => {
    const stance = typeof a?.stance === 'string' ? a.stance : 'observer'
    const ui = STANCE_UI[stance] || STANCE_UI.observer
    return {
      name: typeof a?.name === 'string' ? a.name : '—',
      role: typeof a?.role === 'string' ? a.role : '',
      stanceClass: ui.stanceClass,
      stanceLabel: stanceLabelWithPrefix(ui.label)
    }
  })
}

function mapSanityIndicators(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return defaultIndicatorsFallback()
  return rows.map(r => ({
    label: typeof r?.label === 'string' ? r.label : '—',
    val: tensionLevelLabel(r?.level),
    valClass: valClassFromLevel(r?.level)
  }))
}

function mapSanityKeyFigures(rows, updatedLabel) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [
      { name: 'Actualización HUH', val: updatedLabel, valClass: '' },
      { name: 'Indicador clave', val: '—', valClass: '' }
    ]
  }
  return rows.map(r => ({
    name: typeof r?.label === 'string' ? r.label : '—',
    val: typeof r?.value === 'string' ? r.value : '—',
    valClass: r?.level ? valClassFromLevel(r.level) : ''
  }))
}

function mapSanityTimeline(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return []
  return rows.map(t => {
    const accent = t?.accent === 'hot' || t?.accent === 'cold' ? t.accent : 'warm'
    return {
      date: typeof t?.periodLabel === 'string' ? t.periodLabel : '—',
      dot: TIMELINE_DOT_BY_ACCENT[accent],
      title: typeof t?.title === 'string' ? t.title : '—',
      text: typeof t?.text === 'string' ? t.text : ''
    }
  })
}

function mapContextReadings(readings) {
  if (!Array.isArray(readings) || readings.length === 0) return []
  return readings.map(r => ({
    title: typeof r?.title === 'string' ? r.title : '',
    subtitle: typeof r?.subtitle === 'string' ? r.subtitle : ''
  }))
}

function mapRelatedFocos(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return []
  return rows
    .filter(r => r?.slug)
    .map(r => {
      const lines = titleLinesFromDoc(r)
      const name = lines.join(' ')
      const tagNames = Array.isArray(r.tagNames) ? r.tagNames.filter(Boolean) : []
      const region =
        typeof r.regionLineOverride === 'string' && r.regionLineOverride.trim()
          ? r.regionLineOverride.trim()
          : tagNames.length
            ? tagNames.join(' · ')
            : '—'
      const status = r.status === 'hot' || r.status === 'cold' ? r.status : 'warm'
      return {
        slug: r.slug,
        status,
        name,
        region,
        summary: typeof r.summary === 'string' ? r.summary : ''
      }
    })
}

/**
 * Shape expected by FocoDetailClient (+ contextPortable for Sanity blockContent).
 * @param {Record<string, unknown>} doc
 * @param {unknown[]} articleRows
 */
export function mapSanityFocoToDetail(doc, articleRows) {
  const status = doc.status === 'hot' || doc.status === 'cold' ? doc.status : 'warm'
  const statusLabel =
    (typeof doc.statusLabel === 'string' && doc.statusLabel.trim()) || defaultStatusLabel(status)
  const updatedLabel = formatArticleDate(doc.updatedAt)
  const titleLines = titleLinesFromDoc(doc)
  const tagRefs = Array.isArray(doc.tagIds) ? doc.tagIds.filter(Boolean) : []

  const contextPortable = extractFocoContextPortable(doc)
  const contextReadings = mapContextReadings(doc.contextReadings)

  return {
    slug: doc.slug,
    status,
    articleCount: Array.isArray(articleRows) ? articleRows.length : 0,
    statusLabel,
    regionLine: regionLineFromDoc(doc),
    titleLines,
    summary: typeof doc.summary === 'string' ? doc.summary : '',
    updated: updatedLabel,
    actors: mapSanityActors(doc.actors),
    indicators: mapSanityIndicators(doc.tensionIndicators),
    keyFigures: mapSanityKeyFigures(doc.keyFigures, updatedLabel),
    signalQuote:
      typeof doc.signalQuote === 'string' && doc.signalQuote.trim()
        ? doc.signalQuote.trim()
        : 'Señal editorial pendiente en Sanity.',
    timeline: mapSanityTimeline(doc.timeline),
    archivo: mapArticlesToArchivo(articleRows),
    contexto: {
      paragraphs: [],
      readings: contextReadings.length > 0 ? contextReadings : []
    },
    contextPortable,
    related: mapRelatedFocos(doc.relatedFocos)
  }
}

/**
 * @param {string} slug
 * @returns {Promise<ReturnType<typeof mapSanityFocoToDetail> | null>}
 */
export async function fetchFocoDetailBySlug(slug) {
  const client = getSanityClient()
  if (!client || !slug) return null

  const doc = await client.fetch(focoBySlugQuery, { slug })
  if (!doc?.slug) return null

  const tagRefs = Array.isArray(doc.tagIds) ? doc.tagIds.filter(Boolean) : []
  const articleRows =
    tagRefs.length > 0
      ? await client.fetch(articlesForFocoTagsQuery, { tagRefs })
      : []

  return mapSanityFocoToDetail(doc, Array.isArray(articleRows) ? articleRows : [])
}

/**
 * Sidebar strip: latest focos by updatedAt (coalesced with _updatedAt in GROQ).
 * @param {number} [limit]
 * @returns {Promise<Array<{ name: string, region: string, color: string, slug: string, kind: 'hot' | 'warm' | 'cold' }>>}
 */
export async function fetchFocosSidebarByUpdated(limit = 4) {
  const client = getSanityClient()
  if (!client) return []
  const n = Math.max(1, Math.min(12, Number(limit) || 4))
  const rows = await client.fetch(focosLatestByUpdatedQuery, { limit: n })
  if (!Array.isArray(rows)) return []
  return rows.map(doc => {
    const kind = normalizeKind(doc.status)
    const tagNames = Array.isArray(doc.tagNames) ? doc.tagNames.filter(Boolean) : []
    const region =
      (typeof doc.regionLineOverride === 'string' && doc.regionLineOverride.trim()) ||
      (tagNames.length ? tagNames.join(' · ') : '—')
    const lines = Array.isArray(doc.titleLines)
      ? doc.titleLines.filter(x => typeof x === 'string' && x.trim())
      : []
    const titleBase = typeof doc.title === 'string' ? doc.title.trim() : ''
    const name = lines.length > 0 ? lines.join(' ') : titleBase || String(doc.slug || '')
    return {
      name,
      region,
      color: SIDEBAR_STATUS_COLOR[kind] || SIDEBAR_STATUS_COLOR.warm,
      slug: doc.slug,
      kind
    }
  })
}
