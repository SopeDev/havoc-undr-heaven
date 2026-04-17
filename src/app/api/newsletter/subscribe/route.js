import { NextResponse } from 'next/server'
import { domainLikelyAcceptsMail } from '../../../../lib/newsletter/emailDomainMailCheck'
import {
  getResendClient,
  getResendContactByEmail,
  isResendContactSubscribed,
  upsertResendContact
} from '../../../../lib/newsletter/resendClient'
import { NEWSLETTER_SUBSCRIBE_STATUSES } from '../../../../lib/newsletter/constants'

export const runtime = 'nodejs'

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const domainFromEmail = email => {
  const at = email.lastIndexOf('@')
  if (at < 1 || at === email.length - 1) return ''
  return email.slice(at + 1)
}

export async function POST(req) {
  let email = ''
  try {
    const payload = await req.json()
    email = typeof payload?.email === 'string' ? payload.email.trim().toLowerCase() : ''
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }

  const domain = domainFromEmail(email)
  try {
    const routable = await domainLikelyAcceptsMail(domain)
    if (!routable) {
      return NextResponse.json({ ok: false, error: 'invalid_email_domain' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_email_domain' }, { status: 400 })
  }

  try {
    const resend = getResendClient()
    const existingContact = await getResendContactByEmail({ resend, email })
    if (isResendContactSubscribed(existingContact)) {
      return NextResponse.json({
        ok: true,
        status: NEWSLETTER_SUBSCRIBE_STATUSES.ALREADY_SUBSCRIBED,
        message: 'Este email ya está suscripto al newsletter.'
      })
    }

    await upsertResendContact({ resend, email })
    const savedContact = await getResendContactByEmail({ resend, email })
    if (!isResendContactSubscribed(savedContact)) {
      return NextResponse.json({ ok: false, error: 'subscribe_failed' }, { status: 502 })
    }

    return NextResponse.json({
      ok: true,
      status: NEWSLETTER_SUBSCRIBE_STATUSES.SUBSCRIBED,
      message: 'Listo, ya estás suscripto al newsletter.'
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'subscribe_failed' }, { status: 502 })
  }
}
