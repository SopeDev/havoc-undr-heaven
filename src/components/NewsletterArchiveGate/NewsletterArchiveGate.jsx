'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNewsletterSubscriber } from '../../hooks/useNewsletterSubscriber'
import {
  readNewsletterSubscriber,
  SESSION_NEWSLETTER_MODAL_FLAG
} from '../../lib/newsletter/subscriberLocalStorage'

export default function NewsletterArchiveGate() {
  const router = useRouter()
  const { subscribed } = useNewsletterSubscriber()

  useEffect(() => {
    if (subscribed) return
    if (typeof window === 'undefined') return
    if (readNewsletterSubscriber()) return
    try {
      const sp = new URLSearchParams(window.location.search)
      const st = (sp.get('subscribe') || '').trim().toLowerCase()
      if (st === 'confirmed' || st === 'invalid' || st === 'error') return
    } catch {
      // ignore
    }
    try {
      sessionStorage.setItem(SESSION_NEWSLETTER_MODAL_FLAG, '1')
    } catch {
      // ignore
    }
    router.replace('/')
  }, [subscribed, router])

  return null
}
