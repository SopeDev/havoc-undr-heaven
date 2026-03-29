'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'activos', label: 'Activos' },
  { id: 'elevada', label: 'Tensión Elevada' },
  { id: 'latentes', label: 'Latentes' }
]

function matchesFilter(filterId, kind) {
  if (filterId === 'todos') return true
  if (filterId === 'activos') return kind === 'hot'
  if (filterId === 'elevada') return kind === 'warm'
  if (filterId === 'latentes') return kind === 'cold'
  return true
}

export default function FocosIndexClient({ featured, cards }) {
  const [filter, setFilter] = useState('todos')

  const visibleCards = useMemo(
    () => cards.filter(c => matchesFilter(filter, c.kind)),
    [cards, filter]
  )

  const showFeatured = featured && matchesFilter(filter, featured.kind)

  const regionShort = featured?.regionLine?.split('·')[0]?.trim() || ''

  if (!featured || !cards?.length) return null

  return (
    <>
      <div className='filter-bar'>
        {FILTERS.map(f => (
          <div
            key={f.id}
            className={`filter-item ${filter === f.id ? 'active' : ''}`}
            role='button'
            tabIndex={0}
            onClick={() => setFilter(f.id)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setFilter(f.id)
              }
            }}
          >
            {f.label}
          </div>
        ))}
      </div>

      <div className='focos-body'>
        {showFeatured ? (
          <Link href={`/focos/${featured.slug}`} className='foco-featured'>
            <div className='foco-featured-visual'>
              <div className='foco-featured-status'>
                <div className={`fdot ${featured.kind}`} />
                <span className={`fdot-label ${featured.kind}`}>{featured.label}</span>
              </div>
              <div>
                <div className='foco-featured-name'>
                  {featured.titleLines.map((line, idx) => (
                    <span key={idx}>
                      {line}
                      {idx < featured.titleLines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </div>
                <div className='foco-featured-region'>{featured.regionLine}</div>
              </div>
            </div>
            <div className='foco-featured-info'>
              <div>
                <div className='foco-featured-summary'>{featured.summary}</div>
                <div className='foco-featured-meta'>
                  <div className='foco-meta-item'>
                    <span className='foco-meta-label'>Actualizado</span>
                    <span className='foco-meta-val'>{featured.updated}</span>
                  </div>
                  <div className='foco-meta-item'>
                    <span className='foco-meta-label'>Artículos HUH</span>
                    <span className='foco-meta-val'>{featured.articleCount} publicados</span>
                  </div>
                  <div className='foco-meta-item'>
                    <span className='foco-meta-label'>Región</span>
                    <span className='foco-meta-val'>{regionShort}</span>
                  </div>
                </div>
              </div>
              <span className='foco-read-link'>Ver foco completo →</span>
            </div>
          </Link>
        ) : null}

        <div className='focos-grid-label'>Todos los Focos</div>
        <div className='focos-grid'>
          {visibleCards.map(card => (
              <Link key={card.slug} href={`/focos/${card.slug}`} className='foco-card-link'>
                <div className='foco-card'>
                  <div className='foco-card-top'>
                    <div className='foco-card-status'>
                      <div className={`fdot ${card.kind}`} style={{ width: 8, height: 8 }} />
                      <span className={`fdot-label ${card.kind}`} style={{ fontSize: '8px' }}>
                        {card.label}
                      </span>
                    </div>
                  </div>
                  <div className='foco-card-name'>{card.titleLines.join(' ')}</div>
                  <div className='foco-card-region'>
                    {card.regionLine?.split('·')[0]?.trim() || card.regionLine}
                  </div>
                  <div className='foco-card-summary'>{card.summary}</div>
                  <div className='foco-card-footer'>
                    <span className='foco-card-articles'>
                      {card.articleCount} artículo{card.articleCount !== 1 ? 's' : ''}
                    </span>
                    <span className='foco-card-arrow'>→</span>
                  </div>
                </div>
              </Link>
          ))}
        </div>
      </div>
    </>
  )
}

