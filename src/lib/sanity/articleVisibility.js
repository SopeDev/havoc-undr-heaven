/**
 * GROQ fragment: article is visible on the public site.
 * Dispatch pieces stay hidden until `releasedToWebAt` is set and not in the future.
 */
export const groqArticleVisibleOnWeb =
  '(includeInWeeklyNewsletter != true || (defined(releasedToWebAt) && releasedToWebAt <= now()))'

/**
 * @param {{ includeInWeeklyNewsletter?: boolean, releasedToWebAt?: string } | null | undefined} doc
 * @returns {boolean} true → do not render (404 / omit from lists handled elsewhere)
 */
export function isArticleWithheldFromWeb(doc) {
  if (!doc || doc.includeInWeeklyNewsletter !== true) return false
  const released = doc.releasedToWebAt
  if (released == null || released === '') return true
  const t = new Date(released).getTime()
  if (Number.isNaN(t)) return true
  return t > Date.now()
}
