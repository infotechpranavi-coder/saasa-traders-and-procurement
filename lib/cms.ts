import { promises as fs } from 'fs'
import path from 'path'
import type { Category, CmsData, CustomerReview, HeroBanner, HomepageExpertiseItem, PortfolioProject, Product, Service, BlogPost, BrochureFile } from '@/types/cms'
import { products as seedProducts, productCategories } from '@/data/products'
import { expertiseServices as seedServices } from '@/data/expertise-services'
import { seedBlogs } from '@/data/blog-seed'
import { seedHeroBanners } from '@/data/hero-banners-seed'
import { seedPortfolio } from '@/data/portfolio-seed'
import { seedReviews } from '@/data/reviews-seed'
import { slugify } from '@/lib/slugify'

const CMS_FILE = path.join(process.cwd(), 'data', 'cms.json')

function normalizeCms(data: Partial<CmsData>): CmsData {
  return {
    categories: data.categories ?? [],
    brandCategories: data.brandCategories ?? [],
    brands: data.brands ?? [],
    products: data.products ?? [],
    services: data.services ?? [],
    blogs: data.blogs?.length ? data.blogs : seedBlogs,
    portfolio: data.portfolio?.length ? data.portfolio : seedPortfolio,
    reviews: data.reviews?.length ? data.reviews : seedReviews,
    heroBanners: data.heroBanners?.length ? data.heroBanners : seedHeroBanners,
    brochure: data.brochure ?? null,
  }
}

function buildSeed(): CmsData {
  const categories: Category[] = productCategories.map((name) => ({
    id: slugify(name),
    name,
    type: 'product',
  }))

  const serviceCategories: Category[] = [
    { id: 'construction', name: 'Construction & Earthmoving', type: 'service' },
    { id: 'transport', name: 'Transport & Fleet', type: 'service' },
    { id: 'energy', name: 'Energy & Power', type: 'service' },
    { id: 'mining', name: 'Mining & Quarrying', type: 'service' },
  ]

  return {
    categories: [...categories, ...serviceCategories],
    brandCategories: [],
    brands: [],
    products: seedProducts,
    services: seedServices,
    blogs: seedBlogs,
    portfolio: seedPortfolio,
    reviews: seedReviews,
    heroBanners: seedHeroBanners,
    brochure: null,
  }
}

export async function readCms(): Promise<CmsData> {
  try {
    const raw = await fs.readFile(CMS_FILE, 'utf-8')
    const json = JSON.parse(raw) as Partial<CmsData>
    const parsed = normalizeCms(json)
    if (!json.blogs?.length || !json.portfolio?.length || !json.reviews?.length || !json.heroBanners?.length) {
      if (json.brochure) {
        parsed.brochure = json.brochure
      }
      await writeCms(parsed)
    }
    return parsed
  } catch {
    const seed = buildSeed()
    await writeCms(seed)
    return seed
  }
}

export async function writeCms(data: CmsData): Promise<void> {
  await fs.mkdir(path.dirname(CMS_FILE), { recursive: true })
  await fs.writeFile(CMS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export async function getProducts(): Promise<Product[]> {
  const cms = await readCms()
  return cms.products
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const cms = await readCms()
  return cms.products.find((p) => p.slug === slug)
}

export async function getProductCategories(): Promise<Category[]> {
  const cms = await readCms()
  return cms.categories.filter((c) => c.type === 'product' || c.type === 'both')
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const cms = await readCms()
  return cms.categories.find((c) => c.id === id)
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const cms = await readCms()
  return cms.products.filter((p) => p.categoryId === categoryId)
}

export async function getBrandCategories() {
  const cms = await readCms()
  return cms.brandCategories
}

export async function getBrands() {
  const cms = await readCms()
  return cms.brands
}

export async function getBrandBySlug(slug: string) {
  const cms = await readCms()
  return cms.brands.find((b) => b.slug === slug)
}

export async function getBrandsByCategory(categoryId: string) {
  const cms = await readCms()
  return cms.brands.filter((b) => b.categoryId === categoryId)
}

export async function getProductsByBrand(brandSlug: string): Promise<Product[]> {
  const cms = await readCms()
  const brand = cms.brands.find((b) => b.slug === brandSlug)
  if (!brand?.productSlugs?.length) return []
  const slugSet = new Set(brand.productSlugs)
  return cms.products.filter((p) => slugSet.has(p.slug))
}

export async function getServiceCategories(): Promise<Category[]> {
  const cms = await readCms()
  return cms.categories.filter((c) => c.type === 'service' || c.type === 'both')
}

export async function getServicesByCategory(categoryId: string): Promise<Service[]> {
  const cms = await readCms()
  return cms.services.filter((s) => s.categoryId === categoryId)
}

export async function getServices(): Promise<Service[]> {
  const cms = await readCms()
  return cms.services
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const cms = await readCms()
  return cms.services.find((s) => s.slug === slug)
}

export async function getBlogs(): Promise<BlogPost[]> {
  const cms = await readCms()
  return cms.blogs
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  const cms = await readCms()
  return cms.blogs.find((b) => b.slug === slug)
}

function mapHomepageProducts(products: Product[]): HomepageExpertiseItem[] {
  return products
    .filter((p) => p.showOnHomepage)
    .map((p) => ({
      kind: 'product' as const,
      slug: p.slug,
      title: p.title,
      image: p.image,
      summary: p.desc,
      href: `/products/${p.slug}`,
    }))
}

function mapHomepageServices(services: Service[]): HomepageExpertiseItem[] {
  return services
    .filter((s) => s.showOnHomepage)
    .map((s) => ({
      kind: 'service' as const,
      slug: s.slug,
      title: s.title,
      image: s.image,
      summary: s.summary,
      href: `/services/${s.slug}`,
    }))
}

/** Products & services ticked “Show on homepage” in the dashboard. */
export async function getHomepageExpertiseItems(): Promise<HomepageExpertiseItem[]> {
  const cms = await readCms()
  const selected = [...mapHomepageProducts(cms.products), ...mapHomepageServices(cms.services)]

  if (selected.length > 0) return selected

  return mapHomepageServices(cms.services.slice(0, 4))
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const cms = await readCms()
  return cms.portfolio
}

export async function getPortfolioBySlug(slug: string): Promise<PortfolioProject | undefined> {
  const cms = await readCms()
  return cms.portfolio.find((p) => p.slug === slug)
}

export async function getCustomerReviews(): Promise<CustomerReview[]> {
  const cms = await readCms()
  return cms.reviews
}

export async function getHeroBanners(): Promise<HeroBanner[]> {
  const cms = await readCms()
  return [...cms.heroBanners].sort((a, b) => a.position - b.position || a.slug.localeCompare(b.slug))
}

export async function getBrochure(): Promise<BrochureFile | null> {
  const cms = await readCms()
  return cms.brochure
}
