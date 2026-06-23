'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import CmsImage from './CmsImage'
import type { Category, Service } from '@/types/cms'

interface ServiceCatalogSidebarProps {
  categories: Category[]
  services: Service[]
  activeCategoryId?: string
  activeServiceSlug?: string
}

function categoryThumb(category: Category, services: Service[]) {
  if (category.image?.trim()) return category.image
  const first = services.find((s) => s.categoryId === category.id)
  return first?.image ?? '/images/services/construction-equipment.jpg'
}

function categorySubtitle(category: Category, count: number) {
  const desc = category.description?.trim()
  if (desc) return desc.length > 52 ? `${desc.slice(0, 52)}…` : desc
  return count === 1 ? '1 service' : `${count} services`
}

export default function ServiceCatalogSidebar({
  categories,
  services,
  activeCategoryId,
  activeServiceSlug,
}: ServiceCatalogSidebarProps) {
  const [expandedId, setExpandedId] = useState<string | null>(activeCategoryId ?? null)

  useEffect(() => {
    if (activeCategoryId) setExpandedId(activeCategoryId)
  }, [activeCategoryId, activeServiceSlug])

  const servicesByCategory = useMemo(() => {
    const map = new Map<string, Service[]>()
    for (const service of services) {
      if (!service.categoryId) continue
      const list = map.get(service.categoryId) ?? []
      list.push(service)
      map.set(service.categoryId, list)
    }
    return map
  }, [services])

  const toggleCategory = (categoryId: string) => {
    setExpandedId((current) => (current === categoryId ? null : categoryId))
  }

  if (categories.length === 0) return null

  return (
    <aside className="category-detail-sidebar product-catalog-sidebar" aria-label="Browse services by category">
      <div className="product-catalog-sidebar-card">
        <ul className="product-catalog-list">
          {categories.map((category) => {
            const categoryServices = servicesByCategory.get(category.id) ?? []
            const isActiveCategory = activeCategoryId === category.id
            const isExpanded = expandedId === category.id
            const thumb = categoryThumb(category, services)

            return (
              <li key={category.id} className="product-catalog-item">
                <div
                  className={`product-catalog-category ${
                    isActiveCategory ? 'product-catalog-category--active' : ''
                  } ${isExpanded ? 'product-catalog-category--open' : ''}`}
                >
                  <div className="product-catalog-category-row">
                    <Link
                      href={`/services/category/${category.id}`}
                      className="product-catalog-category-link"
                    >
                      <span className="product-catalog-thumb">
                        <CmsImage src={thumb} alt="" />
                      </span>
                      <span className="product-catalog-meta">
                        <span className="product-catalog-name">{category.name}</span>
                        <span className="product-catalog-desc">
                          {categorySubtitle(category, categoryServices.length)}
                        </span>
                      </span>
                    </Link>
                    {categoryServices.length > 0 && (
                      <button
                        type="button"
                        className="product-catalog-toggle"
                        onClick={() => toggleCategory(category.id)}
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${category.name} services`}
                      >
                        <span aria-hidden>{isExpanded ? '−' : '+'}</span>
                      </button>
                    )}
                  </div>

                  {isExpanded && categoryServices.length > 0 && (
                    <ul className="product-catalog-sublist">
                      {categoryServices.map((service) => (
                        <li key={service.slug}>
                          <Link
                            href={`/services/${service.slug}`}
                            className={`product-catalog-subitem ${
                              activeServiceSlug === service.slug ? 'product-catalog-subitem--active' : ''
                            }`}
                          >
                            {service.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
