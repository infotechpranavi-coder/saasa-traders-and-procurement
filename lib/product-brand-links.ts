import type { CmsData } from '@/types/cms'

export function getBrandSlugsForProduct(cms: CmsData, productSlug: string): string[] {
  if (!productSlug.trim()) return []
  return cms.brands.filter((brand) => brand.productSlugs.includes(productSlug)).map((brand) => brand.slug)
}

export function syncProductBrandLinks(
  cms: CmsData,
  productSlug: string,
  linkedBrandSlugs: string[],
  previousProductSlug?: string,
): void {
  if (!productSlug.trim()) return

  const oldSlug = (previousProductSlug || productSlug).trim()
  const selected = new Set(linkedBrandSlugs)

  for (const brand of cms.brands) {
    let slugs = brand.productSlugs.filter((slug) => slug !== oldSlug)
    if (selected.has(brand.slug)) {
      if (!slugs.includes(productSlug)) slugs.push(productSlug)
    }
    brand.productSlugs = slugs
  }
}

export function removeProductFromBrandLinks(cms: CmsData, productSlug: string): void {
  for (const brand of cms.brands) {
    brand.productSlugs = brand.productSlugs.filter((slug) => slug !== productSlug)
  }
}
