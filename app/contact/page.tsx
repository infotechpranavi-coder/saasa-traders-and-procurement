import type { Metadata } from 'next'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import ContactForm from '../../components/ContactForm'

import { COMPANY_NAME } from '@/lib/brand'

export const metadata: Metadata = { title: `Contact Us - ${COMPANY_NAME}` }

export default function ContactPage() {
  return (
    <PageLayout>
      <PageHero title="Contact Us" breadcrumb="Contact" />
      <ContactForm />
    </PageLayout>
  )
}
