import dns from 'node:dns/promises'

/**
 * Best-effort: domain has MX or A/AAAA (some hosts receive mail on A).
 * Does not prove the mailbox exists; avoids obvious typos / disposable-looking domains with no DNS.
 */
export async function domainLikelyAcceptsMail(hostname) {
  const host = typeof hostname === 'string' ? hostname.trim().toLowerCase() : ''
  if (!host || host.includes('..') || host.startsWith('.') || host.endsWith('.')) return false

  try {
    const mx = await dns.resolveMx(host)
    if (Array.isArray(mx) && mx.length > 0) return true
  } catch {
    // continue to A/AAAA
  }

  try {
    const a = await dns.resolve4(host)
    if (Array.isArray(a) && a.length > 0) return true
  } catch {}

  try {
    const aaaa = await dns.resolve6(host)
    return Array.isArray(aaaa) && aaaa.length > 0
  } catch {
    return false
  }
}
