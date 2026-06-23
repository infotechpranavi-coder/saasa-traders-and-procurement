export type CategoryType = 'product' | 'service' | 'both'

export interface Category {
  id: string
  name: string
  type: CategoryType
  description?: string
  image?: string
}

export interface ProductCompany {
  name: string
  items: string[]
}

export interface BrandCategory {
  id: string
  name: string
}

export interface Brand {
  slug: string
  name: string
  categoryId: string
  description?: string
  image?: string
  equipment?: string[]
  /** Product names listed under this company on the Strong Brands page */
  listedProducts?: string[]
  productSlugs: string[]
}

export interface Product {
  slug: string
  title: string
  label: string
  categoryId?: string
  image: string
  desc: string
  specs: string[]
  overview: string[]
  features: string[]
  applications: string[]
  companies?: ProductCompany[]
  showOnHomepage?: boolean
}

export interface Service {
  slug: string
  title: string
  categoryId?: string
  image: string
  summary: string
  overview: string[]
  capabilities: string[]
  industries: string[]
  showOnHomepage?: boolean
}

export interface HomepageExpertiseItem {
  kind: 'product' | 'service'
  slug: string
  title: string
  image: string
  summary: string
  href: string
}

export interface BlogPost {
  slug: string
  title: string
  image: string
  date: string
  author: string
  cat: string
  excerpt?: string
  body: string[]
  featured?: boolean
  highlight?: boolean
}

export interface PortfolioProject {
  slug: string
  title: string
  label: string
  image: string
  excerpt?: string
  body: string[]
  client?: string
  location?: string
  year?: string
}

export interface CustomerReview {
  slug: string
  name: string
  role: string
  quote: string
  image: string
}

/** Homepage hero carousel slide */
export interface HeroBanner {
  slug: string
  /** Slide order — lower numbers appear first */
  position: number
  image: string
  badge: string
  title: string
  titleAccent: string
  subtitle: string
}

export interface CmsData {
  categories: Category[]
  brandCategories: BrandCategory[]
  brands: Brand[]
  products: Product[]
  services: Service[]
  blogs: BlogPost[]
  portfolio: PortfolioProject[]
  reviews: CustomerReview[]
  heroBanners: HeroBanner[]
}
