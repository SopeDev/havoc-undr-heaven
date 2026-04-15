import { isArticleWithheldFromWeb } from './articleVisibility'
import { getSanityClient } from './client'
import { urlForImage } from './image'
import { formatArticleDate } from './articleView'
import {
  latestNewsletterIssueForEmailQuery,
  nextNewsletterIssueForDispatchQuery,
  newsletterIssuesForWebQuery,
  newsletterIssuesHomeDispatchesQuery
} from './queries'

const HOME_DISPATCH_INTRO_MAX = 220

function isUsableArticleForNewsletterFeed(doc) {
  if (!doc || doc._type !== 'article') return false
  const slug = typeof doc.slug === 'string' ? doc.slug.trim() : ''
  if (!slug) return false
  return !isArticleWithheldFromWeb(doc)
}

/** Email + cron dispatch: include weekly-withheld pieces (released on successful send). */
function isUsableArticleForDispatch(doc) {
  if (!doc || doc._type !== 'article') return false
  const slug = typeof doc.slug === 'string' ? doc.slug.trim() : ''
  return Boolean(slug)
}

function visibleArticlesInIssue(issue) {
  const raw = issue?.articles
  if (!Array.isArray(raw)) return []
  return raw.filter(isUsableArticleForNewsletterFeed)
}

function articlesInIssueForDispatch(issue) {
  const raw = issue?.articles
  if (!Array.isArray(raw)) return []
  return raw.filter(isUsableArticleForDispatch)
}

/**
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function fetchNewsletterIssuesForWeb() {
  const client = getSanityClient()
  if (!client) return []
  const rows = await client.fetch(newsletterIssuesForWebQuery)
  if (!Array.isArray(rows)) return []
  return rows.map(issue => ({
    ...issue,
    articles: visibleArticlesInIssue(issue)
  }))
}

function truncateForCard(text, max = HOME_DISPATCH_INTRO_MAX) {
  const t = typeof text === 'string' ? text.trim() : ''
  if (!t) return ''
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`
}

/**
 * Maps a sent newsletter issue to the homepage Despachos card shape.
 * @param {Record<string, unknown>} issue
 * @returns {{ cat: string, topic: string, title: string, body: string, href: string } | null}
 */
export function mapNewsletterIssueToHomeDispatchItem(issue) {
  if (!issue || typeof issue._id !== 'string') return null
  const intro = typeof issue.intro === 'string' ? issue.intro.trim() : ''
  const fallbackBody =
    'Resumen semanal de geopolítica y el tablero internacional. Ver la edición en el archivo.'
  const body = truncateForCard(intro) || fallbackBody
  const title =
    (typeof issue.title === 'string' && issue.title.trim()) || 'Havoc Dispatch'
  return {
    cat: 'Dispatch',
    topic: formatArticleDate(issue.issuedAt),
    title,
    body,
    href: `/categoria/newsletter#issue-${issue._id}`
  }
}

/**
 * @returns {Promise<Array<{ cat: string, topic: string, title: string, body: string, href: string }>>}
 */
export async function fetchHomeDispatchItems() {
  const client = getSanityClient()
  if (!client) return []
  const rows = await client.fetch(newsletterIssuesHomeDispatchesQuery)
  if (!Array.isArray(rows)) return []
  return rows.map(mapNewsletterIssueToHomeDispatchItem).filter(Boolean)
}

export async function fetchLatestNewsletterIssueForEmail() {
  const client = getSanityClient()
  if (!client) return null
  const issue = await client.fetch(latestNewsletterIssueForEmailQuery)
  if (!issue || typeof issue !== 'object') return null
  const articles = articlesInIssueForDispatch(issue).map(doc => ({
    ...doc,
    coverUrl: urlForImage(doc.coverImage) || null
  }))
  return {
    ...issue,
    articles
  }
}

export async function fetchNextNewsletterIssueForDispatch() {
  const client = getSanityClient()
  if (!client) return null
  const issue = await client.fetch(nextNewsletterIssueForDispatchQuery)
  if (!issue || typeof issue !== 'object') return null
  const articles = articlesInIssueForDispatch(issue).map(doc => ({
    ...doc,
    coverUrl: urlForImage(doc.coverImage) || null
  }))
  return {
    ...issue,
    articles
  }
}
