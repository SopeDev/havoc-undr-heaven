import { defineField, defineType } from 'sanity'
import { editorialSlugify } from '../utils/slugify'

export default defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96, slugify: editorialSlugify },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Optional blurb for tema pages, SEO, or editorial context',
      type: 'text',
      rows: 4
    })
  ],
  preview: {
    select: { title: 'name', subtitle: 'description' }
  }
})
