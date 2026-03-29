import { createImageUrlBuilder } from '@sanity/image-url'
import { getSanityClient } from './client'

/** @param {import('@sanity/client').SanityImageSource | null | undefined} source */
export function urlForImage(source) {
  const client = getSanityClient()
  if (!client || !source?.asset) return null
  return createImageUrlBuilder(client).image(source).width(2000).quality(85).auto('format').url()
}
