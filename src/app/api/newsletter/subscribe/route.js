import { NextResponse } from 'next/server'
import { buildConfirmationToken } from '../../../../lib/newsletter/confirmationToken'
import {
  getAppBaseUrl,
  getNewsletterSender,
  getResendClient,
  getResendContactByEmail,
  isResendContactSubscribed
} from '../../../../lib/newsletter/resendClient'
import { NEWSLETTER_SUBSCRIBE_STATUSES } from '../../../../lib/newsletter/constants'

export const runtime = 'nodejs'

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const jsonOk = body => NextResponse.json(body, { status: 200 })

const confirmationEmailHtml = ({ confirmUrl }) => `
  <div style="font-family: Arial, sans-serif; color: #111111; line-height: 1.6; padding: 20px;">
    <h1 style="font-size: 22px; margin: 0 0 14px;">Confirma tu suscripcion a HAVOC DISPATCH</h1>
    <p style="margin: 0 0 14px;">
      Recibimos una solicitud para suscribirte al newsletter semanal.
    </p>
    <p style="margin: 0 0 20px;">
      Para confirmar, hace click en el siguiente enlace:
    </p>
    <p style="margin: 0 0 22px;">
      <a href="${confirmUrl}" style="background:#111111;color:#ffffff;padding:10px 14px;text-decoration:none;display:inline-block;">
        Confirmar suscripcion
      </a>
    </p>
    <p style="font-size: 13px; color: #555555; margin: 0;">
      Si no pediste esta suscripcion, podes ignorar este mensaje.
    </p>
  </div>
`

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

  try {
    const secret = process.env.NEWSLETTER_CONFIRM_SECRET?.trim()
    if (!secret) throw new Error('Missing env var: NEWSLETTER_CONFIRM_SECRET')

    const resend = getResendClient()
    const existingContact = await getResendContactByEmail({ resend, email })
    if (isResendContactSubscribed(existingContact)) {
      return jsonOk({
        ok: true,
        status: NEWSLETTER_SUBSCRIBE_STATUSES.ALREADY_SUBSCRIBED,
        message: 'Este email ya está suscripto al newsletter.'
      })
    }

    const from = getNewsletterSender()
    const baseUrl = getAppBaseUrl()
    const token = buildConfirmationToken({ email, secret })
    const confirmUrl = `${baseUrl}/api/newsletter/confirm?token=${encodeURIComponent(token)}`

    await resend.emails.send({
      from,
      to: email,
      subject: 'Confirma tu suscripcion a HAVOC DISPATCH',
      html: confirmationEmailHtml({ confirmUrl })
    })

    return jsonOk({
      ok: true,
      status: NEWSLETTER_SUBSCRIBE_STATUSES.CONFIRMATION_SENT,
      message: 'Si el email es valido, te enviamos un enlace de confirmacion.'
    })
  } catch {
    return jsonOk({
      ok: true,
      status: NEWSLETTER_SUBSCRIBE_STATUSES.CONFIRMATION_SENT,
      message: 'Si el email es valido, te enviamos un enlace de confirmacion.'
    })
  }
}
