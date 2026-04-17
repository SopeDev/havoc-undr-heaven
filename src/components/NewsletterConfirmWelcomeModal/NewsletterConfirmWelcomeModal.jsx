'use client'

import { useEffect, useState } from 'react'
import {
  setNewsletterSubscriber,
  setNewsletterConfirmedWithoutEmail
} from '../../lib/newsletter/subscriberLocalStorage'

export default function NewsletterConfirmWelcomeModal({ subscribeStatus }) {
  const [isOpen, setIsOpen] = useState(() => subscribeStatus === 'confirmed')

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = e => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (subscribeStatus !== 'confirmed') return
    const currentUrl = new URL(window.location.href)
    const next = new URLSearchParams(currentUrl.search)
    const sub = (next.get('subscribe') || '').trim().toLowerCase()
    if (sub !== 'confirmed') return
    const rawEmail = next.get('confirmed_email') || ''
    next.delete('subscribe')
    next.delete('confirmed_email')
    const trimmed = rawEmail.trim().toLowerCase()
    if (trimmed && trimmed.includes('@')) setNewsletterSubscriber(trimmed)
    else setNewsletterConfirmedWithoutEmail()
    const nextQuery = next.toString()
    const target = `${currentUrl.pathname}${nextQuery ? `?${nextQuery}` : ''}${currentUrl.hash || ''}`
    window.history.replaceState(window.history.state, '', target)
  }, [subscribeStatus])

  if (!isOpen) return null

  return (
    <div
      className='newsletter-modal-overlay'
      onClick={e => {
        if (e.target === e.currentTarget) setIsOpen(false)
      }}
      role='presentation'
    >
      <div className='newsletter-modal newsletter-modal--welcome' role='dialog' aria-modal='true' aria-label='Suscripción confirmada'>
        <button
          className='newsletter-modal-close'
          type='button'
          onClick={() => setIsOpen(false)}
          aria-label='Cerrar ventana'
        >
          ×
        </button>
        <div className='newsletter-welcome-kicker'>HAVOC DISPATCH</div>
        <h2 className='newsletter-welcome-title'>¡Bienvenido/a!</h2>
        <p className='newsletter-welcome-copy'>
          Tu suscripción fue confirmada y tu contacto ya quedó guardado.
        </p>
        <p className='newsletter-welcome-copy'>
          A partir de ahora vas a recibir el newsletter semanal con artículos destacados.
        </p>
      </div>
    </div>
  )
}
