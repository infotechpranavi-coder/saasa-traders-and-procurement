import type { CmsData } from '@/types/cms'
import type { NavItem, NavSubItem } from '@/types'
import { MAIN_SAASA_SITE_LABEL, MAIN_SAASA_SITE_URL } from '@/lib/brand'

function buildCategoryMenu(
  categories: CmsData['categories'],
  items: { slug: string; title: string; categoryId?: string; image?: string; desc?: string; summary?: string }[],
  basePath: 'products' | 'services',
): NavSubItem[] {
  const menu: NavSubItem[] = [{ label: `View all ${basePath}`, href: `/${basePath}` }]

  for (const category of categories) {
    const subItems: NavSubItem[] = items
      .filter((item) => item.categoryId === category.id)
      .map((item) => ({
        label: item.title,
        href: `/${basePath}/${item.slug}`,
        image: item.image,
        description: item.desc || item.summary,
      }))

    // Hide categories that have no products or services until items are added
    if (subItems.length === 0) continue

    menu.push({
      label: category.name,
      href: `/${basePath}/${category.id}`,
      image: category.image || subItems[0]?.image,
      description: category.description,
      badge: `${subItems.length} ${subItems.length === 1 ? (basePath === 'products' ? 'product' : 'service') : (basePath === 'products' ? 'products' : 'services')}`,
      children: subItems,
    })
  }

  return menu
}

export function buildNavItems(cms: CmsData | null): NavItem[] {
  const products = cms?.products ?? []
  const services = cms?.services ?? []

  // Only show categories in navigation if they have at least one product or service
  const productCategories = (cms?.categories.filter((c) => c.type === 'product' || c.type === 'both') ?? []).filter(
    (c) => products.some((p) => p.categoryId === c.id),
  )
  const serviceCategories = (cms?.categories.filter((c) => c.type === 'service' || c.type === 'both') ?? []).filter(
    (c) => services.some((s) => s.categoryId === c.id),
  )

  const brandSubItems: NavSubItem[] =
    cms?.brands && cms.brands.length > 0
      ? cms.brands.map((b) => ({
          label: b.name,
          href: `/products/brands/${b.slug}`,
        }))
      : [
          { label: 'Caterpillar', href: '/products/brands' },
          { label: 'Komatsu', href: '/products/brands' },
          { label: 'JCB', href: '/products/brands' },
          { label: 'Shantui', href: '/products/brands' },
          { label: 'Develon', href: '/products/brands' },
          { label: 'Volvo', href: '/products/brands' },
          { label: 'Himalaya', href: '/products/brands' },
          { label: 'Sany', href: '/products/brands' },
        ]

  const productChildren: NavSubItem[] = [
    { label: 'View all products', href: '/products' },
    {
      label: 'Strong Brands',
      href: '/products/brands',
      badge: 'OEM Brands',
      description: 'Explore leading equipment manufacturers, global brand partners, and genuine OEM products.',
      children: brandSubItems,
    },
    ...buildCategoryMenu(productCategories, products, 'products').slice(1),
  ]
  const serviceChildren = buildCategoryMenu(serviceCategories, services, 'services')

  return [
    { label: 'Home', href: '/', hasDropdown: false },
    { label: 'About Us', href: '/about', hasDropdown: false },
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
    { label: 'FAQ', href: '/faq', hasDropdown: false },
    { label: 'Contact Us', href: '/contact', hasDropdown: false },
    {
      label: MAIN_SAASA_SITE_LABEL,
      href: MAIN_SAASA_SITE_URL,
      hasDropdown: false,
      external: true,
    },
  ]
}
