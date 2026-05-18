import Link from 'next/link'
import SiteFooter from '../../components/SiteFooter/SiteFooter'
import SiteHeader from '../../components/SiteHeader/SiteHeader'
import { fetchNavLists } from '../../lib/sanity/navigation'
import { fetchRedesSettings } from '../../lib/sanity/redesSettings'
import { getRedesPageConfig } from '../../lib/social'
import TableroGlobalNavLabel from '../../components/TableroGlobalNavLabel/TableroGlobalNavLabel'
import styles from './Redes.module.css'

export const revalidate = 300

export const metadata = {
  title: 'Redes — HAVOC UNDR HEAVEN',
  description:
    'Instagram, YouTube y Spotify de Havoc Undr Heaven: análisis geopolítico en formatos breves, video y audio.'
}

export default async function RedesPage() {
  const [nav, redesSettings] = await Promise.all([fetchNavLists(), fetchRedesSettings()])
  const { instagram, youtube, spotify } = getRedesPageConfig({
    instagramFeaturedPostUrl: redesSettings?.instagramFeaturedPostUrl
  })

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
        <TableroGlobalNavLabel />

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

      <section className={styles.platform} aria-labelledby='redes-ig'>
        <div className={styles.platformIntro}>
          <div className={styles.platformKicker}>Instagram · @{instagram.handle}</div>
          <h2 id='redes-ig' className={styles.platformTitle}>Análisis visual</h2>
          <p className={styles.platformDeck}>
            Publicaciones y reels con la lectura del día. Formato breve, denso en información, pensado para mantenerte
            al corriente del tablero global sin salir del scroll.
          </p>
          <a href={instagram.profileUrl} target='_blank' rel='noreferrer' className={styles.platformCta}>
            Ver en Instagram
          </a>
        </div>
        <div className={styles.platformBody}>
          {instagram.hasEmbed ? (
            <div className={styles.igEmbed}>
              <iframe
                src={instagram.embedUrl}
                title='Publicación destacada en Instagram'
                scrolling='no'
                loading='lazy'
                allowtransparency='true'
              />
            </div>
          ) : (
            <div className={styles.platformFallback}>
              <p>
                En cuanto se fije una publicación destacada aparecerá embebida aquí. Mientras tanto, las últimas
                lecturas visuales están disponibles directamente en el perfil.
              </p>
              <a href={instagram.profileUrl} target='_blank' rel='noreferrer' className={styles.platformFallbackCta}>
                Abrir perfil →
              </a>
            </div>
          )}
        </div>
      </section>

      <section className={styles.platform} aria-labelledby='redes-yt'>
        <div className={styles.platformIntro}>
          <div className={styles.platformKicker}>YouTube</div>
          <h2 id='redes-yt' className={styles.platformTitle}>Investigaciones en video</h2>
          <p className={styles.platformDeck}>
            Análisis estructurales, entrevistas y reportajes con la profundidad que un texto no siempre puede.
            Reproduce la última publicación o explora la cola completa de uploads.
          </p>
          {youtube.profileUrl ? (
            <a href={youtube.profileUrl} target='_blank' rel='noreferrer' className={styles.platformCta}>
              Ver canal completo
            </a>
          ) : null}
        </div>
        <div className={styles.platformBody}>
          {youtube.hasEmbed ? (
            <div className={styles.ytEmbed}>
              <iframe
                src={youtube.embedUrl}
                title='Últimos videos en YouTube'
                loading='lazy'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
              />
            </div>
          ) : (
            <div className={styles.platformFallback}>
              <p>
                Pronto se vinculará el canal de YouTube. Mientras tanto, las nuevas piezas de video se anuncian por
                el resto de las redes.
              </p>
              {youtube.profileUrl ? (
                <a href={youtube.profileUrl} target='_blank' rel='noreferrer' className={styles.platformFallbackCta}>
                  Visitar canal →
                </a>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <section className={styles.platform} aria-labelledby='redes-sp'>
        <div className={styles.platformIntro}>
          <div className={styles.platformKicker}>Spotify</div>
          <h2 id='redes-sp' className={styles.platformTitle}>Podcast semanal</h2>
          <p className={styles.platformDeck}>
            Conversaciones extendidas sobre el nuevo orden mundial. Reproduce el último episodio o suscríbete para
            recibir cada entrega en tu cliente preferido.
          </p>
          {spotify.profileUrl ? (
            <a href={spotify.profileUrl} target='_blank' rel='noreferrer' className={styles.platformCta}>
              Escuchar en Spotify
            </a>
          ) : null}
        </div>
        <div className={styles.platformBody}>
          {spotify.hasEmbed ? (
            <div className={styles.spEmbed}>
              <iframe
                src={spotify.embedUrl}
                title='Reproductor de Spotify'
                loading='lazy'
                allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                allowFullScreen
              />
            </div>
          ) : (
            <div className={styles.platformFallback}>
              <p>
                El reproductor se activará cuando se publique el primer episodio. Suscríbete a la cuenta para recibir
                un aviso en cuanto salga.
              </p>
              {spotify.profileUrl ? (
                <a href={spotify.profileUrl} target='_blank' rel='noreferrer' className={styles.platformFallbackCta}>
                  Ir al perfil →
                </a>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
