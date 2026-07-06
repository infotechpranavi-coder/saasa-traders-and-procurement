import type { Metadata } from 'next'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import FaqPageContent from '../../components/FaqPageContent'
import { COMPANY_NAME } from '@/lib/brand'

export const metadata: Metadata = {
  title: `FAQ Centre - ${COMPANY_NAME}`,
  description: `Answers to common questions about procurement, machinery parts, shipping, pricing, and support from ${COMPANY_NAME}.`,
}

export default function FaqPage() {
  return (
    <PageLayout>
      <PageHero title="FAQ Centre" breadcrumb="FAQ" />
      <FaqPageContent />
    </PageLayout>
  )
}
