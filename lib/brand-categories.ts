import type { Brand } from '@/types/cms'

export function getBrandCategoryIds(brand: Pick<Brand, 'categoryId' | 'categoryIds'>): string[] {
  const values = brand.categoryIds?.length ? brand.categoryIds : [brand.categoryId]
  return Array.from(new Set(values.map((value) => value?.trim()).filter(Boolean)))
}

export function brandBelongsToCategory(
  brand: Pick<Brand, 'categoryId' | 'categoryIds'>,
  categoryId: string,
): boolean {
  return getBrandCategoryIds(brand).includes(categoryId)
}
