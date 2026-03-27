import Link from 'next/link'
import SiteHeader from '../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../components/SiteFooter/SiteFooter'

export default function TableroPage() {
  return (
    <>
      <SiteHeader />
      <div className='breadcrumb'>
        <span>
          <Link href='/'>Inicio</Link>
        </span>
        <span className='sep'>›</span>
        <span className='current'>Tablero Global</span>
      </div>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 48px 120px' }}>
        <p
          style={{
            fontSize: '10px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: 16
          }}
        >
          Próximamente
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 8vw, 64px)',
            letterSpacing: '2px',
            lineHeight: 1.05,
            marginBottom: 20
          }}
        >
          Tablero Global
        </h1>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: 'var(--mid)', lineHeight: 1.65 }}>
          Módulo en construcción: vistas agregadas del estado del mundo, enlazadas con{' '}
          <Link href='/focos' style={{ borderBottom: '1px solid var(--text)' }}>
            Focos de Tensión
          </Link>{' '}
          y el archivo editorial.
        </p>
      </div>
      <SiteFooter />
    </>
  )
}
