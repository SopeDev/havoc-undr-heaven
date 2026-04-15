import { NextResponse } from 'next/server'
import { buildDispatchEmailPayload, assertRecipientAllowed, getManualSendAllowlist } from '../../../../lib/newsletter/sendWorkflow'
import { getAppBaseUrl, getNewsletterSender, getResendClient } from '../../../../lib/newsletter/resendClient'
import { fetchLatestNewsletterIssueForEmail } from '../../../../lib/sanity/newsletterIssues'
import { patchNewsletterIssueManualSendMetadata } from '../../../../lib/sanity/newsletterIssueAdmin'

export const runtime = 'nodejs'

const isEnabled = () => process.env.NEWSLETTER_MANUAL_SEND_ENABLED?.trim() === 'true'

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export async function POST(req) {
  if (!isEnabled()) {
    return NextResponse.json({ ok: false, error: 'manual_send_disabled' }, { status: 403 })
  }

  let to = process.env.NEWSLETTER_TEST_RECIPIENT?.trim().toLowerCase() || ''
  let variant = undefined
  let idempotencyKey = ''
  let dryRun = false

  try {
    const body = await req.json()
    if (typeof body?.to === 'string' && body.to.trim()) to = body.to.trim().toLowerCase()
    if (typeof body?.variant === 'string') variant = body.variant
    if (typeof body?.idempotencyKey === 'string') idempotencyKey = body.idempotencyKey.trim()
    if (body?.dryRun === true) dryRun = true
  } catch {}

  if (!isValidEmail(to)) {
    return NextResponse.json({ ok: false, error: 'invalid_test_recipient' }, { status: 400 })
  }

  const allowCheck = assertRecipientAllowed({ email: to, allowlist: getManualSendAllowlist() })
  if (!allowCheck.ok) {
    return NextResponse.json({ ok: false, error: allowCheck.error }, { status: 403 })
  }

  const issue = await fetchLatestNewsletterIssueForEmail()
  if (!issue) {
    return NextResponse.json({ ok: false, error: 'no_issue_found' }, { status: 404 })
  }

  const resolvedDispatchKey = idempotencyKey || `manual-${issue._id}-${to}`
  if (issue.lastDispatchKey && issue.lastDispatchKey === resolvedDispatchKey) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: 'duplicate_dispatch_key',
      dispatchKey: resolvedDispatchKey
    })
  }

  const baseUrl = getAppBaseUrl()
  const { subject, html, variant: resolvedVariant } = buildDispatchEmailPayload({
    issue,
    baseUrl,
    variant
  })

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      to,
      subject,
      variant: resolvedVariant,
      issueTitle: issue.title || 'HAVOC DISPATCH',
      issueId: issue._id,
      dispatchKey: resolvedDispatchKey,
      htmlLength: html.length
    })
  }

  const resend = getResendClient()
  const from = getNewsletterSender()

  const sendRes = await resend.emails.send({
    from,
    to,
    subject,
    html
  })

  if (sendRes?.error) {
    await patchNewsletterIssueManualSendMetadata({
      issueId: issue._id,
      dispatchKey: resolvedDispatchKey,
      errorMessage: sendRes.error.message || 'send_failed'
    })
    return NextResponse.json({ ok: false, error: sendRes.error.message || 'send_failed' }, { status: 500 })
  }

  await patchNewsletterIssueManualSendMetadata({
    issueId: issue._id,
    dispatchKey: resolvedDispatchKey,
    messageId: sendRes?.data?.id || null
  })

  console.info('[newsletter.send-test] sent', {
    issueId: issue._id,
    issueTitle: issue.title || 'HAVOC DISPATCH',
    to,
    dispatchKey: resolvedDispatchKey,
    messageId: sendRes?.data?.id || null
  })

  return NextResponse.json({
    ok: true,
    to,
    variant: resolvedVariant,
    issueTitle: issue.title || 'HAVOC DISPATCH',
    issueId: issue._id,
    dispatchKey: resolvedDispatchKey,
    messageId: sendRes?.data?.id || null
  })
}
