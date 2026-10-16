import type { Metadata } from 'next'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import FaqPageContent from '../../components/FaqPageContent'
import { COMPANY_NAME } from '@/lib/brand'

export const metadata: Metadata = {
  title: `FAQ Centre - ${COMPANY_NAME}`,
  description: `Answers to common questions about international procurement, machinery parts, shipping, pricing, and support from ${COMPANY_NAME}.`,
  openGraph: {
    title: `Frequently Asked Questions - ${COMPANY_NAME}`,
    description:
      'Everything you need to know about ordering machinery parts, international shipping, payment terms, and OEM sourcing.',
  },
}

export default function FaqPage() {
  return (
    <PageLayout>
      <PageHero title="FAQ Centre" breadcrumb="FAQ" />
      <FaqPageContent />
    </PageLayout>
  )
}
