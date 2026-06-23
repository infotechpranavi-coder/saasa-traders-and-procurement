import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageLayout from '../../../../components/PageLayout'
import CategoryDetailLayout from '../../../../components/CategoryDetailLayout'
import ServiceGrid from '../../../../components/ServiceGrid'
import { COMPANY_NAME } from '@/lib/brand'
import {
  getCategoryById,
  getServiceCategories,
  getServices,
  getServicesByCategory,
} from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const category = await getCategoryById(params.id)
  if (!category) return { title: `Category Not Found - ${COMPANY_NAME}` }
  return { title: `${category.name} - ${COMPANY_NAME} Services` }
}

export default async function ServiceCategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id)
  if (!category || (category.type !== 'service' && category.type !== 'both')) notFound()

  const [services, categories, allServices] = await Promise.all([
    getServicesByCategory(params.id),
    getServiceCategories(),
    getServices(),
  ])
  const heroImage = category.image || services[0]?.image || '/images/services/construction-equipment.jpg'

  return (
    <PageLayout>
      <CategoryDetailLayout
        category={category}
        heroImage={heroImage}
        itemCount={services.length}
        itemLabel={services.length === 1 ? 'service' : 'services'}
        backHref="/services"
        backLabel="Services"
        defaultDescription={`Explore our ${category.name.toLowerCase()} services — procurement, logistics, and support tailored for industrial and construction operations.`}
        catalogTitle="Service offerings"
        catalogType="services"
        sidebarCategories={categories}
        sidebarServices={allServices}
      >
        <ServiceGrid
          services={services}
          emptyMessage="No services listed in this category yet."
          emptyCtaHref="/contact"
          emptyCtaLabel="Contact Us"
        />
      </CategoryDetailLayout>
    </PageLayout>
  )
}
