import Link from 'next/link'
import SiteHeader from '../SiteHeader/SiteHeader'
import SiteFooter from '../SiteFooter/SiteFooter'
import NewsletterSignup from '../NewsletterSignup/NewsletterSignup'

/**
 * @param {{
 *   categories: Array<{ name: string, slug: string }>,
 *   tags: Array<{ name: string, slug: string }>,
 *   hero: { cat: string, topic: string, title: string, excerpt: string, dateStr: string, timeReadStr: string, href: string } | null,
 *   feedItems: Array<{ cat: string, topic: string, title: string, excerpt: string, dateStr: string, timeStr: string, href: string }>,
 *   sidebarArticles: Array<{ cat: string, topic: string, title: string, excerpt: string, dateStr: string, href: string }>,
 *   dispatchItems: Array<{ cat: string, topic: string, title: string, body: string }>,
 *   focoRows: Array<{ name: string, region: string, kind: string, slug: string | null }>
 * }} props
 */
export default function Home({
  categories,
  tags,
  hero,
  feedItems,
  sidebarArticles,
  dispatchItems,
  focoRows
}) {
  return (
    <>
      <SiteHeader />

      <div className='type-bar'>
        <Link href='/' className='type-item active'>Todo</Link>
        {categories
          .filter(c => c.slug !== 'newsletter')
          .map(c => (
            <Link key={c.slug} href={`/categoria/${c.slug}`} className='type-item'>
              {c.name}
            </Link>
          ))}
        <Link href='/categoria/newsletter' className='type-item'>Newsletter</Link>
        <Link href='/focos' className='type-item'>Focos de Tensión</Link>
        <Link href='/tablero' className='type-item'>Tablero Global</Link>

        <form className='type-bar-search' action='/buscar' method='get'>
          <input type='text' name='q' placeholder='Buscar' />
          <button type='submit'>⌕</button>
        </form>
      </div>

      <div className='region-bar'>
        <span className='region-item active'>Temas</span>
        {tags.map(t => (
          <Link key={t.slug} href={`/temas/${t.slug}`} className='region-item'>
            {t.name}
          </Link>
        ))}
      </div>

      <div className='home-content-wrap'>
        <div className='site-body site-body--flush'>
          <main>
            {hero ? (
              <article className='hero-article'>
                <div className='hero-eyebrow'>
                  <span className='hero-cat-tag'>{hero.cat}</span>
                  <span className='hero-region'>{hero.topic}</span>
                  <span className='hero-featured-label'>Más reciente</span>
                </div>
                <h1 className='hero-title'>
                  <Link href={hero.href} className='hero-title-link'>
                    {hero.title}
                  </Link>
                </h1>
                <p className='hero-deck'>{hero.excerpt}</p>
                <div className='hero-image' />
                <div className='hero-meta'>
                  <span>{hero.dateStr}</span>
                  <span>{hero.timeReadStr}</span>
                  <span>Havoc Undr Heaven</span>
                </div>
              </article>
            ) : (
              <p className='hero-deck' style={{ padding: '2rem 0', color: 'var(--muted, #666)' }}>
                No hay artículos publicados todavía.
              </p>
            )}

            <div className='article-feed'>
              {feedItems.map(item => (
                <Link key={item.href} href={item.href}>
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
                </Link>
              ))}
            </div>
          </main>

          <aside className='sidebar'>
            <div className='sidebar-block'>
              <div className='sidebar-label'>Newsletter Semanal</div>
              <NewsletterSignup />
            </div>

            <div className='sidebar-block'>
              <div className='sidebar-label'>Focos de Tensión</div>
              {focoRows.map(f => (
                <Link key={f.slug || f.name} href={f.slug ? `/focos/${f.slug}` : '#'}>
                  <div className='theatre-row'>
                    <div className={`tdot ${f.kind}`} />
                    <div>
                      <div className='theatre-name'>{f.name}</div>
                      <div className='theatre-region'>{f.region}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {sidebarArticles.length > 0 ? (
              <div className='sidebar-block'>
                <div className='sidebar-label'>También en HUH</div>
                {sidebarArticles.map(s => (
                  <Link key={s.href} href={s.href}>
                    <div className='sidebar-art'>
                      <div className='sidebar-art-tag'>{s.topic}</div>
                      <div className='sidebar-art-title'>{s.title}</div>
                      <div className='sidebar-art-date'>{s.dateStr}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      {dispatchItems.length > 0 ? (
        <div className='dispatches-strip'>
          <div className='dispatches-inner'>
            <div className='dispatches-header'>Despachos Recientes</div>
            <div className='dispatches-grid'>
              {dispatchItems.map((d, i) => (
                <div key={i} className='dispatch-card'>
                  <div className='dispatch-eyebrow'>
                    <span className='dispatch-cat'>{d.cat}</span>
                    <span className='dispatch-region-tag'>{d.topic}</span>
                  </div>
                  <span className='dispatch-title'>{d.title}</span>
                  <div className='dispatch-body'>{d.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <SiteFooter />
    </>
  )
}
