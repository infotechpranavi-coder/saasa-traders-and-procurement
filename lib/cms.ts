import { promises as fs } from 'fs'
import path from 'path'
import type { Category, CmsData, Product, Service, BlogPost } from '@/types/cms'
import { products as seedProducts, productCategories } from '@/data/products'
import { expertiseServices as seedServices } from '@/data/expertise-services'
import { seedBlogs } from '@/data/blog-seed'
import { slugify } from '@/lib/slugify'

const CMS_FILE = path.join(process.cwd(), 'data', 'cms.json')

function normalizeCms(data: Partial<CmsData>): CmsData {
  return {
    categories: data.categories ?? [],
    products: data.products ?? [],
    services: data.services ?? [],
    blogs: data.blogs?.length ? data.blogs : seedBlogs,
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
    products: seedProducts,
    services: seedServices,
    blogs: seedBlogs,
  }
}

export async function readCms(): Promise<CmsData> {
  try {
    const raw = await fs.readFile(CMS_FILE, 'utf-8')
    const json = JSON.parse(raw) as Partial<CmsData>
    const parsed = normalizeCms(json)
    if (!json.blogs?.length) {
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
