import { defineField, defineType } from 'sanity'

const INSTAGRAM_PATH_KINDS = ['p', 'reel', 'tv']

const validateInstagramPostUrl = value => {
  if (!value) return true
  try {
    const parsed = new URL(value)
    if (!parsed.hostname.includes('instagram.com')) {
      return 'La URL debe ser de instagram.com'
    }
    const segments = parsed.pathname.split('/').filter(Boolean)
    const hasValidKind = INSTAGRAM_PATH_KINDS.some(k => segments.includes(k))
    if (!hasValidKind) {
      return 'La URL debe corresponder a un post (/p/SHORTCODE/) o un reel (/reel/SHORTCODE/)'
    }
    return true
  } catch {
    return 'URL inválida'
  }
}

export default defineType({
  name: 'redesSettings',
  title: 'Configuración Redes',
  type: 'document',
  fields: [
    defineField({
      name: 'instagramFeaturedPostUrl',
      title: 'Publicación destacada de Instagram',
      type: 'url',
      description:
        'Pega la URL de un post o reel de Instagram para mostrarlo embebido en la sección de Instagram de /redes. Formato aceptado: https://www.instagram.com/p/SHORTCODE/ o https://www.instagram.com/reel/SHORTCODE/. Déjalo vacío para mostrar solo un enlace al perfil.',
      validation: Rule =>
        Rule.uri({ scheme: ['http', 'https'], allowRelative: false }).custom(validateInstagramPostUrl)
    })
  ],
  preview: {
    select: { url: 'instagramFeaturedPostUrl' },
    prepare({ url }) {
      return {
        title: 'Configuración Redes',
        subtitle: url ? `Instagram destacado: ${url}` : 'Sin publicación destacada de Instagram'
      }
    }
  }
})
