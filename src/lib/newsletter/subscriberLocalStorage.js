export const NEWSLETTER_SUBSCRIBER_STORAGE_KEY = 'havoc_newsletter_subscriber_v1'

export const OPEN_NEWSLETTER_MODAL_EVENT = 'havoc-open-newsletter-modal'

/** After a gated redirect; consumed on next home/header mount. */
export const SESSION_NEWSLETTER_MODAL_FLAG = 'havoc_open_newsletter_modal_once'

export const dispatchNewsletterSubscriberChanged = () => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('havoc-newsletter-subscriber-changed'))
}

export const dispatchOpenNewsletterModal = () => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(OPEN_NEWSLETTER_MODAL_EVENT))
}

/**
 * @returns {{ email: string } | null}
 */
export function readNewsletterSubscriber() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(NEWSLETTER_SUBSCRIBER_STORAGE_KEY)
    if (!raw) return null
    const o = JSON.parse(raw)
    if (!o || typeof o !== 'object') return null
    if (o.confirmed === true) {
      const em = typeof o.email === 'string' ? o.email.trim().toLowerCase() : ''
      return { email: em.includes('@') ? em : '' }
    }
    if (typeof o.email === 'string' && o.email.includes('@')) {
      return { email: o.email.trim().toLowerCase() }
    }
    return null
  } catch {
    return null
  }
}

export function setNewsletterSubscriber(email) {
  if (typeof window === 'undefined') return
  const trimmed = typeof email === 'string' ? email.trim().toLowerCase() : ''
  if (!trimmed || !trimmed.includes('@')) return
  try {
    localStorage.setItem(
      NEWSLETTER_SUBSCRIBER_STORAGE_KEY,
      JSON.stringify({ email: trimmed, at: Date.now() })
    )
    dispatchNewsletterSubscriberChanged()
  } catch {
    // ignore quota / private mode
  }
}

/** When the user completed double opt-in but no email was passed in the URL (legacy links). */
export function setNewsletterConfirmedWithoutEmail() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      NEWSLETTER_SUBSCRIBER_STORAGE_KEY,
      JSON.stringify({ confirmed: true, at: Date.now() })
    )
    dispatchNewsletterSubscriberChanged()
  } catch {
    // ignore
  }
}

export function clearNewsletterSubscriber() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(NEWSLETTER_SUBSCRIBER_STORAGE_KEY)
    dispatchNewsletterSubscriberChanged()
  } catch {
    // ignore
  }
}
