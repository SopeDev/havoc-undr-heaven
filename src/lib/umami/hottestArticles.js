import { unstable_cache } from 'next/cache'

/** Rolling window for Umami traffic (ms). */
export const HOTTEST_WINDOW_DAYS = 7

/** Exponential decay half-life for article age (days). Larger → older pieces stay competitive longer. */
export const HOTTEST_PUBLISH_HALF_LIFE_DAYS = 14

/** Weight for unique visitors vs raw pageviews in the traffic term. */
export const HOTTEST_VISITOR_WEIGHT = 0.6

/** Small boost so very new posts appear before they have stats (decays by publish age). */
export const HOTTEST_NEW_BOOST_MAX = 2.5

/** Half-life (days) for the “new article” boost. */
export const HOTTEST_NEW_BOOST_HALF_LIFE_DAYS = 4

/** Sanity pool size when ranking (candidates for hottest). */
export const HOTTEST_SANITY_POOL = 40

/** How many items the home aside requests. */
export const HOTTEST_ASIDE_LIMIT = 5

const MS_PER_DAY = 86400000

function getUmamiApiBase() {
  return (process.env.UMAMI_API_CLIENT_ENDPOINT || 'https://api.umami.is/v1').replace(/\/$/, '')
}

export function isUmamiAnalyticsConfigured() {
  return Boolean(process.env.UMAMI_API_KEY?.trim() && process.env.UMAMI_WEBSITE_ID?.trim())
}

/**
 * Traffic → slug map. Supports /articulos/[slug] and /articles/[slug]; strips trailing slashes and queries.
 * @param {Array<{ name?: string, pageviews?: number, visitors?: number }>} rows
 */
export function trafficBySlugFromPathMetrics(rows) {
  /** @type {Record<string, { pageviews: number, visitors: number }>} */
  const acc = {}
  if (!Array.isArray(rows)) return acc

  for (const row of rows) {
    const slug = slugFromPathMetricName(row?.name ?? row?.x)
    if (!slug) continue
    const pv = Number(row?.pageviews) || 0
    const vis = Number(row?.visitors) || 0
    if (!acc[slug]) acc[slug] = { pageviews: 0, visitors: 0 }
    acc[slug].pageviews += pv
    acc[slug].visitors += vis
  }
  return acc
}

export function slugFromPathMetricName(name) {
  if (!name || typeof name !== 'string') return null
  let path = name.split('?')[0].split('#')[0].replace(/\/$/, '')
  if (!path.startsWith('/')) path = `/${path}`
  const m = path.match(/\/(?:articulos|articles)\/([^/]+)$/i)
  if (!m) return null
  try {
    return decodeURIComponent(m[1]).toLowerCase()
  } catch {
    return m[1].toLowerCase()
  }
}

/**
 * @param {number} pageviews
 * @param {number} visitors
 * @param {number} publishedAtMs
 * @param {number} nowMs
 */
export function computeHotScore(pageviews, visitors, publishedAtMs, nowMs) {
  const traffic = pageviews + HOTTEST_VISITOR_WEIGHT * visitors
  const ageDays = publishedAtMs > 0 ? Math.max(0, (nowMs - publishedAtMs) / MS_PER_DAY) : HOTTEST_PUBLISH_HALF_LIFE_DAYS
  const publishDecay = Math.exp(-ageDays / HOTTEST_PUBLISH_HALF_LIFE_DAYS)
  const newBoost =
    publishedAtMs > 0
      ? HOTTEST_NEW_BOOST_MAX * Math.exp(-ageDays / HOTTEST_NEW_BOOST_HALF_LIFE_DAYS)
      : 0
  return traffic * publishDecay + newBoost
}

async function fetchUmamiPathMetricsExpandedOnce() {
  const key = process.env.UMAMI_API_KEY?.trim()
  const website = process.env.UMAMI_WEBSITE_ID?.trim()
  if (!key || !website) return null

  const endAt = Date.now()
  const startAt = endAt - HOTTEST_WINDOW_DAYS * MS_PER_DAY
  const region = process.env.UMAMI_API_REGION?.trim()
  const base = region ? `${getUmamiApiBase()}/${region.replace(/^\//, '')}` : getUmamiApiBase()

  const url = `${base}/websites/${encodeURIComponent(website)}/metrics/expanded?${new URLSearchParams({
    startAt: String(startAt),
    endAt: String(endAt),
    type: 'path',
    limit: '500'
  })}`

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'x-umami-api-key': key
    }
  })

  if (!res.ok) return null
  const data = await res.json()
  return Array.isArray(data) ? data : null
}

const fetchCachedPathMetricsExpanded = unstable_cache(
  async () => fetchUmamiPathMetricsExpandedOnce(),
  ['umami-path-metrics-expanded'],
  { revalidate: 300 }
)

/**
 * Returns ranked Sanity article docs for the aside (caller maps with mapRawDocToHomeRow).
 * @param {Array<Record<string, unknown>>} rawDocs sanity home article rows (with slug, publishedAt, …)
 * @param {Set<string>} excludedSlugs
 * @param {number} [limit]
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function getHottestSidebarRawDocs(rawDocs, excludedSlugs, limit = HOTTEST_ASIDE_LIMIT) {
  if (!isUmamiAnalyticsConfigured() || !Array.isArray(rawDocs) || rawDocs.length === 0) return []

  let metrics
  try {
    metrics = await fetchCachedPathMetricsExpanded()
  } catch {
    return []
  }
  if (!metrics) return []

  const trafficBySlug = trafficBySlugFromPathMetrics(metrics)
  const now = Date.now()

  const excluded = new Set([...excludedSlugs].map(s => String(s).toLowerCase()))

  const scored = rawDocs
    .map(doc => {
      const slug = typeof doc.slug === 'string' ? doc.slug.toLowerCase() : null
      if (!slug || excluded.has(slug)) return null
      const pub = doc.publishedAt ? new Date(doc.publishedAt).getTime() : 0
      const t = trafficBySlug[slug] || { pageviews: 0, visitors: 0 }
      const score = computeHotScore(t.pageviews, t.visitors, pub, now)
      return { doc, score }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return scored.map(({ doc }) => doc)
}
