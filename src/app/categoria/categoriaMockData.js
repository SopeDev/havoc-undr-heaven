export const VALID_CATEGORY_SLUGS = ['analisis', 'reflexion', 'newsletter', 'redes']

/** Slugs align with `/temas/[tema]` so filters and tema pages stay consistent */
export const CATEGORIA_TOPIC_FILTERS = [
  { slug: 'china', label: 'China' },
  { slug: 'estados-unidos', label: 'Estados Unidos' },
  { slug: 'rusia', label: 'Rusia' },
  { slug: 'asia-pacifico', label: 'Asia-Pacífico' },
  { slug: 'medio-oriente', label: 'Medio Oriente' },
  { slug: 'america-latina', label: 'América Latina' },
  { slug: 'europa', label: 'Europa y Occidente' },
  { slug: 'brics', label: 'BRICS' },
  { slug: 'mexico', label: 'México' },
  { slug: 'geoeconomia', label: 'Geoeconomía' },
  { slug: 'seguridad', label: 'Seguridad' },
  { slug: 'tecnologia', label: 'Tecnología' },
  { slug: 'energia', label: 'Energía' },
  { slug: 'comercio', label: 'Comercio' },
  { slug: 'diplomacia', label: 'Diplomacia' }
]

export const VALID_TEMA_SLUGS = CATEGORIA_TOPIC_FILTERS.map(t => t.slug)

export function temaLabelFromSlug(slug) {
  if (!slug) return null
  const row = CATEGORIA_TOPIC_FILTERS.find(t => t.slug === slug)
  return row ? row.label : null
}

export const SIDEBAR_ANALYSIS = [
  {
    tags: 'China · Semiconductores',
    title: 'La guerra de los semiconductores no es sobre chips',
    date: '22 Feb 2026',
    href: '/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips'
  },
  {
    tags: 'India · Estrategia',
    title: 'La no alineación como modelo de negocio',
    date: '10 Feb 2026',
    href: '/articulos/la-equivocacion-de-occidente-con-ucrania'
  },
  {
    tags: 'Medio Oriente · Geoeconomía',
    title: 'Arabia Saudita, el yuan y el fin del petrodólar',
    date: '1 Feb 2026',
    href: '/articulos/havoc-dispatch-8-la-semana-que-movio-el-tablero'
  }
]

export const FOCO_ROWS = [
  { name: 'Ucrania — Frente Activo', region: 'Europa del Este', color: '#CC2200' },
  { name: 'Estrecho de Taiwán', region: 'Indo-Pacífico', color: '#E07800' },
  { name: 'Reconfiguración Post-Gaza', region: 'Medio Oriente', color: '#CC2200' },
  { name: 'Desdolarización Global', region: 'Global · Geoeconomía', color: '#336699' }
]

export const CATEGORY_DATA = {
  analisis: {
    title: 'Análisis',
    desc:
      'Ensayos de largo aliento sobre las grandes preguntas del orden mundial. No cubrimos noticias — cubrimos las ideas que explican por qué el mundo es como es.',
    stats: [
      { label: 'Artículos publicados', val: '18' },
      { label: 'Más reciente', val: '28 Feb 2026' },
      { label: 'Secciones', val: 'Análisis · Investigación' }
    ],
    hero: {
      cat: 'Análisis',
      topic: 'Estados Unidos · China · Tecnología',
      title: 'La guerra de los semiconductores no es sobre chips',
      deck:
        'Los controles de exportación de Washington son el primer movimiento de una campaña más profunda — una sobre quién define la arquitectura de la próxima era industrial.',
      date: '28 Feb 2026',
      time: '8 min de lectura',
      href: '/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips'
    },
    items: [
      {
        cat: 'Análisis',
        topic: 'Estados Unidos · Hegemonía',
        title: 'El Imperio Americano en decadencia',
        excerpt: 'El unipolarismo no terminó con una derrota militar. Terminó con la acumulación silenciosa de alternativas.',
        date: '25 Feb 2026',
        time: '12 min',
        href: '/articulos/el-imperio-americano-en-decadencia'
      },
      {
        cat: 'Análisis',
        topic: 'China · BRI',
        title: 'Cómo la Ruta de la Seda compra lealtad política',
        excerpt:
          'La Iniciativa del Cinturón y la Ruta no es un proyecto de desarrollo. Es la infraestructura política del orden chino.',
        date: '22 Feb 2026',
        time: '8 min',
        href: '/articulos/como-la-ruta-de-la-seda-compra-lealtad-politica'
      }
    ]
  },
  reflexion: {
    title: 'Reflexión',
    desc:
      'Ensayos de largo aliento sobre las grandes preguntas del orden mundial. No cubrimos noticias — cubrimos las ideas que explican por qué el mundo es como es. Historia, poder, civilización.',
    stats: [
      { label: 'Artículos publicados', val: '7' },
      { label: 'Más reciente', val: '28 Feb 2026' },
      { label: 'Frecuencia', val: '2–3 por mes' }
    ],
    hero: {
      cat: 'Reflexión',
      topic: 'Civilización · Orden Mundial',
      title: 'El fin del mundo que construimos',
      deck:
        'Durante setenta años Occidente creyó que la interdependencia económica garantizaba la paz. Esa hipótesis está siendo falsificada en tiempo real.',
      date: '28 Feb 2026',
      time: '8 min de lectura',
      href: '/articulos/el-proposito-chino-zhong-meng-y-xi-jinping'
    },
    items: [
      {
        cat: 'Reflexión',
        topic: 'Europa · OTAN · Ucrania',
        title: 'La equivocación de Occidente con Ucrania',
        excerpt:
          'Occidente ganó el argumento moral pero perdió el cálculo estratégico. La guerra de desgaste no debilita a Rusia tanto como fragmenta a Europa.',
        date: '10 Feb 2026',
        time: '10 min',
        href: '/articulos/la-equivocacion-de-occidente-con-ucrania'
      },
      {
        cat: 'Reflexión',
        topic: 'China · Civilización',
        title: 'El propósito chino: Zhōng Mèng y Xi Jinping',
        excerpt:
          'El Sueño Chino no es una consigna vacía. Es la articulación de un proyecto civilizacional con siglos de historia detrás.',
        date: '8 Feb 2026',
        time: '9 min',
        href: '/articulos/el-proposito-chino-zhong-meng-y-xi-jinping'
      }
    ]
  },
  newsletter: {
    title: 'Newsletter',
    desc:
      'Dispatches semanales: análisis geopolítico directo a tu correo, con énfasis en lo que cambia incentivos y reordena rutas.',
    stats: [
      { label: 'Ediciones', val: '12' },
      { label: 'Más reciente', val: '28 Feb 2026' },
      { label: 'Entrega', val: 'Semanal' }
    ],
    hero: {
      cat: 'Newsletter',
      topic: 'Resumen Semanal',
      title: 'Havoc Dispatch #8 — La semana que movió el tablero',
      deck:
        'Rearmamento europeo, crisis en el Sahel, y los nuevos números del comercio sino-americano. Todo lo que importó esta semana.',
      date: '28 Feb 2026',
      time: '5 min de lectura',
      href: '/articulos/havoc-dispatch-8-la-semana-que-movio-el-tablero'
    },
    items: [
      {
        cat: 'Newsletter',
        topic: 'Resumen Semanal',
        title: 'Havoc Dispatch #8 — La señal de la transición',
        excerpt: 'La semana no es el evento. Es el impulso que lo vuelve permanente.',
        date: '28 Feb 2026',
        time: '5 min',
        href: '/articulos/havoc-dispatch-8-la-semana-que-movio-el-tablero'
      }
    ]
  },
  redes: {
    title: 'Redes',
    desc: 'Actualizaciones editoriales y enlaces: lo que se está discutiendo, lo que se está leyendo y lo que está por venir.',
    stats: [
      { label: 'Publicaciones', val: '9' },
      { label: 'Más reciente', val: '22 Feb 2026' },
      { label: 'Formato', val: 'Curaduría' }
    ],
    hero: {
      cat: 'Análisis',
      topic: 'Curaduría editorial',
      title: 'Selección semanal de artículos clave',
      deck: 'Una selección editorial para seguir el tablero: soberanía, tecnología y reordenamiento institucional.',
      date: '22 Feb 2026',
      time: '8 min de lectura',
      href: '/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips'
    },
    items: [
      {
        cat: 'Análisis',
        topic: 'Tecnología',
        title: 'Tecnología como campo de batalla',
        excerpt: 'La infraestructura del futuro define el poder presente.',
        date: '20 Feb 2026',
        time: '7 min',
        href: '/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips'
      }
    ]
  }
}
