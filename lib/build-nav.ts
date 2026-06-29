import type { CmsData } from '@/types/cms'
import type { NavItem, NavSubItem } from '@/types'
import { MAIN_SAASA_SITE_LABEL, MAIN_SAASA_SITE_URL } from '@/lib/brand'

function buildCategoryMenu(
  categories: CmsData['categories'],
  items: { slug: string; title: string; categoryId?: string }[],
  basePath: 'products' | 'services',
): NavSubItem[] {
  const menu: NavSubItem[] = [{ label: `View all ${basePath}`, href: `/${basePath}` }]

  for (const category of categories) {
    const subItems = items
      .filter((item) => item.categoryId === category.id)
      .map((item) => ({
        label: item.title,
        href: `/${basePath}/${item.slug}`,
      }))

    menu.push({
      label: category.name,
      href: `/${basePath}/category/${category.id}`,
      children: subItems.length > 0 ? subItems : undefined,
    })
  }

  return menu
}

export function buildNavItems(cms: CmsData | null): NavItem[] {
  const productCategories = cms?.categories.filter((c) => c.type === 'product' || c.type === 'both') ?? []
  const serviceCategories = cms?.categories.filter((c) => c.type === 'service' || c.type === 'both') ?? []

  const productChildren: NavSubItem[] = [
    { label: 'View all products', href: '/products' },
    { label: 'Strong Brands', href: '/products/brands' },
    ...buildCategoryMenu(productCategories, cms?.products ?? [], 'products').slice(1),
  ]
  const serviceChildren = buildCategoryMenu(serviceCategories, cms?.services ?? [], 'services')

  return [
    { label: 'Home', href: '/', hasDropdown: false },
    { label: 'About', href: '/about', hasDropdown: false },
    {
      label: 'Services',
      href: '/services',
      hasDropdown: serviceCategories.length > 0,
      children: serviceCategories.length > 0 ? serviceChildren : undefined,
    },
    {
      label: 'Products',
      href: '/products',
      hasDropdown: productCategories.length > 0,
      children: productCategories.length > 0 ? productChildren : undefined,
    },
    { label: 'Blog', href: '/blog', hasDropdown: false },
    {
      label: MAIN_SAASA_SITE_LABEL,
      href: MAIN_SAASA_SITE_URL,
      hasDropdown: false,
      external: true,
    },
    { label: 'Contact Us', href: '/contact', hasDropdown: false },
  ]
}
