'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import CmsImage from './CmsImage'
import type { Category, Product } from '@/types/cms'

interface ProductCatalogSidebarProps {
  categories: Category[]
  products: Product[]
  activeCategoryId?: string
  activeProductSlug?: string
}

function categoryThumb(category: Category, products: Product[]) {
  if (category.image?.trim()) return category.image
  const first = products.find((p) => p.categoryId === category.id)
  return first?.image ?? '/images/products/gearbox-parts.jpg'
}

function categorySubtitle(category: Category, count: number) {
  const desc = category.description?.trim()
  if (desc) return desc.length > 52 ? `${desc.slice(0, 52)}…` : desc
  return count === 1 ? '1 product' : `${count} products`
}

export default function ProductCatalogSidebar({
  categories,
  products,
  activeCategoryId,
  activeProductSlug,
}: ProductCatalogSidebarProps) {
  const [expandedId, setExpandedId] = useState<string | null>(activeCategoryId ?? null)

  useEffect(() => {
    if (activeCategoryId) setExpandedId(activeCategoryId)
  }, [activeCategoryId, activeProductSlug])

  const productsByCategory = useMemo(() => {
    const map = new Map<string, Product[]>()
    for (const product of products) {
      if (!product.categoryId) continue
      const list = map.get(product.categoryId) ?? []
      list.push(product)
      map.set(product.categoryId, list)
    }
    return map
  }, [products])

  const toggleCategory = (categoryId: string) => {
    setExpandedId((current) => (current === categoryId ? null : categoryId))
  }

  if (categories.length === 0) return null

  return (
    <aside className="category-detail-sidebar product-catalog-sidebar" aria-label="Browse products by category">
      <div className="product-catalog-sidebar-card">
        <ul className="product-catalog-list">
          {categories.map((category) => {
            const categoryProducts = productsByCategory.get(category.id) ?? []
            const isActiveCategory = activeCategoryId === category.id
            const isExpanded = expandedId === category.id
            const thumb = categoryThumb(category, products)

            return (
              <li key={category.id} className="product-catalog-item">
                <div
                  className={`product-catalog-category ${
                    isActiveCategory ? 'product-catalog-category--active' : ''
                  } ${isExpanded ? 'product-catalog-category--open' : ''}`}
                >
                  <div className="product-catalog-category-row">
                    <Link
                      href={`/products/category/${category.id}`}
                      className="product-catalog-category-link"
                    >
                      <span className="product-catalog-thumb">
                        <CmsImage src={thumb} alt="" />
                      </span>
                      <span className="product-catalog-meta">
                        <span className="product-catalog-name">{category.name}</span>
                        <span className="product-catalog-desc">
                          {categorySubtitle(category, categoryProducts.length)}
                        </span>
                      </span>
                    </Link>
                    {categoryProducts.length > 0 && (
                      <button
                        type="button"
                        className="product-catalog-toggle"
                        onClick={() => toggleCategory(category.id)}
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${category.name} products`}
                      >
                        <span aria-hidden>{isExpanded ? '−' : '+'}</span>
                      </button>
                    )}
                  </div>

                  {isExpanded && categoryProducts.length > 0 && (
                    <ul className="product-catalog-sublist">
                      {categoryProducts.map((product) => (
                        <li key={product.slug}>
                          <Link
                            href={`/products/${product.slug}`}
                            className={`product-catalog-subitem ${
                              activeProductSlug === product.slug ? 'product-catalog-subitem--active' : ''
                            }`}
                          >
                            {product.title}
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
