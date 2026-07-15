import { promises as fs } from 'fs'
import path from 'path'
import { unstable_noStore as noStore } from 'next/cache'
import type { Category, CmsData, CustomerReview, HeroBanner, HomepageExpertiseItem, PortfolioProject, Product, Service, BlogPost, BrochureFile, SiteSettings } from '@/types/cms'
import { products as seedProducts, productCategories } from '@/data/products'
import { expertiseServices as seedServices } from '@/data/expertise-services'
import { seedBlogs } from '@/data/blog-seed'
import { seedHeroBanners } from '@/data/hero-banners-seed'
import { seedPortfolio } from '@/data/portfolio-seed'
import { seedReviews } from '@/data/reviews-seed'
import { applyDemoProductServiceSeed } from '@/lib/static-machinery-images'
import { normalizeSiteSettings } from '@/lib/site-settings'
import { brandBelongsToCategory } from '@/lib/brand-categories'
import { slugify } from '@/lib/slugify'
import { CMS_COLLECTION, CMS_DOCUMENT_ID, getMongoDb, isMongoConfigured } from '@/lib/mongodb'
import type { Db } from 'mongodb'

interface CmsDocument {
  _id: string
  data: CmsData
  updatedAt?: string
}

const CMS_FILE = path.join(process.cwd(), 'data', 'cms.json')

function normalizeCms(data: Partial<CmsData>, seedDefaults = false): CmsData {
  return {
    categories: data.categories ?? [],
    brandCategories: data.brandCategories ?? [],
    brands: data.brands ?? [],
    products: data.products ?? [],
    services: data.services ?? [],
    blogs: Array.isArray(data.blogs) ? data.blogs : seedDefaults ? seedBlogs : [],
    portfolio: Array.isArray(data.portfolio) ? data.portfolio : seedDefaults ? seedPortfolio : [],
    reviews: Array.isArray(data.reviews) ? data.reviews : seedDefaults ? seedReviews : [],
    heroBanners: Array.isArray(data.heroBanners) ? data.heroBanners : seedDefaults ? seedHeroBanners : [],
    brochure: data.brochure ?? null,
    siteSettings: normalizeSiteSettings(data.siteSettings),
  }
}

export function buildSeedCms(): CmsData {
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

  return applyDemoProductServiceSeed({
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
    siteSettings: normalizeSiteSettings(),
  })
}

export async function readCmsJsonFile(): Promise<CmsData | null> {
  try {
    const raw = await fs.readFile(CMS_FILE, 'utf-8')
    const json = JSON.parse(raw) as Partial<CmsData>
    return normalizeCms(json)
  } catch {
    return null
  }
}

async function writeCmsToMongo(db: Db, data: CmsData): Promise<void> {
  await db.collection<CmsDocument>(CMS_COLLECTION).updateOne(
    { _id: CMS_DOCUMENT_ID },
    { $set: { data, updatedAt: new Date().toISOString() } },
    { upsert: true },
  )
}

async function readCmsFromMongo(): Promise<CmsData | null> {
  const db = await getMongoDb()
  if (!db) return null

  const doc = await db.collection<CmsDocument>(CMS_COLLECTION).findOne({
    _id: CMS_DOCUMENT_ID,
  })

  if (!doc?.data) return null
  return normalizeCms(doc.data)
}

export async function readCms(): Promise<CmsData> {
  noStore()

  if (isMongoConfigured()) {
    const existing = await readCmsFromMongo()
    if (existing) return existing

    const { seedDemoCmsToMongo } = await import('@/lib/seed-remote-cms')
    return seedDemoCmsToMongo(false)
  }

  const fromFile = await readCmsJsonFile()
  if (fromFile) return fromFile

  const seed = buildSeedCms()
  await writeCms(seed)
  return seed
}

export async function writeCms(data: CmsData): Promise<void> {
  if (isMongoConfigured()) {
    const db = await getMongoDb()
    if (!db) {
      throw new Error('MongoDB is configured but the database connection failed')
    }
    await writeCmsToMongo(db, data)
    return
  }

  await fs.mkdir(path.dirname(CMS_FILE), { recursive: true })
  const json = JSON.stringify(data, null, 2)
  await fs.writeFile(CMS_FILE, json, 'utf-8')
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
  return cms.brands.filter((brand) => brandBelongsToCategory(brand, categoryId))
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

function mapHomepageProducts(products: Product[], onlyFlagged = true): HomepageExpertiseItem[] {
  const list = onlyFlagged ? products.filter((p) => p.showOnHomepage) : products
  return list.map((p) => ({
    kind: 'product' as const,
    slug: p.slug,
    title: p.title,
    image: p.image,
    summary: p.desc,
    href: `/products/${p.slug}`,
  }))
}

function mapHomepageServices(services: Service[], onlyFlagged = true): HomepageExpertiseItem[] {
  const list = onlyFlagged ? services.filter((s) => s.showOnHomepage) : services
  return list.map((s) => ({
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

  // No flags set — show first four services so the section is never empty.
  return mapHomepageServices(cms.services.slice(0, 4), false)
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

export async function getSiteSettings(): Promise<SiteSettings> {
  const cms = await readCms()
  return cms.siteSettings
}

export async function getBrochure(): Promise<BrochureFile | null> {
  const cms = await readCms()
  return cms.brochure
}
