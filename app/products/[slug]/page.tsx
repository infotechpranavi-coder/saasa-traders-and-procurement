import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import PageLayout from '../../../components/PageLayout'
import DetailPageContent from '../../../components/DetailPageContent'
import ProductsBrowseLayout from '../../../components/ProductsBrowseLayout'
import CategoryDetailLayout from '../../../components/CategoryDetailLayout'
import ProductGrid from '../../../components/ProductGrid'
import { COMPANY_NAME } from '@/lib/brand'
import {
  getProductBySlug,
  getCategoryById,
  getProductCategories,
  getProducts,
  getProductsByCategory,
} from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (product) {
    const desc =
      product.desc ||
      (product.overview && product.overview[0]) ||
      `Genuine ${product.title} supplied by ${COMPANY_NAME}. Heavy machinery and equipment parts.`
    return {
      title: `${product.title} - ${COMPANY_NAME} Products`,
      description: desc,
      alternates: {
        canonical: `/products/${product.slug}`,
      },
      openGraph: {
        title: `${product.title} - ${COMPANY_NAME}`,
        description: desc,
        images: product.image ? [product.image] : undefined,
      },
    }
  }

  const category = await getCategoryById(params.slug)
  if (category && (category.type === 'product' || category.type === 'both')) {
    const desc =
      category.description ||
      `Browse genuine heavy machinery parts and equipment components in our ${category.name} range at ${COMPANY_NAME}.`
    return {
      title: `${category.name} Equipment & Parts - ${COMPANY_NAME}`,
      description: desc,
      alternates: {
        canonical: `/products/${category.id}`,
      },
      openGraph: {
        title: `${category.name} Equipment Parts - ${COMPANY_NAME}`,
        description: desc,
        images: category.image ? [category.image] : undefined,
      },
    }
  }

  return { title: `Product Not Found - ${COMPANY_NAME}` }
}

export default async function ProductOrCategoryPage({ params }: { params: { slug: string } }) {
  if (params.slug === 'hydraulic-pump-assemblies') {
    permanentRedirect('/products/develon-excavator')
  }

  const product = await getProductBySlug(params.slug)

  if (product) {
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
                specs={product.specs}
                specifications={product.specifications}
                backHref="/products"
                backLabel="Products"
              />
            </ProductsBrowseLayout>
          </div>
        </section>
      </PageLayout>
    )
  }

  const category = await getCategoryById(params.slug)
  if (category && (category.type === 'product' || category.type === 'both')) {
    const [products, categories, allProducts] = await Promise.all([
      getProductsByCategory(params.slug),
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

  notFound()
}
