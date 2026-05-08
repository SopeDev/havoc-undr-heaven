const DEFAULT_IG = 'https://www.instagram.com/havoc_undrheaven'

const parseConfiguredPosts = value => {
  if (typeof value !== 'string' || !value.trim()) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const fetchInstagramStream = async () => {
  const enabled = process.env.SOCIAL_INSTAGRAM_ENABLED?.trim() !== 'false'
  const profileUrl = process.env.SOCIAL_INSTAGRAM_PROFILE_URL?.trim() || DEFAULT_IG
  if (!enabled) return { platform: 'instagram', items: [], profileUrl, error: 'disabled' }

  const posts = parseConfiguredPosts(process.env.SOCIAL_INSTAGRAM_POSTS_JSON)
  if (posts.length === 0) {
    return { platform: 'instagram', items: [], profileUrl, error: 'missing_api_or_seed_posts' }
  }

  return {
    platform: 'instagram',
    profileUrl,
    items: posts,
    error: null
  }
}
