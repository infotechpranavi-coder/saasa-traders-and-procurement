import type { Product } from '@/types/cms'

/** All gallery URLs for a product — falls back to single `image` field. */
export function getProductImages(product: Pick<Product, 'image' | 'images'>): string[] {
  const fromArray = (product.images ?? []).map((s) => s.trim()).filter(Boolean)
  if (fromArray.length > 0) return fromArray
  const cover = product.image?.trim()
  return cover ? [cover] : []
}

/** Normalize images array and keep `image` in sync as the cover (first item). */
export function normalizeProductImageFields(
  image: string | undefined,
  images: string[] | undefined,
): { image: string; images: string[] } {
  const cleaned = (images ?? []).map((s) => s.trim()).filter(Boolean)
  const cover = image?.trim() || ''
  const merged = cleaned.length > 0 ? cleaned : cover ? [cover] : []
  return {
    images: merged,
    image: merged[0] ?? '',
  }
}
