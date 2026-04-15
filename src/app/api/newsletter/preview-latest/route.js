import { NextResponse } from 'next/server'
import { buildDispatchEmailPayload, getNewsletterTemplateVariant } from '../../../../lib/newsletter/sendWorkflow'
import { getAppBaseUrl } from '../../../../lib/newsletter/resendClient'
import { fetchLatestNewsletterIssueForEmail } from '../../../../lib/sanity/newsletterIssues'

export const runtime = 'nodejs'

export async function GET(req) {
  const issue = await fetchLatestNewsletterIssueForEmail()
  if (!issue) {
    return NextResponse.json({ ok: false, error: 'no_issue_found' }, { status: 404 })
  }

  const url = new URL(req.url)
  const format = url.searchParams.get('format') || 'json'
  const variant = getNewsletterTemplateVariant(url.searchParams.get('variant'))
  const baseUrl = getAppBaseUrl()

  const { subject, html } = buildDispatchEmailPayload({ issue, baseUrl, variant })

  if (format === 'html') {
    return new NextResponse(html, {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' }
    })
  }

  return NextResponse.json({
    ok: true,
    issueId: issue._id,
    issueTitle: issue.title || 'HAVOC DISPATCH',
    variant,
    subject,
    html
  })
}
