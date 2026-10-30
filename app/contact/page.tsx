import { Suspense } from 'react'
import type { Metadata } from 'next'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import ContactForm from '../../components/ContactForm'

import { COMPANY_NAME } from '@/lib/brand'

export const metadata: Metadata = {
  title: `Contact Us - ${COMPANY_NAME} | India & Cameroon Offices`,
  description:
    `Contact ${COMPANY_NAME} for machinery quotes, genuine spare part sourcing, and trading partnerships. Offices in Hisar, Haryana, India and Yaoundé, Cameroon. Opening hours: Mon to Sat, 9AM to 7PM.`,
  openGraph: {
    title: `Contact ${COMPANY_NAME} - Global Procurement & Trade`,
    description:
      'Direct phone lines, email support, quotation requests, and office locations in India (+91 94676 94449, +91 90346 13782) and Cameroon (+237 6 83 57 76 76). Opening hours: Mon to Sat, 9AM to 7PM.',
  },
}

export default function ContactPage() {
  return (
    <PageLayout>
      <PageHero title="Contact Us" breadcrumb="Contact" />
      <Suspense fallback={<div className="py-20 text-center text-sm text-gray-500">Loading form…</div>}>
        <ContactForm />
      </Suspense>
    </PageLayout>
  )
}
