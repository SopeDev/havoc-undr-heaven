'use client'

import { useSyncExternalStore } from 'react'
import { readNewsletterSubscriber } from '../lib/newsletter/subscriberLocalStorage'

/** Stable snapshot for useSyncExternalStore — must not return a fresh object each call. */
const SNAPSHOT_CONFIRMED_NO_EMAIL = '__havoc_nl_confirmed__'

const subscribe = onStoreChange => {
  if (typeof window === 'undefined') return () => {}
  const on = () => onStoreChange()
  window.addEventListener('havoc-newsletter-subscriber-changed', on)
  return () => window.removeEventListener('havoc-newsletter-subscriber-changed', on)
}

function getNewsletterSnapshot() {
  const data = readNewsletterSubscriber()
  if (!data) return ''
  const em = typeof data.email === 'string' ? data.email.trim().toLowerCase() : ''
  if (em.includes('@')) return em
  return SNAPSHOT_CONFIRMED_NO_EMAIL
}

function getServerSnapshot() {
  return ''
}

export function useNewsletterSubscriber() {
  const snapshot = useSyncExternalStore(subscribe, getNewsletterSnapshot, getServerSnapshot)
  const subscribed = snapshot !== ''
  const email =
    subscribed && snapshot !== SNAPSHOT_CONFIRMED_NO_EMAIL ? snapshot : null

  return {
    subscribed,
    email
  }
}
