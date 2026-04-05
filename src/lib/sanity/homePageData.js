import { formatArticleDate } from './articleView'
import { isSanityConfigured } from './client'
import { fetchHomeArticles } from './articles'
import { fetchFocosSidebarByUpdated } from './focos'
import { fetchNavLists } from './navigation'

function tagLineFromNames(names) {
  return Array.isArray(names) ? names.filter(Boolean).join(' · ') : ''
}

export function mapRawDocToHomeRow(doc) {
  const mins = doc.readingTimeMinutes
  return {
    cat: doc.categoryName || 'Análisis',
    topic: tagLineFromNames(doc.tagNames) || '—',
    title: doc.title || '',
    excerpt: doc.deck || '',
    dateStr: formatArticleDate(doc.publishedAt),
    timeStr: typeof mins === 'number' ? `${mins} min` : '—',
    timeReadStr: typeof mins === 'number' ? `${mins} min de lectura` : '—',
    href: `/articulos/${doc.slug}`
  }
}

/** @param {Array<ReturnType<typeof mapRawDocToHomeRow>>} rows */
export function partitionHomeArticles(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { hero: null, feedItems: [], sidebarArticles: [], dispatchItems: [] }
  }
  const hero = rows[0]
  const feedItems = rows.slice(1, 5)
  const sidebarArticles = rows.slice(5, 8)
  const dispatchSlice = rows.slice(8, 11)
  const dispatchItems = dispatchSlice.map(a => ({
    cat: a.cat,
    topic: a.topic,
    title: a.title,
    body: a.excerpt
  }))
  return { hero, feedItems, sidebarArticles, dispatchItems }
}

const FALLBACK_CATEGORIES = [
  { name: 'Análisis', slug: 'analisis' },
  { name: 'Reflexiones', slug: 'reflexiones' },
  { name: 'Newsletter', slug: 'newsletter' }
]

const FALLBACK_TAGS = [
  { name: 'China', slug: 'china' },
  { name: 'Estados Unidos', slug: 'estados-unidos' },
  { name: 'Rusia', slug: 'rusia' },
  { name: 'Asia-Pacífico', slug: 'asia-pacifico' },
  { name: 'Medio Oriente', slug: 'medio-oriente' },
  { name: 'América Latina', slug: 'america-latina' },
  { name: 'Europa y Occidente', slug: 'europa' },
  { name: 'BRICS', slug: 'brics' },
  { name: 'México', slug: 'mexico' },
  { name: 'Geoeconomía', slug: 'geoeconomia' },
  { name: 'Seguridad', slug: 'seguridad' },
  { name: 'Tecnología', slug: 'tecnologia' },
  { name: 'Energía y Medio Ambiente', slug: 'energia' },
  { name: 'Comercio', slug: 'comercio' },
  { name: 'Gobierno', slug: 'gobierno' },
  { name: 'Relaciones Internacionales y Diplomacia', slug: 'diplomacia' },
  { name: 'Mundo', slug: 'mundo' }
]

const FALLBACK_ARTICLE_ROWS = [
  {
    cat: 'Análisis',
    topic: 'Estados Unidos · China · Tecnología',
    title: 'La guerra de los semiconductores no es sobre chips',
    excerpt:
      'Los controles de exportación de Washington son el primer movimiento de una campaña más profunda — una sobre quién define la arquitectura de la próxima era industrial.',
    dateStr: '28 feb 2026',
    timeStr: '8 min',
    timeReadStr: '8 min de lectura',
    href: '/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips'
  },
  {
    cat: 'Análisis',
    topic: 'Rusia · Economía',
    title: 'La guerra silenciosa del rublo',
    excerpt:
      'A pesar de las sanciones occidentales, el superávit comercial ruso se mantiene redirigido a través de los Emiratos, Turquía e India.',
    dateStr: '25 feb 2026',
    timeStr: '5 min',
    timeReadStr: '5 min de lectura',
    href: '/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips'
  },
  {
    cat: 'Reflexiones',
    topic: 'África · Soberanía',
    title: 'El giro deliberado del Sahel',
    excerpt:
      'De Mali a Níger y Burkina Faso, las juntas expulsan a las fuerzas francesas. No es un vacío de poder — es un pivote estratégico deliberado.',
    dateStr: '22 feb 2026',
    timeStr: '6 min',
    timeReadStr: '6 min de lectura',
    href: '/articulos/la-equivocacion-de-occidente-con-ucrania'
  },
  {
    cat: 'Newsletter',
    topic: 'Dispatch №001',
    title: 'Havoc Dispatch №001 — Febrero 28, 2026',
    excerpt:
      'La guerra de semiconductores, el giro del Sahel, la no alineación india y la señal de la desdolarización.',
    dateStr: '28 feb 2026',
    timeStr: '5 min',
    timeReadStr: '5 min de lectura',
    href: '/articulos/havoc-dispatch-8-la-semana-que-movio-el-tablero'
  },
  {
    cat: 'Análisis',
    topic: 'India · Estrategia',
    title: 'La no alineación como modelo de negocio',
    excerpt:
      'Nueva Delhi compra petróleo ruso con descuento, vende refinados a Europa con prima y mantiene alianzas con Washington y Moscú simultáneamente.',
    dateStr: '19 feb 2026',
    timeStr: '7 min',
    timeReadStr: '7 min de lectura',
    href: '/articulos/la-equivocacion-de-occidente-con-ucrania'
  },
  {
    cat: 'Análisis',
    topic: 'Medio Oriente · Finanzas',
    title: 'Arabia Saudita, el yuan y el fin del petrodólar',
    excerpt: 'Riad y Beijing aceleran conversaciones discretas. El sistema financiero del siglo XX tiene fecha de caducidad.',
    dateStr: '15 feb 2026',
    timeStr: '9 min',
    timeReadStr: '9 min de lectura',
    href: '/articulos/havoc-dispatch-8-la-semana-que-movio-el-tablero'
  },
  {
    cat: 'Análisis',
    topic: 'Europa · Energía',
    title: 'La independencia energética europea como proyecto político',
    excerpt: 'La crisis ucraniana aceleró lo que la lógica económica había retrasado décadas.',
    dateStr: '12 feb 2026',
    timeStr: '6 min',
    timeReadStr: '6 min de lectura',
    href: '/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips'
  },
  {
    cat: 'Análisis',
    topic: 'China · BRI',
    title: 'Cómo la Ruta de la Seda compra lealtad política',
    excerpt: 'La Iniciativa del Cinturón y la Ruta es la infraestructura política del orden chino en construcción.',
    dateStr: '3 feb 2026',
    timeStr: '8 min',
    timeReadStr: '8 min de lectura',
    href: '/articulos/como-la-ruta-de-la-seda-compra-lealtad-politica'
  },
  {
    cat: 'Análisis',
    topic: 'China · Diplomacia',
    title: 'El silencio calculado de Beijing sobre Ucrania',
    excerpt:
      'China mantiene una neutralidad que le permite conservar relaciones con Moscú y Bruselas — una disciplina diplomática que Washington no puede replicar.',
    dateStr: '18 feb 2026',
    timeStr: '9 min',
    timeReadStr: '9 min de lectura',
    href: '/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips'
  },
  {
    cat: 'Reflexiones',
    topic: 'América Latina · BRICS',
    title: 'Brasil bajo Lula: el Sur Global toma posición',
    excerpt:
      'La política exterior brasileña se afirma como independiente. Lula construye un rol de mediador con consistencia inusual en la región.',
    dateStr: '16 feb 2026',
    timeStr: '8 min',
    timeReadStr: '8 min de lectura',
    href: '/articulos/la-equivocacion-de-occidente-con-ucrania'
  },
  {
    cat: 'Análisis',
    topic: 'Europa · Soberanía',
    title: 'La OTAN después de Trump: ¿autonomía o dependencia?',
    excerpt:
      'El debate sobre la defensa europea ya no es teórico. Los presupuestos militares suben pero la capacidad real de actuar sin EEUU sigue sin respuesta.',
    dateStr: '14 feb 2026',
    timeStr: '10 min',
    timeReadStr: '10 min de lectura',
    href: '/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips'
  }
]

const FALLBACK_FOCOS = [
  { name: 'Ucrania — Frente Activo', region: 'Europa del Este', kind: 'hot', slug: null },
  { name: 'Estrecho de Taiwán', region: 'Indo-Pacífico', kind: 'warm', slug: null },
  { name: 'Reconfiguración Post-Gaza', region: 'Medio Oriente', kind: 'hot', slug: null },
  { name: 'Expansión BRICS+', region: 'América Latina · Global', kind: 'warm', slug: null },
  { name: 'Rearmamento Europeo', region: 'Europa', kind: 'cold', slug: null }
]

export async function fetchHomePageData() {
  let categories = FALLBACK_CATEGORIES
  let tags = FALLBACK_TAGS
  let articleRows = FALLBACK_ARTICLE_ROWS
  let focoRows = FALLBACK_FOCOS

  if (isSanityConfigured()) {
    const [nav, docs, focos] = await Promise.all([
      fetchNavLists(),
      fetchHomeArticles(12),
      fetchFocosSidebarByUpdated(5)
    ])
    if (nav.categories.length > 0) categories = nav.categories
    if (nav.tags.length > 0) tags = nav.tags
    if (Array.isArray(docs) && docs.length > 0) {
      articleRows = docs.map(mapRawDocToHomeRow)
    }
    if (focos.length > 0) {
      focoRows = focos.map(f => ({
        name: f.name,
        region: f.region,
        kind: f.kind,
        slug: f.slug
      }))
    }
  }

  const { hero, feedItems, sidebarArticles, dispatchItems } = partitionHomeArticles(articleRows)

  return {
    categories,
    tags,
    hero,
    feedItems,
    sidebarArticles,
    dispatchItems,
    focoRows
  }
}
