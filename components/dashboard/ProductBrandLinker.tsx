'use client'

import type { Brand, BrandCategory } from '@/types/cms'

interface ProductBrandLinkerProps {
  brands: Brand[]
  brandCategories: BrandCategory[]
  linkedBrandSlugs: string[]
  onChange: (brandSlugs: string[]) => void
}

export default function ProductBrandLinker({
  brands,
  brandCategories,
  linkedBrandSlugs,
  onChange,
}: ProductBrandLinkerProps) {
  const categoryNameById = Object.fromEntries(brandCategories.map((c) => [c.id, c.name]))

  const toggleBrand = (brandSlug: string) => {
    const selected = new Set(linkedBrandSlugs)
    if (selected.has(brandSlug)) selected.delete(brandSlug)
    else selected.add(brandSlug)
    onChange(Array.from(selected))
  }

  return (
    <div>
      <p className="mb-3 text-xs text-gray-500">
        Tick the companies this product belongs to. Linked products appear as catalog cards on each company page at{' '}
        <code className="text-gray-600">/products/brands/[company]</code>. Create companies first under{' '}
        <strong>Strong brands</strong> if the list is empty.
      </p>
      <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
        {brands.length === 0 ? (
          <p className="px-3 py-4 text-sm text-gray-500">
            No companies yet. Go to <strong>Strong brands</strong> → <strong>Companies</strong> → Add company, then
            return here.
          </p>
        ) : (
          brands.map((brand) => {
            const checked = linkedBrandSlugs.includes(brand.slug)
            return (
              <label
                key={brand.slug}
                className="flex items-center gap-3 px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleBrand(brand.slug)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="font-medium text-gray-800">{brand.name}</span>
                <span className="text-xs text-gray-400 ml-auto">
                  {categoryNameById[brand.categoryId] ?? brand.categoryId}
                </span>
              </label>
            )
          })
        )}
      </div>
    </div>
  )
}
