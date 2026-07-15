export type CategoryType = 'product' | 'service' | 'both'

export interface Category {
  id: string
  name: string
  type: CategoryType
  description?: string
  image?: string
  showInFooter?: boolean
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
  /** Primary category retained for compatibility with existing CMS data. */
  categoryId: string
  /** All brand categories where this company should appear. */
  categoryIds?: string[]
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
  /** Additional product photos for the detail-page gallery (first item mirrors `image`). */
  images?: string[]
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
  showInFooter?: boolean
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

/** Company brochure PDF for public download */
export interface BrochureFile {
  url: string
  fileName: string
  uploadedAt?: string
  /** Cloudinary public_id — used when deleting replaced catalog files */
  publicId?: string
}

export type HeroStatType = 'manual' | 'years_since'

/** One stat shown in the homepage hero footer bar */
export interface HeroStatSetting {
  label: string
  value: string
  /** `years_since` uses `siteSettings.establishedYear` to compute e.g. 10+ */
  type: HeroStatType
}

export interface SiteSettings {
  /** e.g. 2016 — used when a hero stat has type `years_since` */
  establishedYear: number
  heroStats: [HeroStatSetting, HeroStatSetting, HeroStatSetting]
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
  brochure: BrochureFile | null
  siteSettings: SiteSettings
}
