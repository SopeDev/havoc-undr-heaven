import { getSanityClient } from './client'
import { allCategoriesQuery, allTagsQuery } from './queries'

/**
 * Fetches all category and tag documents from Sanity in parallel.
 * Returns { categories, tags } — empty arrays if CMS is not configured.
 */
export async function fetchNavLists() {
  const client = getSanityClient()
  if (!client) return { categories: [], tags: [] }

  const [categories, tags] = await Promise.all([
    client.fetch(allCategoriesQuery),
    client.fetch(allTagsQuery)
  ])

  return {
    categories: Array.isArray(categories) ? categories : [],
    tags: Array.isArray(tags) ? tags : []
  }
}
