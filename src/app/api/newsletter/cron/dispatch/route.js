import { NextResponse } from 'next/server'
import { NEWSLETTER_SEND_STATUSES } from '../../../../../lib/newsletter/constants'
import {
  buildDispatchEmailPayload,
  chunkRecipients,
  getMaxCronRecipients,
  validateIssueForDispatch
} from '../../../../../lib/newsletter/sendWorkflow'
import {
  getAppBaseUrl,
  getNewsletterSender,
  getResendClient,
  listAllActiveResendContacts
} from '../../../../../lib/newsletter/resendClient'
import { fetchNextNewsletterIssueForDispatch } from '../../../../../lib/sanity/newsletterIssues'
import {
  commitNewsletterDispatchSuccess,
  patchNewsletterIssueFailed,
  patchNewsletterIssueSending
} from '../../../../../lib/sanity/newsletterIssueAdmin'

export const runtime = 'nodejs'

const isCronEnabled = () => process.env.NEWSLETTER_CRON_ENABLED?.trim() === 'true'

const isDryRun = req => {
  const envDry = process.env.NEWSLETTER_CRON_DRY_RUN?.trim() === 'true'
  const url = new URL(req.url)
  const queryDry = url.searchParams.get('dryRun') === 'true'
  return envDry || queryDry
}

const isAuthorized = req => {
  const secret = process.env.NEWSLETTER_CRON_SECRET?.trim()
  if (!secret) return false
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  return token === secret
}

export async function POST(req) {
  if (!isCronEnabled()) {
    return NextResponse.json({ ok: false, error: 'cron_disabled' }, { status: 403 })
  }
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const dryRun = isDryRun(req)

  const issue = await fetchNextNewsletterIssueForDispatch()
  if (!issue) {
    return NextResponse.json({ ok: true, status: 'no_issue_ready' })
  }
  if (issue.emailSentAt) {
    return NextResponse.json({ ok: true, status: 'already_sent', issueId: issue._id })
  }

  const validation = validateIssueForDispatch(issue)
  if (!validation.ok) {
    if (!dryRun) {
      await patchNewsletterIssueFailed({
        issueId: issue._id,
        dispatchKey: `cron-invalid-${Date.now()}`,
        errorMessage: validation.error
      })
    }
    return NextResponse.json({ ok: false, error: validation.error, issueId: issue._id }, { status: 400 })
  }

  const dispatchKey = `cron-${issue._id}-${Date.now()}`
  if (issue.lastDispatchKey && issue.lastDispatchKey === dispatchKey) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'duplicate_dispatch_key', issueId: issue._id })
  }

  const baseUrl = getAppBaseUrl()
  const { subject, html, variant } = buildDispatchEmailPayload({ issue, baseUrl })

  const resend = getResendClient()
  const recipients = await listAllActiveResendContacts({
    resend,
    maxContacts: getMaxCronRecipients()
  })

  if (recipients.length === 0) {
    if (!dryRun) {
      await patchNewsletterIssueFailed({
        issueId: issue._id,
        dispatchKey,
        errorMessage: 'no_active_recipients'
      })
    }
    return NextResponse.json({ ok: false, error: 'no_active_recipients', issueId: issue._id }, { status: 400 })
  }

  if (dryRun) {
    const articles = Array.isArray(issue.articles) ? issue.articles : []
    const weeklyArticleCount = articles.filter(a => a?.includeInWeeklyNewsletter === true).length
    return NextResponse.json({
      ok: true,
      dryRun: true,
      issueId: issue._id,
      issueTitle: issue.title || 'HAVOC DISPATCH',
      articleCount: articles.length,
      weeklyArticleCount,
      recipientCount: recipients.length,
      subject,
      templateVariant: variant,
      variant
    })
  }

  try {
    await patchNewsletterIssueSending({ issue, dispatchKey })
  } catch {
    return NextResponse.json({ ok: false, error: 'issue_state_conflict', issueId: issue._id }, { status: 409 })
  }

  try {
    const from = getNewsletterSender()
    const chunks = chunkRecipients(recipients, 50)
    const messageIds = []
    for (const group of chunks) {
      const sendRes = await resend.emails.send({
        from,
        to: group,
        subject,
        html
      })
      if (sendRes?.error) throw new Error(sendRes.error.message || 'send_failed')
      if (sendRes?.data?.id) messageIds.push(sendRes.data.id)
    }

    await commitNewsletterDispatchSuccess({
      issueId: issue._id,
      dispatchKey,
      messageId: messageIds.join(','),
      articles: issue.articles
    })

    return NextResponse.json({
      ok: true,
      status: NEWSLETTER_SEND_STATUSES.SENT,
      issueId: issue._id,
      issueTitle: issue.title || 'HAVOC DISPATCH',
      recipientCount: recipients.length,
      messageIds,
      weeklyArticlesReleased: (issue.articles || []).filter(a => a?.includeInWeeklyNewsletter === true).length
    })
  } catch (err) {
    await patchNewsletterIssueFailed({
      issueId: issue._id,
      dispatchKey,
      errorMessage: err instanceof Error ? err.message : 'send_failed'
    })
    return NextResponse.json({
      ok: false,
      issueId: issue._id,
      error: err instanceof Error ? err.message : 'send_failed'
    }, { status: 500 })
  }
}
