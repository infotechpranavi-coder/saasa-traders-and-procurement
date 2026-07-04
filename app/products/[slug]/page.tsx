import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageLayout from '../../../components/PageLayout'
import DetailPageContent from '../../../components/DetailPageContent'
import ProductsBrowseLayout from '../../../components/ProductsBrowseLayout'
import { getProductBySlug, getCategoryById, getProductCategories, getProducts } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Product Not Found - SAASA B2E TRADES' }
  return { title: `${product.title} - SAASA B2E TRADES Products` }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  const [category, categories, allProducts] = await Promise.all([
    product.categoryId ? getCategoryById(product.categoryId) : Promise.resolve(undefined),
    getProductCategories(),
    getProducts(),
  ])
  return (
    <PageLayout>
      <section className="product-detail-body">
        <div className="product-detail-inner">
          <ProductsBrowseLayout
            categories={categories}
            products={allProducts}
            activeCategoryId={category?.id}
            activeProductSlug={product.slug}
          >
            <DetailPageContent
              image={product.image}
              images={product.images}
              title={product.title}
              label={product.label}
              overview={product.overview}
              listTitle="Key Features"
              listItems={product.features}
              secondaryTitle="Applications"
              secondaryItems={product.applications}
              companies={product.companies}
              backHref="/products"
              backLabel="Products"
            />
          </ProductsBrowseLayout>
        </div>
      </section>
    </PageLayout>
  )
}
