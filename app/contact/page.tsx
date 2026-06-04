import type { Metadata } from 'next'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import ContactForm from '../../components/ContactForm'

export const metadata: Metadata = { title: 'Contact Us - TransHub' }

export default function ContactPage() {
  return (
    <PageLayout>
      <PageHero title="Contact Us" breadcrumb="Contact" />
      <ContactForm />
    </PageLayout>
  )
}
