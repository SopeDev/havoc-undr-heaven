'use client'

import { useNewsletterSubscriber } from '../../hooks/useNewsletterSubscriber'

export default function UnlessNewsletterSubscribed({ children }) {
  const { subscribed } = useNewsletterSubscriber()
  if (subscribed) return null
  return children
}
