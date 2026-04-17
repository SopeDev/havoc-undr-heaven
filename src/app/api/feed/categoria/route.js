import { NextResponse } from 'next/server'
import { clampFeedRange, FEED_PAGE_SIZE } from '../../../../lib/feedPagination'
import { fetchArticlesByCategoryRange } from '../../../../lib/sanity/articles'
import { mapDocToItem } from '../../../../lib/sanity/categoriaPageData'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const categorySlug = searchParams.get('categorySlug')?.trim()
  if (!categorySlug) {
    return NextResponse.json({ error: 'categorySlug is required' }, { status: 400 })
  }
  const temaSlug = searchParams.get('temaSlug')?.trim() || undefined
  const sectionTitle = searchParams.get('sectionTitle')?.trim() || 'Categoría'
  const { offset, limit } = clampFeedRange(searchParams.get('offset'), searchParams.get('limit'))

  const docs = await fetchArticlesByCategoryRange(categorySlug, offset, offset + limit, {
    tagSlug: temaSlug
  })
  const hasMore = docs.length === limit
  const items = docs.map(d => mapDocToItem(d, sectionTitle))
  return NextResponse.json({ items, hasMore, pageSize: FEED_PAGE_SIZE })
}
