import { NextResponse } from 'next/server'
import { parseAndValidateConfirmationToken } from '../../../../lib/newsletter/confirmationToken'
import {
  getAppBaseUrl,
  getResendClient,
  upsertResendContact,
  getResendContactByEmail,
  isResendContactSubscribed
} from '../../../../lib/newsletter/resendClient'
import { NEWSLETTER_SUBSCRIBE_STATUSES } from '../../../../lib/newsletter/constants'

export const runtime = 'nodejs'

const redirectWithStatus = ({ baseUrl, status, email }) => {
  const url = new URL('/categoria/newsletter', baseUrl)
  url.searchParams.set('subscribe', status)
  if (status === NEWSLETTER_SUBSCRIBE_STATUSES.CONFIRMED && email) {
    url.searchParams.set('confirmed_email', email)
  }
  return NextResponse.redirect(url)
}

export async function GET(req) {
  const secret = process.env.NEWSLETTER_CONFIRM_SECRET?.trim()
  if (!secret) {
    return NextResponse.json({ ok: false, error: 'server_not_configured' }, { status: 500 })
  }

  const baseUrl = getAppBaseUrl()
  const token = req.nextUrl.searchParams.get('token') || ''
  const parsed = parseAndValidateConfirmationToken({ token, secret })

  if (!parsed.ok) {
    return redirectWithStatus({ baseUrl, status: NEWSLETTER_SUBSCRIBE_STATUSES.INVALID })
  }

  try {
    const resend = getResendClient()
    await upsertResendContact({ resend, email: parsed.email })
    const savedContact = await getResendContactByEmail({ resend, email: parsed.email })
    if (!isResendContactSubscribed(savedContact)) {
      return redirectWithStatus({ baseUrl, status: NEWSLETTER_SUBSCRIBE_STATUSES.ERROR })
    }
    return redirectWithStatus({
      baseUrl,
      status: NEWSLETTER_SUBSCRIBE_STATUSES.CONFIRMED,
      email: parsed.email
    })
  } catch {
    return redirectWithStatus({ baseUrl, status: NEWSLETTER_SUBSCRIBE_STATUSES.ERROR })
  }
}
