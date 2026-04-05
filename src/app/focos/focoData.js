/** Mock focos — expand per CMS later */

export const FOCO_SLUGS = [
  'ucrania-frente-de-guerra',
  'estrecho-de-taiwan',
  'reconfiguracion-post-gaza',
  'sahel-giro-geopolitico',
  'mar-del-sur-de-china',
  'rearmamento-europeo',
  'sudan-colapso-estatal',
  'desdolarizacion-global',
  'expansion-brics',
  'corea-del-norte-apertura-controlada'
]

const genericContexto = (name, region) => ({
  paragraphs: [
    {
      type: 'p',
      text: `${name} forma parte de los escenarios estructurales que HUH sigue como foco de tensión: no cubrimos el minuto a minuto, sino los incentivos y las rutas que reordenan el tablero.`
    },
    {
      type: 'h3',
      text: 'Qué vigilar'
    },
    {
      type: 'p',
      text: `En ${region}, la señal útil suele estar en la logística y los compromisos financieros — no solo en los titulares diplomáticos.`
    }
  ],
  readings: [
    { title: 'Archivo HUH', subtitle: 'Explora análisis y reflexiones ya publicadas sobre la región.' },
    { title: 'Temas relacionados', subtitle: 'Encadenar el foco con geoeconomía, seguridad y diplomacia.' }
  ]
})

const genericTimeline = () => [
  {
    date: 'Feb 2026',
    dot: 'var(--orange)',
    title: 'Actualización de escenario',
    text: 'Los actores ajustan posturas; la fricción se mantiene en un rango que conviene monitorear semana a semana.'
  },
  {
    date: 'Ene 2026',
    dot: 'var(--blue)',
    title: 'Señal institucional',
    text: 'Cambios en retórica o en el canal diplomático suelen anticipar movimientos de segunda ronda.'
  }
]

const genericArchivo = slug => {
  const base = '/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips'
  return [
    {
      cat: 'Análisis',
      title: 'Lectura relacionada con el tablero global',
      excerpt: 'Piezas del archivo útiles para situar incentivos — sustituir por artículos etiquetados al integrar CMS.',
      meta: '28 Feb 2026 · 8 min de lectura',
      href: base
    },
    {
      cat: 'Newsletter',
      title: `Dispatch — notas sobre ${slug.replace(/-/g, ' ')}`,
      excerpt: 'Resumen editorial semanal; en producción enlazará al índice de dispatches por foco.',
      meta: '28 Feb 2026 · 5 min',
      href: '/articulos/havoc-dispatch-8-la-semana-que-movio-el-tablero'
    }
  ]
}

function minimalFoco(slug, partial) {
  const status = partial.status || 'warm'
  return {
    slug,
    status,
    articleCount: partial.articleCount ?? 2,
    statusLabel:
      partial.statusLabel ||
      (status === 'hot' ? 'Conflicto activo / activo' : status === 'cold' ? 'Latente' : 'Tensión elevada'),
    regionLine: partial.regionLine,
    titleLines: partial.titleLines,
    summary: partial.summary,
    updated: partial.updated || '28 Feb 2026',
    actors: partial.actors || [
      {
        name: 'Actores regionales',
        role: 'Posturas y coaliciones en redefinición; detalle al conectar CMS.',
        stanceClass: 'stance-observador',
        stanceLabel: 'Postura: Observador activo'
      }
    ],
    indicators: partial.indicators || [
      { label: 'Actividad militar', val: 'Media', valClass: 'val-med' },
      { label: 'Presión diplomática', val: 'Media', valClass: 'val-med' },
      { label: 'Riesgo de escalada', val: 'Media', valClass: 'val-med' }
    ],
    keyFigures: partial.keyFigures || [
      { name: 'Indicador clave', val: '—' },
      { name: 'Actualización HUH', val: partial.updated || '28 Feb 2026' }
    ],
    signalQuote: partial.signalQuote || 'Seguimos el ritmo operacional y los compromisos externos más que la retórica.',
    timeline: partial.timeline || genericTimeline(),
    archivo: partial.archivo || genericArchivo(slug),
    contexto: partial.contexto || genericContexto(partial.titleLines.join(' '), partial.regionLine),
    related: partial.related || []
  }
}

export const FOCOS_BY_SLUG = {
  'estrecho-de-taiwan': {
    slug: 'estrecho-de-taiwan',
    status: 'warm',
    articleCount: 3,
    statusLabel: 'Tensión Elevada',
    regionLine: 'Indo-Pacífico · China · Taiwán · Estados Unidos',
    titleLines: ['Estrecho', 'de Taiwán'],
    summary:
      'La disputa más peligrosa del mundo. Beijing considera Taiwán una provincia rebelde; Washington mantiene una política de ambigüedad estratégica que cada vez cuesta más sostener. El estrecho es el punto de fricción donde el viejo orden y el nuevo orden se miran de frente.',
    updated: '28 Feb 2026',
    actors: [
      {
        name: 'República Popular China',
        role: 'Reclama soberanía sobre Taiwán. Escala presión militar y diplomática de forma gradual y sistemática.',
        stanceClass: 'stance-agresivo',
        stanceLabel: 'Postura: Asertivo'
      },
      {
        name: 'Taiwán (ROC)',
        role: 'Democracia de facto con gobierno propio. Mantiene su identidad mientras evita la declaración formal de independencia.',
        stanceClass: 'stance-defensivo',
        stanceLabel: 'Postura: Defensivo'
      },
      {
        name: 'Estados Unidos',
        role: 'Suministra armas a Taiwán bajo la Ley de Relaciones de Taiwán. Mantiene ambigüedad estratégica sobre intervención directa.',
        stanceClass: 'stance-ambiguo',
        stanceLabel: 'Postura: Ambiguo'
      },
      {
        name: 'Japón · Australia',
        role: 'Aliados regionales con interés vital en estabilidad del estrecho. Aumentan capacidad de defensa propia.',
        stanceClass: 'stance-observador',
        stanceLabel: 'Postura: Observador activo'
      }
    ],
    indicators: [
      { label: 'Actividad militar', val: 'Alta', valClass: 'val-high' },
      { label: 'Presión diplomática', val: 'Media', valClass: 'val-med' },
      { label: 'Riesgo de escalada', val: 'Media', valClass: 'val-med' },
      { label: 'Probabilidad de conflicto (12 meses)', val: 'Baja', valClass: 'val-low' }
    ],
    keyFigures: [
      { name: 'Ancho del estrecho', val: '180 km' },
      { name: 'PIB de Taiwán', val: '$790B USD' },
      { name: 'Producción chips avanzados', val: '+90%', valClass: 'val-high' },
      { name: 'Gasto militar China (2025)', val: '$296B USD' }
    ],
    signalQuote:
      'Observa la cadencia de los ejercicios del EPL, no sus declaraciones. El ritmo operacional revela la intención estratégica mejor que cualquier comunicado oficial.',
    timeline: [
      {
        date: 'Feb 2026',
        dot: 'var(--orange)',
        title: 'EPL intensifica ejercicios navales al este del estrecho',
        text: 'La Marina del Ejército Popular de Liberación completó sus ejercicios de mayor escala en 18 meses, incluyendo simulacros de bloqueo naval. Washington respondió con el paso de un destructor por el estrecho dentro de las 72 horas.'
      },
      {
        date: 'Ene 2026',
        dot: 'var(--red)',
        title: 'Revisión interna de la doctrina de ambigüedad estratégica en EEUU',
        text: 'Documentos filtrados sugieren que el Departamento de Defensa está revisando activamente si la política de ambigüedad estratégica sigue siendo creíble como disuasor ante las capacidades militares chinas actuales.'
      },
      {
        date: 'Dic 2025',
        dot: 'var(--blue)',
        title: 'Taiwán aprueba aumento del 15% en presupuesto de defensa',
        text: 'El parlamento taiwanés aprobó el mayor aumento de presupuesto de defensa en una década, con énfasis en sistemas de misiles costeros y guerra asimétrica.'
      },
      {
        date: 'Nov 2025',
        dot: 'var(--orange)',
        title: 'China aumenta presencia de aviones militares en zona de identificación de defensa aérea',
        text: 'Los incursiones de aeronaves militares chinas en la ADIZ taiwanesa alcanzaron un nuevo récord mensual. La táctica busca normalizar la presencia militar y desgastar la capacidad de respuesta taiwanesa.'
      }
    ],
    archivo: [
      {
        cat: 'Análisis',
        title: 'La guerra de los semiconductores no es sobre chips',
        excerpt:
          'Los controles de exportación de Washington son el primer movimiento de una campaña más profunda — sobre quién define la arquitectura de la próxima era industrial.',
        meta: '28 Feb 2026 · 8 min de lectura',
        href: '/articulos/la-guerra-de-los-semiconductores-no-es-sobre-chips'
      },
      {
        cat: 'Reflexiones',
        title: 'Taiwán no es Ucrania: por qué las analogías fallan',
        excerpt:
          'La tentación de leer Taiwán como la próxima Ucrania es comprensible pero incorrecta. Las asimetrías geográficas, económicas y nucleares hacen imposible la comparación directa.',
        meta: '14 Feb 2026 · 6 min de lectura',
        href: '/articulos/la-equivocacion-de-occidente-con-ucrania'
      },
      {
        cat: 'Newsletter',
        title: 'Dispatch №001 — Señal: La revisión de la ambigüedad estratégica',
        excerpt:
          'Esta semana el dato más importante no fue la noticia más cubierta. El Pentágono está discutiendo si la ambigüedad estratégica sigue siendo un disuasor creíble.',
        meta: '28 Feb 2026 · Dispatch №001',
        href: '/articulos/havoc-dispatch-8-la-semana-que-movio-el-tablero'
      }
    ],
    contexto: {
      paragraphs: [
        {
          type: 'p',
          text: 'La disputa del Estrecho de Taiwán tiene sus raíces en la Guerra Civil China de 1945–1949. Cuando las fuerzas comunistas de Mao Zedong derrotaron al gobierno nacionalista del Kuomintang, el líder Chiang Kai-shek y sus fuerzas se retiraron a la isla de Taiwán, donde establecieron la República de China (ROC), proclamándose el gobierno legítimo de toda China.'
        },
        {
          type: 'h3',
          text: 'La estructura de la tensión'
        },
        {
          type: 'p',
          text: 'Beijing opera bajo el principio de «Una sola China» — la posición de que existe un solo Estado chino y que Taiwán es parte de él. La República Popular China nunca ha controlado Taiwán, pero tampoco ha renunciado al uso de la fuerza para «reunificarlo».'
        },
        {
          type: 'blockquote',
          text: 'Taiwán no es un problema de seguridad. Es un problema de identidad nacional amplificado por la física de los semiconductores y la geometría de las alianzas del Pacífico.'
        },
        {
          type: 'p',
          text: 'Taiwán, por su parte, ha evolucionado hacia una democracia funcional con una identidad propia. Las encuestas muestran consistentemente que la mayoría de los taiwaneses se identifican como taiwaneses — no como chinos — y prefieren el statu quo a la unificación bajo los términos de Beijing.'
        },
        {
          type: 'h3',
          text: 'Por qué importa al nuevo orden mundial'
        },
        {
          type: 'p',
          text: 'Taiwán produce más del 90% de los semiconductores más avanzados del planeta a través de TSMC. Cualquier interrupción de esa producción — ya sea por conflicto, bloqueo o coerción — tendría consecuencias económicas globales que hacen palidecer cualquier crisis previa de cadenas de suministro.'
        },
        {
          type: 'p',
          text: 'El estrecho es también el test definitivo de la arquitectura de alianzas estadounidense en el Indo-Pacífico. Si Washington no puede — o no quiere — defender Taiwán, el valor de sus compromisos de seguridad en toda la región se derrumba.'
        }
      ],
      readings: [
        {
          title: 'The China Challenge — Hal Brands',
          subtitle: 'El marco más riguroso sobre la competencia estratégica EEUU-China'
        },
        {
          title: '2034 — Elliot Ackerman & Adm. Stavridis',
          subtitle: 'Ficción estratégica que simula un conflicto en el estrecho'
        },
        {
          title: 'CSIS Taiwan Strait War Game Reports',
          subtitle: 'Simulaciones del conflicto. Acceso público.'
        }
      ]
    },
    related: [
      { slug: 'ucrania-frente-de-guerra', status: 'hot', name: 'Ucrania — Frente de Guerra', region: 'Europa del Este', summary: 'El conflicto que reconfiguró la arquitectura de seguridad europea.' },
      { slug: 'reconfiguracion-post-gaza', status: 'hot', name: 'Reconfiguración Post-Gaza', region: 'Medio Oriente', summary: 'Reordenamiento de alianzas tras Gaza.' },
      { slug: 'expansion-brics', status: 'cold', name: 'Expansión BRICS+', region: 'Global · Sur Global', summary: 'Instituciones paralelas y arquitectura financiera alternativa.' }
    ]
  },

  'ucrania-frente-de-guerra': minimalFoco('ucrania-frente-de-guerra', {
    status: 'hot',
    articleCount: 7,
    statusLabel: 'Conflicto Activo',
    regionLine: 'Europa del Este · Rusia · OTAN',
    titleLines: ['Ucrania —', 'Frente de', 'Guerra'],
    summary:
      'El conflicto que reconfiguró la arquitectura de seguridad europea y expuso los límites del orden unipolar. Las negociaciones de alto el fuego siguen bloqueadas mientras el debate sobre el compromiso occidental a largo plazo se intensifica internamente.',
    actors: [
      {
        name: 'Rusia',
        role: 'Objetivos estratégicos en la frontera y órbita post-soviética; uso de fuerza y líneas diplomáticas paralelas.',
        stanceClass: 'stance-agresivo',
        stanceLabel: 'Postura: Asertivo'
      },
      {
        name: 'Ucrania',
        role: 'Defensa territorial y afiliación política occidental; dependencia de apoyo exterior sostenido.',
        stanceClass: 'stance-defensivo',
        stanceLabel: 'Postura: Defensivo'
      },
      {
        name: 'OTAN / UE',
        role: 'Sanciones, asistencia militar y contención del escalado sistémico; tensiones internas sobre el horizonte.',
        stanceClass: 'stance-ambiguo',
        stanceLabel: 'Postura: Ambiguo'
      }
    ],
    related: [
      { slug: 'estrecho-de-taiwan', status: 'warm', name: 'Estrecho de Taiwán', region: 'Indo-Pacífico', summary: 'Disputa clave entre EEUU y China.' },
      { slug: 'rearmamento-europeo', status: 'warm', name: 'Rearmamento Europeo', region: 'Europa · OTAN', summary: 'Autonomía estratégica y defensa común.' },
      { slug: 'desdolarizacion-global', status: 'cold', name: 'Desdolarización Global', region: 'Global · Geoeconomía', summary: 'Erosión acumulativa del sistema del petrodólar.' }
    ]
  }),

  'reconfiguracion-post-gaza': minimalFoco('reconfiguracion-post-gaza', {
    status: 'hot',
    regionLine: 'Medio Oriente',
    titleLines: ['Reconfiguración', 'Post-Gaza'],
    summary:
      'El reordenamiento de alianzas regionales tras el conflicto en Gaza. La normalización árabe-israelí está estancada pero no muerta. Los cálculos en Riad han cambiado significativamente.',
    related: [
      { slug: 'sahel-giro-geopolitico', status: 'warm', name: 'Sahel — Giro Geopolítico', region: 'África Occidental', summary: 'Reorientación hacia Rusia y China.' },
      { slug: 'mar-del-sur-de-china', status: 'warm', name: 'Mar del Sur de China', region: 'Indo-Pacífico', summary: 'Incidentes navales y asertividad china.' },
      { slug: 'ucrania-frente-de-guerra', status: 'hot', name: 'Ucrania — Frente de Guerra', region: 'Europa del Este', summary: 'Reconfiguración de seguridad europea.' }
    ]
  }),

  'sahel-giro-geopolitico': minimalFoco('sahel-giro-geopolitico', {
    status: 'warm',
    regionLine: 'África Occidental',
    titleLines: ['Sahel —', 'Giro Geopolítico'],
    summary:
      'Mali, Níger y Burkina Faso expulsan a las fuerzas francesas y se reorientan hacia Rusia y China. Las élites africanas aprenden a usar la competencia entre grandes potencias como palanca de soberanía.',
    related: [
      { slug: 'sudan-colapso-estatal', status: 'hot', name: 'Sudan — Colapso Estatal', region: 'Cuerno de África', summary: 'Crisis humanitaria y armas externas.' },
      { slug: 'desdolarizacion-global', status: 'cold', name: 'Desdolarización Global', region: 'Global', summary: 'Infraestructura financiera alternativa.' },
      { slug: 'expansion-brics', status: 'cold', name: 'Expansión BRICS+', region: 'Sur Global', summary: 'Instituciones paralelas.' }
    ]
  }),

  'mar-del-sur-de-china': minimalFoco('mar-del-sur-de-china', {
    status: 'warm',
    regionLine: 'Indo-Pacífico · ASEAN',
    titleLines: ['Mar del Sur', 'de China'],
    summary:
      'Beijing aserta su soberanía sobre aguas disputadas con Filipinas, Vietnam y Malasia. Los incidentes navales aumentan mientras EEUU incrementa su presencia en la región.',
    related: [
      { slug: 'estrecho-de-taiwan', status: 'warm', name: 'Estrecho de Taiwán', region: 'Indo-Pacífico', summary: 'Fractura central del orden regional.' },
      { slug: 'rearmamento-europeo', status: 'warm', name: 'Rearmamento Europeo', region: 'Europa', summary: 'Capacidad y autonomía.' },
      { slug: 'expansion-brics', status: 'cold', name: 'Expansión BRICS+', region: 'Global', summary: 'Bloque emergente.' }
    ]
  }),

  'rearmamento-europeo': minimalFoco('rearmamento-europeo', {
    status: 'warm',
    regionLine: 'Europa · OTAN',
    titleLines: ['Rearmamento', 'Europeo'],
    summary:
      'La presión sobre los aliados europeos para financiar su propia defensa acelera un debate existencial. ¿Puede Europa actuar estratégicamente sin EEUU? La pregunta ya no es teórica.',
    related: [
      { slug: 'ucrania-frente-de-guerra', status: 'hot', name: 'Ucrania — Frente de Guerra', region: 'Europa del Este', summary: 'Choque de seguridad continental.' },
      { slug: 'mar-del-sur-de-china', status: 'warm', name: 'Mar del Sur de China', region: 'Indo-Pacífico', summary: 'Competencia naval y territorial.' },
      { slug: 'desdolarizacion-global', status: 'cold', name: 'Desdolarización Global', region: 'Global', summary: 'Geoeconomía e instituciones.' }
    ]
  }),

  'sudan-colapso-estatal': minimalFoco('sudan-colapso-estatal', {
    status: 'hot',
    regionLine: 'África del Norte · Cuerno de África',
    titleLines: ['Sudan —', 'Colapso Estatal'],
    summary:
      'La guerra entre las Fuerzas Armadas Sudanesas y las RSF ha creado una crisis humanitaria grave. Las potencias externas alimentan el conflicto con armas mientras negocian acceso a recursos.',
    related: [
      { slug: 'sahel-giro-geopolitico', status: 'warm', name: 'Sahel', region: 'África Occidental', summary: 'Giro geopolítico regional.' },
      { slug: 'reconfiguracion-post-gaza', status: 'hot', name: 'Reconfiguración Post-Gaza', region: 'Medio Oriente', summary: 'Enlace regional.' },
      { slug: 'expansion-brics', status: 'cold', name: 'BRICS+', region: 'Global', summary: 'Sur Global.' }
    ]
  }),

  'desdolarizacion-global': minimalFoco('desdolarizacion-global', {
    status: 'cold',
    regionLine: 'Global · Geoeconomía',
    titleLines: ['Desdolarización', 'Global'],
    summary:
      'La erosión lenta pero acumulativa del sistema del petrodólar. Arabia Saudita, China y el bloque BRICS construyen infraestructura financiera alternativa. El proceso es gradual hasta que no lo es.',
    related: [
      { slug: 'expansion-brics', status: 'cold', name: 'Expansión BRICS+', region: 'Sur Global', summary: 'Instituciones paralelas.' },
      { slug: 'reconfiguracion-post-gaza', status: 'hot', name: 'Medio Oriente', region: 'Golfo', summary: 'Facturación y alianzas.' },
      { slug: 'mar-del-sur-de-china', status: 'warm', name: 'Indo-Pacífico', region: 'Comercio', summary: 'Rutas marítimas.' }
    ]
  }),

  'expansion-brics': minimalFoco('expansion-brics', {
    status: 'cold',
    regionLine: 'Global · Sur Global',
    titleLines: ['Expansión', 'BRICS+'],
    summary:
      'El bloque que agrupa a las potencias emergentes suma miembros y construye instituciones paralelas al orden de Bretton Woods. Su cohesión interna sigue siendo la pregunta clave.',
    related: [
      { slug: 'desdolarizacion-global', status: 'cold', name: 'Desdolarización', region: 'Global', summary: 'Moneda y clearing.' },
      { slug: 'sahel-giro-geopolitico', status: 'warm', name: 'Sahel', region: 'África', summary: 'Pivotes sur-sur.' },
      { slug: 'corea-del-norte-apertura-controlada', status: 'cold', name: 'Corea del Norte', region: 'Indo-Pacífico', summary: 'Apertura controlada.' }
    ]
  }),

  'corea-del-norte-apertura-controlada': minimalFoco('corea-del-norte-apertura-controlada', {
    status: 'cold',
    regionLine: 'Indo-Pacífico · Corea',
    titleLines: ['Corea del Norte —', 'Apertura Controlada'],
    summary:
      'Pyongyang abre canales discretos con actores seleccionados mientras mantiene su programa nuclear como garantía de supervivencia del régimen. Un proceso de décadas que podría acelerarse.',
    related: [
      { slug: 'estrecho-de-taiwan', status: 'warm', name: 'Taiwán', region: 'Indo-Pacífico', summary: 'Seguridad regional.' },
      { slug: 'mar-del-sur-de-china', status: 'warm', name: 'Mar del Sur de China', region: 'ASEAN', summary: 'Fricción marítima.' },
      { slug: 'expansion-brics', status: 'cold', name: 'BRICS+', region: 'Global', summary: 'Instituciones alternativas.' }
    ]
  })
}

export function getFocoBySlug(slug) {
  return FOCOS_BY_SLUG[slug] || null
}

/** Featured + grid order (matches static template layout). */
export const FOCO_FEATURED_SLUG = 'ucrania-frente-de-guerra'

export const FOCO_INDEX_CARDS = [
  { slug: 'reconfiguracion-post-gaza', kind: 'hot', label: 'Activo', articleCount: 5 },
  { slug: 'estrecho-de-taiwan', kind: 'warm', label: 'Tensión Elevada', articleCount: 3 },
  { slug: 'sahel-giro-geopolitico', kind: 'warm', label: 'Tensión Elevada', articleCount: 4 },
  { slug: 'mar-del-sur-de-china', kind: 'warm', label: 'Tensión Elevada', articleCount: 2 },
  { slug: 'rearmamento-europeo', kind: 'warm', label: 'Tensión Elevada', articleCount: 3 },
  { slug: 'sudan-colapso-estatal', kind: 'hot', label: 'Activo', articleCount: 2 },
  { slug: 'desdolarizacion-global', kind: 'cold', label: 'Latente', articleCount: 3 },
  { slug: 'expansion-brics', kind: 'cold', label: 'Latente', articleCount: 2 },
  { slug: 'corea-del-norte-apertura-controlada', kind: 'cold', label: 'Latente', articleCount: 1 }
]

/** Same card shape as Sanity index cards — for fallback when CMS has no foco documents. */
export function buildMockFocosIndexCards() {
  return FOCO_INDEX_CARDS.map(c => {
    const data = getFocoBySlug(c.slug)
    if (!data) return null
    return {
      slug: c.slug,
      kind: c.kind,
      label: c.label,
      titleLines: data.titleLines,
      regionLine: data.regionLine,
      summary: data.summary,
      updated: data.updated,
      articleCount: c.articleCount,
      featured: c.slug === FOCO_FEATURED_SLUG
    }
  }).filter(Boolean)
}

/**
 * Featured hero may use FOCO_FEATURED_SLUG even when that foco is not in the grid list (static mock layout).
 * @param {ReturnType<typeof buildMockFocosIndexCards>} cards
 */
export function resolveMockFeaturedIndexCard(cards) {
  if (!cards?.length) return null
  const inGrid = cards.find(c => c.slug === FOCO_FEATURED_SLUG)
  if (inGrid) return inGrid
  const data = getFocoBySlug(FOCO_FEATURED_SLUG)
  if (!data) return cards[0]
  const kind = data.status === 'hot' ? 'hot' : data.status === 'cold' ? 'cold' : 'warm'
  return {
    slug: data.slug,
    kind,
    label: data.statusLabel,
    titleLines: data.titleLines,
    regionLine: data.regionLine,
    summary: data.summary,
    updated: data.updated,
    articleCount: data.articleCount,
    featured: true
  }
}
