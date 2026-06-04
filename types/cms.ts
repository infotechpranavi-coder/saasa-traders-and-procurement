export type CategoryType = 'product' | 'service' | 'both'

export interface Category {
  id: string
  name: string
  type: CategoryType
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

export interface CmsData {
  categories: Category[]
  products: Product[]
  services: Service[]
  blogs: BlogPost[]
}
