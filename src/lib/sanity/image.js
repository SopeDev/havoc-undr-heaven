import { createImageUrlBuilder } from '@sanity/image-url'
import { getSanityClient } from './client'

/** @param {import('@sanity/client').SanityImageSource | null | undefined} source */
export function urlForImage(source) {
  const client = getSanityClient()
  if (!client || !source?.asset) return null
  return createImageUrlBuilder(client).image(source).width(2000).quality(85).auto('format').url()
}

/** Feed rows, hero band, dispatch cards — one sensible size for Next/Image (not full-bleed article body). */
export function urlForCardImage(source) {
  const client = getSanityClient()
  if (!client || !source?.asset) return null
  return createImageUrlBuilder(client)
    .image(source)
    .width(960)
    .height(540)
    .fit('crop')
    .quality(82)
    .auto('format')
    .url()
}
