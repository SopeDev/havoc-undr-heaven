import { getSanityClient } from './client'
import { redesSettingsQuery } from './queries'

/**
 * Fetches the singleton `redesSettings` document. Returns null if Sanity is not
 * configured or the document hasn't been created yet.
 */
export async function fetchRedesSettings() {
  const client = getSanityClient()
  if (!client) return null

  try {
    const data = await client.fetch(redesSettingsQuery)
    return data || null
  } catch {
    return null
  }
}
