import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import ServicesCatalog from '../../components/ServicesCatalog'
import { getServiceCategories, getServices } from '@/lib/cms'

import { COMPANY_NAME } from '@/lib/brand'

export const metadata: Metadata = { title: `Services - ${COMPANY_NAME}` }
export const dynamic = 'force-dynamic'

export default async function ServicesPage({ searchParams }: { searchParams: { category?: string } }) {
  if (searchParams.category) {
    redirect(`/services/category/${searchParams.category}`)
  }

  const services = await getServices()
  const categories = await getServiceCategories()

  return (
    <PageLayout>
      <PageHero title="Our Services" breadcrumb="Services" />

      <section className="py-20 bg-white">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="py-12 text-center text-sm text-gray-500">Loading services…</div>}>
            <ServicesCatalog services={services} categories={categories} />
          </Suspense>
        </div>
      </section>
    </PageLayout>
  )
}
