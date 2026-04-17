'use client'

import Link from 'next/link'
import { useNewsletterSubscriber } from '../../hooks/useNewsletterSubscriber'
import { dispatchOpenNewsletterModal } from '../../lib/newsletter/subscriberLocalStorage'

export default function NewsletterArticleLink({
  href,
  categorySlug,
  className,
  children,
  scroll,
  ...rest
}) {
  const { subscribed } = useNewsletterSubscriber()
  const locked = categorySlug === 'newsletter' && !subscribed

  const onClick = e => {
    if (!locked) return
    e.preventDefault()
    dispatchOpenNewsletterModal()
  }

  return (
    <Link href={href} onClick={onClick} className={className} scroll={scroll} {...rest}>
      {children}
    </Link>
  )
}
