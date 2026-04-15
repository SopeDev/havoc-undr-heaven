import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'deck',
      title: 'Deck / excerpt',
      description: 'Hero subtitle or lead paragraph',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }]
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }]
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'author' }] }]
    }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime' }),
    defineField({
      name: 'readingTimeMinutes',
      title: 'Reading time (minutes)',
      type: 'number',
      validation: Rule => Rule.min(1).integer()
    }),
    defineField({
      name: 'includeInWeeklyNewsletter',
      title: 'Incluir en el Dispatch semanal',
      description:
        'Marcá los textos del Dispatch. Podés dejarlo en true: el sitio público los muestra solo cuando “Liberado al sitio el” tiene fecha y ya pasó. Completá Deck / excerpt para el correo (“Leer más”).',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'releasedToWebAt',
      title: 'Liberado al sitio el',
      description:
        'Cuándo el artículo puede verse en la web. Vacío o fecha futura = oculto en listas y en /articulos/… aunque “Incluir en el Dispatch” siga en true. Tras el envío, el job (o edición manual) pone aquí la fecha/hora — normalmente “ahora” o la del envío.',
      type: 'datetime'
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'deck',
      media: 'coverImage',
      weekly: 'includeInWeeklyNewsletter'
    },
    prepare({ title, subtitle, media, weekly }) {
      const base = subtitle || ''
      return {
        title,
        subtitle: weekly ? (base ? `${base} · Dispatch` : 'Dispatch semanal') : base,
        media
      }
    }
  },
  orderings: [
    {
      title: 'Published, newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    }
  ]
})
