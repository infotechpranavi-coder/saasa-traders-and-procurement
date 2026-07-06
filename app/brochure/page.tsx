import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import PageHero from '@/components/PageHero'
import BrochureDownloadPage from '@/components/BrochureDownloadPage'
import { getBrochure } from '@/lib/cms'
import { COMPANY_NAME } from '@/lib/brand'

export const metadata: Metadata = {
  title: `Download Catalog - ${COMPANY_NAME}`,
  description: `Request and download the ${COMPANY_NAME} product catalog.`,
}

export const dynamic = 'force-dynamic'

export default async function BrochurePage() {
  const brochure = await getBrochure()
  if (!brochure?.url?.trim()) notFound()

  return (
    <PageLayout>
      <PageHero title="Download Catalog" breadcrumb="Catalog" />
      <BrochureDownloadPage brochure={brochure} />
    </PageLayout>
  )
}
