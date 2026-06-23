import Link from 'next/link'
import PageLayout from '../../../components/PageLayout'
import PageHero from '../../../components/PageHero'
import StrongBrandsGrid from '../../../components/StrongBrandsGrid'
import { COMPANY_NAME } from '@/lib/brand'
import { getBrandCategories, getBrands } from '@/lib/cms'

import type { Metadata } from 'next'

export const metadata: Metadata = { title: `Strong Brands - ${COMPANY_NAME}` }
export const dynamic = 'force-dynamic'

export default async function StrongBrandsPage() {
  const [brandCategories, brands] = await Promise.all([getBrandCategories(), getBrands()])

  return (
    <PageLayout>
      <PageHero title="Strong Brands" breadcrumb="Products" breadcrumbHref="/products" />

      <section className="strong-brands-page">
        <div className="category-page-container">
          <div className="strong-brands-intro">
            <p className="strong-brands-lead">
              We partner with leading OEM and equipment manufacturers worldwide — supplying trucks, buses,
              construction machinery, and components through SAASA B2E TRADES.
            </p>
            <Link href="/products" className="strong-brands-back">
              ← All products
            </Link>
          </div>

          <StrongBrandsGrid brandCategories={brandCategories} brands={brands} />
        </div>
      </section>
    </PageLayout>
  )
}
