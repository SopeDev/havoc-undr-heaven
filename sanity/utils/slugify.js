const stripDiacritics = value =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

/**
 * Slugify helper for editorial taxonomies (categories, tags). Strips diacritics
 * before slugifying so `"Análisis"` becomes `"analisis"` rather than `"análisis"`.
 * Mirrors the URLs hardcoded throughout the site (e.g. /categoria/analisis).
 */
export const editorialSlugify = input =>
  stripDiacritics(input)
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
