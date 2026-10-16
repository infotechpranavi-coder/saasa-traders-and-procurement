import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import ServicesCatalog from '../../components/ServicesCatalog'
import { getServiceCategories, getServices } from '@/lib/cms'

import { COMPANY_NAME } from '@/lib/brand'

export const metadata: Metadata = {
  title: `Our Services - Industrial Procurement & Trading - ${COMPANY_NAME}`,
  description:
    `Comprehensive enterprise procurement, heavy machinery leasing, cross-border supply chain logistics, and equipment sourcing services from ${COMPANY_NAME}.`,
  openGraph: {
    title: `Industrial & Trading Services - ${COMPANY_NAME}`,
    description:
      'Tailored procurement, logistics, and heavy machinery support for construction, mining, and transport operations globally.',
  },
}
export const dynamic = 'force-dynamic'

export default async function ServicesPage({ searchParams }: { searchParams: { category?: string } }) {
  if (searchParams.category) {
    redirect(`/services/${searchParams.category}`)
  }

  const services = await getServices()
  const categories = await getServiceCategories()
  const visibleCategories = categories.filter((c) => services.some((s) => s.categoryId === c.id))

  return (
    <PageLayout>
      <PageHero title="Our Services" breadcrumb="Services" />

      <section className="py-20 bg-white">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="py-12 text-center text-sm text-gray-500">Loading services…</div>}>
            <ServicesCatalog services={services} categories={visibleCategories} />
          </Suspense>
        </div>
      </section>
    </PageLayout>
  )
}
