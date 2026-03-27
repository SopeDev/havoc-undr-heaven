import Link from 'next/link'
import SiteHeader from '../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../components/SiteFooter/SiteFooter'
import FocosIndexClient from './FocosIndexClient'
import { FOCO_FEATURED_SLUG, FOCO_INDEX_CARDS } from './focoData'

export default function FocosPage() {
  return (
    <div className='focos-index'>
      <SiteHeader />

      <div className='breadcrumb'>
        <span>
          <Link href='/'>Inicio</Link>
        </span>
        <span className='sep'>›</span>
        <span className='current'>Focos de Tensión</span>
      </div>

      <div className='page-header'>
        <div className='page-header-inner'>
          <div>
            <div className='page-header-label'>Seguimiento de escenarios geopolíticos</div>
            <h1 className='page-header-title'>
              Focos de
              <br />
              Tensión
            </h1>
            <p className='page-header-desc'>
              Los conflictos y tensiones estructurales que están redefiniendo el orden mundial. Cada foco incluye su estado
              actual, archivo de análisis publicados y contexto histórico para entender desde cero.
            </p>
          </div>
          <div className='legend'>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className='legend-dot' style={{ background: 'var(--red)' }} />
              <span className='legend-text-title'>Activo</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className='legend-dot' style={{ background: 'var(--orange)' }} />
              <span className='legend-text-title'>Tensión Elevada</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className='legend-dot' style={{ background: 'var(--blue)' }} />
              <span className='legend-text-title'>Latente</span>
            </div>
          </div>
        </div>
      </div>

      <div className='stats-bar'>
        <div className='stats-bar-inner'>
          <div className='stat-item'>
            <span className='stat-num'>9</span>
            <span className='stat-label'>Focos activos</span>
          </div>
          <div className='stat-item'>
            <span className='stat-num red'>2</span>
            <span className='stat-label'>Conflicto activo</span>
          </div>
          <div className='stat-item'>
            <span className='stat-num orange'>4</span>
            <span className='stat-label'>Tensión elevada</span>
          </div>
          <div className='stat-item'>
            <span className='stat-num blue'>3</span>
            <span className='stat-label'>Latentes</span>
          </div>
          <div className='stat-item'>
            <span className='stat-num' style={{ color: '#555' }}>
              28 Feb
            </span>
            <span className='stat-label'>Última actualización</span>
          </div>
        </div>
      </div>

      <FocosIndexClient featuredSlug={FOCO_FEATURED_SLUG} cards={FOCO_INDEX_CARDS} />

      <SiteFooter />
    </div>
  )
}
