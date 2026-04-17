import { NextResponse } from 'next/server'
import { clampFeedRange, FEED_PAGE_SIZE } from '../../../../lib/feedPagination'
import { fetchHomeArticlesRange } from '../../../../lib/sanity/articles'
import { mapRawDocToHomeRow } from '../../../../lib/sanity/homePageData'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const { offset, limit } = clampFeedRange(searchParams.get('offset'), searchParams.get('limit'))
  const docs = await fetchHomeArticlesRange(offset, offset + limit)
  const hasMore = docs.length === limit
  const items = docs.map(mapRawDocToHomeRow)
  return NextResponse.json({ items, hasMore, pageSize: FEED_PAGE_SIZE })
}
