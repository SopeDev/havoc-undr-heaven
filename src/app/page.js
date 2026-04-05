import Home from '../components/Home/Home'
import { fetchHomePageData } from '../lib/sanity/homePageData'

export const revalidate = 60

export default async function HomePage() {
  const data = await fetchHomePageData()
  return <Home {...data} />
}
