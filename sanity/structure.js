import { singletonTypes } from './schemaTypes'

const SINGLETON_DEFINITIONS = [
  {
    id: 'redesSettings',
    schemaType: 'redesSettings',
    title: 'Configuración Redes'
  }
]

export const structure = S =>
  S.list()
    .title('Contenido')
    .items([
      ...SINGLETON_DEFINITIONS.map(def =>
        S.listItem()
          .id(def.id)
          .title(def.title)
          .child(S.document().schemaType(def.schemaType).documentId(def.id))
      ),
      S.divider(),
      ...S.documentTypeListItems().filter(item => !singletonTypes.has(item.getId()))
    ])
