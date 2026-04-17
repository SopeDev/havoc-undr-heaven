'use client'

import { useNewsletterSubscriber } from '../../hooks/useNewsletterSubscriber'
import NewsletterSignup from '../NewsletterSignup/NewsletterSignup'

export default function NewsletterSidebarBlock() {
  const { subscribed } = useNewsletterSubscriber()
  if (subscribed) return null
  return (
    <div className='sidebar-block'>
      <div className='sidebar-label'>Newsletter Semanal</div>
      <NewsletterSignup />
    </div>
  )
}
