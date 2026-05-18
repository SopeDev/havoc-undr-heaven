import { getSiteUrl } from '../lib/siteUrl'

export default function robots() {
  const siteUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api/', '/tablero']
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  }
}
