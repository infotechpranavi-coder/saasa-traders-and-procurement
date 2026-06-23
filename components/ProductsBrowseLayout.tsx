import type { Category, Product } from '@/types/cms'
import CategorySidebar from './CategorySidebar'
import ProductCatalogSidebar from './ProductCatalogSidebar'

interface ProductsBrowseLayoutProps {
  categories: Category[]
  products?: Product[]
  activeCategoryId?: string
  activeProductSlug?: string
  backHref?: string
  backLabel?: string
  categoryBasePath?: string
  children: React.ReactNode
}

export default function ProductsBrowseLayout({
  categories,
  products,
  activeCategoryId,
  activeProductSlug,
  backHref,
  backLabel,
  categoryBasePath,
  children,
}: ProductsBrowseLayoutProps) {
  const useCatalogSidebar = Boolean(products && products.length > 0)

  return (
    <div className={`products-browse-layout ${useCatalogSidebar ? 'products-browse-layout--catalog' : ''}`}>
      {useCatalogSidebar && products ? (
        <ProductCatalogSidebar
          categories={categories}
          products={products}
          activeCategoryId={activeCategoryId}
          activeProductSlug={activeProductSlug}
        />
      ) : (
        <CategorySidebar
          categories={categories}
          activeCategoryId={activeCategoryId}
          backHref={backHref}
          backLabel={backLabel}
          categoryBasePath={categoryBasePath}
        />
      )}
      <div className="products-browse-main">{children}</div>
    </div>
  )
}
