'use client'

import { useState } from 'react'

const isValidEmail = email => {
  const v = email.trim()
  if (!v) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export default function NewsletterSignup({ variant = 'default', placeholder = 'tu@correo.com' }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)

  const onSubmit = e => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setStatus('invalid')
      return
    }
    // Placeholder: we’ll wire the provider later via `/api/newsletter/subscribe`.
    setStatus('success')
  }

  return (
    <div className='newsletter-box'>
      <h3>HAVOC DISPATCH</h3>
      <p>Análisis geopolítico directo a tu correo cada semana.</p>

      <form onSubmit={onSubmit}>
        <input
          className='newsletter-input'
          type='email'
          placeholder={placeholder}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button className='newsletter-btn' type='submit'>
          Suscribirse
        </button>
      </form>

      {status === 'invalid' ? (
        <div style={{ marginTop: 10, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#E07800' }}>
          Revisa tu email
        </div>
      ) : null}

      {status === 'success' ? (
        <div style={{ marginTop: 10, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#88CC00' }}>
          Gracias por suscribirte
        </div>
      ) : null}
    </div>
  )
}

