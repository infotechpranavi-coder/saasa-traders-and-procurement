import Link from 'next/link'
import type { Brand, BrandCategory } from '@/types/cms'
import { brandBelongsToCategory, getBrandCategoryIds } from '@/lib/brand-categories'

interface StrongBrandsGridProps {
  brandCategories: BrandCategory[]
  brands: Brand[]
}

export default function StrongBrandsGrid({ brandCategories, brands }: StrongBrandsGridProps) {
  const grouped = brandCategories
    .map((category) => ({
      category,
      brands: brands.filter((brand) => brandBelongsToCategory(brand, category.id)),
    }))
    .filter((group) => group.brands.length > 0)

  const uncategorized = brands.filter(
    (brand) =>
      !getBrandCategoryIds(brand).some((categoryId) =>
        brandCategories.some((category) => category.id === categoryId),
      ),
  )

  if (grouped.length === 0 && uncategorized.length === 0) {
    return (
      <div className="strong-brands-empty">
        <p className="hp-subtitle mb-2">No brands listed yet</p>
        <p className="hp-body text-sm">Check back soon for our partner equipment brands.</p>
      </div>
    )
  }

  return (
    <div className="strong-brands-grid">
      {grouped.map(({ category, brands: categoryBrands }) => (
        <section key={category.id} className="strong-brands-group">
          <h2 className="strong-brands-group-title">{category.name}</h2>
          <ul className="strong-brands-list">
            {categoryBrands.map((brand) => (
              <li key={brand.slug}>
                <Link href={`/products/brands/${brand.slug}`} className="strong-brands-link">
                  {brand.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {uncategorized.length > 0 && (
        <section className="strong-brands-group">
          <h2 className="strong-brands-group-title">Other brands</h2>
          <ul className="strong-brands-list">
            {uncategorized.map((brand) => (
              <li key={brand.slug}>
                <Link href={`/products/brands/${brand.slug}`} className="strong-brands-link">
                  {brand.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
