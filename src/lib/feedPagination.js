/** Feed list page size (after hero) for home, categoría, and tema pages. */
export const FEED_PAGE_SIZE = 5

/** Hero + first feed page + one peek row to detect “has more”. */
export const FEED_FIRST_PEEK_DOCS = 1 + FEED_PAGE_SIZE + 1

/** Max articles returned per “load more” API request. */
export const MAX_FEED_API_BATCH = 20

/** Max start index for paginated feed API (abuse guard). */
export const MAX_FEED_API_OFFSET = 500

/**
 * @param {unknown} offset
 * @param {unknown} limit
 */
export function clampFeedRange(offset, limit) {
  const o = Math.max(0, Math.min(MAX_FEED_API_OFFSET, Math.floor(Number(offset) || 0)))
  const l = Math.max(1, Math.min(MAX_FEED_API_BATCH, Math.floor(Number(limit) || FEED_PAGE_SIZE)))
  return { offset: o, limit: l }
}

/** Index in ordered list where “load more” starts (after hero + first `FEED_PAGE_SIZE`). */
export function feedLoadMoreStartOffset() {
  return 1 + FEED_PAGE_SIZE
}
