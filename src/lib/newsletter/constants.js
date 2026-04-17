export const NEWSLETTER_SUBSCRIBE_STATUSES = {
  ALREADY_SUBSCRIBED: 'already_subscribed',
  /** Immediate subscribe succeeded (contact created in Resend). */
  SUBSCRIBED: 'subscribed',
  /** Legacy double opt-in link completed (kept for old confirmation URLs). */
  CONFIRMED: 'confirmed',
  INVALID: 'invalid',
  ERROR: 'error'
}

export const NEWSLETTER_SEND_STATUSES = {
  DRAFT: 'draft',
  READY: 'ready',
  SENDING: 'sending',
  SENT: 'sent',
  FAILED: 'failed'
}

export const NEWSLETTER_TEMPLATE_VARIANTS = {
  ARTICLE: 'article',
  COMPACT: 'compact'
}
