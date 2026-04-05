import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteHeader from '../../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../../components/SiteFooter/SiteFooter'
import NewsletterSignup from '../../../components/NewsletterSignup/NewsletterSignup'
import { fetchTemaPageData } from '../../../lib/sanity/temas'
import { fetchNavLists } from '../../../lib/sanity/navigation'

export const revalidate = 60

const loadTemaPage = cache(async temaSlug => {
  const [cms, nav] = await Promise.all([fetchTemaPageData(temaSlug), fetchNavLists()])
  return { cms, nav }
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
  const { cms: tema, nav } = await loadTemaPage(temaSlug)
  if (!tema) notFound()

  const hasHero = tema.hero !== null && tema.hero !== undefined
  const hasArticles = tema.articles.length > 0

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

      <div className='region-bar'>
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

          {hasHero ? (
            <Link href={tema.hero.href}>
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
            </Link>
          ) : (
            <p style={{ padding: '1.5rem 0', color: 'var(--muted, #666)' }}>
              No hay artículos publicados con este tema todavía.
            </p>
          )}

          {tema.articles.map(a => (
            <Link key={a.href || a.title} href={a.href || '#'}>
              <div className='feed-item' role='link' tabIndex={0}>
                <div>
                  <div className='feed-eyebrow'>
                    <span className='cat-tag'>{a.cat}</span>
                    <span className='topic-tag'>{a.tags}</span>
                  </div>
                  <div className='feed-item-title'>{a.title}</div>
                  <div className='feed-item-excerpt'>{a.excerpt}</div>
                  <div className='feed-item-meta'>
                    {a.date} · {a.time}
                  </div>
                </div>
                <div className='feed-thumb' />
              </div>
            </Link>
          ))}

          {(hasHero || hasArticles) && (
            <div className='load-more'>Cargar más artículos</div>
          )}
        </div>

        <aside className='tema-sidebar'>
          <div className='sidebar-block'>
            <div className='sidebar-label'>Newsletter Semanal</div>
            <NewsletterSignup />
          </div>

          <div className='sidebar-block'>
            <div className='sidebar-label'>También en HUH</div>
            {tema.sidebar.map(s => (
              <div key={s.title} className='sidebar-art'>
                <div className='sidebar-art-tag'>{s.tags}</div>
                <div className='sidebar-art-title'>{s.title}</div>
                <div className='sidebar-art-date'>{s.date}</div>
              </div>
            ))}
          </div>

          {tema.focos.length ? (
            <div className='sidebar-block'>
              <div className='sidebar-label'>Focos de Tensión</div>
              {tema.focos.map(f => (
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
          ) : null}
        </aside>
      </div>

      <SiteFooter />
    </>
  )
}
