'use client'

import { useState } from 'react'

const isValidEmail = email => {
  const v = email.trim()
  if (!v) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export default function NewsletterSignup({
  variant = 'default',
  placeholder = 'tu@correo.com',
  title = 'HAVOC DISPATCH',
  description = 'Análisis geopolítico directo a tu correo cada semana.',
  onSuccess
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const statusStyles = {
    marginTop: 10,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase'
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (isSubmitting) return

    if (!isValidEmail(email)) {
      setStatus('invalid')
      return
    }

    setIsSubmitting(true)
    setStatus(null)
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const payload = await res.json().catch(() => null)

      if (!res.ok) {
        setStatus('error')
        return
      }

      if (payload?.status === 'already_subscribed') {
        setStatus('already')
        return
      }

      setEmail('')
      setStatus('confirm')
      if (typeof onSuccess === 'function') onSuccess()
    } catch {
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={variant === 'modal' ? 'newsletter-box newsletter-box--modal' : 'newsletter-box'}>
      <h3>{title}</h3>
      <p>{description}</p>

      <form onSubmit={onSubmit}>
        <input
          className='newsletter-input'
          type='email'
          placeholder={placeholder}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button className='newsletter-btn' type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Suscribirse'}
        </button>
      </form>

      {status === 'invalid' ? (
        <div style={{ ...statusStyles, color: '#E07800' }}>
          Revisa tu email
        </div>
      ) : null}

      {status === 'confirm' ? (
        <div style={{ ...statusStyles, color: '#88CC00' }}>
          Revisa tu correo para confirmar
        </div>
      ) : null}

      {status === 'error' ? (
        <div style={{ ...statusStyles, color: '#CC2200' }}>
          No pudimos enviar confirmacion
        </div>
      ) : null}

      {status === 'already' ? (
        <div style={{ ...statusStyles, color: '#88CC00' }}>
          Este email ya está suscripto
        </div>
      ) : null}
    </div>
  )
}

