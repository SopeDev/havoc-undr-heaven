/**
 * Canonical public site origin for metadata, sitemap, and robots.
 */
export function getSiteUrl() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEWSLETTER_BASE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim()

  if (!base) return 'https://www.havocundrheaven.com'

  const withProtocol = base.startsWith('http') ? base : `https://${base}`
  return withProtocol.replace(/\/$/, '')
}
