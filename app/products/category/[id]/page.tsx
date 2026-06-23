import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageLayout from '../../../../components/PageLayout'
import CategoryDetailLayout from '../../../../components/CategoryDetailLayout'
import ProductGrid from '../../../../components/ProductGrid'
import { COMPANY_NAME } from '@/lib/brand'
import { getCategoryById, getProductCategories, getProducts, getProductsByCategory } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const category = await getCategoryById(params.id)
  if (!category) return { title: `Category Not Found - ${COMPANY_NAME}` }
  return { title: `${category.name} - ${COMPANY_NAME} Products` }
}

export default async function ProductCategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id)
  if (!category || (category.type !== 'product' && category.type !== 'both')) notFound()

  const [products, categories, allProducts] = await Promise.all([
    getProductsByCategory(params.id),
    getProductCategories(),
    getProducts(),
  ])
  const heroImage = category.image || products[0]?.image || '/images/products/gearbox-parts.jpg'

  return (
    <PageLayout>
      <CategoryDetailLayout
        category={category}
        heroImage={heroImage}
        itemCount={products.length}
        itemLabel={products.length === 1 ? 'product' : 'products'}
        backHref="/products"
        backLabel="Products"
        defaultDescription={`Browse genuine parts and components in our ${category.name.toLowerCase()} range — sourced globally and delivered to your job site on time.`}
        catalogTitle="Product range"
        sidebarCategories={categories}
        sidebarProducts={allProducts}
      >
        <ProductGrid
          products={products}
          categories={categories}
          hideCategoryBadge
          emptyMessage="No products listed in this category yet."
          emptyCtaHref="/contact"
          emptyCtaLabel="Request a Quote"
        />
      </CategoryDetailLayout>
    </PageLayout>
  )
}
