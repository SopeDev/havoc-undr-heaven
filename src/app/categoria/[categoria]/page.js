import { notFound } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '../../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../../components/SiteFooter/SiteFooter'
import NewsletterSignup from '../../../components/NewsletterSignup/NewsletterSignup'
import {
  DEFAULT_CATEGORY_TAB_LABELS,
  DEFAULT_CATEGORY_TAB_SLUGS,
  resolveCrossCategorySlug
} from '../categoriaConstants'
import {
  fetchArticlesByCategorySlug,
  fetchArticlesByCategorySlugLimited,
  fetchCategoryBySlug
} from '../../../lib/sanity/articles'
import { isSanityConfigured } from '../../../lib/sanity/client'
import { mergeCategoriaPage } from '../../../lib/sanity/categoriaPageData'
import { fetchFocosSidebarByUpdated } from '../../../lib/sanity/focos'
import { fetchNavLists } from '../../../lib/sanity/navigation'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { categoria } = await params
  let title = 'Categoría'
  let description = ''

  const c = await fetchCategoryBySlug(categoria)
  if (c?.name) title = c.name
  if (c?.description) description = c.description

  return {
    title: `${title} — HAVOC UNDR HEAVEN`,
    description: description && description.length > 160 ? `${description.slice(0, 157)}…` : description || undefined
  }
}

function parseTemaSlug(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return null
  return raw.trim().toLowerCase()
}

export default async function CategoriaPage({ params, searchParams }) {
  const { categoria: key } = await params
  const sp = await searchParams
  const rawTema = parseTemaSlug(Array.isArray(sp?.tema) ? sp.tema[0] : sp?.tema)

  const sanityOn = isSanityConfigured()

  const [sanityCategory, nav, focoSidebarCms] = await Promise.all([
    fetchCategoryBySlug(key),
    fetchNavLists(),
    fetchFocosSidebarByUpdated(4)
  ])

  const temaSlug = rawTema && nav.tags.some(t => t.slug === rawTema) ? rawTema : null
  const sanityArticles = await fetchArticlesByCategorySlug(
    key,
    temaSlug ? { tagSlug: temaSlug } : {}
  )

  const crossSlug = resolveCrossCategorySlug(key, nav.categories)
  const crossCategoryTitle = crossSlug
    ? nav.categories.find(c => c.slug === crossSlug)?.name || null
    : null
  const crossCategoryArticles = crossSlug
    ? await fetchArticlesByCategorySlugLimited(crossSlug, 3)
    : []

  const focoSidebarRows = focoSidebarCms

  const validCategorySlugs =
    nav.categories.length > 0 ? nav.categories.map(c => c.slug) : DEFAULT_CATEGORY_TAB_SLUGS

  if (!validCategorySlugs.includes(key)) {
    notFound()
  }

  const tagFilterActive = Boolean(temaSlug)

  const data = mergeCategoriaPage(sanityCategory, sanityArticles, {
    tagFilterActive,
    sanityConfigured: sanityOn,
    crossCategorySidebarArticles: crossCategoryArticles,
    crossCategoryTitle
  })

  const sidebarItems = data.sidebar?.length > 0 ? data.sidebar : []
  const sidebarTitle = data.sidebar?.length > 0 ? data.sidebarSectionTitle || '—' : ''

  const tabCategories =
    nav.categories.length > 0
      ? nav.categories
      : DEFAULT_CATEGORY_TAB_SLUGS.map(slug => ({
          name: DEFAULT_CATEGORY_TAB_LABELS[slug] || slug,
          slug
        }))

  return (
    <>
      <SiteHeader />

      <div className='breadcrumb'>
        <span>
          <Link href='/'>Inicio</Link>
        </span>
        <span className='sep'>›</span>
        <span className='current'>{data.title}</span>
      </div>

      <div className='section-tabs'>
        <Link href='/' className='section-tab' aria-label='Todo'>
          Todo
        </Link>
        {tabCategories.map(c => (
          <Link
            key={c.slug}
            href={`/categoria/${c.slug}`}
            className={key === c.slug ? 'section-tab active' : 'section-tab'}
          >
            {c.name}
          </Link>
        ))}
        <Link href='/categoria/newsletter' className='section-tab'>
          Newsletter
        </Link>
        <Link href='/focos' className='section-tab'>
          Focos de Tensión
        </Link>
        <Link href='/tablero' className='section-tab'>
          Tablero Global
        </Link>
      </div>

      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div className='cat-header'>
          <div>
            <h1 className='cat-title'>{data.title}</h1>
            <p className='cat-desc'>{data.desc}</p>
          </div>

          <div className='cat-stats'>
            {data.stats.map(s => (
              <div key={s.label} className='cat-stat-row'>
                <span className='cat-stat-label'>{s.label}</span>
                <span className='cat-stat-val'>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='topic-filter'>
        <span className='topic-label'>Filtrar por tema:</span>
        <Link
          href={`/categoria/${key}`}
          className={!temaSlug ? 'topic-pill active' : 'topic-pill'}
          scroll={false}
        >
          Todos
        </Link>
        {nav.tags.map(t => (
          <Link
            key={t.slug}
            href={`/categoria/${key}?tema=${t.slug}`}
            className={temaSlug === t.slug ? 'topic-pill active' : 'topic-pill'}
            scroll={false}
          >
            {t.name}
          </Link>
        ))}
      </div>

      <div className='cat-body'>
        <div className='cat-feed'>
          {data.feedEmpty ? (
            <p className='cat-feed-empty' style={{ padding: '1.5rem 0', color: 'var(--muted, #666)' }}>
              {tagFilterActive && temaSlug ? (
                <>
                  No hay artículos con este tema en esta categoría. Probá otro filtro o{' '}
                  <Link href={`/temas/${temaSlug}`}>ver todo el archivo del tema</Link>.
                </>
              ) : (
                <>No hay artículos publicados en esta categoría todavía.</>
              )}
            </p>
          ) : null}

          {!data.feedEmpty && data.hero ? (
            <Link href={data.hero.href}>
              <div className='feed-hero' role='link' tabIndex={0}>
                <div className='feed-hero-image' />
                <div className='feed-hero-eyebrow'>
                  <span className='cat-tag'>{data.hero.cat}</span>
                  <span className='topic-tag'>{data.hero.topic}</span>
                </div>
                <h2 className='feed-hero-title'>{data.hero.title}</h2>
                <p className='feed-hero-deck'>{data.hero.deck}</p>
                <div className='feed-hero-meta'>
                  <span>{data.hero.date}</span>
                  <span>{data.hero.time}</span>
                </div>
              </div>
            </Link>
          ) : null}

          {data.items.map(item => (
            <Link key={item.href} href={item.href}>
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
            </Link>
          ))}

          {!data.feedEmpty && (data.hero || data.items.length > 0) ? (
            <div className='load-more'>Cargar más artículos</div>
          ) : null}
        </div>

        <aside className='cat-sidebar'>
          <div className='sidebar-block'>
            <div className='sidebar-label'>Newsletter Semanal</div>
            <NewsletterSignup />
          </div>

          {sidebarItems.length > 0 ? (
            <div className='sidebar-block'>
              <div className='sidebar-label'>En {sidebarTitle}</div>
              {sidebarItems.map(s => (
                <Link key={s.href} href={s.href}>
                  <div className='sidebar-art'>
                    <div className='sidebar-art-tag'>{s.tags}</div>
                    <div className='sidebar-art-title'>{s.title}</div>
                    <div className='sidebar-art-date'>{s.date}</div>
                  </div>
                </Link>
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
