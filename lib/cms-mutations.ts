import { revalidatePath } from 'next/cache'
import { readCms, writeCms } from '@/lib/cms'
import { slugify } from '@/lib/slugify'
import type { BlogPost, Category, CategoryType, CmsData, Product, Service } from '@/types/cms'

export type CmsActionResult<T = undefined> =
  | { ok: true; data: T; cms: CmsData }
  | { ok: false; error: string }

function revalidatePublicPages() {
  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath('/services')
  revalidatePath('/blog')
  revalidatePath('/dashboard')
}

function normalizeProduct(body: Product, fallbackSlug?: string): Product | null {
  const title = body.title?.trim()
  if (!title) return null

  const slug = body.slug?.trim() ? slugify(body.slug) : fallbackSlug || slugify(title)

  return {
    ...body,
    slug,
    title,
    label: body.label?.trim() || 'Parts',
    image: body.image?.trim() || '/images/products/hydraulic-pump.jpg',
    desc: body.desc?.trim() || '',
    specs: body.specs ?? [],
    overview: body.overview ?? [],
    features: body.features ?? [],
    applications: body.applications ?? [],
  }
}

function normalizeService(body: Service, fallbackSlug?: string): Service | null {
  const title = body.title?.trim()
  if (!title) return null

  const slug = body.slug?.trim() ? slugify(body.slug) : fallbackSlug || slugify(title)

  return {
    ...body,
    slug,
    title,
    image: body.image?.trim() || '/images/services/construction-equipment.jpg',
    summary: body.summary?.trim() || '',
    overview: body.overview ?? [],
    capabilities: body.capabilities ?? [],
    industries: body.industries ?? [],
  }
}

export async function createProduct(productInput: Product): Promise<CmsActionResult<Product>> {
  const product = normalizeProduct(productInput)
  if (!product) return { ok: false, error: 'Title is required' }

  const cms = await readCms()
  if (cms.products.some((p) => p.slug === product.slug)) {
    return { ok: false, error: 'Product slug already exists' }
  }

  cms.products.push(product)
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: product, cms }
}

export async function updateProduct(originalSlug: string, productInput: Product): Promise<CmsActionResult<Product>> {
  const product = normalizeProduct(productInput, originalSlug)
  if (!product || !originalSlug) return { ok: false, error: 'Invalid product data' }

  const cms = await readCms()
  const index = cms.products.findIndex((p) => p.slug === originalSlug)
  if (index === -1) return { ok: false, error: 'Product not found' }

  if (product.slug !== originalSlug && cms.products.some((p) => p.slug === product.slug)) {
    return { ok: false, error: 'Product slug already exists' }
  }

  cms.products[index] = product
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: product, cms }
}

export async function deleteProduct(slug: string): Promise<CmsActionResult> {
  const cms = await readCms()
  cms.products = cms.products.filter((p) => p.slug !== slug)
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: undefined, cms }
}

export async function createService(serviceInput: Service): Promise<CmsActionResult<Service>> {
  const service = normalizeService(serviceInput)
  if (!service) return { ok: false, error: 'Title is required' }

  const cms = await readCms()
  if (cms.services.some((s) => s.slug === service.slug)) {
    return { ok: false, error: 'Service slug already exists' }
  }

  cms.services.push(service)
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: service, cms }
}

export async function updateService(originalSlug: string, serviceInput: Service): Promise<CmsActionResult<Service>> {
  const service = normalizeService(serviceInput, originalSlug)
  if (!service || !originalSlug) return { ok: false, error: 'Invalid service data' }

  const cms = await readCms()
  const index = cms.services.findIndex((s) => s.slug === originalSlug)
  if (index === -1) return { ok: false, error: 'Service not found' }

  if (service.slug !== originalSlug && cms.services.some((s) => s.slug === service.slug)) {
    return { ok: false, error: 'Service slug already exists' }
  }

  cms.services[index] = service
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: service, cms }
}

export async function deleteService(slug: string): Promise<CmsActionResult> {
  const cms = await readCms()
  cms.services = cms.services.filter((s) => s.slug !== slug)
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: undefined, cms }
}

export async function createCategory(input: { id?: string; name: string; type: CategoryType }): Promise<CmsActionResult<Category>> {
  const name = input.name.trim()
  if (!name) return { ok: false, error: 'Name is required' }

  const cms = await readCms()
  const id = input.id?.trim() ? slugify(input.id) : slugify(name)

  if (cms.categories.some((c) => c.id === id)) {
    return { ok: false, error: 'Category already exists' }
  }

  const category: Category = { id, name, type: input.type || 'product' }
  cms.categories.push(category)
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: category, cms }
}

export async function updateCategory(input: { id: string; name: string; type: CategoryType }): Promise<CmsActionResult<Category>> {
  const id = input.id.trim()
  const name = input.name.trim()
  if (!id || !name) return { ok: false, error: 'Id and name are required' }

  const cms = await readCms()
  const index = cms.categories.findIndex((c) => c.id === id)
  if (index === -1) return { ok: false, error: 'Category not found' }

  const category: Category = { id, name, type: input.type || 'product' }
  cms.categories[index] = category
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: category, cms }
}

export async function deleteCategory(id: string): Promise<CmsActionResult> {
  const cms = await readCms()
  cms.categories = cms.categories.filter((c) => c.id !== id)
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: undefined, cms }
}

function normalizeBlog(body: BlogPost, fallbackSlug?: string): BlogPost | null {
  const title = body.title?.trim()
  if (!title) return null

  const slug = body.slug?.trim() ? slugify(body.slug) : fallbackSlug || slugify(title)

  return {
    ...body,
    slug,
    title,
    image: body.image?.trim() || '/images/blog/featured-air.jpg',
    date: body.date?.trim() || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    author: body.author?.trim() || 'TransHub Team',
    cat: body.cat?.trim() || 'Logistics',
    excerpt: body.excerpt?.trim() || '',
    body: body.body?.length ? body.body : [''],
    featured: Boolean(body.featured),
    highlight: Boolean(body.highlight),
  }
}

export async function createBlog(blogInput: BlogPost): Promise<CmsActionResult<BlogPost>> {
  const blog = normalizeBlog(blogInput)
  if (!blog) return { ok: false, error: 'Title is required' }

  const cms = await readCms()
  if (cms.blogs.some((b) => b.slug === blog.slug)) {
    return { ok: false, error: 'Blog slug already exists' }
  }

  if (blog.featured) {
    cms.blogs = cms.blogs.map((b) => ({ ...b, featured: false }))
  }

  cms.blogs.push(blog)
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: blog, cms }
}

export async function updateBlog(originalSlug: string, blogInput: BlogPost): Promise<CmsActionResult<BlogPost>> {
  const blog = normalizeBlog(blogInput, originalSlug)
  if (!blog || !originalSlug) return { ok: false, error: 'Invalid blog data' }

  const cms = await readCms()
  const index = cms.blogs.findIndex((b) => b.slug === originalSlug)
  if (index === -1) return { ok: false, error: 'Blog not found' }

  if (blog.slug !== originalSlug && cms.blogs.some((b) => b.slug === blog.slug)) {
    return { ok: false, error: 'Blog slug already exists' }
  }

  if (blog.featured) {
    cms.blogs = cms.blogs.map((b) => ({ ...b, featured: b.slug === originalSlug ? true : false }))
  }

  cms.blogs[index] = blog
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: blog, cms }
}

export async function deleteBlog(slug: string): Promise<CmsActionResult> {
  const cms = await readCms()
  cms.blogs = cms.blogs.filter((b) => b.slug !== slug)
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: undefined, cms }
}
