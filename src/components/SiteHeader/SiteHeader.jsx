'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NewsletterSignupModal from '../NewsletterSignupModal/NewsletterSignupModal'

const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio', href: '/' },
  { id: 'nosotros', label: 'Nosotros', href: '/nosotros' },
  { id: 'redes', label: 'Redes', href: '/categoria/redes' }
] 

export default function SiteHeader() {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState(null)
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false)
  const dropdownRootRef = useRef(null)
  const searchInputRef = useRef(null)

  const [todayLabel] = useState(() => {
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
  })

  useEffect(() => {
    const onDocClick = e => {
      const target = e.target
      if (!target || !target.closest) return
      if (!target.closest('.nav-dropdown-wrap')) setOpenMenu(null)
    }

    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const goSearch = () => {
    const q = (searchInputRef.current?.value || '').trim()
    if (!q) return
    const url = new URL('/buscar', window.location.origin)
    url.searchParams.set('q', q)
    window.location.href = url.toString()
  }

  const isActive = href => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const toggleMenu = id => e => {
    e.preventDefault()
    setOpenMenu(prev => (prev === id ? null : id))
  }

  return (
    <>
      <nav ref={dropdownRootRef}>
        <ul className='nav-links'>
          {NAV_ITEMS.map(item => (
            <li key={item.id}>
              <Link href={item.href} className={isActive(item.href) ? 'active' : undefined}>
                {item.label}
              </Link>
            </li>
          ))}

          <li className={openMenu === 'publicaciones' ? 'nav-dropdown-wrap open' : 'nav-dropdown-wrap'}>
            <a href='#' onClick={toggleMenu('publicaciones')} className={openMenu === 'publicaciones' ? 'active' : undefined}>
              Publicaciones
            </a>
            <div className='nav-dropdown'>
              <Link href='/categoria/analisis'>Análisis</Link>
              <Link href='/categoria/reflexiones'>Reflexiones</Link>
              <Link href='/categoria/newsletter'>Newsletter</Link>
              <Link href='/categoria/redes'>Redes</Link>
              <div className='nav-search-wrap'>
                <input ref={searchInputRef} className='nav-search-input' type='text' placeholder='Buscar...' />
                <button className='nav-search-btn' onClick={goSearch} aria-label='Buscar'>⌕</button>
              </div>
            </div>
          </li>

          <li className={openMenu === 'estado' ? 'nav-dropdown-wrap open' : 'nav-dropdown-wrap'}>
            <a href='#' onClick={toggleMenu('estado')} className={openMenu === 'estado' ? 'active' : undefined}>
              Estado del Mundo
            </a>
            <div className='nav-dropdown'>
              <Link href='/focos'>Focos de Tensión</Link>
              <a href='/tablero'>Tablero Global</a>
            </div>
          </li>
        </ul>

        <button className='nav-subscribe' type='button' onClick={() => setIsNewsletterModalOpen(true)}>
          Suscribirse
        </button>
      </nav>

      <div className='masthead'>
        <div className='masthead-meta'>
          <span />
          <span>{todayLabel}</span>
        </div>

        <img className='masthead-logo' src='/images/havoc_logo.png' alt='HAVOC UNDR HEAVEN' />
        <div className='masthead-catchphrase'>El nuevo orden mundial está aquí</div>
      </div>

      <NewsletterSignupModal
        isOpen={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
      />
    </>
  )
}

