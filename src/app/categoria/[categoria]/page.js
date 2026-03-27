import Link from 'next/link'
import SiteHeader from '../../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../../components/SiteFooter/SiteFooter'
import NewsletterSignup from '../../../components/NewsletterSignup/NewsletterSignup'

const TOPIC_PILLS = [
  'Todos',
  'China',
  'Estados Unidos',
  'Rusia',
  'Asia-Pacífico',
  'Medio Oriente',
  'América Latina',
  'Europa y Occidente',
  'BRICS',
  'México',
  'Geoeconomía',
  'Seguridad',
  'Tecnología',
  'Energía',
  'Comercio',
  'Diplomacia'
]

const SIDEBAR_ANALYSIS = [
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

const FOCO_ROWS = [
  { name: 'Ucrania — Frente Activo', region: 'Europa del Este', color: '#CC2200' },
  { name: 'Estrecho de Taiwán', region: 'Indo-Pacífico', color: '#E07800' },
  { name: 'Reconfiguración Post-Gaza', region: 'Medio Oriente', color: '#CC2200' },
  { name: 'Desdolarización Global', region: 'Global · Geoeconomía', color: '#336699' }
]

const CATEGORY_DATA = {
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
        excerpt: 'La Iniciativa del Cinturón y la Ruta no es un proyecto de desarrollo. Es la infraestructura política del orden chino.',
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
      deck: 'Durante setenta años Occidente creyó que la interdependencia económica garantizaba la paz. Esa hipótesis está siendo falsificada en tiempo real.',
      date: '28 Feb 2026',
      time: '8 min de lectura',
      href: '/articulos/el-proposito-chino-zhong-meng-y-xi-jinping'
    },
    items: [
      {
        cat: 'Reflexión',
        topic: 'Europa · OTAN · Ucrania',
        title: 'La equivocación de Occidente con Ucrania',
        excerpt: 'Occidente ganó el argumento moral pero perdió el cálculo estratégico. La guerra de desgaste no debilita a Rusia tanto como fragmenta a Europa.',
        date: '10 Feb 2026',
        time: '10 min',
        href: '/articulos/la-equivocacion-de-occidente-con-ucrania'
      },
      {
        cat: 'Reflexión',
        topic: 'China · Civilización',
        title: 'El propósito chino: Zhōng Mèng y Xi Jinping',
        excerpt: 'El Sueño Chino no es una consigna vacía. Es la articulación de un proyecto civilizacional con siglos de historia detrás.',
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
      deck: 'Rearmamento europeo, crisis en el Sahel, y los nuevos números del comercio sino-americano. Todo lo que importó esta semana.',
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

export default function CategoriaPage({ params }) {
  const key = params?.categoria
  const data = CATEGORY_DATA[key] || CATEGORY_DATA.reflexion

  return (
    <>
      <SiteHeader />

      <div className='breadcrumb'>
        <span>
          <Link href='/'>Inicio</Link>
        </span>
        <span className='sep'>›</span>
        <span className='current'>{data.title}</span>
      </div>

      <div className='section-tabs'>
        <Link
          href='/'
          className={data.title ? 'section-tab' : 'section-tab'}
          aria-label='Todo'
        >
          Todo
        </Link>
        <Link href='/categoria/analisis' className={key === 'analisis' ? 'section-tab active' : 'section-tab'}>
          Análisis
        </Link>
        <Link href='/categoria/reflexion' className={key === 'reflexion' ? 'section-tab active' : 'section-tab'}>
          Reflexión
        </Link>
        <Link
          href='/categoria/newsletter'
          className={key === 'newsletter' ? 'section-tab active' : 'section-tab'}
        >
          Newsletter
        </Link>
        <Link href='/focos' className={key === 'focos' ? 'section-tab active' : 'section-tab'}>
          Focos de Tensión
        </Link>
        <Link href='/tablero' className={key === 'tablero' ? 'section-tab active' : 'section-tab'}>
          Tablero Global
        </Link>
      </div>

      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div className='cat-header'>
          <div>
            <h1 className='cat-title'>{data.title}</h1>
            <p className='cat-desc'>{data.desc}</p>
          </div>

          <div className='cat-stats'>
            {data.stats.map(s => (
              <div key={s.label} className='cat-stat-row'>
                <span className='cat-stat-label'>{s.label}</span>
                <span className='cat-stat-val'>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='topic-filter'>
        <span className='topic-label'>Filtrar por tema:</span>
        {TOPIC_PILLS.map(t => (
          <div key={t} className={t === 'Todos' ? 'topic-pill active' : 'topic-pill'}>
            {t}
          </div>
        ))}
      </div>

      <div className='cat-body'>
        <div className='cat-feed'>
          <Link href={data.hero.href}>
            <div className='feed-hero' role='link' tabIndex={0}>
              <div className='feed-hero-image' />
              <div className='feed-hero-eyebrow'>
                <span className='cat-tag'>{data.hero.cat}</span>
                <span className='topic-tag'>{data.hero.topic}</span>
              </div>
              <h2 className='feed-hero-title'>{data.hero.title}</h2>
              <p className='feed-hero-deck'>{data.hero.deck}</p>
              <div className='feed-hero-meta'>
                <span>{data.hero.date}</span>
                <span>{data.hero.time}</span>
              </div>
            </div>
          </Link>

          {data.items.map(item => (
            <Link key={item.title} href={item.href}>
              <div className='feed-item' role='link' tabIndex={0}>
                <div>
                  <div className='feed-item-eyebrow'>
                    <span className='cat-tag'>{item.cat}</span>
                    <span className='topic-tag'>{item.topic}</span>
                  </div>
                  <div className='feed-item-title'>{item.title}</div>
                  <div className='feed-item-excerpt'>{item.excerpt}</div>
                  <div className='feed-item-meta'>
                    {item.date} · {item.time}
                  </div>
                </div>
                <div className='feed-thumb' />
              </div>
            </Link>
          ))}

          <div className='load-more'>Cargar más artículos</div>
        </div>

        <aside className='cat-sidebar'>
          <div className='sidebar-block'>
            <div className='sidebar-label'>Newsletter Semanal</div>
            <NewsletterSignup />
          </div>

          <div className='sidebar-block'>
            <div className='sidebar-label'>En Análisis</div>
            {SIDEBAR_ANALYSIS.map(s => (
              <Link key={s.title} href={s.href}>
                <div className='sidebar-art'>
                  <div className='sidebar-art-tag'>{s.tags}</div>
                  <div className='sidebar-art-title'>{s.title}</div>
                  <div className='sidebar-art-date'>{s.date}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className='sidebar-block'>
            <div className='sidebar-label'>Focos de Tensión</div>
            {FOCO_ROWS.map(f => (
              <div key={f.name} className='foco-row'>
                <div className='fdot-sm' style={{ background: f.color }} />
                <div>
                  <div className='foco-row-name'>{f.name}</div>
                  <div className='foco-row-region'>{f.region}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <SiteFooter />
    </>
  )
}

