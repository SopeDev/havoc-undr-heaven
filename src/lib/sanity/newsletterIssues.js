import { isArticleWithheldFromWeb } from './articleVisibility'
import { getSanityClient } from './client'
import { newsletterIssuesForWebQuery } from './queries'

function isUsableArticleForNewsletterFeed(doc) {
  if (!doc || doc._type !== 'article') return false
  const slug = typeof doc.slug === 'string' ? doc.slug.trim() : ''
  if (!slug) return false
  return !isArticleWithheldFromWeb(doc)
}

function visibleArticlesInIssue(issue) {
  const raw = issue?.articles
  if (!Array.isArray(raw)) return []
  return raw.filter(isUsableArticleForNewsletterFeed)
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
