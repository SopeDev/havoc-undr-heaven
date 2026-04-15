# Newsletter Test Matrix

## Subscription Flow

- New email subscribe:
  - Submit from navbar modal and aside form
  - Expect API status `confirmation_sent`
  - Expect confirmation email delivered
- Already subscribed email:
  - Submit same address again
  - Expect API status `already_subscribed`
  - Expect no new confirmation email
- Invalid/expired confirm token:
  - Open stale or tampered confirm URL
  - Expect redirect with `subscribe=invalid`
  - Expect warning banner on newsletter page
- Confirm success:
  - Open valid confirm URL
  - Expect contact stored as subscribed in Resend
  - Expect redirect with `subscribe=confirmed`
  - Expect welcome modal on load

## Template + Manual Send

- Preview endpoint:
  - `GET /api/newsletter/preview-latest?format=json`
  - `GET /api/newsletter/preview-latest?format=html`
  - Validate variant output with `variant=article|compact`
- Manual send dry run:
  - `POST /api/newsletter/send-test` with `{ \"dryRun\": true }`
  - Confirm payload includes subject, issue id, html length
- Manual send allowlist:
  - Configure `NEWSLETTER_MANUAL_SEND_ALLOWLIST`
  - Ensure non-allowlisted recipient is blocked
- Manual send idempotency:
  - Reuse same `idempotencyKey`
  - Verify second call returns `duplicate_dispatch_key` skip

## Cron Dispatch

- Cron auth/guard:
  - Missing or invalid bearer token must return `unauthorized`
  - Disabled cron must return `cron_disabled`
- No eligible issue:
  - Expect `status: no_issue_ready`
- Dry run:
  - `NEWSLETTER_CRON_DRY_RUN=true` or `?dryRun=true`
  - Return recipient count + subject, do not send, do not mark sent
- Live send:
  - Set issue to `ready`, issuedAt in the past
  - Verify status transition: `ready -> sending -> sent`
  - Verify `emailSentAt`, `lastSentMessageId`, and `lastDispatchKey` are set
- Failure path:
  - Force send error (e.g., revoke key temporarily)
  - Verify status transitions to `failed`
  - Verify `lastSendError` is saved
