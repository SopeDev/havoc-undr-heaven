'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SiteHeader from '../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../components/SiteFooter/SiteFooter'
import NewsletterSignup from '../../components/NewsletterSignup/NewsletterSignup'

const MOCK_ARTICLES = [
  {
    cat: 'Análisis',
    tags: 'China · Tecnología · Estados Unidos',
    title: 'La guerra de los semiconductores no es sobre chips',
    excerpt:
      'Los controles de exportación de Washington son el primer movimiento de una campaña más profunda — sobre quién define la arquitectura de la próxima era industrial.',
    date: '28 Feb 2026',
    ts: 20260228,
    time: '8 min',
    url: '/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips'
  },
  {
    cat: 'Análisis',
    tags: 'Estados Unidos · Hegemonía',
    title: 'El Imperio Americano en decadencia',
    excerpt:
      'El unipolarismo no terminó con una derrota militar. Terminó con la acumulación silenciosa de alternativas que Washington no supo ver venir.',
    date: '25 Feb 2026',
    ts: 20260225,
    time: '12 min',
    url: '/articulos/el-imperio-americano-en-decadencia'
  },
  {
    cat: 'Análisis',
    tags: 'China · BRI',
    title: 'Cómo la Ruta de la Seda compra lealtad política',
    excerpt:
      'La Iniciativa del Cinturón y la Ruta no es un proyecto de desarrollo. Es la infraestructura política del orden chino en construcción.',
    date: '22 Feb 2026',
    ts: 20260222,
    time: '8 min',
    url: '/articulos/como-la-ruta-de-la-seda-compra-lealtad-politica'
  },
  {
    cat: 'Análisis',
    tags: 'Europa · Defensa · OTAN',
    title: 'Europa en crisis existencial',
    excerpt:
      'La presión de Trump sobre los aliados europeos aceleró un debate que llevan décadas evitando: ¿puede Europa actuar estratégicamente sin Estados Unidos?',
    date: '20 Feb 2026',
    ts: 20260220,
    time: '9 min',
    url: '/articulos/europa-en-crisis-existencial'
  },
  {
    cat: 'Reflexiones',
    tags: 'Europa · OTAN · Ucrania',
    title: 'La equivocación de Occidente con Ucrania',
    excerpt:
      'Occidente ganó el argumento moral pero perdió el cálculo estratégico. La guerra de desgaste no debilita a Rusia tanto como fragmenta a Europa.',
    date: '10 Feb 2026',
    ts: 20260210,
    time: '10 min',
    url: '/articulos/la-equivocacion-de-occidente-con-ucrania'
  },
  {
    cat: 'Reflexiones',
    tags: 'China · Civilización',
    title: 'El propósito chino: Zhōng Mèng y Xi Jinping',
    excerpt:
      'El Sueño Chino no es una consigna vacía. Es la articulación de un proyecto civilizacional con siglos de historia detrás.',
    date: '8 Feb 2026',
    ts: 20260208,
    time: '9 min',
    url: '/articulos/el-proposito-chino-zhong-meng-y-xi-jinping'
  },
  {
    cat: 'Newsletter',
    tags: 'Resumen Semanal',
    title: 'Havoc Dispatch #8 — La semana que movió el tablero',
    excerpt:
      'Rearmamento europeo, crisis en el Sahel, y los nuevos números del comercio sino-americano. Todo lo que importó esta semana en geopolítica.',
    date: '28 Feb 2026',
    ts: 20260228,
    time: '5 min',
    url: '/articulos/havoc-dispatch-8-la-semana-que-movio-el-tablero'
  }
]

const FALLBACK_TRENDING = [
  { title: 'La guerra de los semiconductores no es sobre chips', meta: 'Análisis · 28 Feb 2026' },
  { title: 'El Imperio Americano en decadencia', meta: 'Análisis · 25 Feb 2026' },
  { title: 'Europa en crisis existencial', meta: 'Análisis · 20 Feb 2026' },
  { title: 'Los Estados-Civilización y el fin del universalismo liberal', meta: 'Reflexiones · 1 Feb 2026' }
]

function mergeArticlePools(cmsRows, mockRows) {
  const map = new Map()
  for (const row of cmsRows) {
    map.set(row.url, row)
  }
  for (const row of mockRows) {
    if (!map.has(row.url)) map.set(row.url, row)
  }
  return [...map.values()]
}

/** Mock uses YYYYMMDD `ts`; CMS uses unix seconds — normalize to unix seconds for sorting. */
function comparableTs(row) {
  const t = row.ts
  if (t > 1_000_000_000) return t
  const str = String(t).padStart(8, '0')
  const y = Number.parseInt(str.slice(0, 4), 10)
  const m = Number.parseInt(str.slice(4, 6), 10) - 1
  const d = Number.parseInt(str.slice(6, 8), 10)
  return Math.floor(Date.UTC(y, m, d) / 1000)
}

const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const highlight = (text, q) => {
  if (!q) return text
  const re = new RegExp(`(${escapeRegExp(q)})`, 'gi')
  return text.replace(re, '<mark>$1</mark>')
}

const scoreArticle = (a, q) => {
  if (!q) return 1
  const ql = q.toLowerCase()
  let score = 0
  if (a.title.toLowerCase().includes(ql)) score += 10
  if (a.tags.toLowerCase().includes(ql)) score += 6
  if (a.excerpt.toLowerCase().includes(ql)) score += 3
  if (a.cat.toLowerCase().includes(ql)) score += 2
  return score
}

const matchesCategoryFilter = (a, currentFilter, categoryList) => {
  if (currentFilter === 'todo') return true
  const match = categoryList.find(c => c.slug === currentFilter)
  if (match) return a.cat === match.name
  return true
}

export default function BuscarClient({ cmsArticles = [], categories = [], tags = [] }) {
  const router = useRouter()
  const params = useSearchParams()

  const qFromUrl = params.get('q') || ''

  const [query, setQuery] = useState(qFromUrl)
  const [currentFilter, setCurrentFilter] = useState('todo')
  const [currentSort, setCurrentSort] = useState('relevancia')

  const pool = useMemo(() => mergeArticlePools(cmsArticles, MOCK_ARTICLES), [cmsArticles])

  const trending = useMemo(() => {
    if (pool.length === 0) return FALLBACK_TRENDING
    const top = [...pool].sort((a, b) => comparableTs(b) - comparableTs(a)).slice(0, 4)
    return top.map(a => ({
      title: a.title,
      meta: `${a.cat} · ${a.date}`
    }))
  }, [pool])

  const results = useMemo(() => {
    const q = query.trim()
    let filtered = pool.filter(a => {
      if (!matchesCategoryFilter(a, currentFilter, categories)) return false
      if (!q) return true
      return scoreArticle(a, q) > 0
    })

    if (currentSort === 'reciente') filtered.sort((a, b) => comparableTs(b) - comparableTs(a))
    else if (currentSort === 'antiguo') filtered.sort((a, b) => comparableTs(a) - comparableTs(b))
    else if (q) filtered.sort((a, b) => scoreArticle(b, q) - scoreArticle(a, q))

    return filtered
  }, [currentFilter, currentSort, query, pool, categories])

  const goToQuery = nextQ => {
    const clean = nextQ.trim()
    setQuery(clean)
    const queryPart = clean ? `?q=${encodeURIComponent(clean)}` : ''
    router.push(`/buscar${queryPart}`)
  }

  const onSubmitSearch = e => {
    e.preventDefault()
    goToQuery(query)
  }

  const showNoResults = query.trim() && results.length === 0
  const showTrending = !query.trim()

  return (
    <>
      <SiteHeader />

      <div className='search-hero'>
        <div className='search-hero-label'>Búsqueda</div>

        <form className='search-bar-big' onSubmit={onSubmitSearch}>
          <input
            type='text'
            id='search-input'
            placeholder='¿Qué estás buscando?'
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete='off'
          />
          <button type='submit'>Buscar</button>
        </form>

        <div className='search-meta'>
          <span className='search-count'>
            {query.trim() ? (
              results.length > 0 ? (
                <>
                  <strong>{results.length}</strong> resultado{results.length !== 1 ? 's' : ''} para &quot;{' '}
                  <strong>{query.trim()}</strong>&quot;
                </>
              ) : (
                <>
                  Sin resultados para &quot;{' '}
                  <strong>{query.trim()}</strong>&quot;
                </>
              )
            ) : (
              <>
                Mostrando <strong>{results.length}</strong> artículos
              </>
            )}
          </span>

          <div className='search-filters'>
            <div
              className={currentFilter === 'todo' ? 'sf active' : 'sf'}
              role='button'
              tabIndex={0}
              onClick={() => setCurrentFilter('todo')}
            >
              Todo
            </div>
            {categories.map(c => (
              <div
                key={c.slug}
                className={currentFilter === c.slug ? 'sf active' : 'sf'}
                role='button'
                tabIndex={0}
                onClick={() => setCurrentFilter(c.slug)}
              >
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='search-body'>
        <div className='results'>
          <div className='results-sort'>
            <span className='sort-label'>Ordenar por</span>
            <div className='sort-options'>
              <div
                className={currentSort === 'relevancia' ? 'sort-opt active' : 'sort-opt'}
                role='button'
                tabIndex={0}
                onClick={() => setCurrentSort('relevancia')}
              >
                Relevancia
              </div>
              <div
                className={currentSort === 'reciente' ? 'sort-opt active' : 'sort-opt'}
                role='button'
                tabIndex={0}
                onClick={() => setCurrentSort('reciente')}
              >
                Más reciente
              </div>
              <div
                className={currentSort === 'antiguo' ? 'sort-opt active' : 'sort-opt'}
                role='button'
                tabIndex={0}
                onClick={() => setCurrentSort('antiguo')}
              >
                Más antiguo
              </div>
            </div>
          </div>

          {showNoResults ? (
            <div className='no-results'>
              <div className='no-results-icon'>◎</div>
              <div className='no-results-title'>Sin resultados</div>
              <p className='no-results-sub'>
                No encontramos artículos que coincidan con &quot;<strong>{query.trim()}</strong>&quot;. Prueba
                con otros términos o explora por tema.
              </p>
              <div className='suggestions-label'>Búsquedas frecuentes</div>
              <div className='suggestions'>
                {['China', 'Estados Unidos', 'Rusia', 'Ucrania', 'BRICS', 'Tecnología', 'Desdolarización', 'India'].map(
                  s => (
                    <span key={s} className='suggestion-pill' onClick={() => goToQuery(s)}>
                      {s}
                    </span>
                  )
                )}
              </div>

              <div className='trending-section'>
                <div className='trending-label'>Artículos más leídos</div>
                <div className='trending-grid'>
                  {trending.map((t, i) => (
                    <div key={`${t.title}-${i}`} className='trending-item'>
                      <div className='trending-num'>0{i + 1}</div>
                      <div className='trending-title'>{t.title}</div>
                      <div className='trending-meta'>{t.meta}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {results.length > 0 ? (
            <>
              <div id='results-container'>
                {showTrending
                  ? results.map(a => (
                      <div
                        key={a.url}
                        className='result-item'
                        onClick={() => (window.location.href = a.url)}
                        role='link'
                        tabIndex={0}
                      >
                        <div>
                          <div className='result-eyebrow'>
                            <span className='cat-tag'>{a.cat}</span>
                            <span className='topic-tag'>{a.tags}</span>
                          </div>
                          <div
                            className='result-title'
                            dangerouslySetInnerHTML={{ __html: highlight(a.title, query.trim()) }}
                          />
                          <div
                            className='result-excerpt'
                            dangerouslySetInnerHTML={{ __html: highlight(a.excerpt, query.trim()) }}
                          />
                          <div className='result-meta'>
                            <span>{a.date}</span>
                            <span>{a.time} de lectura</span>
                          </div>
                        </div>
                        <div className='result-thumb' />
                      </div>
                    ))
                  : results.map(a => (
                      <div
                        key={a.url}
                        className='result-item'
                        onClick={() => (window.location.href = a.url)}
                        role='link'
                        tabIndex={0}
                      >
                        <div>
                          <div className='result-eyebrow'>
                            <span className='cat-tag'>{a.cat}</span>
                            <span className='topic-tag'>{a.tags}</span>
                          </div>
                          <div
                            className='result-title'
                            dangerouslySetInnerHTML={{ __html: highlight(a.title, query.trim()) }}
                          />
                          <div
                            className='result-excerpt'
                            dangerouslySetInnerHTML={{ __html: highlight(a.excerpt, query.trim()) }}
                          />
                          <div className='result-meta'>
                            <span>{a.date}</span>
                            <span>{a.time} de lectura</span>
                          </div>
                        </div>
                        <div className='result-thumb' />
                      </div>
                    ))}
              </div>

              {showTrending ? (
                <div className='trending-section'>
                  <div className='trending-label'>Más leídos</div>
                  <div className='trending-grid'>
                    {trending.map((t, i) => (
                      <div key={`${t.title}-${i}`} className='trending-item'>
                        <div className='trending-num'>0{i + 1}</div>
                        <div className='trending-title'>{t.title}</div>
                        <div className='trending-meta'>{t.meta}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <aside className='search-sidebar'>
          <div className='sidebar-block'>
            <div className='sidebar-label'>Newsletter Semanal</div>
            <NewsletterSignup />
          </div>

          {tags.length > 0 && (
            <div className='sidebar-block'>
              <div className='sidebar-label'>Explorar por Tema</div>
              <div className='tema-pill-grid'>
                {tags.map(t => (
                  <a key={t.slug} href={`/temas/${t.slug}`} className='tema-pill'>
                    {t.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <SiteFooter />
    </>
  )
}
