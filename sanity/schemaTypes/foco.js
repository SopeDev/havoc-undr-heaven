import { defineArrayMember, defineField, defineType } from 'sanity'

const STATUS_OPTIONS = [
  { title: 'Activo (hot)', value: 'hot' },
  { title: 'Tensión elevada (warm)', value: 'warm' },
  { title: 'Latente (cold)', value: 'cold' }
]

const STANCE_OPTIONS = [
  { title: 'Asertivo / coercitivo', value: 'aggressive' },
  { title: 'Defensivo', value: 'defensive' },
  { title: 'Ambiguo / condicional', value: 'ambiguous' },
  { title: 'Observador activo', value: 'observer' }
]

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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        maxLength: 96,
        source: doc => {
          const lines = doc?.titleLines
          if (!Array.isArray(lines)) return ''
          return lines.filter(Boolean).join(' ').trim()
        }
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
      title: 'Título (líneas)',
      description: 'Cada ítem es una línea del titular en la página del foco.',
      type: 'array',
      of: [{ type: 'string' }],
      validation: Rule => Rule.min(1)
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
              title: 'Postura (estilo)',
              type: 'string',
              options: { list: STANCE_OPTIONS, layout: 'radio' },
              initialValue: 'observer'
            }),
            defineField({
              name: 'stanceLabel',
              title: 'Texto de postura',
              description: 'Ej. Postura: Asertivo. Si está vacío, el sitio usa un texto por defecto según la postura.',
              type: 'string'
            })
          ],
          preview: {
            select: { name: 'name', stance: 'stance' },
            prepare({ name, stance }) {
              return { title: name || 'Actor', subtitle: stance }
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
            defineField({ name: 'value', title: 'Valor (texto)', type: 'string', validation: Rule => Rule.required() }),
            defineField({
              name: 'level',
              title: 'Nivel (color)',
              type: 'string',
              options: { list: LEVEL_OPTIONS, layout: 'radio' },
              initialValue: 'med'
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
      lines: 'titleLines',
      slug: 'slug.current',
      status: 'status'
    },
    prepare({ lines, slug, status }) {
      const title =
        Array.isArray(lines) && lines.length ? lines.filter(Boolean).join(' ') : 'Foco'
      const st = status === 'hot' ? 'Activo' : status === 'cold' ? 'Latente' : 'Tensión elevada'
      return {
        title,
        subtitle: slug ? `${slug} · ${st}` : st
      }
    }
  },
  orderings: [
    { title: 'Orden manual', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
    { title: 'Actualizado', name: 'updatedAtDesc', by: [{ field: 'updatedAt', direction: 'desc' }] }
  ]
})
