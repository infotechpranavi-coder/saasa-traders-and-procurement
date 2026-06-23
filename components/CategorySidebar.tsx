import Link from 'next/link'
import type { Category } from '@/types/cms'

interface CategorySidebarProps {
  categories: Category[]
  activeCategoryId?: string
  backHref?: string
  backLabel?: string
  categoryBasePath?: string
}

export default function CategorySidebar({
  categories,
  activeCategoryId,
  backHref = '/products',
  backLabel = 'Products',
  categoryBasePath = '/products/category',
}: CategorySidebarProps) {
  if (categories.length === 0) return null

  return (
    <aside className="category-detail-sidebar" aria-label="Browse categories">
      <div className="category-sidebar-card">
        <h2 className="category-sidebar-title">Categories</h2>
        <ul className="category-sidebar-nav">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`${categoryBasePath}/${cat.id}`}
                className={`category-sidebar-link ${activeCategoryId === cat.id ? 'category-sidebar-link--active' : ''}`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
