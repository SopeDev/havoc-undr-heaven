import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes, singletonTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const SINGLETON_HIDDEN_ACTIONS = new Set(['duplicate', 'delete', 'unpublish'])

export default defineConfig({
  name: 'havoc',
  title: 'Havoc Undr Heaven',
  projectId: projectId || 'missing-project-id',
  dataset,
  basePath: '/studio',
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    templates: templates => templates.filter(t => !singletonTypes.has(t.schemaType))
  },
  document: {
    actions: (prev, { schemaType }) => {
      if (singletonTypes.has(schemaType)) {
        return prev.filter(({ action }) => !SINGLETON_HIDDEN_ACTIONS.has(action))
      }
      return prev
    },
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter(option => !singletonTypes.has(option.templateId))
      }
      return prev
    }
  }
})
