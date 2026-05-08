const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

const getJson = async url => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 6000)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 300 }
    })
    if (!res.ok) throw new Error(`youtube_http_${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timeout)
  }
}

const getUploadsPlaylistId = async ({ apiKey, channelId }) => {
  const url = `${YOUTUBE_API_BASE}/channels?part=contentDetails&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`
  const json = await getJson(url)
  const first = Array.isArray(json?.items) ? json.items[0] : null
  return first?.contentDetails?.relatedPlaylists?.uploads || null
}

const parseVideoItems = rows => {
  if (!Array.isArray(rows)) return []
  return rows
    .map(row => {
      const snippet = row?.snippet || {}
      const resourceId = snippet?.resourceId || {}
      const videoId = (resourceId?.videoId || '').trim()
      const title = (snippet?.title || '').trim()
      if (!videoId || !title) return null
      const thumbs = snippet?.thumbnails || {}
      const imageUrl =
        thumbs?.maxres?.url ||
        thumbs?.standard?.url ||
        thumbs?.high?.url ||
        thumbs?.medium?.url ||
        thumbs?.default?.url ||
        null
      return {
        id: videoId,
        title,
        excerpt: (snippet?.description || '').trim(),
        imageUrl,
        publishedAt: snippet?.publishedAt || null,
        href: `https://www.youtube.com/watch?v=${videoId}`,
        kind: 'video'
      }
    })
    .filter(Boolean)
}

export const fetchYouTubeStream = async () => {
  const enabled = process.env.SOCIAL_YOUTUBE_ENABLED?.trim() !== 'false'
  const profileUrl = process.env.SOCIAL_YOUTUBE_CHANNEL_URL?.trim() || 'https://www.youtube.com'
  if (!enabled) {
    return { platform: 'youtube', items: [], profileUrl, error: 'disabled' }
  }

  const apiKey = process.env.SOCIAL_YOUTUBE_API_KEY?.trim()
  const channelId = process.env.SOCIAL_YOUTUBE_CHANNEL_ID?.trim()
  const maxItems = Math.min(12, Math.max(1, Number(process.env.SOCIAL_YOUTUBE_MAX_ITEMS || 6)))
  if (!apiKey || !channelId) {
    return { platform: 'youtube', items: [], profileUrl, error: 'missing_env' }
  }

  try {
    const uploads = process.env.SOCIAL_YOUTUBE_UPLOADS_PLAYLIST_ID?.trim() || (await getUploadsPlaylistId({ apiKey, channelId }))
    if (!uploads) return { platform: 'youtube', items: [], profileUrl, error: 'missing_uploads_playlist' }
    const url =
      `${YOUTUBE_API_BASE}/playlistItems?part=snippet&playlistId=${encodeURIComponent(uploads)}` +
      `&maxResults=${maxItems}&key=${encodeURIComponent(apiKey)}`
    const json = await getJson(url)
    const items = parseVideoItems(json?.items)
    return { platform: 'youtube', items, profileUrl, error: null }
  } catch (err) {
    return { platform: 'youtube', items: [], profileUrl, error: err instanceof Error ? err.message : 'unknown_error' }
  }
}
