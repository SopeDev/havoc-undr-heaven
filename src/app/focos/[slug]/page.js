import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteHeader from '../../../components/SiteHeader/SiteHeader'
import SiteFooter from '../../../components/SiteFooter/SiteFooter'
import FocoDetailClient from '../FocoDetailClient'
import { getFocoBySlug } from '../focoData'
import { isSanityConfigured } from '../../../lib/sanity/client'
import { fetchFocoDetailBySlug } from '../../../lib/sanity/focos'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params

  if (isSanityConfigured()) {
    const data = await fetchFocoDetailBySlug(slug)
    if (data?.titleLines?.length) {
      const title = data.titleLines.join(' ')
      const desc = typeof data.summary === 'string' ? data.summary : undefined
      return {
        title: `${title} — Focos de Tensión · HAVOC UNDR HEAVEN`,
        description: desc
      }
    }
  }

  const mock = slug ? getFocoBySlug(slug) : null
  if (mock?.titleLines?.length) {
    const title = mock.titleLines.join(' ')
    return {
      title: `${title} — Focos de Tensión · HAVOC UNDR HEAVEN`,
      description: mock.summary
    }
  }

  return { title: 'Foco de tensión — HAVOC UNDR HEAVEN' }
}

export default async function FocoSlugPage({ params }) {
  const { slug } = await params
  if (!slug) notFound()

  let data = null
  if (isSanityConfigured()) {
    data = await fetchFocoDetailBySlug(slug)
  }
  if (!data) {
    data = getFocoBySlug(slug)
  }
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
