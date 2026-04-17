'use client'

import { useSyncExternalStore } from 'react'
import { readNewsletterSubscriber } from '../lib/newsletter/subscriberLocalStorage'

const subscribe = onStoreChange => {
  if (typeof window === 'undefined') return () => {}
  const on = () => onStoreChange()
  window.addEventListener('havoc-newsletter-subscriber-changed', on)
  return () => window.removeEventListener('havoc-newsletter-subscriber-changed', on)
}

const getSnapshot = () => readNewsletterSubscriber()

const getServerSnapshot = () => null

export function useNewsletterSubscriber() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return {
    subscribed: Boolean(data),
    email: data?.email || null
  }
}
