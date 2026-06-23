import Link from 'next/link'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import ProductsCatalog from '../../components/ProductsCatalog'
import ProductsBrowseLayout from '../../components/ProductsBrowseLayout'
import { SectionLabelIcon } from '../../components/icons/LogisticsIcons'
import { COMPANY_NAME } from '@/lib/brand'
import { getProductCategories, getProducts } from '@/lib/cms'

export const metadata: Metadata = { title: `Products - ${COMPANY_NAME}` }
export const dynamic = 'force-dynamic'

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  if (searchParams.category) {
    redirect(`/products/category/${searchParams.category}`)
  }

  const products = await getProducts()
  const categories = await getProductCategories()

  return (
    <PageLayout>
      <PageHero title="Our Products" breadcrumb="Products" />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="section-label justify-center mb-3">
              <SectionLabelIcon className="text-primary" />
              CONSTRUCTION MACHINERY PARTS
            </div>
            <h2 className="hp-title hp-title--center">Genuine Parts for Heavy Equipment</h2>
            <p className="hp-lead mt-4 max-w-2xl mx-auto">
              SAASA B2E TRADES supplies construction machinery parts and components for excavators, bulldozers, loaders,
              cranes, and road-building equipment — sourced globally and delivered to your job site on time.
            </p>
          </div>

          <Suspense fallback={<div className="py-12 text-center text-sm text-gray-500">Loading products…</div>}>
            <ProductsBrowseLayout categories={categories}>
              <ProductsCatalog products={products} categories={categories} />
            </ProductsBrowseLayout>
          </Suspense>
        </div>
      </section>

      <section className="py-16 bg-[#f4f5f7]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="hp-title mb-3">Need a part not listed here?</h3>
          <p className="hp-lead max-w-xl mx-auto mb-6">
            We source spare parts for all major construction machinery brands. Send us your model number or part code and
            our team will find it for you.
          </p>
          <Link href="/contact" className="btn-primary inline-flex">
            Enquire About Parts
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}
