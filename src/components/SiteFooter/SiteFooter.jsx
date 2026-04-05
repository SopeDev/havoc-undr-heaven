import Link from 'next/link'

export default function SiteFooter() {
  return (
    <>
      <footer>
        <div>
          <div className='footer-logo-text'>HAVOC UNDR HEAVEN</div>
          <div className='footer-catch'>
            El nuevo orden mundial está aquí.
            <br />
            Nosotros lo explicamos.
          </div>
        </div>

        <div>
          <div className='footer-col-title'>Secciones</div>
          <ul className='footer-links'>
            <li>
              <Link href='/categoria/analisis'>Análisis</Link>
            </li>
            <li>
              <Link href='/categoria/reflexiones'>Reflexiones</Link>
            </li>
            <li>
              <Link href='/categoria/newsletter'>Newsletter</Link>
            </li>
            <li>
              <Link href='/focos'>Focos de Tensión</Link>
            </li>
            <li>
              <Link href='/tablero'>Tablero Global</Link>
            </li>
          </ul>
        </div>

        <div>
          <div className='footer-col-title'>Acerca De</div>
          <ul className='footer-links'>
            <li>
              <Link href='/nosotros'>Nosotros</Link>
            </li>
            <li>
              <Link href='/categoria/redes'>Redes</Link>
            </li>
            <li>
              <a href='#'>Contacto</a>
            </li>
            <li>
              <Link href='/categoria/newsletter'>Suscribirse</Link>
            </li>
          </ul>
        </div>
      </footer>

      <div className='footer-bottom'>
        <span className='footer-copy'>© 2026 Havoc Undr Heaven · Todos los derechos reservados</span>
        <div className='footer-social'>
          <a href='#'>Instagram</a>
          <a href='#'>Spotify</a>
          <Link href='/categoria/newsletter'>Newsletter</Link>
        </div>
      </div>
    </>
  )
}

