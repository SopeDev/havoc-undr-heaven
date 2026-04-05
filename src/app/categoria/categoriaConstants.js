/** Fallback slugs when Sanity has not returned categories yet (empty nav). */
export const DEFAULT_CATEGORY_TAB_SLUGS = ['analisis', 'reflexiones', 'newsletter', 'redes']

export const DEFAULT_CATEGORY_TAB_LABELS = {
  analisis: 'Análisis',
  reflexiones: 'Reflexiones',
  newsletter: 'Newsletter',
  redes: 'Redes'
}

const CROSS_CATEGORY_PAIR = {
  analisis: 'reflexiones',
  reflexiones: 'analisis'
}

/**
 * @param {string} currentSlug
 * @param {Array<{ slug: string }>} categoriesFromNav
 * @returns {string | null}
 */
export function resolveCrossCategorySlug(currentSlug, categoriesFromNav) {
  const list = Array.isArray(categoriesFromNav) ? categoriesFromNav : []
  const slugs = new Set(list.map(c => c.slug).filter(Boolean))
  const paired = CROSS_CATEGORY_PAIR[currentSlug]
  if (paired && slugs.has(paired)) return paired
  const others = list.map(c => c.slug).filter(s => s && s !== currentSlug)
  return others[0] || null
}
