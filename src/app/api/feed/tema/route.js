import { NextResponse } from 'next/server'
import { clampFeedRange, FEED_PAGE_SIZE } from '../../../../lib/feedPagination'
import { fetchArticlesByTagSlugRange } from '../../../../lib/sanity/articles'
import { mapArticleToFeedItem } from '../../../../lib/sanity/temas'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const temaSlug = searchParams.get('temaSlug')?.trim()
  if (!temaSlug) {
    return NextResponse.json({ error: 'temaSlug is required' }, { status: 400 })
  }
  const { offset, limit } = clampFeedRange(searchParams.get('offset'), searchParams.get('limit'))

  const docs = await fetchArticlesByTagSlugRange(temaSlug, offset, offset + limit)
  const hasMore = docs.length === limit
  const items = docs.map(mapArticleToFeedItem)
  return NextResponse.json({ items, hasMore, pageSize: FEED_PAGE_SIZE })
}
