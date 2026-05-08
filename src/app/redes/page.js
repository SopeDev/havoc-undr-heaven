import Link from 'next/link'
import SiteFooter from '../../components/SiteFooter/SiteFooter'
import SiteHeader from '../../components/SiteHeader/SiteHeader'
import { fetchNavLists } from '../../lib/sanity/navigation'
import { fetchRedesPageData } from '../../lib/social'
import styles from './Redes.module.css'

export const revalidate = 300

export const metadata = {
  title: 'Redes — HAVOC UNDR HEAVEN',
  description:
    'Instagram, YouTube y Spotify de Havoc Undr Heaven: análisis geopolítico en formatos breves, video y audio.'
}

const formatDate = iso => {
  if (!iso) return 'Sin fecha'
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(t))
}

const fallbackCopy = platform =>
  platform === 'instagram'
    ? 'Conectaremos el feed en vivo cuando se habiliten los permisos de plataforma. Mientras tanto, síguenos para ver el stream completo.'
    : 'No pudimos cargar este stream ahora mismo. Intenta abrirlo directamente en la plataforma.'

export default async function RedesPage() {
  const [{ streams, latest }, nav] = await Promise.all([fetchRedesPageData(), fetchNavLists()])

  return (
    <>
      <SiteHeader />

      <div className='breadcrumb'>
        <span>
          <Link href='/'>Inicio</Link>
        </span>
        <span className='sep'>›</span>
        <span className='current'>Redes</span>
      </div>

      <div className='type-bar'>
        <Link href='/' className='type-item'>Todo</Link>
        {nav.categories
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
        {nav.tags.map(t => (
          <Link key={t.slug} href={`/temas/${t.slug}`} className='region-item'>
            {t.name}
          </Link>
        ))}
      </div>

      <section className={styles.hero}>
        <div className={styles.heroKicker}>Canales en vivo</div>
        <h1 className={styles.heroTitle}>Redes</h1>
        <p className={styles.heroDeck}>
          Tres formatos, una misma tesis editorial: geopolítica rigurosa en tiempo real para leer el nuevo orden
          mundial desde texto breve, video y audio.
        </p>
      </section>

      <section className={styles.streams} aria-label='Streams de contenido'>
        {streams.map(stream => (
          <article key={stream.platform} className={styles.streamCard}>
            <div className={styles.streamHead}>
              <h2 className={styles.streamTitle}>{stream.label}</h2>
              <a href={stream.profileUrl} target='_blank' rel='noreferrer' className={styles.streamCta}>
                {stream.ctaLabel}
              </a>
            </div>

            {stream.items.length === 0 ? (
              <p className={styles.streamEmpty}>{fallbackCopy(stream.platform)}</p>
            ) : (
              <ul className={styles.streamList}>
                {stream.items.slice(0, 4).map(item => (
                  <li key={`${stream.platform}-${item.id}`} className={styles.streamItem}>
                    <a href={item.href} target='_blank' rel='noreferrer' className={styles.streamLink}>
                      {item.imageUrl ? <img src={item.imageUrl} alt='' className={styles.streamThumb} loading='lazy' /> : null}
                      <div className={styles.streamBody}>
                        <div className={styles.streamMeta}>
                          <span>{item.kind}</span>
                          <span>{formatDate(item.publishedAt)}</span>
                        </div>
                        <h3 className={styles.streamItemTitle}>{item.title}</h3>
                        {item.excerpt ? <p className={styles.streamExcerpt}>{item.excerpt}</p> : null}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>

      <section className={styles.latest} aria-label='Lo último en redes'>
        <div className={styles.latestHead}>
          <h2 className={styles.latestTitle}>Lo último</h2>
          <p className={styles.latestDeck}>Un corte transversal de las publicaciones más recientes en todos los canales.</p>
        </div>
        {latest.length === 0 ? (
          <p className={styles.latestEmpty}>Todavía no hay piezas disponibles para este panel.</p>
        ) : (
          <div className={styles.latestGrid}>
            {latest.map(item => (
              <a
                key={`latest-${item.platform}-${item.id}`}
                href={item.href}
                target='_blank'
                rel='noreferrer'
                className={styles.latestCard}
              >
                <div className={styles.latestPlatform}>{item.platform}</div>
                <h3 className={styles.latestCardTitle}>{item.title}</h3>
                <div className={styles.latestMeta}>{formatDate(item.publishedAt)}</div>
              </a>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </>
  )
}
