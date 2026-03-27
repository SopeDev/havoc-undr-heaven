import Link from 'next/link'
import SiteHeader from '../../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../../components/SiteFooter/SiteFooter'
import NewsletterSignup from '../../../components/NewsletterSignup/NewsletterSignup'

const TOP_TYPE_ITEMS = [
  { href: '/', label: 'Todo', activeKey: 'todo' },
  { href: '/categoria/analisis', label: 'Análisis', activeKey: 'analisis' },
  { href: '/categoria/reflexion', label: 'Reflexión', activeKey: 'reflexion' },
  { href: '/categoria/newsletter', label: 'Newsletter', activeKey: 'newsletter' },
  { href: '/focos', label: 'Focos de Tensión', activeKey: 'focos' },
  { href: '/tablero', label: 'Tablero Global', activeKey: 'tablero' }
]

const REGION_ITEMS = [
  { slug: 'china', label: 'China' },
  { slug: 'estados-unidos', label: 'Estados Unidos' },
  { slug: 'rusia', label: 'Rusia' },
  { slug: 'asia-pacifico', label: 'Asia-Pacífico' },
  { slug: 'medio-oriente', label: 'Medio Oriente' },
  { slug: 'america-latina', label: 'América Latina' },
  { slug: 'europa', label: 'Europa y Occidente' },
  { slug: 'brics', label: 'BRICS' },
  { slug: 'mexico', label: 'México' },
  { slug: 'geoeconomia', label: 'Geoeconomía' },
  { slug: 'seguridad', label: 'Seguridad' },
  { slug: 'tecnologia', label: 'Tecnología' },
  { slug: 'energia', label: 'Energía y Medio Ambiente' },
  { slug: 'comercio', label: 'Comercio' },
  { slug: 'gobierno', label: 'Gobierno' },
  { slug: 'diplomacia', label: 'Relaciones Internacionales y Diplomacia' },
  { slug: 'mundo', label: 'Mundo' }
]

const FALLBACK = {
  label: 'Mundo',
  desc:
    'El nuevo orden mundial en su totalidad — la contra-globalización, el multipolarismo y los marcos conceptuales para entender la transición sistémica.',
  count: 12,
  latest: '28 Feb 2026',
  sections: 'Análisis · Reflexión',
  related: ['China', 'Estados Unidos', 'Sur Global', 'BRICS', 'Geoeconomía', 'Diplomacia'],
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

export default function TemaPage({ params }) {
  const temaSlug = params?.tema
  const tema = THEMES[temaSlug] || FALLBACK

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
        {TOP_TYPE_ITEMS.map(item => (
          <Link key={item.activeKey} href={item.href} className='type-item'>
            {item.label}
          </Link>
        ))}
      </div>

      <div className='region-bar'>
        <span className='region-item'>Temas</span>
        {REGION_ITEMS.map(item => (
          <Link
            key={item.slug}
            href={`/temas/${item.slug}`}
            className={item.slug === temaSlug ? 'region-item active' : 'region-item'}
          >
            {item.label}
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

      <div className='related-bar'>
        <span className='related-label'>Temas relacionados:</span>
        {tema.related.map(r => (
          <a key={r} href='#' className='related-pill'>
            {r}
          </a>
        ))}
      </div>

      <div className='tema-body'>
        <div className='tema-feed'>
          <div className='feed-filter-row'>
            <div className='feed-filter active'>Todo</div>
            <div className='feed-filter'>Análisis</div>
            <div className='feed-filter'>Reflexión</div>
            <div className='feed-filter'>Newsletter</div>
          </div>

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

          {tema.articles.map(a => (
            <div key={a.title} className='feed-item' role='link' tabIndex={0}>
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
          ))}

          <div className='load-more'>Cargar más artículos</div>
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
                <div key={f.name} className='foco-row'>
                  <div className='fdot-sm' style={{ background: f.color }} />
                  <div>
                    <div className='foco-row-name'>{f.name}</div>
                    <div className='foco-row-region'>{f.region}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </aside>
      </div>

      <SiteFooter />
    </>
  )
}

