import { defineArrayMember, defineField, defineType } from 'sanity'

const STATUS_OPTIONS = [
  { title: 'Activo (hot)', value: 'hot' },
  { title: 'Tensión elevada (warm)', value: 'warm' },
  { title: 'Latente (cold)', value: 'cold' }
]

const STANCE_OPTIONS = [
  { title: 'Asertivo', value: 'aggressive' },
  { title: 'Defensivo', value: 'defensive' },
  { title: 'Ambiguo', value: 'ambiguous' },
  { title: 'Observador activo', value: 'observer' }
]

const STANCE_PREVIEW_SUBTITLE = {
  aggressive: 'Asertivo',
  defensive: 'Defensivo',
  ambiguous: 'Ambiguo',
  observer: 'Observador activo'
}

const LEVEL_OPTIONS = [
  { title: 'Alta', value: 'high' },
  { title: 'Media', value: 'med' },
  { title: 'Baja', value: 'low' }
]

const TIMELINE_ACCENT = [
  { title: 'Rojo (crítico)', value: 'hot' },
  { title: 'Naranja (alerta)', value: 'warm' },
  { title: 'Azul (institucional)', value: 'cold' }
]

export default defineType({
  name: 'foco',
  title: 'Foco de tensión',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      description: 'Nombre del foco.',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        maxLength: 96,
        source: doc => (typeof doc?.title === 'string' ? doc.title : '')
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: { list: STATUS_OPTIONS, layout: 'radio' },
      initialValue: 'warm',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'statusLabel',
      title: 'Etiqueta de estado (opcional)',
      description: 'Si está vacío, el sitio usa la etiqueta por defecto según el estado.',
      type: 'string'
    }),
    defineField({
      name: 'titleLines',
      title: 'Título en el hero (líneas opcionales)',
      description:
        'Si lo completás, cada ítem es una línea del titular grande (como en el mock). Si está vacío, el sitio puede mostrar solo el campo Título.',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'tags',
      title: 'Temas / etiquetas',
      description:
        'Referencias a los mismos tags que usás en artículos. Un artículo aparece en el Archivo de este foco si comparte al menos uno de estos tags.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      validation: Rule => Rule.min(1).error('Agregá al menos un tag para enlazar artículos al foco.')
    }),
    defineField({
      name: 'regionLineOverride',
      title: 'Línea de región (opcional)',
      description:
        'Texto bajo el título (ej. Indo-Pacífico · China). Si lo dejás vacío, el sitio puede armar la línea a partir de los nombres de los tags.',
      type: 'string'
    }),
    defineField({
      name: 'summary',
      title: 'Resumen / bajada',
      type: 'text',
      rows: 5
    }),
    defineField({
      name: 'updatedAt',
      title: 'Actualizado',
      description: 'Fecha mostrada como “Actualizado” en el hero.',
      type: 'datetime'
    }),
    defineField({
      name: 'actors',
      title: 'Actores principales',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'focoActor',
          fields: [
            defineField({ name: 'name', title: 'Nombre', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'role', title: 'Rol / descripción', type: 'text', rows: 3 }),
            defineField({
              name: 'stance',
              title: 'Postura',
              type: 'string',
              options: { list: STANCE_OPTIONS, layout: 'radio' },
              initialValue: 'observer',
              validation: Rule => Rule.required()
            })
          ],
          preview: {
            select: { name: 'name', stance: 'stance' },
            prepare({ name, stance }) {
              const sub =
                stance && STANCE_PREVIEW_SUBTITLE[stance] ? STANCE_PREVIEW_SUBTITLE[stance] : stance || ''
              return { title: name || 'Actor', subtitle: sub }
            }
          }
        })
      ]
    }),
    defineField({
      name: 'tensionIndicators',
      title: 'Índice de tensión HUH',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'focoIndicator',
          fields: [
            defineField({ name: 'label', title: 'Indicador', type: 'string', validation: Rule => Rule.required() }),
            defineField({
              name: 'level',
              title: 'Nivel',
              description: 'Se muestra en el sitio como Alta, Media o Baja con el color correspondiente.',
              type: 'string',
              options: { list: LEVEL_OPTIONS, layout: 'radio' },
              initialValue: 'med',
              validation: Rule => Rule.required()
            })
          ],
          preview: {
            select: { label: 'label', level: 'level' },
            prepare({ label, level }) {
              const sub =
                level === 'high' ? 'Alta' : level === 'low' ? 'Baja' : level === 'med' ? 'Media' : '—'
              return { title: label || 'Indicador', subtitle: sub }
            }
          }
        })
      ]
    }),
    defineField({
      name: 'keyFigures',
      title: 'Cifras clave',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'focoKeyFigure',
          fields: [
            defineField({ name: 'label', title: 'Etiqueta', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'value', title: 'Valor', type: 'string', validation: Rule => Rule.required() }),
            defineField({
              name: 'level',
              title: 'Nivel de color (opcional)',
              type: 'string',
              options: {
                list: [
                  { title: '—', value: '' },
                  { title: 'Alta', value: 'high' },
                  { title: 'Media', value: 'med' },
                  { title: 'Baja', value: 'low' }
                ]
              }
            })
          ],
          preview: {
            select: { label: 'label', value: 'value' },
            prepare({ label, value }) {
              return { title: label, subtitle: value }
            }
          }
        })
      ]
    }),
    defineField({
      name: 'signalQuote',
      title: 'Señal HUH',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'timeline',
      title: 'Últimos desarrollos (timeline)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'focoTimelineEvent',
          fields: [
            defineField({
              name: 'periodLabel',
              title: 'Fecha / período (texto corto)',
              description: 'Ej. Feb 2026',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({ name: 'title', title: 'Título', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'text', title: 'Texto', type: 'text', rows: 4 }),
            defineField({
              name: 'accent',
              title: 'Color del punto',
              type: 'string',
              options: { list: TIMELINE_ACCENT, layout: 'radio' },
              initialValue: 'warm'
            })
          ],
          preview: {
            select: { period: 'periodLabel', title: 'title' },
            prepare({ period, title }) {
              return { title: title || 'Evento', subtitle: period }
            }
          }
        })
      ]
    }),
    defineField({
      name: 'context',
      title: 'Contexto de fondo',
      description: 'Pestaña “Contexto de Fondo”; mismo tipo de bloques que en artículos.',
      type: 'blockContent'
    }),
    defineField({
      name: 'contextReadings',
      title: 'Lecturas esenciales',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'focoReading',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'subtitle', title: 'Subtítulo / fuente', type: 'string' })
          ],
          preview: {
            select: { title: 'title', subtitle: 'subtitle' },
            prepare({ title, subtitle }) {
              return { title, subtitle }
            }
          }
        })
      ]
    }),
    defineField({
      name: 'relatedFocos',
      title: 'Focos relacionados',
      description: 'Tarjetas al pie; idealmente 3.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'foco' }] }],
      validation: Rule => Rule.max(3)
    }),
    defineField({
      name: 'featured',
      title: 'Destacado en el índice',
      description: 'Puede mostrarse como foco principal en /focos.',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'sortOrder',
      title: 'Orden en grilla',
      description: 'Número menor = primero en la lista del índice.',
      type: 'number',
      initialValue: 0
    })
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      status: 'status'
    },
    prepare({ title, slug, status }) {
      const st = status === 'hot' ? 'Activo' : status === 'cold' ? 'Latente' : 'Tensión elevada'
      return {
        title: title?.trim() || 'Foco',
        subtitle: slug ? `${slug} · ${st}` : st
      }
    }
  },
  orderings: [
    { title: 'Título A→Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
    { title: 'Orden manual', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
    { title: 'Actualizado', name: 'updatedAtDesc', by: [{ field: 'updatedAt', direction: 'desc' }] }
  ]
})
