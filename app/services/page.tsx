import type { Metadata } from 'next'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import ExpertiseServicesGrid from '../../components/ExpertiseServicesGrid'
import { getServices } from '@/lib/cms'

import { COMPANY_NAME } from '@/lib/brand'

export const metadata: Metadata = { title: `Services - ${COMPANY_NAME}` }
export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <PageLayout>
      <PageHero title="Our Services" breadcrumb="Services" />

      <section className="py-20 bg-white">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <ExpertiseServicesGrid services={services} />
        </div>
      </section>
    </PageLayout>
  )
}
