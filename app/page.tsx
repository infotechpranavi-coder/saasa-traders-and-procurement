import type { Metadata } from 'next'
import HeroSection from '../components/HeroSection'
import HomeServices from '../components/HomeServices'
import Stats from '../components/Stats'
import Solutions from '../components/Solutions'
import HomePortfolio from '../components/HomePortfolio'
import HomeTestimonials from '../components/HomeTestimonials'
import HomeBlog from '../components/HomeBlog'
import HomeCatalogCta from '../components/HomeCatalogCta'
import Footer from '../components/Footer'
import { COMPANY_NAME } from '@/lib/brand'

export const metadata: Metadata = {
  title: `${COMPANY_NAME} - Construction Machinery, Heavy Equipment Parts & Global Trading`,
  description:
    `${COMPANY_NAME} is an international B2E trading company specialising in global procurement, genuine heavy equipment parts, construction machinery, and industrial supply worldwide.`,
  openGraph: {
    title: `${COMPANY_NAME} - Global Procurement & Heavy Machinery Trading`,
    description:
      'Sourcing and supplying excavators, bulldozers, wheel loaders, and genuine OEM spare parts for demanding industrial sites worldwide.',
  },
}

export default function Home() {
  return (
    <main className="home-page site-typography">
      <HeroSection />
      <HomeServices />
      <Stats />
      <Solutions />
      <HomeCatalogCta />
      {/* Portfolio section hidden for now */}
      {/* <HomePortfolio /> */}
      <HomeTestimonials />
      <HomeBlog />
      <Footer />
    </main>
  )
}
