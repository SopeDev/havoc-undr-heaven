import Link from 'next/link'
import SiteHeader from '../../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../../components/SiteFooter/SiteFooter'
import NewsletterSignup from '../../../components/NewsletterSignup/NewsletterSignup'
import { DEFAULT_CATEGORY_TAB_LABELS, DEFAULT_CATEGORY_TAB_SLUGS } from '../categoriaConstants'
import { fetchArticlesByCategorySlugLimited, fetchCategoryBySlug } from '../../../lib/sanity/articles'
import { fetchNewsletterIssuesForWeb } from '../../../lib/sanity/newsletterIssues'
import { fetchFocosSidebarByUpdated } from '../../../lib/sanity/focos'
import { fetchNavLists } from '../../../lib/sanity/navigation'
import { formatArticleDate } from '../../../lib/sanity/articleView'
import styles from './page.module.css'

export const revalidate = 60

const DEFAULT_NEWSLETTER_TITLE = 'Newsletter'
const SIDEBAR_SLUG_ANALISIS = 'analisis'
const SIDEBAR_SLUG_REFLEXIONES = 'reflexiones'

function parseTemaSlug(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return null
  return raw.trim().toLowerCase()
}

function tagLineFromArticle(doc) {
  if (!doc) return ''
  return Array.isArray(doc.tagNames) ? doc.tagNames.filter(Boolean).join(' · ') : ''
}

function readingTimeShort(mins) {
  return typeof mins === 'number' ? `${mins} min` : '—'
}

function articleSlugFromDoc(doc) {
  if (!doc) return ''
  const s = doc.slug
  if (typeof s === 'string') return s.trim()
  if (s && typeof s.current === 'string') return s.current.trim()
  return ''
}

function mapIssueArticleToFeedRow(doc) {
  const slug = articleSlugFromDoc(doc)
  if (!slug) return null
  return {
    cat: doc.categoryName || 'Análisis',
    topic: tagLineFromArticle(doc) || '—',
    title: doc.title || '',
    excerpt: doc.deck || '',
    date: formatArticleDate(doc.publishedAt),
    time: readingTimeShort(doc.readingTimeMinutes),
    href: `/articulos/${slug}`
  }
}

function articleMatchesTemaSlug(doc, temaSlug) {
  if (!temaSlug) return true
  const slugs = Array.isArray(doc.tagSlugs) ? doc.tagSlugs.filter(Boolean) : []
  return slugs.includes(temaSlug)
}

function visibleArticleDocsForIssue(issue, temaSlug) {
  if (!Array.isArray(issue.articles)) return []
  return issue.articles.filter(doc => {
    if (!doc) return false
    if (!articleMatchesTemaSlug(doc, temaSlug)) return false
    return Boolean(articleSlugFromDoc(doc))
  })
}

function aggregateIssueThemes(articleDocs) {
  const counts = new Map()
  for (const doc of articleDocs) {
    const names = Array.isArray(doc.tagNames) ? doc.tagNames : []
    const slugs = Array.isArray(doc.tagSlugs) ? doc.tagSlugs : []
    const seen = new Set()
    for (let i = 0; i < names.length; i++) {
      const name = typeof names[i] === 'string' ? names[i].trim() : ''
      const slug = typeof slugs[i] === 'string' ? slugs[i].trim().toLowerCase() : ''
      const key = slug || name.toLowerCase()
      if (!key || seen.has(key)) continue
      seen.add(key)
      const display = name || slug
      const prev = counts.get(key)
      if (prev) prev.count += 1
      else counts.set(key, { name: display, count: 1 })
    }
  }
  return [...counts.values()].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
  })
}

function themeEyebrowFromAgg(sortedThemes) {
  if (!sortedThemes.length) return ''
  return sortedThemes.map(t => t.name).join(' · ')
}

function formatPiezasLabel(n) {
  const k = Math.max(0, Number(n) || 0)
  if (k === 1) return '1 pieza'
  return `${k} piezas`
}

function mapDocsToSidebarRows(docs) {
  return docs.map(d => ({
    tags: tagLineFromArticle(d) || '—',
    title: d.title,
    date: formatArticleDate(d.publishedAt),
    href: `/articulos/${d.slug}`
  }))
}

function newsletterSidebarSectionTitle(nav, resolvedSlug, fallbackTitle) {
  const entry = nav.categories?.find(c => c.slug === resolvedSlug)
  return entry?.name || fallbackTitle
}

export async function generateMetadata() {
  const c = await fetchCategoryBySlug('newsletter')
  const title = c?.name?.trim() || DEFAULT_NEWSLETTER_TITLE
  const description = c?.description?.trim() || ''

  return {
    title: `${title} — HAVOC UNDR HEAVEN`,
    description:
      description && description.length > 160 ? `${description.slice(0, 157)}…` : description || undefined
  }
}

export default async function NewsletterArchivePage({ searchParams }) {
  const sp = await searchParams
  const rawTema = parseTemaSlug(Array.isArray(sp?.tema) ? sp.tema[0] : sp?.tema)

  const [nav, focoSidebarCms, issues, sanityCategory, analisisDocs, reflexionesDocs] =
    await Promise.all([
      fetchNavLists(),
      fetchFocosSidebarByUpdated(4),
      fetchNewsletterIssuesForWeb(),
      fetchCategoryBySlug('newsletter'),
      fetchArticlesByCategorySlugLimited(SIDEBAR_SLUG_ANALISIS, 3),
      fetchArticlesByCategorySlugLimited(SIDEBAR_SLUG_REFLEXIONES, 3)
    ])

  const focoSidebarRows = focoSidebarCms
  const analisisSidebarItems = mapDocsToSidebarRows(analisisDocs)
  const reflexionSidebarItems = mapDocsToSidebarRows(reflexionesDocs)

  const temaSlug =
    rawTema && nav.tags.some(t => t.slug === rawTema) ? rawTema : null

  const pageTitle = sanityCategory?.name?.trim() || DEFAULT_NEWSLETTER_TITLE
  const pageDesc = sanityCategory?.description?.trim() || ''

  const analisisAsideTitle = newsletterSidebarSectionTitle(
    nav,
    SIDEBAR_SLUG_ANALISIS,
    DEFAULT_CATEGORY_TAB_LABELS[SIDEBAR_SLUG_ANALISIS] || 'Análisis'
  )
  const reflexionAsideTitle = newsletterSidebarSectionTitle(
    nav,
    SIDEBAR_SLUG_REFLEXIONES,
    DEFAULT_CATEGORY_TAB_LABELS[SIDEBAR_SLUG_REFLEXIONES] || 'Reflexiones'
  )

  const editionCount = String(issues.length)
  const latestIssued = issues[0]?.issuedAt
  const stats =
    issues.length > 0
      ? [
          { label: 'Ediciones en archivo', val: editionCount },
          { label: 'Más reciente', val: formatArticleDate(latestIssued) },
          { label: 'Entrega', val: 'Semanal' }
        ]
      : [
          { label: 'Ediciones en archivo', val: '0' },
          { label: 'Más reciente', val: '—' },
          { label: 'Entrega', val: 'Semanal' }
        ]

  const issueBundles = issues.map(issue => {
    const visibleDocs = visibleArticleDocsForIssue(issue, temaSlug)
    const themeAgg = aggregateIssueThemes(visibleDocs)
    const safeRows = visibleDocs.flatMap(doc => {
      const row = mapIssueArticleToFeedRow(doc)
      return row ? [row] : []
    })
    return { issue, safeRows, themeAgg }
  })
  const showTemaEmptyMessage =
    Boolean(temaSlug) && issues.length > 0 && !issueBundles.some(b => b.safeRows.length > 0)

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
        <span className='current'>{pageTitle}</span>
      </div>

      <div className='section-tabs'>
        <Link href='/' className='section-tab' aria-label='Todo'>
          Todo
        </Link>
        {tabCategories.map(c => (
          <Link
            key={c.slug}
            href={`/categoria/${c.slug}`}
            className='section-tab'
          >
            {c.name}
          </Link>
        ))}
        <Link href='/categoria/newsletter' className='section-tab active'>
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
            <h1 className='cat-title'>{pageTitle}</h1>
            <p className='cat-desc'>{pageDesc}</p>
          </div>

          <div className='cat-stats'>
            {stats.map(s => (
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
          href='/categoria/newsletter'
          className={!temaSlug ? 'topic-pill active' : 'topic-pill'}
          scroll={false}
        >
          Todos
        </Link>
        {nav.tags.map(t => (
          <Link
            key={t.slug}
            href={`/categoria/newsletter?tema=${t.slug}`}
            className={temaSlug === t.slug ? 'topic-pill active' : 'topic-pill'}
            scroll={false}
          >
            {t.name}
          </Link>
        ))}
      </div>

      <div className='cat-body'>
        <div className='cat-feed'>
          {issues.length === 0 ? (
            <p className={styles.emptyFeed}>Todavía no hay ediciones publicadas en el sitio.</p>
          ) : null}

          {showTemaEmptyMessage ? (
            <p className='cat-feed-empty' style={{ padding: '1.5rem 0', color: 'var(--muted, #666)' }}>
              No hay artículos con este tema en esta categoría. Probá otro filtro o{' '}
              <Link href={`/temas/${temaSlug}`}>ver todo el archivo del tema</Link>.
            </p>
          ) : null}

          {issueBundles.map(({ issue, safeRows, themeAgg }) => {
            if (temaSlug && safeRows.length === 0) return null

            const themeLine = themeEyebrowFromAgg(themeAgg)

            return (
              <section key={issue._id} className={styles.issueBlock} aria-labelledby={`issue-${issue._id}`}>
                <div className='feed-hero feed-hero--dispatch'>
                  <div className='feed-hero-image' aria-hidden />
                  <div className='feed-hero-eyebrow'>
                    <span className='cat-tag'>Dispatch</span>
                    {themeLine ? <span className='topic-tag'>{themeLine}</span> : null}
                  </div>
                  <h2 className='feed-hero-title' id={`issue-${issue._id}`}>
                    {issue.title || 'Dispatch'}
                  </h2>
                  {issue.intro ? <p className='feed-hero-deck'>{issue.intro}</p> : null}
                  <div className='feed-hero-meta feed-hero-meta--dispatch'>
                    <span>{formatArticleDate(issue.issuedAt)}</span>
                    <span>{formatPiezasLabel(safeRows.length)}</span>
                  </div>
                </div>

                {safeRows.length === 0 ? (
                  <p className={styles.emptyFeed}>
                    No hay artículos de esta edición publicados en el sitio todavía.
                  </p>
                ) : (
                  <div className={styles.articleList}>
                    {safeRows.map(item => (
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
                  </div>
                )}
              </section>
            )
          })}
        </div>

        <aside className='cat-sidebar'>
          <div className='sidebar-block'>
            <div className='sidebar-label'>Newsletter Semanal</div>
            <NewsletterSignup />
          </div>

          <div className='sidebar-block'>
            <div className='sidebar-label'>En {analisisAsideTitle}</div>
            {analisisSidebarItems.length > 0 ? (
              analisisSidebarItems.map(s => (
                <Link key={s.href} href={s.href}>
                  <div className='sidebar-art'>
                    <div className='sidebar-art-tag'>{s.tags}</div>
                    <div className='sidebar-art-title'>{s.title}</div>
                    <div className='sidebar-art-date'>{s.date}</div>
                  </div>
                </Link>
              ))
            ) : (
              <p className={styles.sidebarAsideEmpty}>
                Sin piezas recientes.{' '}
                <Link href={`/categoria/${SIDEBAR_SLUG_ANALISIS}`}>Ver archivo de Análisis</Link>
              </p>
            )}
          </div>

          <div className='sidebar-block'>
            <div className='sidebar-label'>En {reflexionAsideTitle}</div>
            {reflexionSidebarItems.length > 0 ? (
              reflexionSidebarItems.map(s => (
                <Link key={s.href} href={s.href}>
                  <div className='sidebar-art'>
                    <div className='sidebar-art-tag'>{s.tags}</div>
                    <div className='sidebar-art-title'>{s.title}</div>
                    <div className='sidebar-art-date'>{s.date}</div>
                  </div>
                </Link>
              ))
            ) : (
              <p className={styles.sidebarAsideEmpty}>
                Sin piezas recientes.{' '}
                <Link href={`/categoria/${SIDEBAR_SLUG_REFLEXIONES}`}>Ver archivo de Reflexiones</Link>
              </p>
            )}
          </div>

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
