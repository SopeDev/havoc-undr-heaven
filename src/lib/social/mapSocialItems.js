const asIsoOrNull = value => {
  if (typeof value !== 'string' || !value.trim()) return null
  const t = new Date(value).getTime()
  if (Number.isNaN(t)) return null
  return new Date(t).toISOString()
}

const trimText = value => (typeof value === 'string' ? value.trim() : '')

export const normalizeYouTubeItems = rows => {
  if (!Array.isArray(rows)) return []
  return rows
    .map(row => {
      const id = trimText(row?.id)
      const title = trimText(row?.title)
      const href = trimText(row?.href)
      if (!id || !title || !href) return null
      return {
        platform: 'youtube',
        id,
        title,
        excerpt: trimText(row?.excerpt),
        imageUrl: trimText(row?.imageUrl) || null,
        publishedAt: asIsoOrNull(row?.publishedAt),
        href,
        kind: trimText(row?.kind) || 'video'
      }
    })
    .filter(Boolean)
}

export const normalizeSpotifyItems = rows => {
  if (!Array.isArray(rows)) return []
  return rows
    .map(row => {
      const id = trimText(row?.id)
      const title = trimText(row?.title)
      const href = trimText(row?.href)
      if (!id || !title || !href) return null
      return {
        platform: 'spotify',
        id,
        title,
        excerpt: trimText(row?.excerpt),
        imageUrl: trimText(row?.imageUrl) || null,
        publishedAt: asIsoOrNull(row?.publishedAt),
        href,
        kind: trimText(row?.kind) || 'audio'
      }
    })
    .filter(Boolean)
}

export const normalizeInstagramItems = rows => {
  if (!Array.isArray(rows)) return []
  return rows
    .map((row, idx) => {
      const href = trimText(row?.href)
      if (!href) return null
      const id = trimText(row?.id) || `ig-${idx + 1}`
      const title = trimText(row?.title) || 'Publicación en Instagram'
      return {
        platform: 'instagram',
        id,
        title,
        excerpt: trimText(row?.excerpt),
        imageUrl: trimText(row?.imageUrl) || null,
        publishedAt: asIsoOrNull(row?.publishedAt),
        href,
        kind: trimText(row?.kind) || 'post'
      }
    })
    .filter(Boolean)
}

export const mergeLatestSocialItems = (streams, maxItems = 9) => {
  const merged = (Array.isArray(streams) ? streams : [])
    .flatMap(s => (Array.isArray(s?.items) ? s.items : []))
    .sort((a, b) => {
      const ta = a?.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const tb = b?.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return tb - ta
    })
  return merged.slice(0, Math.max(0, Number(maxItems) || 0))
}
