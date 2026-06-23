import Link from 'next/link'
import CmsImage from './CmsImage'
import ProductsBrowseLayout from './ProductsBrowseLayout'
import ServicesBrowseLayout from './ServicesBrowseLayout'
import type { Category, Product, Service } from '@/types/cms'

interface CategoryDetailLayoutProps {
  category: Category
  heroImage: string
  itemCount: number
  itemLabel: string
  backHref: string
  backLabel: string
  defaultDescription: string
  catalogTitle: string
  catalogType?: 'products' | 'services'
  sidebarCategories?: Category[]
  sidebarProducts?: Product[]
  sidebarServices?: Service[]
  children: React.ReactNode
}

export default function CategoryDetailLayout({
  category,
  heroImage,
  itemCount,
  backHref,
  backLabel,
  defaultDescription,
  catalogTitle,
  catalogType = 'products',
  sidebarCategories,
  sidebarProducts,
  sidebarServices,
  children,
}: CategoryDetailLayoutProps) {
  const description = category.description?.trim() || defaultDescription
  const showImage = Boolean(category.image?.trim() || heroImage)
  const showProductSidebar = catalogType === 'products' && Boolean(sidebarCategories?.length && sidebarProducts?.length)
  const showServiceSidebar = catalogType === 'services' && Boolean(sidebarCategories?.length && sidebarServices?.length)
  const showSidebar = showProductSidebar || showServiceSidebar

  const catalogBody = showProductSidebar ? (
    <ProductsBrowseLayout
      categories={sidebarCategories!}
      products={sidebarProducts!}
      activeCategoryId={category.id}
    >
      <div className="category-catalog-main-panel">
        <h2 className="category-catalog-title">{catalogTitle}</h2>
        <div className="category-items-wrap">{children}</div>
      </div>
    </ProductsBrowseLayout>
  ) : showServiceSidebar ? (
    <ServicesBrowseLayout
      categories={sidebarCategories!}
      services={sidebarServices!}
      activeCategoryId={category.id}
    >
      <div className="category-catalog-main-panel">
        <h2 className="category-catalog-title">{catalogTitle}</h2>
        <div className="category-items-wrap">{children}</div>
      </div>
    </ServicesBrowseLayout>
  ) : (
    children
  )

  return (
    <>
      <header className="category-hero">
        {showImage ? (
          <div className="category-hero-media" aria-hidden>
            <CmsImage src={heroImage} alt="" fill priority />
          </div>
        ) : (
          <div className="category-hero-fallback" aria-hidden />
        )}
        <div className="category-hero-overlay" aria-hidden />

        <div className="category-hero-content">
          <nav className="category-hero-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="category-hero-crumb-sep" aria-hidden>
              /
            </span>
            <Link href={backHref}>{backLabel}</Link>
            <span className="category-hero-crumb-sep" aria-hidden>
              /
            </span>
            <span className="category-hero-crumb-current">{category.name}</span>
          </nav>

          <p className="category-hero-eyebrow">{backLabel} category</p>
          <h1 className="category-hero-title">{category.name}</h1>
          <p className="category-hero-lead">{description}</p>
        </div>
      </header>

      {itemCount > 0 ? (
        <section className="category-catalog-section">
          <div className="category-page-container">
            <div className={showSidebar ? 'category-catalog-layout' : undefined}>
              {showSidebar ? (
                catalogBody
              ) : (
                <>
                  <h2 className="category-catalog-title">{catalogTitle}</h2>
                  <div
                    className={
                      itemCount === 1
                        ? 'category-items-wrap category-items-wrap--single'
                        : 'category-items-wrap'
                    }
                  >
                    {children}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="category-catalog-section category-catalog-section--empty">
          <div className="category-page-container">{children}</div>
        </section>
      )}
    </>
  )
}
