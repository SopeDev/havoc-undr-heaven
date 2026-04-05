export const MOCK_ARTICLES = [
  (() => {
    const author = {
      name: 'Havoc Undr Heaven',
      initials: 'HUH',
      bio:
        'Publicación independiente de análisis geopolítico y relaciones internacionales fundada en la frontera Tijuana–San Diego. Cubrimos el nuevo orden mundial para una audiencia hispanohablante que merece análisis serio sin jerga académica ni propaganda. El nuevo orden mundial está aquí. Nosotros lo explicamos.'
    }

    const makeBody = (overrides = {}) => [
      {
        type: 'p',
        text:
          'Cuando el mundo cambia, el primer error es reducirlo a un solo episodio. Detrás de cada gesto hay una disputa por arquitectura — por reglas, por rutas, por capacidades.',
        ...overrides.first
      },
      { type: 'p', text: overrides.second ?? 'El resultado rara vez es el que las narrativas iniciales prometen. Lo que ocurre se decide en la fricción: incentivos, logística y política.' },
      { type: 'h2', text: overrides.h2 ?? 'El patrón que se repite' },
      {
        type: 'p',
        text:
          'Las instituciones, la industria y la seguridad se vuelven el mismo tablero. Cuando los controles externos se endurecen, los actores responden con autosuficiencia, alianzas y sustitución.',
        ...overrides.third
      },
      { type: 'blockquote', text: overrides.quote ?? 'La pregunta no es si habrá respuesta, sino cuánto tiempo tarda en volverse estratégica.' },
      {
        type: 'p',
        text:
          'La presión no detiene la trayectoria. La reordena. Es ahí donde se construye la próxima ventaja estructural.',
        ...overrides.fourth
      },
      { type: 'stat', number: overrides.statNumber ?? '$143B', text: overrides.statText ?? 'Inversión comprometida en capacidad doméstica — la redistribución silenciosa del futuro.' },
      { type: 'h2', text: overrides.h2b ?? 'Lo que esto revela del nuevo orden' },
      { type: 'p', text: overrides.last1 ?? 'Es el mismo patrón en microcosmos: una potencia consolidando, otra convirtiendo presión en combustible.' },
      { type: 'p', text: overrides.last2 ?? 'Dentro de pocos años, el episodio será recordado por el incentivo que creó, no por la restricción que impuso.' }
    ]

    const baseRelated = [
      { title: 'Arabia Saudita, el yuan y el fin del petrodólar', tag: 'Desdolarización', date: '15 Feb 2026' },
      { title: 'La no alineación como modelo de negocio', tag: 'India · Estrategia', date: '19 Feb 2026' },
      { title: 'China en camino a convertirse en el hegemon', tag: 'China · Hegemonía', date: '20 Ene 2026' }
    ]

    return [
      {
        slug: 'la-guerra-de-los-semiconductores-no-es-sobre-chips',
        cat: 'Análisis',
        tagsText: 'Estados Unidos · China · Tecnología',
        title: 'La guerra de los semiconductores no es sobre chips',
        deck:
          'Los controles de exportación de Washington son el primer movimiento de una campaña más profunda — una sobre quién define la arquitectura de la próxima era industrial.',
        dateLabel: '28 Feb 2026',
        readingTime: '8 min de lectura',
        author,
        coverCaption:
          'Fábrica de semiconductores TSMC en Taiwán. La isla produce más del 90% de los chips más avanzados del mundo.',
        body: makeBody({
          first: {
            text:
              'Cuando Estados Unidos anunció sus restricciones masivas de exportación de semiconductores en 2022, la mayoría de los analistas lo enmarcaron como una historia tecnológica. Los chips avanzados alimentan la inteligencia artificial; la IA alimenta los sistemas militares; por lo tanto, controlar el acceso a los chips equivale a contener la modernización militar china.'
          },
          second:
            'Ese marco se queda corto. La guerra de los semiconductores es una guerra de soberanía. Lo que Washington está realmente disputando es si Beijing tendrá permitido construir una base tecnológica autosuficiente — una que eventualmente haría irrelevantes las sanciones estadounidenses.',
          h2: 'El error de cálculo estratégico',
          quote: 'El control unilateral tiene fecha de caducidad. La pregunta es qué hace el contenido con ese tiempo.',
          statNumber: '$143B',
          statText:
            'Inversión comprometida por China en producción doméstica de semiconductores para 2030 — el mayor despliegue de capital estatal en tecnología en la historia.',
          last1:
            'La guerra de los semiconductores no es un episodio aislado. Es el patrón del nuevo orden mundial en microcosmos: una potencia establecida intentando preservar su ventaja estructural mediante controles unilaterales, y una potencia ascendente convirtiendo esa presión en combustible para la autosuficiencia.',
          last2:
            'El resultado más probable no es la contención permanente de China. Es que dentro de diez años, cuando los chips chinos compitan en rendimiento con los taiwaneses y estadounidenses, la guerra de los semiconductores será recordada como la política que hizo inevitable la independencia tecnológica de Beijing.'
        }),
        tags: ['Estados Unidos', 'China', 'Tecnología', 'Semiconductores', 'Nuevo Orden Mundial'],
        related: baseRelated
      },
      {
        slug: 'el-imperio-americano-en-decadencia',
        cat: 'Análisis',
        tagsText: 'Estados Unidos · Hegemonía',
        title: 'El Imperio Americano en decadencia',
        deck:
          'El unipolarismo no terminó con una derrota militar. Terminó con la acumulación silenciosa de alternativas que Washington no supo ver venir.',
        dateLabel: '25 Feb 2026',
        readingTime: '12 min de lectura',
        author,
        coverCaption:
          'Puente entre distritos financieros: tensión entre influencia histórica y nuevas rutas de poder.',
        body: makeBody({
          first: {
            text:
              'El unipolarismo rara vez cae en un día. Se erosiona por acumulación: incentivos internos, costos externos y alternativas que ganan tracción en cadena.'
          },
          h2: 'La alternativa como sistema',
          quote: 'La pérdida no llega con una señal, llega con un cambio de hábitos.',
          statNumber: '$—',
          statText: 'Reconfiguración de alianzas y sustitución de dependencias — el cambio silencioso.'
        }),
        tags: ['Estados Unidos', 'Hegemonía', 'Orden Mundial'],
        related: baseRelated
      },
      {
        slug: 'como-la-ruta-de-la-seda-compra-lealtad-politica',
        cat: 'Análisis',
        tagsText: 'China · BRI',
        title: 'Cómo la Ruta de la Seda compra lealtad política',
        deck:
          'La Iniciativa del Cinturón y la Ruta no es un proyecto de desarrollo. Es la infraestructura política del orden chino en construcción.',
        dateLabel: '22 Feb 2026',
        readingTime: '8 min de lectura',
        author,
        coverCaption: 'Mapa de corredores logísticos: infraestructura como política sostenida.',
        body: makeBody({
          first: {
            text:
              'La Ruta no opera como caridad ni como proyecto aislado. Funciona como un mecanismo de alineamiento: financia, conecta y obliga a administrar juntos.'
          },
          h2: 'Infraestructura como legitimidad',
          quote: 'Cuando la ruta se vuelve dependencia, la lealtad deja de ser discurso.',
          statNumber: '$—',
          statText: 'Acceso privilegiado a cadenas y gobernanza — el incentivo real.'
        }),
        tags: ['China', 'BRI', 'Diplomacia'],
        related: baseRelated
      },
      {
        slug: 'europa-en-crisis-existencial',
        cat: 'Análisis',
        tagsText: 'Europa · Defensa · OTAN',
        title: 'Europa en crisis existencial',
        deck:
          'La presión de Trump sobre los aliados europeos aceleró un debate que llevan décadas evitando: ¿puede Europa actuar estratégicamente sin Estados Unidos?',
        dateLabel: '20 Feb 2026',
        readingTime: '9 min de lectura',
        author,
        coverCaption: 'Panorama de defensa: el costo de la autonomía y el precio de la dependencia.',
        body: makeBody({
          first: {
            text:
              'Europa enfrenta un problema que no es solo militar. Es de capacidad: presupuesto, industria, logística, doctrina y decisión.'
          },
          h2: 'Capacidad antes que narrativa',
          quote: 'Autonomía no es independencia total. Es capacidad de elegir bajo presión.',
          statNumber: '$—',
          statText: 'Aceleración de programas — el ajuste de largo plazo.'
        }),
        tags: ['Europa', 'Defensa', 'OTAN'],
        related: baseRelated
      },
      {
        slug: 'la-equivocacion-de-occidente-con-ucrania',
        cat: 'Reflexiones',
        tagsText: 'Europa · OTAN · Ucrania',
        title: 'La equivocación de Occidente con Ucrania',
        deck:
          'Occidente ganó el argumento moral pero perdió el cálculo estratégico. La guerra de desgaste no debilita a Rusia tanto como fragmenta a Europa.',
        dateLabel: '10 Feb 2026',
        readingTime: '10 min de lectura',
        author,
        coverCaption: 'Fragmentación europea: tensiones entre solidaridad y cálculo.',
        body: makeBody({
          first: {
            text:
              'La moral moviliza, pero no reemplaza el diseño estratégico. Cuando el horizonte se vuelve elástico, el costo se distribuye de forma asimétrica.'
          },
          h2: 'Lo que el desgaste realmente hace',
          quote: 'El tiempo no es neutro: el desgaste modifica incentivos en cadena.',
          statNumber: '$—',
          statText: 'Efectos políticos y económicos — la erosión silenciosa.'
        }),
        tags: ['Ucrania', 'OTAN', 'Europa'],
        related: baseRelated
      },
      {
        slug: 'el-proposito-chino-zhong-meng-y-xi-jinping',
        cat: 'Reflexiones',
        tagsText: 'China · Civilización',
        title: 'El propósito chino: Zhōng Mèng y Xi Jinping',
        deck:
          'El Sueño Chino no es una consigna vacía. Es la articulación de un proyecto civilizacional con siglos de historia detrás.',
        dateLabel: '8 Feb 2026',
        readingTime: '9 min de lectura',
        author,
        coverCaption: 'Civilización como marco: continuidad y cambio coordinado.',
        body: makeBody({
          first: {
            text:
              'Los proyectos que sobreviven no dependen del titular del día. Se sostienen con lenguaje estructural: identidad, continuidad y capacidad de planificar.'
          },
          h2: 'Narrativa y administración',
          quote: 'Cuando el relato se convierte en plan, el futuro deja de ser promesa.',
          statNumber: '$—',
          statText: 'Implementación como legitimidad — la otra cara del sueño.'
        }),
        tags: ['China', 'Civilización', 'Proyecto'],
        related: baseRelated
      },
      {
        slug: 'havoc-dispatch-8-la-semana-que-movio-el-tablero',
        cat: 'Newsletter',
        tagsText: 'Resumen Semanal',
        title: 'Havoc Dispatch #8 — La semana que movió el tablero',
        deck:
          'Rearmamento europeo, crisis en el Sahel, y los nuevos números del comercio sino-americano. Todo lo que importó esta semana en geopolítica.',
        dateLabel: '28 Feb 2026',
        readingTime: '5 min de lectura',
        author,
        coverCaption: 'Edición semanal: tres señales, una misma dirección.',
        body: makeBody({
          first: {
            text:
              'Esta edición se concentra en lo que realmente movió el tablero: decisiones que cambian incentivos y reordenan rutas en competencia.'
          },
          h2: 'Los tres movimientos',
          quote: 'La semana no es el evento. Es el impulso que lo vuelve permanente.',
          statNumber: '$—',
          statText: 'Señales de capacidad: defensa, fronteras y comercio.'
        }),
        tags: ['Newsletter', 'Edición semanal'],
        related: baseRelated
      }
    ]
  })()
]
