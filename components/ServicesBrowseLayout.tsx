import type { Category, Service } from '@/types/cms'
import ServiceCatalogSidebar from './ServiceCatalogSidebar'

interface ServicesBrowseLayoutProps {
  categories: Category[]
  services: Service[]
  activeCategoryId?: string
  activeServiceSlug?: string
  children: React.ReactNode
}

export default function ServicesBrowseLayout({
  categories,
  services,
  activeCategoryId,
  activeServiceSlug,
  children,
}: ServicesBrowseLayoutProps) {
  const useCatalogSidebar = services.length > 0

  return (
    <div className={`products-browse-layout ${useCatalogSidebar ? 'products-browse-layout--catalog' : ''}`}>
      {useCatalogSidebar && (
        <ServiceCatalogSidebar
          categories={categories}
          services={services}
          activeCategoryId={activeCategoryId}
          activeServiceSlug={activeServiceSlug}
        />
      )}
      <div className="products-browse-main">{children}</div>
    </div>
  )
}
