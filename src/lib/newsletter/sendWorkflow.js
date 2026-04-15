import { NEWSLETTER_SEND_STATUSES, NEWSLETTER_TEMPLATE_VARIANTS } from './constants'
import { buildDispatchEmailHtml } from './dispatchEmailTemplate'

const parseCsvList = value => {
  if (typeof value !== 'string' || !value.trim()) return []
  return value
    .split(',')
    .map(v => v.trim().toLowerCase())
    .filter(Boolean)
}

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const normalizeVariant = variant => {
  if (typeof variant !== 'string') return NEWSLETTER_TEMPLATE_VARIANTS.ARTICLE
  const v = variant.trim().toLowerCase()
  return v === NEWSLETTER_TEMPLATE_VARIANTS.COMPACT
    ? NEWSLETTER_TEMPLATE_VARIANTS.COMPACT
    : NEWSLETTER_TEMPLATE_VARIANTS.ARTICLE
}

const parsePositiveInt = value => {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.floor(n)
}

export const getNewsletterTemplateVariant = provided => {
  return normalizeVariant(provided || process.env.NEWSLETTER_DEFAULT_TEMPLATE_VARIANT)
}

export const validateIssueForDispatch = issue => {
  if (!issue || typeof issue !== 'object') return { ok: false, error: 'invalid_issue' }
  const title = typeof issue.title === 'string' ? issue.title.trim() : ''
  if (!title) return { ok: false, error: 'missing_issue_title' }
  if (!issue.issuedAt) return { ok: false, error: 'missing_issue_date' }
  const articles = Array.isArray(issue.articles) ? issue.articles : []
  if (articles.length === 0) return { ok: false, error: 'issue_without_articles' }
  return { ok: true }
}

export const getDispatchSubject = issue => {
  const title = issue?.title || 'HAVOC DISPATCH'
  const date = new Date(issue?.issuedAt || Date.now()).toLocaleDateString('es-AR')
  return `${title} · ${date}`
}

export const buildDispatchEmailPayload = ({ issue, baseUrl, variant }) => {
  const safeVariant = getNewsletterTemplateVariant(variant)
  return {
    subject: getDispatchSubject(issue),
    html: buildDispatchEmailHtml({ issue, baseUrl, variant: safeVariant }),
    variant: safeVariant
  }
}

export const getManualSendAllowlist = () => parseCsvList(process.env.NEWSLETTER_MANUAL_SEND_ALLOWLIST)

export const assertRecipientAllowed = ({ email, allowlist }) => {
  if (!isValidEmail(email)) return { ok: false, error: 'invalid_recipient' }
  if (!Array.isArray(allowlist) || allowlist.length === 0) return { ok: true }
  return allowlist.includes(email.toLowerCase())
    ? { ok: true }
    : { ok: false, error: 'recipient_not_allowed' }
}

export const getMaxCronRecipients = () => parsePositiveInt(process.env.NEWSLETTER_CRON_MAX_RECIPIENTS) || null

export const chunkRecipients = (emails, size = 50) => {
  const out = []
  const k = Math.max(1, Number(size) || 1)
  for (let i = 0; i < emails.length; i += k) out.push(emails.slice(i, i + k))
  return out
}

export const toIssueDispatchPatchBase = ({ dispatchKey, sendStatus }) => {
  const patch = {
    lastDispatchKey: dispatchKey,
    sendStatus,
    lastSendAttemptAt: new Date().toISOString()
  }
  if (sendStatus === NEWSLETTER_SEND_STATUSES.SENDING) patch.lastSendError = null
  return patch
}
