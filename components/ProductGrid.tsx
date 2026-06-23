import CmsImage from './CmsImage'
import Link from 'next/link'
import type { Category, Product } from '@/types/cms'

interface ProductGridProps {
  products: Product[]
  categories: Category[]
  emptyMessage?: string
  hideCategoryBadge?: boolean
  emptyCtaHref?: string
  emptyCtaLabel?: string
}

export default function ProductGrid({
  products,
  categories,
  emptyMessage = 'No products in this category yet.',
  hideCategoryBadge = false,
  emptyCtaHref = '/products',
  emptyCtaLabel = 'View All Products',
}: ProductGridProps) {
  const categoryNameById = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  if (products.length === 0) {
    return (
      <div className="category-empty-state">
        <p className="hp-subtitle mb-2">{emptyMessage}</p>
        {emptyCtaHref && (
          <Link href={emptyCtaHref} className="btn-primary mt-2 inline-flex text-sm">
            {emptyCtaLabel}
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <Link
          key={product.slug}
          href={`/products/${product.slug}`}
          className="product-card group"
        >
          <article>
            <div className="product-card-media">
              <CmsImage
                src={product.image}
                alt={product.title}
                fill
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="product-card-media-overlay" />
              {!hideCategoryBadge && (
                <span className="product-card-badge">
                  {product.categoryId ? categoryNameById[product.categoryId] ?? product.label : product.label}
                </span>
              )}
            </div>
            <div className="product-card-body">
              <h3 className="product-card-title">{product.title}</h3>
              <p className="product-card-desc">{product.desc}</p>
              {product.specs.length > 0 && (
                <ul className="product-card-specs">
                  {product.specs.slice(0, 3).map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
              )}
              <span className="product-card-cta">
                View Details
                <span aria-hidden>→</span>
              </span>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}
