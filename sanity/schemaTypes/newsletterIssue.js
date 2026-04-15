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
    }),
    defineField({
      name: 'sendStatus',
      title: 'Estado de envío',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Ready', value: 'ready' },
          { title: 'Sending', value: 'sending' },
          { title: 'Sent', value: 'sent' },
          { title: 'Failed', value: 'failed' }
        ],
        layout: 'radio'
      }
    }),
    defineField({
      name: 'sendAttemptCount',
      title: 'Intentos de envío',
      type: 'number',
      initialValue: 0
    }),
    defineField({
      name: 'lastSendAttemptAt',
      title: 'Último intento de envío',
      type: 'datetime',
      readOnly: true
    }),
    defineField({
      name: 'lastSentMessageId',
      title: 'Último message ID (Resend)',
      type: 'string',
      readOnly: true
    }),
    defineField({
      name: 'lastDispatchKey',
      title: 'Última clave de despacho',
      type: 'string',
      readOnly: true
    }),
    defineField({
      name: 'lastSendError',
      title: 'Último error de envío',
      type: 'text',
      rows: 3,
      readOnly: true
    })
  ],
  preview: {
    select: { title: 'title', sent: 'emailSentAt', issued: 'issuedAt', sendStatus: 'sendStatus' },
    prepare({ title, sent, issued, sendStatus }) {
      const date = issued ? new Date(issued).toLocaleDateString('es') : ''
      const status = sendStatus || (sent ? 'sent' : 'draft')
      return {
        title: title || 'Sin título',
        subtitle: `${status.toUpperCase()} · ${date}`
      }
    }
  },
  orderings: [
    { title: 'Emitido, más reciente', name: 'issuedDesc', by: [{ field: 'issuedAt', direction: 'desc' }] }
  ]
})
