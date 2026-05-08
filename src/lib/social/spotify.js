const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

const toBase64 = value => Buffer.from(value).toString('base64')

const parseImage = images => {
  if (!Array.isArray(images) || images.length === 0) return null
  const sorted = [...images].sort((a, b) => (b?.width || 0) - (a?.width || 0))
  return sorted[0]?.url || null
}

const getSpotifyToken = async ({ clientId, clientSecret }) => {
  const creds = toBase64(`${clientId}:${clientSecret}`)
  const res = await fetch(SPOTIFY_ACCOUNTS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials',
    next: { revalidate: 300 }
  })
  if (!res.ok) throw new Error(`spotify_token_${res.status}`)
  const json = await res.json()
  const token = json?.access_token
  if (!token) throw new Error('spotify_missing_access_token')
  return token
}

const fetchSpotifyJson = async ({ url, token }) => {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 }
  })
  if (!res.ok) throw new Error(`spotify_http_${res.status}`)
  return await res.json()
}

const mapShowEpisodes = rows => {
  if (!Array.isArray(rows)) return []
  return rows
    .map(ep => {
      const id = (ep?.id || '').trim()
      const title = (ep?.name || '').trim()
      const href = ep?.external_urls?.spotify || ''
      if (!id || !title || !href) return null
      return {
        id,
        title,
        excerpt: (ep?.description || '').trim(),
        imageUrl: parseImage(ep?.images),
        publishedAt: ep?.release_date || null,
        href,
        kind: 'episode'
      }
    })
    .filter(Boolean)
}

export const fetchSpotifyStream = async () => {
  const enabled = process.env.SOCIAL_SPOTIFY_ENABLED?.trim() !== 'false'
  const profileUrl = process.env.SOCIAL_SPOTIFY_PROFILE_URL?.trim() || 'https://open.spotify.com'
  if (!enabled) return { platform: 'spotify', items: [], profileUrl, error: 'disabled' }

  const clientId = process.env.SOCIAL_SPOTIFY_CLIENT_ID?.trim()
  const clientSecret = process.env.SOCIAL_SPOTIFY_CLIENT_SECRET?.trim()
  const showId = process.env.SOCIAL_SPOTIFY_SHOW_ID?.trim()
  const maxItems = Math.min(12, Math.max(1, Number(process.env.SOCIAL_SPOTIFY_MAX_ITEMS || 6)))

  if (!clientId || !clientSecret || !showId) {
    return { platform: 'spotify', items: [], profileUrl, error: 'missing_env' }
  }

  try {
    const token = await getSpotifyToken({ clientId, clientSecret })
    const url = `${SPOTIFY_API_BASE}/shows/${encodeURIComponent(showId)}/episodes?limit=${maxItems}&market=US`
    const json = await fetchSpotifyJson({ url, token })
    const items = mapShowEpisodes(json?.items)
    return { platform: 'spotify', items, profileUrl, error: null }
  } catch (err) {
    return { platform: 'spotify', items: [], profileUrl, error: err instanceof Error ? err.message : 'unknown_error' }
  }
}
