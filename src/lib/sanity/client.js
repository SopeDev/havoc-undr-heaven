import { createClient } from 'next-sanity'

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-01'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

/** @returns {import('@sanity/client').SanityClient | null} */
export function getSanityClient() {
  if (!projectId) return null
  return createClient({ projectId, dataset, apiVersion, useCdn: true })
}

export function isSanityConfigured() {
  return Boolean(projectId)
}
