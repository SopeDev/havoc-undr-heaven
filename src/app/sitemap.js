import { getSiteUrl } from '../lib/siteUrl'
import { fetchArticleSlugs } from '../lib/sanity/articles'
import { getSanityClient } from '../lib/sanity/client'
import { allCategoriesQuery, allTagsQuery, focosIndexListQuery } from '../lib/sanity/queries'

export default async function sitemap() {
  const siteUrl = getSiteUrl()
  const now = new Date()

  const staticRoutes = [
    { path: '', changeFrequency: 'daily', priority: 1 },
    { path: '/nosotros', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/redes', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/focos', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/categoria/newsletter', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/categoria/analisis', changeFrequency: 'daily', priority: 0.9 },
    { path: '/categoria/reflexiones', changeFrequency: 'daily', priority: 0.9 }
  ].map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority
  }))

  const client = getSanityClient()
  if (!client) return staticRoutes

  const [articles, categories, tags, focos] = await Promise.all([
    fetchArticleSlugs(),
    client.fetch(allCategoriesQuery),
    client.fetch(allTagsQuery),
    client.fetch(focosIndexListQuery)
  ])

  const articleEntries = (Array.isArray(articles) ? articles : [])
    .filter(row => row?.slug)
    .map(row => ({
      url: `${siteUrl}/articulos/${row.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7
    }))

  const categoryEntries = (Array.isArray(categories) ? categories : [])
    .filter(c => c?.slug && c.slug !== 'redes')
    .map(c => ({
      url: `${siteUrl}/categoria/${c.slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85
    }))

  const tagEntries = (Array.isArray(tags) ? tags : [])
    .filter(t => t?.slug)
    .map(t => ({
      url: `${siteUrl}/temas/${t.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6
    }))

  const focoEntries = (Array.isArray(focos) ? focos : [])
    .filter(f => f?.slug)
    .map(f => ({
      url: `${siteUrl}/focos/${f.slug}`,
      lastModified: f.updatedAt ? new Date(f.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.75
    }))

  return [...staticRoutes, ...categoryEntries, ...tagEntries, ...articleEntries, ...focoEntries]
}
