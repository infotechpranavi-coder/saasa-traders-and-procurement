'use client'

import Link from 'next/link'
import type { Category, Product } from '@/types/cms'
import ProductGrid from './ProductGrid'

interface ProductsCatalogProps {
  products: Product[]
  categories: Category[]
}

export default function ProductsCatalog({ products, categories }: ProductsCatalogProps) {
  return (
    <>
      {categories.length > 0 && (
        <div className="products-mobile-cats mb-8 flex flex-wrap items-center justify-center gap-2 lg:hidden">
          <Link
            href="/products"
            className="rounded-full border border-primary bg-primary px-4 py-1.5 text-xs font-semibold text-white transition"
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/category/${cat.id}`}
              className="rounded-full border border-gray-200 bg-[#f4f5f7] px-4 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-primary hover:text-primary"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      <ProductGrid products={products} categories={categories} emptyMessage="No products listed yet." />
    </>
  )
}
