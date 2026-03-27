import SiteHeader from '../components/SiteHeader/SiteHeader'
import SiteFooter from '../components/SiteFooter/SiteFooter'
import NewsletterSignup from '../components/NewsletterSignup/NewsletterSignup'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <SiteHeader />
      {/* <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <NewsletterSignup />
        <div className={styles.intro}>
          <h1>To get started, edit the page.js file.</h1>
          <p>
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className={styles.secondary}
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
      </div> */}

      <div className='type-bar'>
        <Link href='/' className='type-item active'>Todo</Link>
        <Link href='/categoria/analisis' className='type-item'>Análisis</Link>
        <Link href='/categoria/reflexion' className='type-item'>Reflexión</Link>
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
        <Link href='/temas/china' className='region-item'>China</Link>
        <Link href='/temas/estados-unidos' className='region-item'>Estados Unidos</Link>
        <Link href='/temas/rusia' className='region-item'>Rusia</Link>
        <Link href='/temas/asia-pacifico' className='region-item'>Asia-Pacífico</Link>
        <Link href='/temas/medio-oriente' className='region-item'>Medio Oriente</Link>
        <Link href='/temas/america-latina' className='region-item'>América Latina</Link>
        <Link href='/temas/europa' className='region-item'>Europa y Occidente</Link>
        <Link href='/temas/brics' className='region-item'>BRICS</Link>
        <Link href='/temas/mexico' className='region-item'>México</Link>
        <Link href='/temas/geoeconomia' className='region-item'>Geoeconomía</Link>
        <Link href='/temas/seguridad' className='region-item'>Seguridad</Link>
        <Link href='/temas/tecnologia' className='region-item'>Tecnología</Link>
        <Link href='/temas/energia' className='region-item'>Energía y Medio Ambiente</Link>
        <Link href='/temas/comercio' className='region-item'>Comercio</Link>
        <Link href='/temas/gobierno' className='region-item'>Gobierno</Link>
        <Link href='/temas/diplomacia' className='region-item'>Relaciones Internacionales y Diplomacia</Link>
        <Link href='/temas/mundo' className='region-item'>Mundo</Link>
      </div>

      <div className='home-content-wrap'>
        <div className='site-body site-body--flush'>
          <main>
            <article className='hero-article'>
              <div className='hero-eyebrow'>
                <span className='hero-cat-tag'>Análisis</span>
                <span className='hero-region'>Estados Unidos · China · Tecnología</span>
                <span className='hero-featured-label'>Más reciente</span>
              </div>
              <h1 className='hero-title'>
                <Link href='/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips' className='hero-title-link'>
                  La guerra de los semiconductores no es sobre chips
                </Link>
              </h1>
              <p className='hero-deck'>
                Los controles de exportación de Washington son el primer movimiento de una campaña más profunda — una sobre quién define la arquitectura de la próxima era industrial.
              </p>
              <div className='hero-image' />
              <div className='hero-meta'>
                <span>28 Feb 2026</span>
                <span>8 min de lectura</span>
                <span>Havoc Undr Heaven</span>
              </div>
            </article>

            <div className='article-feed'>
              <div className='feed-item'>
                <div>
                  <div className='feed-eyebrow'>
                    <span className='feed-cat'>Análisis</span>
                    <span className='feed-region'>Rusia · Economía</span>
                  </div>
                  <div className='feed-title'>La guerra silenciosa del rublo</div>
                  <div className='feed-excerpt'>
                    A pesar de las sanciones occidentales, el superávit comercial ruso se mantiene redirigido a través de los Emiratos, Turquía e India.
                  </div>
                  <div className='feed-meta'>25 Feb 2026 · 5 min</div>
                </div>
                <div className='feed-thumb' />
              </div>

              <div className='feed-item'>
                <div>
                  <div className='feed-eyebrow'>
                    <span className='feed-cat'>Reflexión</span>
                    <span className='feed-region'>África · Soberanía</span>
                  </div>
                  <div className='feed-title'>El giro deliberado del Sahel</div>
                  <div className='feed-excerpt'>
                    De Mali a Níger y Burkina Faso, las juntas expulsan a las fuerzas francesas. No es un vacío de poder — es un pivote estratégico deliberado.
                  </div>
                  <div className='feed-meta'>22 Feb 2026 · 6 min</div>
                </div>
                <div className='feed-thumb' />
              </div>

              <div className='feed-item'>
                <div>
                  <div className='feed-eyebrow'>
                    <span className='feed-cat'>Newsletter</span>
                    <span className='feed-region'>Dispatch №001</span>
                  </div>
                  <div className='feed-title'>Havoc Dispatch №001 — Febrero 28, 2026</div>
                  <div className='feed-excerpt'>
                    La guerra de semiconductores, el giro del Sahel, la no alineación india y la señal de la desdolarización.
                  </div>
                  <div className='feed-meta'>28 Feb 2026 · Edición semanal</div>
                </div>
                <div className='feed-thumb' />
              </div>

              <div className='feed-item'>
                <div>
                  <div className='feed-eyebrow'>
                    <span className='feed-cat'>Análisis</span>
                    <span className='feed-region'>India · Estrategia</span>
                  </div>
                  <div className='feed-title'>La no alineación como modelo de negocio</div>
                  <div className='feed-excerpt'>
                    Nueva Delhi compra petróleo ruso con descuento, vende refinados a Europa con prima y mantiene alianzas con Washington y Moscú simultáneamente.
                  </div>
                  <div className='feed-meta'>19 Feb 2026 · 7 min</div>
                </div>
                <div className='feed-thumb' />
              </div>
            </div>
          </main>

          <aside className='sidebar'>
            <div className='sidebar-block'>
              <div className='sidebar-label'>Newsletter Semanal</div>
              <NewsletterSignup />
            </div>

            <div className='sidebar-block'>
              <div className='sidebar-label'>Focos de Tensión</div>
              <div className='theatre-row'>
                <div className='tdot hot' />
                <div>
                  <div className='theatre-name'>Ucrania — Frente Activo</div>
                  <div className='theatre-region'>Europa del Este</div>
                </div>
              </div>
              <div className='theatre-row'>
                <div className='tdot warm' />
                <div>
                  <div className='theatre-name'>Estrecho de Taiwán</div>
                  <div className='theatre-region'>Indo-Pacífico</div>
                </div>
              </div>
              <div className='theatre-row'>
                <div className='tdot hot' />
                <div>
                  <div className='theatre-name'>Reconfiguración Post-Gaza</div>
                  <div className='theatre-region'>Medio Oriente</div>
                </div>
              </div>
              <div className='theatre-row'>
                <div className='tdot warm' />
                <div>
                  <div className='theatre-name'>Expansión BRICS+</div>
                  <div className='theatre-region'>América Latina · Global</div>
                </div>
              </div>
              <div className='theatre-row'>
                <div className='tdot cold' />
                <div>
                  <div className='theatre-name'>Rearmamento Europeo</div>
                  <div className='theatre-region'>Europa</div>
                </div>
              </div>
            </div>

            <div className='sidebar-block'>
              <div className='sidebar-label'>También en HUH</div>
              <div className='sidebar-art'>
                <div className='sidebar-art-tag'>Medio Oriente · Finanzas</div>
                <div className='sidebar-art-title'>Arabia Saudita, el yuan y el fin del petrodólar</div>
                <div className='sidebar-art-date'>15 Feb 2026</div>
              </div>
              <div className='sidebar-art'>
                <div className='sidebar-art-tag'>Europa · Energía</div>
                <div className='sidebar-art-title'>La independencia energética europea como proyecto político</div>
                <div className='sidebar-art-date'>12 Feb 2026</div>
              </div>
              <div className='sidebar-art'>
                <div className='sidebar-art-tag'>China · BRI</div>
                <div className='sidebar-art-title'>Cómo la Ruta de la Seda compra lealtad política</div>
                <div className='sidebar-art-date'>3 Feb 2026</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className='dispatches-strip'>
        <div className='dispatches-inner'>
          <div className='dispatches-header'>Despachos Recientes</div>
          <div className='dispatches-grid'>
            <div className='dispatch-card'>
              <div className='dispatch-eyebrow'>
                <span className='dispatch-cat'>Análisis</span>
                <span className='dispatch-region-tag'>China · Diplomacia</span>
              </div>
              <span className='dispatch-title'>El silencio calculado de Beijing sobre Ucrania</span>
              <div className='dispatch-body'>
                China mantiene una neutralidad que le permite conservar relaciones con Moscú y Bruselas — una disciplina diplomática que Washington no puede replicar.
              </div>
            </div>

            <div className='dispatch-card'>
              <div className='dispatch-eyebrow'>
                <span className='dispatch-cat'>Reflexión</span>
                <span className='dispatch-region-tag'>América Latina · BRICS</span>
              </div>
              <span className='dispatch-title'>Brasil bajo Lula: el Sur Global toma posición</span>
              <div className='dispatch-body'>
                La política exterior brasileña se afirma como independiente. Lula construye un rol de mediador que ningún gobierno latinoamericano ha intentado con esta consistencia en décadas.
              </div>
            </div>

            <div className='dispatch-card'>
              <div className='dispatch-eyebrow'>
                <span className='dispatch-cat'>Análisis</span>
                <span className='dispatch-region-tag'>Europa · Soberanía</span>
              </div>
              <span className='dispatch-title'>La OTAN después de Trump: ¿autonomía o dependencia?</span>
              <div className='dispatch-body'>
                El debate sobre la defensa europea ya no es teórico. Los presupuestos militares suben pero la capacidad real de actuar sin EEUU sigue sin respuesta.
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  )
}
