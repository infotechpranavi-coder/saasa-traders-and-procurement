import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageLayout from '../../../components/PageLayout'
import PageHero from '../../../components/PageHero'
import DetailPageContent from '../../../components/DetailPageContent'
import { getServiceBySlug } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug)
  if (!service) return { title: 'Service Not Found - TransHub' }
  return { title: `${service.title} - TransHub Services` }
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug)
  if (!service) notFound()

  return (
    <PageLayout>
      <PageHero
        title={service.title}
        breadcrumb="Services"
        trail={[
          { label: 'Services', href: '/services' },
          { label: service.title },
        ]}
      />

      <DetailPageContent
        image={service.image}
        title={service.title}
        label="Our Expertise"
        overview={service.overview}
        listTitle="What We Provide"
        listItems={service.capabilities}
        secondaryTitle="Industries Served"
        secondaryItems={service.industries}
        backHref="/services"
        backLabel="Services"
      />
    </PageLayout>
  )
}
