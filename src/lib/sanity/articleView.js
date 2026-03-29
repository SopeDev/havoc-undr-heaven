import { urlForImage } from './image'

const CATEGORY_SLUG_BY_NAME = {
  Análisis: 'analisis',
  Reflexión: 'reflexion',
  Newsletter: 'newsletter',
  Redes: 'redes'
}

export function initialsFromName(name) {
  if (!name || typeof name !== 'string') return 'HU'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 3).toUpperCase()
}

export function formatArticleDate(iso) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
  } catch {
    return '—'
  }
}

export function categoryHrefSlug(categoryName, categorySlug) {
  if (categorySlug) return categorySlug
  return CATEGORY_SLUG_BY_NAME[categoryName] || 'analisis'
}

/**
 * @param {Record<string, unknown>} doc - fetchArticleBySlug result
 * @param {Array<{ title: string, slug: string, publishedAt?: string, tagLine?: string }>} relatedRows
 */
export function buildMockArticleView(mock) {
  const catSlug =
    mock.cat === 'Análisis'
      ? 'analisis'
      : mock.cat === 'Reflexión'
        ? 'reflexion'
        : mock.cat === 'Newsletter'
          ? 'newsletter'
          : mock.cat === 'Redes'
            ? 'redes'
            : 'analisis'

  return {
    source: 'mock',
    cat: mock.cat,
    catSlug,
    tagsText: mock.tagsText,
    title: mock.title,
    deck: mock.deck,
    dateLabel: mock.dateLabel,
    readingTime: mock.readingTime,
    author: {
      name: mock.author.name,
      initials: mock.author.initials,
      bio: mock.author.bio,
      avatarUrl: null
    },
    coverCaption: mock.coverCaption,
    coverUrl: null,
    tags: mock.tags,
    related: mock.related.map(r => ({ key: r.title, title: r.title, tag: r.tag, date: r.date, href: null }))
  }
}

export function buildArticleViewFromSanity(doc, relatedRows = []) {
  const firstAuthor = Array.isArray(doc.authors) && doc.authors[0] ? doc.authors[0] : null
  const name = firstAuthor?.name || 'Havoc Undr Heaven'
  const avatarUrl = firstAuthor?.avatar ? urlForImage(firstAuthor.avatar) : null

  const tagNames = (doc.tags || []).map(t => t?.name).filter(Boolean)

  return {
    source: 'sanity',
    cat: doc.category?.name || 'Análisis',
    catSlug: categoryHrefSlug(doc.category?.name, doc.category?.slug),
    tagsText: tagNames.length ? tagNames.join(' · ') : '—',
    title: doc.title || '',
    deck: doc.deck || '',
    dateLabel: formatArticleDate(doc.publishedAt),
    readingTime:
      typeof doc.readingTimeMinutes === 'number' ? `${doc.readingTimeMinutes} min de lectura` : '—',
    author: {
      name,
      initials: initialsFromName(name),
      bio: firstAuthor?.bio || '',
      avatarUrl
    },
    coverCaption: doc.coverImage?.alt || '',
    coverUrl: doc.coverImage ? urlForImage(doc.coverImage) : null,
    tags: tagNames,
    related: (relatedRows || []).map(r => ({
      key: r.slug || r.title,
      title: r.title,
      tag: r.tagLine || 'HUH',
      date: formatArticleDate(r.publishedAt),
      href: r.slug ? `/articulos/${r.slug}` : null
    }))
  }
}
