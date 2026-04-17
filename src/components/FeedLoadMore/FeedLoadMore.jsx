'use client'

import { useCallback, useState } from 'react'
import { FEED_PAGE_SIZE, feedLoadMoreStartOffset } from '../../lib/feedPagination'
import NewsletterArticleLink from '../NewsletterArticleLink/NewsletterArticleLink'

function homeItem(item) {
  return (
    <NewsletterArticleLink key={item.href} href={item.href} categorySlug={item.categorySlug}>
      <div className='feed-item' role='link' tabIndex={0}>
        <div>
          <div className='feed-eyebrow'>
            <span className='feed-cat'>{item.cat}</span>
            <span className='feed-region'>{item.topic}</span>
          </div>
          <div className='feed-title'>{item.title}</div>
          <div className='feed-excerpt'>{item.excerpt}</div>
          <div className='feed-meta'>
            {item.dateStr} · {item.timeStr}
          </div>
        </div>
        <div className='feed-thumb' />
      </div>
    </NewsletterArticleLink>
  )
}

function categoriaItem(item, categorySlugProp) {
  const catSlug = categorySlugProp || item.categorySlug
  return (
    <NewsletterArticleLink key={item.href} href={item.href} categorySlug={catSlug}>
      <div className='feed-item' role='link' tabIndex={0}>
        <div>
          <div className='feed-item-eyebrow'>
            <span className='cat-tag'>{item.cat}</span>
            <span className='topic-tag'>{item.topic}</span>
          </div>
          <div className='feed-item-title'>{item.title}</div>
          <div className='feed-item-excerpt'>{item.excerpt}</div>
          <div className='feed-item-meta'>
            {item.date} · {item.time}
          </div>
        </div>
        <div className='feed-thumb' />
      </div>
    </NewsletterArticleLink>
  )
}

function temaItem(item) {
  return (
    <NewsletterArticleLink key={item.href || item.title} href={item.href || '#'} categorySlug={item.categorySlug}>
      <div className='feed-item' role='link' tabIndex={0}>
        <div>
          <div className='feed-eyebrow'>
            <span className='cat-tag'>{item.cat}</span>
            <span className='topic-tag'>{item.tags}</span>
          </div>
          <div className='feed-item-title'>{item.title}</div>
          <div className='feed-item-excerpt'>{item.excerpt}</div>
          <div className='feed-item-meta'>
            {item.date} · {item.time}
          </div>
        </div>
        <div className='feed-thumb' />
      </div>
    </NewsletterArticleLink>
  )
}

/**
 * @param {{
 *   variant: 'home' | 'categoria' | 'tema',
 *   initialItems: Array<Record<string, unknown>>,
 *   hasMore: boolean,
 *   categorySlug?: string,
 *   temaSlug?: string,
 *   sectionTitle?: string
 * }} props
 */
export default function FeedLoadMore({
  variant,
  initialItems,
  hasMore: initialHasMore,
  categorySlug,
  temaSlug,
  sectionTitle
}) {
  const [items, setItems] = useState(initialItems)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [nextOffset, setNextOffset] = useState(feedLoadMoreStartOffset())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const buildUrl = useCallback(
    (offset, limit) => {
      const qs = new URLSearchParams()
      qs.set('offset', String(offset))
      qs.set('limit', String(limit))
      if (variant === 'categoria') {
        qs.set('categorySlug', categorySlug || '')
        if (temaSlug) qs.set('temaSlug', temaSlug)
        if (sectionTitle) qs.set('sectionTitle', sectionTitle)
        return `/api/feed/categoria?${qs.toString()}`
      }
      if (variant === 'tema') {
        qs.set('temaSlug', temaSlug || '')
        return `/api/feed/tema?${qs.toString()}`
      }
      return `/api/feed/home?${qs.toString()}`
    },
    [variant, categorySlug, temaSlug, sectionTitle]
  )

  const onLoadMore = useCallback(async () => {
    if (busy || !hasMore) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(buildUrl(nextOffset, FEED_PAGE_SIZE))
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || res.statusText || 'Error al cargar')
      }
      const data = await res.json()
      const batch = Array.isArray(data.items) ? data.items : []
      setItems(prev => [...prev, ...batch])
      setHasMore(Boolean(data.hasMore))
      setNextOffset(o => o + batch.length)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar')
    } finally {
      setBusy(false)
    }
  }, [busy, hasMore, nextOffset, buildUrl])

  const renderItem =
    variant === 'home'
      ? homeItem
      : variant === 'categoria'
        ? item => categoriaItem(item, categorySlug)
        : temaItem

  return (
    <>
      {items.map(renderItem)}
      {hasMore ? (
        <button
          type='button'
          className='load-more'
          onClick={onLoadMore}
          disabled={busy}
          aria-busy={busy}
        >
          {busy ? 'Cargando…' : 'Cargar más artículos'}
        </button>
      ) : null}
      {error ? (
        <p className='feed-load-more-error' style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)' }}>
          {error}
        </p>
      ) : null}
    </>
  )
}
