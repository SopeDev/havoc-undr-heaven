import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'newsletterIssue',
  title: 'Edición newsletter (Dispatch)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título de la edición',
      description: 'Ej. Havoc Dispatch — Semana del 10 mar 2026',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'issuedAt',
      title: 'Fecha de la edición',
      description: 'Fecha editorial de este envío (listados y archivo).',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'intro',
      title: 'Intro / bajada',
      description: 'Texto opcional para la página de la edición y el cuerpo del email.',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'articles',
      title: 'Artículos en esta edición',
      description:
        'Orden = orden en el email y en la web. Cada artículo debe tener Deck / excerpt para el envío. El sitio público solo muestra esta edición cuando “Enviado el” está definido.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }]
    }),
    defineField({
      name: 'emailSentAt',
      title: 'Enviado el',
      description:
        'Cuándo se completó el envío por correo. Vacío = borrador (no aparece en Despachos ni archivo público). Suele completarse el job del lunes o manualmente.',
      type: 'datetime'
    })
  ],
  preview: {
    select: { title: 'title', sent: 'emailSentAt', issued: 'issuedAt' },
    prepare({ title, sent, issued }) {
      const date = issued ? new Date(issued).toLocaleDateString('es') : ''
      return {
        title: title || 'Sin título',
        subtitle: sent ? `Enviado · ${date}` : `Borrador · ${date}`
      }
    }
  },
  orderings: [
    { title: 'Emitido, más reciente', name: 'issuedDesc', by: [{ field: 'issuedAt', direction: 'desc' }] }
  ]
})
