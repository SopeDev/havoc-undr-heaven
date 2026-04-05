'use client'

import { useState } from 'react'
import Link from 'next/link'
import ArticleBodyPortableText from '../../components/ArticleBodyPortableText/ArticleBodyPortableText'

const LAYERS = [
  { id: 'actual', label: 'Estado Actual' },
  { id: 'archivo', label: 'Archivo HUH' },
  { id: 'contexto', label: 'Contexto de Fondo' }
]

const RELATED_STATUS = {
  hot: { label: 'Activo', color: 'var(--red)' },
  warm: { label: 'Tensión Elevada', color: 'var(--orange)' },
  cold: { label: 'Latente', color: 'var(--blue)' }
}

export default function FocoDetailClient({ data }) {
  const [layer, setLayer] = useState('actual')
  const [archivoFilter, setArchivoFilter] = useState('todo')

  const statusDotClass = data.status === 'hot' ? 'hot' : data.status === 'cold' ? 'cold' : 'warm'
  const statusValClass = statusDotClass

  const renderContextoBlock = (block, i) => {
    if (block.type === 'p') {
      return <p key={i}>{block.text}</p>
    }
    if (block.type === 'h3') {
      return <h3 key={i}>{block.text}</h3>
    }
    if (block.type === 'blockquote') {
      return (
        <div key={i} className='contexto-blockquote'>
          <p>{block.text}</p>
        </div>
      )
    }
    return null
  }

  const archivoFiltered =
    archivoFilter === 'todo'
      ? data.archivo
      : data.archivo.filter(a => {
          if (archivoFilter === 'analisis') return a.cat === 'Análisis'
          if (archivoFilter === 'reflexiones')
            return a.cat === 'Reflexiones' || a.cat === 'Reflexión'
          if (archivoFilter === 'newsletter') return a.cat === 'Newsletter'
          return true
        })

  return (
    <div className='foco-detail-page'>
      <div className='foco-hero'>
        <div className='foco-hero-inner'>
          <div>
            <div className='foco-status-row'>
              <div className={`status-dot-large ${statusDotClass}`} />
              <span className='status-label'>Estado:</span>
              <span className={`status-value ${statusValClass}`}>{data.statusLabel}</span>
              <span className='status-updated'>Actualizado: {data.updated}</span>
            </div>
            <div className='foco-region'>{data.regionLine}</div>
            <h1 className='foco-title'>
              {data.titleLines.map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < data.titleLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h1>
            <p className='foco-summary'>{data.summary}</p>
          </div>

          <div className='foco-actors'>
            <div className='actors-title'>Actores Principales</div>
            {data.actors.map(actor => (
              <div key={actor.name} className='actor-row'>
                <div className='actor-name'>{actor.name}</div>
                <div className='actor-role'>{actor.role}</div>
                <div>
                  <span className={`actor-stance ${actor.stanceClass}`}>{actor.stanceLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='layer-tabs-sticky'>
        <div className='layer-tabs-inner'>
          <div className='layer-tabs-row' role='tablist'>
            {LAYERS.map(l => (
              <button
                key={l.id}
                type='button'
                className={`layer-tab ${layer === l.id ? 'active' : ''}`}
                onClick={() => setLayer(l.id)}
                role='tab'
                aria-selected={layer === l.id}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='page-body'>
        {layer === 'actual' ? (
          <div className='layer-content'>
            <div className='layer-main'>
              <div className='section-eyebrow'>Últimos Desarrollos</div>
              <div className='timeline'>
                {data.timeline?.length > 0 ? (
                  data.timeline.map((t, i) => (
                    <div key={i} className='timeline-item'>
                      <div className='timeline-date'>{t.date}</div>
                      <div>
                        <div className='timeline-title'>
                          <span className='timeline-dot' style={{ background: t.dot }} />
                          {t.title}
                        </div>
                        <div className='timeline-text'>{t.text}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--mid)', fontSize: 14 }}>
                    Agregá entradas de línea de tiempo en Sanity para este foco.
                  </p>
                )}
              </div>
            </div>

            <div className='layer-sidebar'>
              <div className='indicator-block'>
                <div className='indicator-label'>Índice de Tensión HUH</div>
                {data.indicators.map(row => (
                  <div key={row.label} className='indicator-row'>
                    <span className='indicator-name'>{row.label}</span>
                    <span className={`indicator-val ${row.valClass || ''}`}>{row.val}</span>
                  </div>
                ))}
              </div>

              <div className='indicator-block'>
                <div className='indicator-label'>Cifras Clave</div>
                {data.keyFigures.map(row => (
                  <div key={row.name} className='indicator-row'>
                    <span className='indicator-name'>{row.name}</span>
                    <span className={`indicator-val ${row.valClass || ''}`}>{row.val}</span>
                  </div>
                ))}
              </div>

              <div className='indicator-block'>
                <div className='indicator-label'>Señal HUH</div>
                <p className='foco-signal-quote'>{data.signalQuote}</p>
              </div>
            </div>
          </div>
        ) : null}

        {layer === 'archivo' ? (
          <div className='foco-section'>
            <div className='section-eyebrow'>Archivo HUH — Todo lo que hemos publicado sobre este foco</div>
            <div className='archivo-filters'>
              {[
                { id: 'todo', label: 'Todo' },
                { id: 'analisis', label: 'Análisis' },
                { id: 'reflexiones', label: 'Reflexiones' },
                { id: 'newsletter', label: 'Newsletter' }
              ].map(f => (
                <button
                  key={f.id}
                  type='button'
                  className={`archivo-filter ${archivoFilter === f.id ? 'active' : ''}`}
                  onClick={() => setArchivoFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {archivoFiltered.length === 0 ? (
              <p style={{ color: 'var(--mid)', fontSize: 14 }}>
                Todavía no hay artículos enlazados por etiqueta a este foco.
              </p>
            ) : null}
            {archivoFiltered.map((item, idx) => (
              <Link key={`${item.href}-${idx}`} href={item.href} className='archivo-item'>
                <div>
                  <span className='archivo-cat'>{item.cat}</span>
                  <div className='archivo-title'>{item.title}</div>
                  <div className='archivo-excerpt'>{item.excerpt}</div>
                  <div className='archivo-meta'>{item.meta}</div>
                </div>
                <div className='archivo-thumb' />
              </Link>
            ))}
          </div>
        ) : null}

        {layer === 'contexto' ? (
          <div className='foco-section'>
            <div className='section-eyebrow'>Contexto de Fondo — Para entender desde cero</div>
            <div className='contexto-grid'>
              <div className='contexto-main'>
                <div className='contexto-body'>
                  {data.contextPortable?.length ? (
                    <ArticleBodyPortableText
                      value={data.contextPortable}
                      emptyMessage='Aún no hay bloques de contexto en el CMS para este foco.'
                    />
                  ) : data.contexto.paragraphs?.length > 0 ? (
                    data.contexto.paragraphs.map(renderContextoBlock)
                  ) : (
                    <p style={{ color: 'var(--mid)', fontSize: 14 }}>
                      Aún no hay contexto de fondo para este foco en el sitio.
                    </p>
                  )}
                </div>
              </div>
              <div className='contexto-side'>
                {data.contexto.readings?.length > 0 ? (
                  <div className='indicator-block'>
                    <div className='indicator-label'>Lecturas Esenciales</div>
                    {data.contexto.readings.map((r, i) => (
                      <div key={i} className='reading-row'>
                        <div className='reading-title'>{r.title}</div>
                        <div className='reading-sub'>{r.subtitle}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {data.related.length > 0 ? (
          <div className='related-focos'>
            <div className='related-focos-label'>Otros Focos de Tensión</div>
            <div className='focos-grid'>
              {data.related.map(r => {
                const st = RELATED_STATUS[r.status] || RELATED_STATUS.warm
                return (
                  <Link key={r.slug} href={`/focos/${r.slug}`} className='foco-card'>
                    <div className='foco-card-status'>
                      <div className='foco-dot' style={{ background: st.color }} />
                      <span
                        style={{
                          fontSize: '9px',
                          letterSpacing: '2px',
                          textTransform: 'uppercase',
                          color: st.color,
                          fontWeight: 600
                        }}
                      >
                        {st.label}
                      </span>
                    </div>
                    <div className='foco-card-name'>{r.name}</div>
                    <div className='foco-card-region'>{r.region}</div>
                    <div className='foco-card-summary'>{r.summary}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
