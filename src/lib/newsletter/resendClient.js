import { Resend } from 'resend'

const getRequiredEnv = key => {
  const value = process.env[key]
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Missing env var: ${key}`)
  }
  return value.trim()
}

export const getResendClient = () => {
  const apiKey = getRequiredEnv('RESEND_API_KEY')
  return new Resend(apiKey)
}

export const getNewsletterSender = () => {
  const fromEmail = getRequiredEnv('NEWSLETTER_FROM_EMAIL')
  const fromName = process.env.NEWSLETTER_FROM_NAME?.trim() || 'HAVOC UNDR HEAVEN'
  return `${fromName} <${fromEmail}>`
}

export const getAppBaseUrl = () => {
  const base =
    process.env.NEWSLETTER_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()

  if (!base) throw new Error('Missing env var: NEWSLETTER_BASE_URL (or NEXT_PUBLIC_SITE_URL)')

  return base.startsWith('http') ? base : `https://${base}`
}

export const upsertResendContact = async ({ resend, email }) => {
  const createRes = await resend.contacts.create({
    email,
    unsubscribed: false
  })

  if (!createRes?.error) return

  const errMessage = createRes.error?.message || ''
  if (errMessage.toLowerCase().includes('already exists')) return

  throw new Error(errMessage || 'Unable to upsert contact in Resend')
}

export const getResendContactByEmail = async ({ resend, email }) => {
  const lookupRes = await resend.contacts.get({ email })
  if (lookupRes?.error) return null
  return lookupRes?.data || null
}

export const isResendContactSubscribed = contact => {
  if (!contact || typeof contact !== 'object') return false
  return contact.unsubscribed === false
}

const parsePositiveInt = value => {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.floor(n)
}

export const listAllActiveResendContacts = async ({ resend, maxContacts }) => {
  const out = []
  const seen = new Set()
  const configuredMax = parsePositiveInt(maxContacts) || Infinity
  let after = undefined

  while (out.length < configuredMax) {
    const pageLimit = Math.min(100, configuredMax === Infinity ? 100 : configuredMax - out.length)
    const listRes = await resend.contacts.list({
      limit: Math.max(1, pageLimit),
      ...(after ? { after } : {})
    })

    if (listRes?.error) {
      throw new Error(listRes.error.message || 'Unable to list Resend contacts')
    }

    const contacts = Array.isArray(listRes?.data?.data) ? listRes.data.data : []
    for (const c of contacts) {
      const email = typeof c?.email === 'string' ? c.email.trim().toLowerCase() : ''
      if (!email || seen.has(email)) continue
      seen.add(email)
      if (c.unsubscribed === false) out.push(email)
      if (out.length >= configuredMax) break
    }

    const hasMore = Boolean(listRes?.data?.has_more)
    const lastId = contacts.length > 0 ? contacts[contacts.length - 1]?.id : null
    if (!hasMore || !lastId) break
    after = lastId
  }

  return out
}
