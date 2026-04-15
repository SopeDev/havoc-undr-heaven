import crypto from 'node:crypto'

const TOKEN_VERSION = 'v1'
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24

const toBase64Url = value => {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

const fromBase64Url = value => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padLen = normalized.length % 4
  const padded = padLen === 0 ? normalized : normalized + '='.repeat(4 - padLen)
  return Buffer.from(padded, 'base64').toString('utf8')
}

const safeEqual = (a, b) => {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

const signPayload = (payloadB64, secret) => {
  return crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url')
}

export const buildConfirmationToken = ({ email, secret, now = Date.now() }) => {
  const payload = {
    v: TOKEN_VERSION,
    email,
    iat: now,
    exp: now + TOKEN_TTL_MS
  }
  const payloadB64 = toBase64Url(JSON.stringify(payload))
  const sig = signPayload(payloadB64, secret)
  return `${payloadB64}.${sig}`
}

export const parseAndValidateConfirmationToken = ({ token, secret, now = Date.now() }) => {
  if (typeof token !== 'string' || !token.includes('.')) {
    return { ok: false, reason: 'invalid_format' }
  }

  const [payloadB64, sig] = token.split('.', 2)
  if (!payloadB64 || !sig) {
    return { ok: false, reason: 'invalid_format' }
  }

  const expectedSig = signPayload(payloadB64, secret)
  if (!safeEqual(sig, expectedSig)) {
    return { ok: false, reason: 'invalid_signature' }
  }

  let payload = null
  try {
    payload = JSON.parse(fromBase64Url(payloadB64))
  } catch {
    return { ok: false, reason: 'invalid_payload' }
  }

  if (!payload || payload.v !== TOKEN_VERSION || typeof payload.email !== 'string') {
    return { ok: false, reason: 'invalid_payload' }
  }

  if (typeof payload.exp !== 'number' || payload.exp < now) {
    return { ok: false, reason: 'expired' }
  }

  return {
    ok: true,
    email: payload.email.trim().toLowerCase()
  }
}
