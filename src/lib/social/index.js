const trim = value => (typeof value === 'string' ? value.trim() : '')

const extractInstagramHandle = url => {
  try {
    const parsed = new URL(url)
    const parts = parsed.pathname.split('/').filter(Boolean)
    return parts[0] || null
  } catch {
    return null
  }
}

const buildInstagramEmbedUrl = postUrl => {
  if (!postUrl) return null
  try {
    const parsed = new URL(postUrl)
    if (!parsed.hostname.includes('instagram.com')) return null
    const segments = parsed.pathname.split('/').filter(Boolean)
    const kindIdx = segments.findIndex(s => s === 'p' || s === 'reel' || s === 'tv')
    if (kindIdx === -1 || !segments[kindIdx + 1]) return null
    return `https://www.instagram.com/${segments[kindIdx]}/${segments[kindIdx + 1]}/embed/`
  } catch {
    return null
  }
}

const SPOTIFY_EMBED_TYPES = new Set(['show', 'episode', 'playlist', 'artist', 'album', 'track'])

const buildSpotifyEmbedUrl = (type, id) => {
  if (!type || !id) return null
  if (!SPOTIFY_EMBED_TYPES.has(type)) return null
  return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`
}

const parseSpotifyResourceFromUrl = url => {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('spotify.com')) return null
    const segments = parsed.pathname.split('/').filter(Boolean)
    const typeIdx = segments.findIndex(s => SPOTIFY_EMBED_TYPES.has(s))
    if (typeIdx === -1 || !segments[typeIdx + 1]) return null
    return { type: segments[typeIdx], id: segments[typeIdx + 1].split('?')[0] }
  } catch {
    return null
  }
}

const deriveYouTubePlaylistId = ({ playlistOverride, channelId }) => {
  if (playlistOverride) return playlistOverride
  if (channelId && channelId.startsWith('UC')) return `UU${channelId.slice(2)}`
  return ''
}

const buildYouTubeEmbedUrl = playlistId =>
  playlistId ? `https://www.youtube.com/embed/videoseries?list=${playlistId}` : null

export const getRedesPageConfig = ({ instagramFeaturedPostUrl } = {}) => {
  const instagramProfileUrl =
    trim(process.env.SOCIAL_INSTAGRAM_PROFILE_URL) || 'https://www.instagram.com/havoc_undrheaven'
  const instagramHandle = extractInstagramHandle(instagramProfileUrl) || 'havoc_undrheaven'
  // Sanity-managed URL takes precedence; env var stays as a dev/preview fallback.
  const instagramFeaturedSource = trim(instagramFeaturedPostUrl) || trim(process.env.SOCIAL_INSTAGRAM_FEATURED_POST_URL)
  const instagramEmbedUrl = buildInstagramEmbedUrl(instagramFeaturedSource)

  const youtubeProfileUrl = trim(process.env.SOCIAL_YOUTUBE_CHANNEL_URL)
  const youtubePlaylistId = deriveYouTubePlaylistId({
    playlistOverride: trim(process.env.SOCIAL_YOUTUBE_PLAYLIST_ID),
    channelId: trim(process.env.SOCIAL_YOUTUBE_CHANNEL_ID)
  })
  const youtubeEmbedUrl = buildYouTubeEmbedUrl(youtubePlaylistId)

  const spotifyProfileUrl = trim(process.env.SOCIAL_SPOTIFY_PROFILE_URL)
  const spotifyOverrideType = trim(process.env.SOCIAL_SPOTIFY_EMBED_TYPE).toLowerCase()
  const spotifyOverrideId = trim(process.env.SOCIAL_SPOTIFY_EMBED_ID)
  const spotifyParsed = parseSpotifyResourceFromUrl(spotifyProfileUrl)
  const spotifyEmbedUrl = buildSpotifyEmbedUrl(
    spotifyOverrideType || spotifyParsed?.type || '',
    spotifyOverrideId || spotifyParsed?.id || ''
  )

  return {
    instagram: {
      profileUrl: instagramProfileUrl,
      handle: instagramHandle,
      embedUrl: instagramEmbedUrl,
      hasEmbed: Boolean(instagramEmbedUrl)
    },
    youtube: {
      profileUrl: youtubeProfileUrl,
      embedUrl: youtubeEmbedUrl,
      hasEmbed: Boolean(youtubeEmbedUrl)
    },
    spotify: {
      profileUrl: spotifyProfileUrl,
      embedUrl: spotifyEmbedUrl,
      hasEmbed: Boolean(spotifyEmbedUrl)
    }
  }
}
