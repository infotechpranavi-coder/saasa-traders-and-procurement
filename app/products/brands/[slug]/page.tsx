import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageLayout from '../../../../components/PageLayout'
import ProductGrid from '../../../../components/ProductGrid'
import CmsImage from '../../../../components/CmsImage'
import Link from 'next/link'
import { COMPANY_NAME } from '@/lib/brand'
import {
  getBrandBySlug,
  getBrandCategories,
  getProductCategories,
  getProductsByBrand,
} from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const brand = await getBrandBySlug(params.slug)
  if (!brand) return { title: `Brand Not Found - ${COMPANY_NAME}` }
  return { title: `${brand.name} - ${COMPANY_NAME} Strong Brands` }
}

export default async function BrandDetailPage({ params }: { params: { slug: string } }) {
  const brand = await getBrandBySlug(params.slug)
  if (!brand) notFound()

  const [products, categories, brandCategories] = await Promise.all([
    getProductsByBrand(params.slug),
    getProductCategories(),
    getBrandCategories(),
  ])

  const brandCategory = brandCategories.find((c) => c.id === brand.categoryId)
  const description =
    brand.description?.trim() ||
    `Explore ${brand.name} equipment and parts supplied through SAASA B2E TRADES.`

  return (
    <PageLayout>
      <header className="category-hero">
        <div className="category-hero-media" aria-hidden>
          <CmsImage src={brand.image || '/images/products/gearbox-parts.jpg'} alt="" fill priority />
        </div>
        <div className="category-hero-overlay" aria-hidden />

        <div className="category-hero-content">
          <nav className="category-hero-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="category-hero-crumb-sep" aria-hidden>
              /
            </span>
            <Link href="/products">Products</Link>
            <span className="category-hero-crumb-sep" aria-hidden>
              /
            </span>
            <Link href="/products/brands">Strong Brands</Link>
            <span className="category-hero-crumb-sep" aria-hidden>
              /
            </span>
            <span className="category-hero-crumb-current">{brand.name}</span>
          </nav>

          <p className="category-hero-eyebrow">
            {brandCategory?.name ?? 'Strong Brands'}
          </p>
          <h1 className="category-hero-title">{brand.name}</h1>
          <p className="category-hero-lead">{description}</p>

          {brand.equipment && brand.equipment.length > 0 && (
            <ul className="brand-equipment-tags">
              {brand.equipment.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <section className="category-catalog-section">
        <div className="category-page-container">
          {brand.listedProducts && brand.listedProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="category-catalog-title">Products under {brand.name}</h2>
              <ul className="brand-listed-products">
                {brand.listedProducts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <h2 className="category-catalog-title">Catalog products</h2>
          <ProductGrid
            products={products}
            categories={categories}
            hideCategoryBadge
            emptyMessage={`No catalog items linked to ${brand.name} yet.`}
            emptyCtaHref="/contact"
            emptyCtaLabel="Request a Quote"
          />
        </div>
      </section>
    </PageLayout>
  )
}
