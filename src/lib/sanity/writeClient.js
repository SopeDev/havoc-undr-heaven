import { createClient } from 'next-sanity'

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-01'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

export function getSanityWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim()
  if (!projectId || !token) return null

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token
  })
}
