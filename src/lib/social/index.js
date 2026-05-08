import { fetchInstagramStream } from './instagram'
import { normalizeInstagramItems, normalizeSpotifyItems, normalizeYouTubeItems, mergeLatestSocialItems } from './mapSocialItems'
import { fetchSpotifyStream } from './spotify'
import { fetchYouTubeStream } from './youtube'

const STREAM_META = {
  instagram: {
    label: 'Instagram',
    cta: 'Ver en Instagram'
  },
  youtube: {
    label: 'YouTube',
    cta: 'Ver en YouTube'
  },
  spotify: {
    label: 'Spotify',
    cta: 'Escuchar en Spotify'
  }
}

const mapStream = stream => {
  const platform = stream?.platform || 'unknown'
  const base = STREAM_META[platform] || { label: platform, cta: 'Abrir' }
  const normalize =
    platform === 'youtube'
      ? normalizeYouTubeItems
      : platform === 'spotify'
        ? normalizeSpotifyItems
        : normalizeInstagramItems

  return {
    platform,
    label: base.label,
    ctaLabel: base.cta,
    profileUrl: stream?.profileUrl || '',
    items: normalize(stream?.items),
    error: stream?.error || null
  }
}

export const fetchRedesPageData = async () => {
  const [ig, yt, sp] = await Promise.allSettled([
    fetchInstagramStream(),
    fetchYouTubeStream(),
    fetchSpotifyStream()
  ])

  const rawStreams = [ig, yt, sp].map((r, idx) => {
    if (r.status === 'fulfilled') return r.value
    const platform = idx === 0 ? 'instagram' : idx === 1 ? 'youtube' : 'spotify'
    return {
      platform,
      profileUrl: '',
      items: [],
      error: r.reason instanceof Error ? r.reason.message : 'unknown_error'
    }
  })

  const streams = rawStreams.map(mapStream)
  const latest = mergeLatestSocialItems(streams, 9)
  return {
    streams,
    latest
  }
}
