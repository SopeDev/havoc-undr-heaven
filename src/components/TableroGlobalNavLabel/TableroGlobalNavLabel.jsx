/**
 * Non-link nav label for Tablero Global while the route is under construction.
 * @param {{ variant?: 'type-item' | 'section-tab' | 'nav-dropdown' | 'footer' }} props
 */
const SoonLabel = () => <span className='nav-soon-label'>(en construcción)</span>

export default function TableroGlobalNavLabel({ variant = 'type-item' }) {
  if (variant === 'nav-dropdown') {
    return (
      <span className='nav-dropdown-item nav-dropdown-item--soon' aria-disabled='true'>
        <span className='nav-soon-title'>Tablero Global</span>
        <SoonLabel />
      </span>
    )
  }

  if (variant === 'footer') {
    return (
      <span className='footer-link-soon' aria-disabled='true'>
        <span className='nav-soon-title'>Tablero Global</span>
        <SoonLabel />
      </span>
    )
  }

  const className = variant === 'section-tab' ? 'section-tab section-tab--soon' : 'type-item type-item--soon'

  return (
    <span className={className} aria-disabled='true'>
      <span className='nav-soon-title'>Tablero Global</span>
      <SoonLabel />
    </span>
  )
}
