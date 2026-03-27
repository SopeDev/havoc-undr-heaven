import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteHeader from '../../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../../components/SiteFooter/SiteFooter'
import FocoDetailClient from '../FocoDetailClient'
import { getFocoBySlug } from '../focoData'

export default function FocoSlugPage({ params }) {
  const slug = params?.slug
  const data = slug ? getFocoBySlug(slug) : null
  if (!data) notFound()

  const crumbTitle = data.titleLines.join(' ')

  return (
    <>
      <SiteHeader />

      <div className='breadcrumb'>
        <span>
          <Link href='/'>Inicio</Link>
        </span>
        <span className='sep'>›</span>
        <span>
          <Link href='/focos'>Focos de Tensión</Link>
        </span>
        <span className='sep'>›</span>
        <span className='current'>{crumbTitle}</span>
      </div>

      <FocoDetailClient data={data} />
      <SiteFooter />
    </>
  )
}
