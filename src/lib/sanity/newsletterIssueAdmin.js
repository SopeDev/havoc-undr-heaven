import { NEWSLETTER_SEND_STATUSES } from '../newsletter/constants'
import { getSanityWriteClient } from './writeClient'

const getExistingAttemptCount = issue => {
  const n = Number(issue?.sendAttemptCount)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.floor(n)
}

export const patchNewsletterIssueSending = async ({ issue, dispatchKey }) => {
  const client = getSanityWriteClient()
  if (!client) throw new Error('Missing env var: SANITY_API_WRITE_TOKEN')

  const nextAttempts = getExistingAttemptCount(issue) + 1
  return client
    .patch(issue._id)
    .ifRevisionId(issue._rev)
    .set({
      sendStatus: NEWSLETTER_SEND_STATUSES.SENDING,
      lastDispatchKey: dispatchKey,
      lastSendAttemptAt: new Date().toISOString(),
      sendAttemptCount: nextAttempts,
      lastSendError: null
    })
    .commit()
}

export const patchNewsletterIssueSent = async ({ issueId, messageId, dispatchKey }) => {
  const client = getSanityWriteClient()
  if (!client) throw new Error('Missing env var: SANITY_API_WRITE_TOKEN')

  return client
    .patch(issueId)
    .set({
      sendStatus: NEWSLETTER_SEND_STATUSES.SENT,
      emailSentAt: new Date().toISOString(),
      lastSentMessageId: messageId || '',
      lastDispatchKey: dispatchKey,
      lastSendError: null
    })
    .commit()
}

/**
 * After emails send successfully: mark issue sent and set releasedToWebAt now for weekly newsletter articles.
 * Single transaction so issue + articles stay consistent.
 */
export const commitNewsletterDispatchSuccess = async ({ issueId, messageId, dispatchKey, articles }) => {
  const client = getSanityWriteClient()
  if (!client) throw new Error('Missing env var: SANITY_API_WRITE_TOKEN')

  const now = new Date().toISOString()
  const weeklyDocs = Array.isArray(articles)
    ? articles.filter(
        a =>
          a &&
          typeof a._id === 'string' &&
          a.includeInWeeklyNewsletter === true
      )
    : []

  let trx = client
    .transaction()
    .patch(issueId, p =>
      p.set({
        sendStatus: NEWSLETTER_SEND_STATUSES.SENT,
        emailSentAt: now,
        lastSentMessageId: messageId || '',
        lastDispatchKey: dispatchKey,
        lastSendError: null
      })
    )

  for (const a of weeklyDocs) {
    trx = trx.patch(a._id, patch => patch.set({ releasedToWebAt: now }))
  }

  return trx.commit()
}

export const patchNewsletterIssueFailed = async ({ issueId, errorMessage, dispatchKey }) => {
  const client = getSanityWriteClient()
  if (!client) throw new Error('Missing env var: SANITY_API_WRITE_TOKEN')

  return client
    .patch(issueId)
    .set({
      sendStatus: NEWSLETTER_SEND_STATUSES.FAILED,
      lastDispatchKey: dispatchKey,
      lastSendError: errorMessage || 'send_failed'
    })
    .commit()
}

export const patchNewsletterIssueManualSendMetadata = async ({ issueId, dispatchKey, messageId, errorMessage }) => {
  const client = getSanityWriteClient()
  if (!client) return null

  return client
    .patch(issueId)
    .set({
      lastDispatchKey: dispatchKey,
      lastSendAttemptAt: new Date().toISOString(),
      ...(messageId ? { lastSentMessageId: messageId } : {}),
      ...(errorMessage ? { lastSendError: errorMessage } : {})
    })
    .commit()
}
