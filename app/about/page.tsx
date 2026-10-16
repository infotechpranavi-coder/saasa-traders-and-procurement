import type { Metadata } from 'next'
import PageLayout from '@/components/PageLayout'
import PageHero from '@/components/PageHero'
import AboutClient from './AboutClient'
import Process from '@/components/Process'
import { COMPANY_NAME } from '@/lib/brand'

export const metadata: Metadata = {
  title: `About Us - ${COMPANY_NAME} | Multi-Sector Trading & Procurement`,
  description:
    `Learn about ${COMPANY_NAME} — the trading and procurement division of SAASA B2E Group, with offices in India, the UAE, and Cameroon, supplying FMCG products, vehicles, heavy machinery, pharmaceutical machines, and IT equipment across Africa and the Middle East.`,
  openGraph: {
    title: `About ${COMPANY_NAME} - Multi-Sector Procurement & Trading`,
    description:
      'Offices in India, UAE, and Cameroon supplying FMCG products, commercial vehicles, heavy machinery, pharmaceutical machines, and IT equipment.',
  },
}

export default function AboutPage() {
  return (
    <PageLayout>
      <PageHero title="About Us" breadcrumb="About" />
      <AboutClient />
      <Process />
    </PageLayout>
  )
}
