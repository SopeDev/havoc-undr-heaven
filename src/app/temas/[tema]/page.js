import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteHeader from '../../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../../components/SiteFooter/SiteFooter'
import FeedLoadMore from '../../../components/FeedLoadMore/FeedLoadMore'
import NewsletterSidebarBlock from '../../../components/NewsletterSidebarBlock/NewsletterSidebarBlock'
import NewsletterArticleLink from '../../../components/NewsletterArticleLink/NewsletterArticleLink'
import { fetchTemaPageData } from '../../../lib/sanity/temas'
import { fetchFocosSidebarByUpdated } from '../../../lib/sanity/focos'
import { fetchSpotlightSidebarArticles } from '../../../lib/sanity/homePageData'
import { fetchNavLists } from '../../../lib/sanity/navigation'

export const revalidate = 60

const loadTemaPage = cache(async temaSlug => {
  const [cms, nav, spotlightArticles, focoSidebarCms] = await Promise.all([
    fetchTemaPageData(temaSlug),
    fetchNavLists(),
    fetchSpotlightSidebarArticles(),
    fetchFocosSidebarByUpdated(4)
  ])
  return { cms, nav, spotlightArticles, focoSidebarCms }
})

export async function generateMetadata({ params }) {
  const { tema: temaSlug } = await params
  const { cms } = await loadTemaPage(temaSlug)
  if (!cms) {
    return { title: 'Tema — HAVOC UNDR HEAVEN' }
  }
  const title = `${cms.label} — HAVOC UNDR HEAVEN`
  const desc = cms.desc || undefined
  return {
    title,
    description: desc && desc.length > 160 ? `${desc.slice(0, 157)}…` : desc
  }
}

export default async function TemaPage({ params }) {
  const { tema: temaSlug } = await params
  const { cms: tema, nav, spotlightArticles, focoSidebarCms } = await loadTemaPage(temaSlug)
  if (!tema) notFound()

  const focoSidebarRows = focoSidebarCms

  const hasHero = tema.hero !== null && tema.hero !== undefined

  return (
    <>
      <SiteHeader />

      <div className='breadcrumb'>
        <span>
          <Link href='/'>Inicio</Link>
        </span>
        <span className='sep'>›</span>
        <span className='current'>{tema.label}</span>
      </div>

      <div className='type-bar'>
        <Link href='/' className='type-item'>
          Todo
        </Link>
        {nav.categories.map(c => (
          <Link key={c.slug} href={`/categoria/${c.slug}`} className='type-item'>
            {c.name}
          </Link>
        ))}
        <Link href='/focos' className='type-item'>
          Focos de Tensión
        </Link>
        <Link href='/tablero' className='type-item'>
          Tablero Global
        </Link>
      </div>

      <div className='region-bar region-bar--tema'>
        <span className='region-item'>Temas</span>
        {nav.tags.map(t => (
          <Link
            key={t.slug}
            href={`/temas/${t.slug}`}
            className={t.slug === temaSlug ? 'region-item active' : 'region-item'}
          >
            {t.name}
          </Link>
        ))}
      </div>

      <div className='tema-header'>
        <div>
          <div className='tema-eyebrow'>Archivo por tema</div>
          <h1 className='tema-title'>{tema.label}</h1>
          <p className='tema-desc'>{tema.desc}</p>
        </div>

        <div className='tema-stats'>
          <div className='tema-stat'>
            <span className='tema-stat-label'>Artículos publicados</span>
            <span className='tema-stat-val'>{tema.count}</span>
          </div>
          <div className='tema-stat'>
            <span className='tema-stat-label'>Más reciente</span>
            <span className='tema-stat-val'>{tema.latest}</span>
          </div>
          <div className='tema-stat'>
            <span className='tema-stat-label'>Secciones</span>
            <span className='tema-stat-val'>{tema.sections}</span>
          </div>
        </div>
      </div>

      {tema.related.length > 0 ? (
        <div className='related-bar'>
          <span className='related-label'>Temas relacionados:</span>
          {tema.related.map(r => (
            <Link key={r.slug} href={`/temas/${r.slug}`} className='related-pill'>
              {r.name}
            </Link>
          ))}
        </div>
      ) : null}

      <div className='tema-body'>
        <div className='tema-feed'>
          <div className='feed-filter-row'>
            <Link href={`/temas/${temaSlug}`} className='feed-filter active' scroll={false}>
              Todo
            </Link>
            {nav.categories.map(c => (
              <Link
                key={c.slug}
                href={`/categoria/${c.slug}?tema=${temaSlug}`}
                className='feed-filter'
                scroll={false}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {!hasHero ? (
            <p style={{ padding: '1.5rem 0', color: 'var(--muted, #666)' }}>
              No hay artículos publicados con este tema todavía.
            </p>
          ) : (
            <>
              <NewsletterArticleLink href={tema.hero.href} categorySlug={tema.hero.categorySlug}>
                <div className='feed-hero'>
                  <div className='feed-hero-img' />
                  <div className='feed-eyebrow'>
                    <span className='cat-tag'>{tema.hero.cat}</span>
                    <span className='topic-tag'>{tema.hero.tags}</span>
                  </div>
                  <h2 className='feed-hero-title'>{tema.hero.title}</h2>
                  <p className='feed-hero-deck'>{tema.hero.deck}</p>
                  <div className='feed-hero-meta'>
                    <span>{tema.hero.date}</span>
                    <span>{tema.hero.time}</span>
                  </div>
                </div>
              </NewsletterArticleLink>
              <FeedLoadMore
                variant='tema'
                initialItems={tema.articles}
                hasMore={tema.feedHasMore}
                temaSlug={temaSlug}
              />
            </>
          )}
        </div>

        <aside className='tema-sidebar'>
          <NewsletterSidebarBlock />

          {spotlightArticles.length > 0 ? (
              <div className='sidebar-block'>
                <div className='sidebar-label'>En el Spotlight</div>
                {spotlightArticles.map(s => (
                  <NewsletterArticleLink key={s.href} href={s.href} categorySlug={s.categorySlug}>
                    <div className='sidebar-art'>
                      <div className='sidebar-art-tag'>{s.topic}</div>
                      <div className='sidebar-art-title'>{s.title}</div>
                      <div className='sidebar-art-date'>{s.dateStr}</div>
                    </div>
                  </NewsletterArticleLink>
                ))}
              </div>
          ) : null}

          <div className='sidebar-block'>
            <div className='sidebar-label'>Focos de Tensión</div>
            {focoSidebarRows.map(f => (
              <Link key={f.slug || f.name} href={f.slug ? `/focos/${f.slug}` : '#'}>
                <div className='foco-row'>
                  <div className='fdot-sm' style={{ background: f.color }} />
                  <div>
                    <div className='foco-row-name'>{f.name}</div>
                    <div className='foco-row-region'>{f.region}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <SiteFooter />
    </>
  )
}
