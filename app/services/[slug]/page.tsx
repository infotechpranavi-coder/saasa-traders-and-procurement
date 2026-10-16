import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageLayout from '../../../components/PageLayout'
import DetailPageContent from '../../../components/DetailPageContent'
import ServicesBrowseLayout from '../../../components/ServicesBrowseLayout'
import CategoryDetailLayout from '../../../components/CategoryDetailLayout'
import ServiceGrid from '../../../components/ServiceGrid'
import { COMPANY_NAME } from '@/lib/brand'
import {
  getServiceBySlug,
  getCategoryById,
  getServiceCategories,
  getServices,
  getServicesByCategory,
} from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug)
  if (service) {
    const desc = service.summary || (service.overview && service.overview[0]) || `${service.title} by ${COMPANY_NAME}`
    return {
      title: `${service.title} - ${COMPANY_NAME} Services`,
      description: desc,
      alternates: {
        canonical: `/services/${service.slug}`,
      },
      openGraph: {
        title: `${service.title} - ${COMPANY_NAME}`,
        description: desc,
        images: service.image ? [service.image] : undefined,
      },
    }
  }

  const category = await getCategoryById(params.slug)
  if (category && (category.type === 'service' || category.type === 'both')) {
    const desc = category.description || `Explore our ${category.name} services at ${COMPANY_NAME}.`
    return {
      title: `${category.name} Services - ${COMPANY_NAME}`,
      description: desc,
      alternates: {
        canonical: `/services/${category.id}`,
      },
      openGraph: {
        title: `${category.name} Services - ${COMPANY_NAME}`,
        description: desc,
        images: category.image ? [category.image] : undefined,
      },
    }
  }

  return { title: `Service Not Found - ${COMPANY_NAME}` }
}

export default async function ServiceOrCategoryPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug)

  if (service) {
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
                backHref={category ? `/services/${category.id}` : '/services'}
                backLabel={category?.name || 'Services'}
              />
            </ServicesBrowseLayout>
          </div>
        </section>
      </PageLayout>
    )
  }

  const category = await getCategoryById(params.slug)
  if (category && (category.type === 'service' || category.type === 'both')) {
    const [services, categories, allServices] = await Promise.all([
      getServicesByCategory(params.slug),
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

  notFound()
}
