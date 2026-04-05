import Link from 'next/link'
import SiteHeader from '../../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../../components/SiteFooter/SiteFooter'
import NewsletterSignup from '../../../components/NewsletterSignup/NewsletterSignup'
import { isSanityConfigured } from '../../../lib/sanity/client'
import { fetchTemaPageData } from '../../../lib/sanity/temas'
import { fetchNavLists } from '../../../lib/sanity/navigation'

export const revalidate = 60

const FALLBACK = {
  label: 'Mundo',
  desc:
    'El nuevo orden mundial en su totalidad — la contra-globalización, el multipolarismo y los marcos conceptuales para entender la transición sistémica.',
  count: 12,
  latest: '28 Feb 2026',
  sections: 'Análisis · Reflexiones',
  related: [
    { name: 'China', slug: 'china' },
    { name: 'Estados Unidos', slug: 'estados-unidos' },
    { name: 'Sur Global', slug: 'mundo' },
    { name: 'BRICS', slug: 'brics' },
    { name: 'Geoeconomía', slug: 'geoeconomia' },
    { name: 'Diplomacia', slug: 'diplomacia' }
  ],
  hero: {
    cat: 'Análisis',
    tags: 'Orden Mundial · Contra-Globalización',
    title: 'El nuevo orden mundial: la Contra-Globalización',
    deck:
      'No estamos viviendo el fin de la globalización sino su transformación más profunda. El orden que emerge no es la reversión al siglo XIX — es algo sin precedentes históricos claros.',
    date: '28 Feb 2026',
    time: '14 min de lectura',
    href: '/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips'
  },
  articles: [
    {
      cat: 'Análisis',
      tags: 'Orden Mundial · Civilización',
      title: 'Los Estados-Civilización y el fin del universalismo liberal',
      excerpt:
        'China, Rusia, India y Turquía se piensan a sí mismos como civilizaciones, no como naciones-estado. Eso cambia todo sobre cómo negocian y cómo combaten.',
      date: '20 Feb 2026',
      time: '9 min',
      href: '/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips'
    }
  ],
  sidebar: [
    { tags: 'China · Hegemonía', title: 'China en camino a convertirse en el hegemon', date: '20 Ene 2026' },
    { tags: 'EEUU · Declive', title: 'El Imperio Americano en decadencia', date: '25 Feb 2026' },
    { tags: 'BRICS · Instituciones', title: 'BRICS+: el Sur Global construye sus propias instituciones', date: '10 Feb 2026' }
  ],
  focos: []
}

const THEMES = {
  china: {
    ...FALLBACK,
    label: 'China',
    desc:
      'Todo lo publicado sobre China — su ascenso como hegemon, su modelo político, su estrategia económica y su papel central en el nuevo orden mundial.',
    count: 14,
    latest: '28 Feb 2026'
  },
  'estados-unidos': {
    ...FALLBACK,
    label: 'Estados Unidos',
    desc:
      'El análisis del Imperio Americano en declive — su política exterior, su tecnonacionalismo y su reconfiguración en un mundo que ya no le pertenece.',
    count: 11,
    latest: '25 Feb 2026'
  },
  rusia: {
    ...FALLBACK,
    label: 'Rusia',
    desc:
      'Rusia como potencia disruptiva del orden liberal — su doctrina estratégica, su economía de guerra y su proyección en África.',
    count: 8,
    latest: '20 Feb 2026'
  },
  mundo: FALLBACK
}

async function resolveTema(temaSlug) {
  if (isSanityConfigured()) {
    const [cms, nav] = await Promise.all([
      fetchTemaPageData(temaSlug),
      fetchNavLists()
    ])
    if (cms) return { tema: cms, nav }
    return { tema: THEMES[temaSlug] || FALLBACK, nav }
  }
  return { tema: THEMES[temaSlug] || FALLBACK, nav: { categories: [], tags: [] } }
}

export async function generateMetadata({ params }) {
  const { tema: temaSlug } = await params
  const { tema } = await resolveTema(temaSlug)
  const title = `${tema.label} — HAVOC UNDR HEAVEN`
  const desc = tema.desc || undefined
  return {
    title,
    description: desc && desc.length > 160 ? `${desc.slice(0, 157)}…` : desc
  }
}

export default async function TemaPage({ params }) {
  const { tema: temaSlug } = await params
  const { tema, nav } = await resolveTema(temaSlug)

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
        <Link href='/' className='type-item'>Todo</Link>
        {nav.categories.map(c => (
          <Link key={c.slug} href={`/categoria/${c.slug}`} className='type-item'>
            {c.name}
          </Link>
        ))}
        <Link href='/focos' className='type-item'>Focos de Tensión</Link>
        <Link href='/tablero' className='type-item'>Tablero Global</Link>
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
            <Link
              href={`/temas/${temaSlug}`}
              className='feed-filter active'
              scroll={false}
            >
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
