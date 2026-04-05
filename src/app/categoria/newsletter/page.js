import Link from 'next/link'
import SiteHeader from '../../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../../components/SiteFooter/SiteFooter'
import NewsletterSignup from '../../../components/NewsletterSignup/NewsletterSignup'
import {
  CATEGORY_DATA,
  CATEGORIA_TOPIC_FILTERS,
  FOCO_ROWS,
  VALID_CATEGORY_SLUGS
} from '../categoriaMockData'
import { fetchArticlesByCategorySlugLimited, fetchCategoryBySlug } from '../../../lib/sanity/articles'
import { isSanityConfigured } from '../../../lib/sanity/client'
import { fetchNewsletterIssuesForWeb } from '../../../lib/sanity/newsletterIssues'
import { fetchFocosSidebarByUpdated } from '../../../lib/sanity/focos'
import { fetchNavLists } from '../../../lib/sanity/navigation'
import { formatArticleDate } from '../../../lib/sanity/articleView'
import styles from './page.module.css'

export const revalidate = 60

const MOCK_NEWSLETTER = CATEGORY_DATA.newsletter

function parseTemaSlug(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return null
  return raw.trim().toLowerCase()
}

function tagSlugsFromMockTopic(topicLabel) {
  if (!topicLabel || typeof topicLabel !== 'string') return []
  const hit = CATEGORIA_TOPIC_FILTERS.find(
    f => f.label.toLowerCase() === topicLabel.trim().toLowerCase()
  )
  return hit ? [hit.slug] : []
}

function tagLineFromArticle(doc) {
  if (!doc) return ''
  return Array.isArray(doc.tagNames) ? doc.tagNames.filter(Boolean).join(' · ') : ''
}

function readingTimeShort(mins) {
  return typeof mins === 'number' ? `${mins} min` : '—'
}

function mockIssuesFromFallback() {
  const m = MOCK_NEWSLETTER
  const slugFromHref = href =>
    typeof href === 'string' && href.startsWith('/articulos/')
      ? href.slice('/articulos/'.length)
      : ''

  const toArticle = row => ({
    title: row.title,
    slug: slugFromHref(row.href),
    deck: row.deck || row.excerpt || '',
    publishedAt: null,
    readingTimeMinutes: null,
    categoryName: row.cat || 'Newsletter',
    tagNames: row.topic ? [row.topic] : [],
    tagSlugs: tagSlugsFromMockTopic(row.topic)
  })

  const articles = [m.hero, ...m.items].map(toArticle).filter(a => a.slug)
  const issueTitle =
    typeof m.hero?.title === 'string' && m.hero.title.includes('—')
      ? m.hero.title.split('—')[0].trim()
      : 'Havoc Dispatch'

  return [
    {
      _id: 'mock-newsletter-issue',
      title: issueTitle,
      issuedAt: '2026-02-28T12:00:00.000Z',
      intro: m.hero?.deck || m.desc,
      articles
    }
  ]
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

/** Article docs in this issue that pass tema + slug (same set as feed rows). */
function visibleArticleDocsForIssue(issue, temaSlug) {
  if (!Array.isArray(issue.articles)) return []
  return issue.articles.filter(doc => {
    if (!doc) return false
    if (!articleMatchesTemaSlug(doc, temaSlug)) return false
    return Boolean(articleSlugFromDoc(doc))
  })
}

/**
 * Count tag appearances across articles (each tag at most once per article).
 * Sort: higher count first, then name A–Z (es).
 */
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

function mockSidebarItemsFromCategorySlug(slug) {
  const mock = CATEGORY_DATA[slug]
  if (!mock) return []
  const rows = []
  if (mock.hero) {
    rows.push({
      tags: mock.hero.topic,
      title: mock.hero.title,
      date: mock.hero.date,
      href: mock.hero.href
    })
  }
  if (mock.items) {
    for (const item of mock.items) {
      if (rows.length >= 3) break
      rows.push({
        tags: item.topic,
        title: item.title,
        date: item.date,
        href: item.href
      })
    }
  }
  return rows.slice(0, 3)
}

function mapDocsToSidebarRows(docs) {
  return docs.map(d => ({
    tags: tagLineFromArticle(d) || '—',
    title: d.title,
    date: formatArticleDate(d.publishedAt),
    href: `/articulos/${d.slug}`
  }))
}

/** CMS category slugs (only editorial lanes + newsletter + redes in mock). */
const SIDEBAR_SLUG_ANALISIS = 'analisis'
const SIDEBAR_SLUG_REFLEXIONES = 'reflexiones'

function newsletterSidebarSectionTitle(nav, resolvedSlug, fallbackTitle) {
  const entry = nav.categories?.find(c => c.slug === resolvedSlug)
  return entry?.name || fallbackTitle
}

export async function generateMetadata() {
  let title = MOCK_NEWSLETTER.title
  let description = MOCK_NEWSLETTER.desc

  if (isSanityConfigured()) {
    const c = await fetchCategoryBySlug('newsletter')
    if (c?.name) title = c.name
    if (c?.description) description = c.description
  }

  return {
    title: `${title} — HAVOC UNDR HEAVEN`,
    description:
      description && description.length > 160 ? `${description.slice(0, 157)}…` : description || undefined
  }
}

export default async function NewsletterArchivePage({ searchParams }) {
  const sp = await searchParams
  const rawTema = parseTemaSlug(Array.isArray(sp?.tema) ? sp.tema[0] : sp?.tema)

  const sanityOn = isSanityConfigured()
  let nav = { categories: [], tags: [] }
  let focoSidebarRows = FOCO_ROWS
  let issues = []
  let sanityCategory = null

  let analisisSidebarItems = []
  let reflexionSidebarItems = []
  const analisisArchiveSlug = SIDEBAR_SLUG_ANALISIS
  const reflexionArchiveSlug = SIDEBAR_SLUG_REFLEXIONES

  if (sanityOn) {
    const [navLists, focoSidebarCms, fetchedIssues, cat, analisisDocs, reflexionesDocs] =
      await Promise.all([
        fetchNavLists(),
        fetchFocosSidebarByUpdated(4),
        fetchNewsletterIssuesForWeb(),
        fetchCategoryBySlug('newsletter'),
        fetchArticlesByCategorySlugLimited(SIDEBAR_SLUG_ANALISIS, 3),
        fetchArticlesByCategorySlugLimited(SIDEBAR_SLUG_REFLEXIONES, 3)
      ])
    nav = navLists
    if (focoSidebarCms.length > 0) focoSidebarRows = focoSidebarCms
    issues = fetchedIssues
    sanityCategory = cat
    analisisSidebarItems = mapDocsToSidebarRows(analisisDocs)
    reflexionSidebarItems = mapDocsToSidebarRows(reflexionesDocs)
  } else {
    issues = mockIssuesFromFallback()
    analisisSidebarItems = mockSidebarItemsFromCategorySlug(SIDEBAR_SLUG_ANALISIS)
    reflexionSidebarItems = mockSidebarItemsFromCategorySlug(SIDEBAR_SLUG_REFLEXIONES)
  }

  const temaSlug =
    rawTema && nav.tags.some(t => t.slug === rawTema) ? rawTema : null

  const pageTitle = sanityCategory?.name || MOCK_NEWSLETTER.title
  const pageDesc = sanityCategory?.description || MOCK_NEWSLETTER.desc

  const analisisAsideTitle = newsletterSidebarSectionTitle(
    nav,
    analisisArchiveSlug,
    CATEGORY_DATA.analisis?.title || 'Análisis'
  )
  const reflexionAsideTitle = newsletterSidebarSectionTitle(
    nav,
    reflexionArchiveSlug,
    'Reflexiones'
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
        {(nav.categories.length > 0
          ? nav.categories
          : VALID_CATEGORY_SLUGS.map(slug => ({
              name: CATEGORY_DATA[slug]?.title || slug,
              slug
            }))
        ).map(c => (
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
                <Link href={`/categoria/${analisisArchiveSlug}`}>Ver archivo de Análisis</Link>
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
                <Link href={`/categoria/${reflexionArchiveSlug}`}>Ver archivo de Reflexiones</Link>
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
