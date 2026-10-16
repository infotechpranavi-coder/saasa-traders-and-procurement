import type { Metadata } from 'next'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import ContactForm from '../../components/ContactForm'

import { COMPANY_NAME } from '@/lib/brand'

export const metadata: Metadata = {
  title: `Contact Us - ${COMPANY_NAME} | India & Cameroon Offices`,
  description:
    `Contact ${COMPANY_NAME} for machinery quotes, genuine spare part sourcing, and trading partnerships. Offices in Hisar, Haryana, India and Yaoundé, Cameroon.`,
  openGraph: {
    title: `Contact ${COMPANY_NAME} - Global Procurement & Trade`,
    description:
      'Direct phone lines, email support, quotation requests, and office locations in India (+91 94676 94449) and Cameroon (+237 6 83 57 76 76).',
  },
}

export default function ContactPage() {
  return (
    <PageLayout>
      <PageHero title="Contact Us" breadcrumb="Contact" />
      <ContactForm />
    </PageLayout>
  )
}
