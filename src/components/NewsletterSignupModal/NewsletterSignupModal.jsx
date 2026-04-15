'use client'

import { useEffect } from 'react'
import NewsletterSignup from '../NewsletterSignup/NewsletterSignup'

export default function NewsletterSignupModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = e => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className='newsletter-modal-overlay'
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
      role='presentation'
    >
      <div className='newsletter-modal' role='dialog' aria-modal='true' aria-label='Suscribirse al newsletter'>
        <button className='newsletter-modal-close' type='button' onClick={onClose} aria-label='Cerrar ventana'>
          ×
        </button>

        <NewsletterSignup
          variant='modal'
          title='Suscribite a HAVOC DISPATCH'
          description='Recibí análisis geopolítico directo a tu correo cada semana.'
        />
      </div>
    </div>
  )
}
