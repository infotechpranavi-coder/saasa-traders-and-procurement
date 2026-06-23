import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageLayout from '../../../components/PageLayout'
import DetailPageContent from '../../../components/DetailPageContent'
import ServicesBrowseLayout from '../../../components/ServicesBrowseLayout'
import {
  getServiceBySlug,
  getCategoryById,
  getServiceCategories,
  getServices,
} from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug)
  if (!service) return { title: 'Service Not Found - SAASA B2E TRADES' }
  return { title: `${service.title} - SAASA B2E TRADES Services` }
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug)
  if (!service) notFound()

  const [category, categories, allServices] = await Promise.all([
    service.categoryId ? getCategoryById(service.categoryId) : Promise.resolve(undefined),
    getServiceCategories(),
    getServices(),
  ])

  return (
    <PageLayout>
      <section className="product-detail-body">
        <div className="product-detail-inner">
          <ServicesBrowseLayout
            categories={categories}
            services={allServices}
            activeCategoryId={category?.id}
            activeServiceSlug={service.slug}
          >
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
          </ServicesBrowseLayout>
        </div>
      </section>
    </PageLayout>
  )
}
