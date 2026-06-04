import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageLayout from '../../../components/PageLayout'
import PageHero from '../../../components/PageHero'
import DetailPageContent from '../../../components/DetailPageContent'
import { getProductBySlug } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Product Not Found - TransHub' }
  return { title: `${product.title} - TransHub Products` }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  return (
    <PageLayout>
      <PageHero
        title={product.title}
        breadcrumb="Products"
        trail={[
          { label: 'Products', href: '/products' },
          { label: product.title },
        ]}
      />

      <DetailPageContent
        image={product.image}
        title={product.title}
        label={product.label}
        overview={product.overview}
        listTitle="Key Features"
        listItems={product.features}
        secondaryTitle="Applications"
        secondaryItems={product.applications}
        backHref="/products"
        backLabel="Products"
      />
    </PageLayout>
  )
}
