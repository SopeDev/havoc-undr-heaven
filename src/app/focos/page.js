import Link from 'next/link'
import SiteHeader from '../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../components/SiteFooter/SiteFooter'
import FocosIndexClient from './FocosIndexClient'
import { fetchFocosIndexData, pickFeaturedIndexCard } from '../../lib/sanity/focos'

export const revalidate = 60

function statsFromCards(cards, lastUpdatedLabel) {
  if (!cards?.length) {
    return {
      total: 0,
      hot: 0,
      warm: 0,
      cold: 0,
      lastUpdatedLabel: lastUpdatedLabel ?? '—'
    }
  }
  return {
    total: cards.length,
    hot: cards.filter(c => c.kind === 'hot').length,
    warm: cards.filter(c => c.kind === 'warm').length,
    cold: cards.filter(c => c.kind === 'cold').length,
    lastUpdatedLabel: lastUpdatedLabel ?? cards[0]?.updated ?? '—'
  }
}

export default async function FocosPage() {
  const cms = await fetchFocosIndexData()
  const cards = cms?.cards ?? []
  const stats = cms?.stats ?? statsFromCards(cards, '—')
  const featured = pickFeaturedIndexCard(cards)

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
            <span className='stat-num'>{stats.total}</span>
            <span className='stat-label'>Focos activos</span>
          </div>
          <div className='stat-item'>
            <span className='stat-num red'>{stats.hot}</span>
            <span className='stat-label'>Conflicto activo</span>
          </div>
          <div className='stat-item'>
            <span className='stat-num orange'>{stats.warm}</span>
            <span className='stat-label'>Tensión elevada</span>
          </div>
          <div className='stat-item'>
            <span className='stat-num blue'>{stats.cold}</span>
            <span className='stat-label'>Latentes</span>
          </div>
          <div className='stat-item'>
            <span className='stat-num' style={{ color: '#555' }}>
              {stats.lastUpdatedLabel}
            </span>
            <span className='stat-label'>Última actualización</span>
          </div>
        </div>
      </div>

      <FocosIndexClient featured={featured} cards={cards} />

      <SiteFooter />
    </div>
  )
}
