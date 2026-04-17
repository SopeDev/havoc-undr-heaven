'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SiteHeader from '../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../components/SiteFooter/SiteFooter'
import NewsletterSidebarBlock from '../../components/NewsletterSidebarBlock/NewsletterSidebarBlock'
import { useNewsletterSubscriber } from '../../hooks/useNewsletterSubscriber'
import {
  readNewsletterSubscriber,
  SESSION_NEWSLETTER_MODAL_FLAG
} from '../../lib/newsletter/subscriberLocalStorage'

export default function ArticlePageClient({ view, body, requiresNewsletterAccess = false }) {
  const router = useRouter()
  const { subscribed } = useNewsletterSubscriber()

  useEffect(() => {
    if (!requiresNewsletterAccess) return
    if (subscribed) return
    if (readNewsletterSubscriber()) return
    try {
      sessionStorage.setItem(SESSION_NEWSLETTER_MODAL_FLAG, '1')
    } catch {
      // ignore
    }
    router.replace('/')
  }, [requiresNewsletterAccess, subscribed, router])

  useEffect(() => {
    const onScroll = () => {
      const progressEl = document.getElementById('progress')
      const articleEl = document.querySelector('.article-body')
      if (!progressEl || !articleEl) return

      const rect = articleEl.getBoundingClientRect()
      const articleHeight = articleEl.offsetHeight
      const scrolled = Math.max(0, -rect.top)
      const progress = Math.min(100, (scrolled / articleHeight) * 100)
      progressEl.style.width = `${progress}%`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const authorAvatarInner = view.author.avatarUrl ? (
    <Image src={view.author.avatarUrl} alt='' width={32} height={32} className='article-author-avatar-img' />
  ) : (
    view.author.initials
  )

  const authorBioAvatarInner = view.author.avatarUrl ? (
    <Image src={view.author.avatarUrl} alt='' width={64} height={64} className='author-avatar-img' />
  ) : (
    view.author.initials
  )

  return (
    <>
      <div className='reading-progress' id='progress' />
      <SiteHeader />

      <div className='breadcrumb'>
        <span>
          <Link href='/'>Inicio</Link>
        </span>
        <span className='sep'>›</span>
        <span>
          <Link href={`/categoria/${view.catSlug}`}>{view.cat}</Link>
        </span>
        <span className='sep'>›</span>
        <span className='current'>{view.title}</span>
      </div>

      <div className='article-layout'>
        <article className='article-main'>
          <div className='article-eyebrow'>
            <span className='tag'>{view.cat}</span>
            <span>{view.tagsText}</span>
          </div>

          <h1 className='article-title'>{view.title}</h1>
          <p className='article-deck'>{view.deck}</p>

          <div className='article-meta-bar'>
            <div className='article-meta-left'>
              <div className='article-author-wrap'>
                <div className='article-author-avatar'>{authorAvatarInner}</div>
                <div className='article-author-info'>
                  <span className='article-author-label'>Por</span>
                  <span className='article-author'>{view.author.name}</span>
                </div>
              </div>

              <span className='article-date'>{view.dateLabel}</span>
              <span className='article-readtime'>{view.readingTime}</span>
            </div>
            <div className='article-share'>
              <button className='share-btn' type='button'>
                Instagram
              </button>
              <button className='share-btn' type='button'>
                Copiar enlace
              </button>
              <button className='share-btn' type='button'>
                Newsletter
              </button>
            </div>
          </div>

          {view.coverUrl ? (
            <div className='article-image article-image--photo'>
              <Image
                className='article-cover-img'
                src={view.coverUrl}
                alt={view.coverCaption || view.title}
                width={1200}
                height={675}
                sizes='(max-width: 900px) 100vw, 820px'
                priority
              />
            </div>
          ) : (
            <div className='article-image' />
          )}
          {view.coverCaption ? <p className='image-caption'>{view.coverCaption}</p> : null}

          <div className='article-body'>{body}</div>

          <div className='article-footer'>
            <div className='article-tags'>
              {view.tags.map(t => (
                <span key={t} className='article-tag-pill'>
                  {t}
                </span>
              ))}
            </div>

            <div className='article-share-bottom'>
              <span className='share-label'>Compartir</span>
              <button className='share-btn' type='button'>
                Instagram
              </button>
              <button className='share-btn' type='button'>
                Copiar enlace
              </button>
              <button className='share-btn' type='button'>
                Newsletter
              </button>
            </div>
          </div>

          <div className='author-bio'>
            <div className='author-avatar'>{authorBioAvatarInner}</div>
            <div>
              <div className='author-bio-label'>Sobre el autor</div>
              <div className='author-bio-name'>{view.author.name}</div>
              <p className='author-bio-text'>
                <em>{view.author.bio || '—'}</em>
              </p>
            </div>
          </div>

          <div className='related'>
            <div className='related-label'>También en Havoc Undr Heaven</div>
            <div className='related-grid'>
              {view.related.map(r => {
                const inner = (
                  <>
                    <div className='related-thumb' />
                    <div className='related-tag'>{r.tag}</div>
                    <span className='related-title'>{r.title}</span>
                    <div className='related-date'>{r.date}</div>
                  </>
                )
                const rk = r.key || r.title
                return r.href ? (
                  <Link key={rk} href={r.href} className='related-item related-item--link'>
                    {inner}
                  </Link>
                ) : (
                  <div key={rk} className='related-item'>
                    {inner}
                  </div>
                )
              })}
            </div>
          </div>
        </article>

        <aside className='article-sidebar'>
          <NewsletterSidebarBlock />

          <div className='sidebar-block'>
            <div className='sidebar-label'>Más en {view.cat}</div>
            {view.related.slice(0, 3).map(r => {
              const rk = r.key || r.title
              return r.href ? (
                <Link key={rk} href={r.href} className='sidebar-art sidebar-art--link'>
                  <div className='sidebar-art-tag'>{r.tag}</div>
                  <div className='sidebar-art-title'>{r.title}</div>
                  <div className='sidebar-art-date'>{r.date}</div>
                </Link>
              ) : (
                <div key={rk} className='sidebar-art'>
                  <div className='sidebar-art-tag'>{r.tag}</div>
                  <div className='sidebar-art-title'>{r.title}</div>
                  <div className='sidebar-art-date'>{r.date}</div>
                </div>
              )
            })}
          </div>

          <div className='sidebar-block'>
            <div className='sidebar-label'>Teatros Activos</div>
            <div className='sidebar-article' style={{ padding: '13px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#CC2200',
                    marginTop: 4,
                    flexShrink: 0
                  }}
                />
                <div>
                  <div className='sidebar-art-title' style={{ fontSize: 12 }}>
                    Ucrania — Frente Activo
                  </div>
                  <div className='sidebar-art-date'>Europa del Este</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <SiteFooter />
    </>
  )
}
