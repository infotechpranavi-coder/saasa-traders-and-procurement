import { queueNewsletterContentAlert } from '@/lib/email/newsletter-notify'
import { readCms, writeCms } from '@/lib/cms'
import { revalidatePublicPages } from '@/lib/revalidate-public'
import { slugify } from '@/lib/slugify'
import { normalizeProductImageFields } from '@/lib/product-images'
import { normalizeProductCompanies } from '@/lib/product-companies'
import { removeProductFromBrandLinks, syncProductBrandLinks } from '@/lib/product-brand-links'
import type { BlogPost, Brand, BrandCategory, Category, CategoryType, CmsData, CustomerReview, HeroBanner, PortfolioProject, Product, Service, BrochureFile, SiteSettings } from '@/types/cms'
import { normalizeSiteSettings } from '@/lib/site-settings'

export type CmsActionResult<T = undefined> =
  | { ok: true; data: T; cms: CmsData }
  | { ok: false; error: string }

async function persistCms<T>(cms: CmsData, data: T): Promise<CmsActionResult<T>> {
  try {
    await writeCms(cms)
    revalidatePublicPages()
    return { ok: true, data, cms }
  } catch {
    return { ok: false, error: 'Failed to save content. Check MongoDB connection and credentials.' }
  }
}

async function persistCmsOnly(cms: CmsData): Promise<CmsActionResult> {
  try {
    await writeCms(cms)
    revalidatePublicPages()
    return { ok: true, data: undefined, cms }
  } catch {
    return { ok: false, error: 'Failed to save content. Check MongoDB connection and credentials.' }
  }
}

function normalizeProduct(body: Product, fallbackSlug?: string): Product | null {
  const title = body.title?.trim()
  if (!title) return null

  const slug = body.slug?.trim() ? slugify(body.slug) : fallbackSlug || slugify(title)
  const { image, images } = normalizeProductImageFields(body.image, body.images)

  return {
    ...body,
    slug,
    title,
    label: body.label?.trim() || '',
    image,
    images,
    desc: body.desc?.trim() || '',
    specs: body.specs ?? [],
    overview: body.overview ?? [],
    features: body.features ?? [],
    applications: body.applications ?? [],
    companies: normalizeProductCompanies(body.companies),
    showOnHomepage: Boolean(body.showOnHomepage),
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
    image: body.image?.trim() || '',
    summary: body.summary?.trim() || '',
    overview: body.overview ?? [],
    capabilities: body.capabilities ?? [],
    industries: body.industries ?? [],
    showOnHomepage: Boolean(body.showOnHomepage),
    showInFooter: Boolean(body.showInFooter),
  }
}

export async function createProduct(
  productInput: Product,
  linkedBrandSlugs?: string[],
): Promise<CmsActionResult<Product>> {
  const product = normalizeProduct(productInput)
  if (!product) return { ok: false, error: 'Title is required' }

  const cms = await readCms()
  if (cms.products.some((p) => p.slug === product.slug)) {
    return { ok: false, error: 'Product slug already exists' }
  }

  cms.products.push(product)
  if (linkedBrandSlugs) {
    syncProductBrandLinks(cms, product.slug, linkedBrandSlugs)
  }
  await writeCms(cms)
  revalidatePublicPages()
  queueNewsletterContentAlert({ kind: 'product', title: product.title, slug: product.slug })
  return { ok: true, data: product, cms }
}

export async function updateProduct(
  originalSlug: string,
  productInput: Product,
  linkedBrandSlugs?: string[],
): Promise<CmsActionResult<Product>> {
  const product = normalizeProduct(productInput, originalSlug)
  if (!product || !originalSlug) return { ok: false, error: 'Invalid product data' }

  const cms = await readCms()
  const index = cms.products.findIndex((p) => p.slug === originalSlug)
  if (index === -1) return { ok: false, error: 'Product not found' }

  if (product.slug !== originalSlug && cms.products.some((p) => p.slug === product.slug)) {
    return { ok: false, error: 'Product slug already exists' }
  }

  cms.products[index] = product
  if (linkedBrandSlugs) {
    syncProductBrandLinks(cms, product.slug, linkedBrandSlugs, originalSlug)
  }
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: product, cms }
}

export async function deleteProduct(slug: string): Promise<CmsActionResult> {
  const cms = await readCms()
  cms.products = cms.products.filter((p) => p.slug !== slug)
  removeProductFromBrandLinks(cms, slug)
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
  queueNewsletterContentAlert({ kind: 'service', title: service.title, slug: service.slug })
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

export async function createCategory(input: {
  id?: string
  name: string
  type: CategoryType
  description?: string
  image?: string
  showInFooter?: boolean
}): Promise<CmsActionResult<Category>> {
  const name = input.name.trim()
  if (!name) return { ok: false, error: 'Name is required' }

  const cms = await readCms()
  const id = input.id?.trim() ? slugify(input.id) : slugify(name)

  if (cms.categories.some((c) => c.id === id)) {
    return { ok: false, error: 'Category already exists' }
  }

  const category: Category = {
    id,
    name,
    type: input.type || 'product',
    description: input.description?.trim() || '',
    image: input.image?.trim() || '',
    showInFooter: Boolean(input.showInFooter),
  }
  cms.categories.push(category)
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: category, cms }
}

export async function updateCategory(input: {
  id: string
  name: string
  type: CategoryType
  description?: string
  image?: string
  showInFooter?: boolean
}): Promise<CmsActionResult<Category>> {
  const id = input.id.trim()
  const name = input.name.trim()
  if (!id || !name) return { ok: false, error: 'Id and name are required' }

  const cms = await readCms()
  const index = cms.categories.findIndex((c) => c.id === id)
  if (index === -1) return { ok: false, error: 'Category not found' }

  const category: Category = {
    id,
    name,
    type: input.type || 'product',
    description: input.description?.trim() || '',
    image: input.image?.trim() || '',
    showInFooter: Boolean(input.showInFooter),
  }
  cms.categories[index] = category
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: category, cms }
}

export async function deleteCategory(id: string): Promise<CmsActionResult> {
  const cms = await readCms()
  const inUse =
    cms.products.some((p) => p.categoryId === id) || cms.services.some((s) => s.categoryId === id)
  if (inUse) {
    return { ok: false, error: 'Category is assigned to products or services. Reassign them first.' }
  }

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
    image: body.image?.trim() || '',
    date: body.date?.trim() || '',
    author: body.author?.trim() || '',
    cat: body.cat?.trim() || '',
    excerpt: body.excerpt?.trim() || '',
    body: (body.body ?? []).map((paragraph) => paragraph.trim()).filter(Boolean),
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
  const result = await persistCms(cms, blog)
  if (result.ok) {
    queueNewsletterContentAlert({ kind: 'blog', title: blog.title, slug: blog.slug })
  }
  return result
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
  return persistCms(cms, blog)
}

export async function deleteBlog(slug: string): Promise<CmsActionResult> {
  const cms = await readCms()
  cms.blogs = cms.blogs.filter((b) => b.slug !== slug)
  return persistCmsOnly(cms)
}

function normalizeBrand(body: Brand, fallbackSlug?: string): Brand | null {
  const name = body.name?.trim()
  if (!name) return null

  const slug = body.slug?.trim() ? slugify(body.slug) : fallbackSlug || slugify(name)
  const categoryId = body.categoryId?.trim()
  if (!categoryId) return null

  return {
    slug,
    name,
    categoryId,
    description: body.description?.trim() || '',
    image: body.image?.trim() || '',
    equipment: (body.equipment ?? []).map((item) => item.trim()).filter(Boolean),
    listedProducts: (body.listedProducts ?? []).map((item) => item.trim()).filter(Boolean),
    productSlugs: body.productSlugs ?? [],
  }
}

export async function createBrandCategory(input: {
  id?: string
  name: string
}): Promise<CmsActionResult<BrandCategory>> {
  const name = input.name.trim()
  if (!name) return { ok: false, error: 'Name is required' }

  const cms = await readCms()
  const id = input.id?.trim() ? slugify(input.id) : slugify(name)
  if (cms.brandCategories.some((c) => c.id === id)) {
    return { ok: false, error: 'Brand category already exists' }
  }

  const category: BrandCategory = { id, name }
  cms.brandCategories.push(category)
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: category, cms }
}

export async function updateBrandCategory(input: {
  id: string
  name: string
}): Promise<CmsActionResult<BrandCategory>> {
  const id = input.id.trim()
  const name = input.name.trim()
  if (!id || !name) return { ok: false, error: 'Id and name are required' }

  const cms = await readCms()
  const index = cms.brandCategories.findIndex((c) => c.id === id)
  if (index === -1) return { ok: false, error: 'Brand category not found' }

  const category: BrandCategory = { id, name }
  cms.brandCategories[index] = category
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: category, cms }
}

export async function deleteBrandCategory(id: string): Promise<CmsActionResult> {
  const cms = await readCms()
  if (cms.brands.some((b) => b.categoryId === id)) {
    return { ok: false, error: 'Brand category has brands assigned. Reassign or delete them first.' }
  }

  cms.brandCategories = cms.brandCategories.filter((c) => c.id !== id)
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: undefined, cms }
}

export async function createBrand(brandInput: Brand): Promise<CmsActionResult<Brand>> {
  const brand = normalizeBrand(brandInput)
  if (!brand) return { ok: false, error: 'Name and brand category are required' }

  const cms = await readCms()
  if (!cms.brandCategories.some((c) => c.id === brand.categoryId)) {
    return { ok: false, error: 'Brand category not found' }
  }
  if (cms.brands.some((b) => b.slug === brand.slug)) {
    return { ok: false, error: 'Brand slug already exists' }
  }

  cms.brands.push(brand)
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: brand, cms }
}

export async function updateBrand(originalSlug: string, brandInput: Brand): Promise<CmsActionResult<Brand>> {
  const brand = normalizeBrand(brandInput, originalSlug)
  if (!brand || !originalSlug) return { ok: false, error: 'Invalid brand data' }

  const cms = await readCms()
  const index = cms.brands.findIndex((b) => b.slug === originalSlug)
  if (index === -1) return { ok: false, error: 'Brand not found' }

  if (!cms.brandCategories.some((c) => c.id === brand.categoryId)) {
    return { ok: false, error: 'Brand category not found' }
  }
  if (brand.slug !== originalSlug && cms.brands.some((b) => b.slug === brand.slug)) {
    return { ok: false, error: 'Brand slug already exists' }
  }

  cms.brands[index] = brand
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: brand, cms }
}

export async function deleteBrand(slug: string): Promise<CmsActionResult> {
  const cms = await readCms()
  cms.brands = cms.brands.filter((b) => b.slug !== slug)
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: undefined, cms }
}

function normalizePortfolio(body: PortfolioProject, fallbackSlug?: string): PortfolioProject | null {
  const title = body.title?.trim()
  if (!title) return null

  const slug = body.slug?.trim() ? slugify(body.slug) : fallbackSlug || slugify(title)

  return {
    ...body,
    slug,
    title,
    label: body.label?.trim() || '',
    image: body.image?.trim() || '',
    excerpt: body.excerpt?.trim() || '',
    body: body.body?.length ? body.body : [''],
    client: body.client?.trim() || '',
    location: body.location?.trim() || '',
    year: body.year?.trim() || '',
  }
}

export async function createPortfolioProject(
  input: PortfolioProject,
): Promise<CmsActionResult<PortfolioProject>> {
  const project = normalizePortfolio(input)
  if (!project) return { ok: false, error: 'Title is required' }

  const cms = await readCms()
  if (cms.portfolio.some((p) => p.slug === project.slug)) {
    return { ok: false, error: 'Project slug already exists' }
  }

  cms.portfolio.push(project)
  return persistCms(cms, project)
}

export async function updatePortfolioProject(
  originalSlug: string,
  input: PortfolioProject,
): Promise<CmsActionResult<PortfolioProject>> {
  const project = normalizePortfolio(input, originalSlug)
  if (!project || !originalSlug) return { ok: false, error: 'Invalid project data' }

  const cms = await readCms()
  const index = cms.portfolio.findIndex((p) => p.slug === originalSlug)
  if (index === -1) return { ok: false, error: 'Project not found' }

  if (project.slug !== originalSlug && cms.portfolio.some((p) => p.slug === project.slug)) {
    return { ok: false, error: 'Project slug already exists' }
  }

  cms.portfolio[index] = project
  return persistCms(cms, project)
}

export async function deletePortfolioProject(slug: string): Promise<CmsActionResult> {
  const cms = await readCms()
  cms.portfolio = cms.portfolio.filter((p) => p.slug !== slug)
  return persistCmsOnly(cms)
}

function normalizeReview(body: CustomerReview, fallbackSlug?: string): CustomerReview | null {
  const name = body.name?.trim()
  const quote = body.quote?.trim()
  if (!name || !quote) return null

  const slug = body.slug?.trim() ? slugify(body.slug) : fallbackSlug || slugify(name)

  return {
    slug,
    name,
    role: body.role?.trim() || '',
    quote,
    image: body.image?.trim() || '',
  }
}

export async function createReview(input: CustomerReview): Promise<CmsActionResult<CustomerReview>> {
  const review = normalizeReview(input)
  if (!review) return { ok: false, error: 'Name and review text are required' }

  const cms = await readCms()
  if (cms.reviews.some((r) => r.slug === review.slug)) {
    return { ok: false, error: 'Review slug already exists' }
  }

  cms.reviews.push(review)
  return persistCms(cms, review)
}

export async function updateReview(
  originalSlug: string,
  input: CustomerReview,
): Promise<CmsActionResult<CustomerReview>> {
  const review = normalizeReview(input, originalSlug)
  if (!review || !originalSlug) return { ok: false, error: 'Invalid review data' }

  const cms = await readCms()
  const index = cms.reviews.findIndex((r) => r.slug === originalSlug)
  if (index === -1) return { ok: false, error: 'Review not found' }

  if (review.slug !== originalSlug && cms.reviews.some((r) => r.slug === review.slug)) {
    return { ok: false, error: 'Review slug already exists' }
  }

  cms.reviews[index] = review
  return persistCms(cms, review)
}

export async function deleteReview(slug: string): Promise<CmsActionResult> {
  const cms = await readCms()
  cms.reviews = cms.reviews.filter((r) => r.slug !== slug)
  return persistCmsOnly(cms)
}

function normalizeHeroBanner(body: HeroBanner, fallbackSlug?: string): HeroBanner | null {
  const title = body.title?.trim()
  const subtitle = body.subtitle?.trim()
  const image = body.image?.trim()
  if (!title || !subtitle || !image) return null

  const slug = body.slug?.trim() ? slugify(body.slug) : fallbackSlug || slugify(`${title}-${body.titleAccent || 'slide'}`)

  return {
    slug,
    position: Math.max(1, Number(body.position) || 1),
    image,
    badge: body.badge?.trim() || '',
    title,
    titleAccent: body.titleAccent?.trim() || '',
    subtitle,
  }
}

function sortHeroBanners(banners: HeroBanner[]) {
  return [...banners].sort((a, b) => a.position - b.position || a.slug.localeCompare(b.slug))
}

export async function createHeroBanner(input: HeroBanner): Promise<CmsActionResult<HeroBanner>> {
  const banner = normalizeHeroBanner(input)
  if (!banner) return { ok: false, error: 'Title, subtitle, and background image are required' }

  const cms = await readCms()
  if (cms.heroBanners.some((b) => b.slug === banner.slug)) {
    return { ok: false, error: 'Banner slug already exists' }
  }

  cms.heroBanners = sortHeroBanners([...cms.heroBanners, banner])
  return persistCms(cms, banner)
}

export async function updateHeroBanner(
  originalSlug: string,
  input: HeroBanner,
): Promise<CmsActionResult<HeroBanner>> {
  const banner = normalizeHeroBanner(input, originalSlug)
  if (!banner || !originalSlug) return { ok: false, error: 'Invalid banner data' }

  const cms = await readCms()
  const index = cms.heroBanners.findIndex((b) => b.slug === originalSlug)
  if (index === -1) return { ok: false, error: 'Banner not found' }

  if (banner.slug !== originalSlug && cms.heroBanners.some((b) => b.slug === banner.slug)) {
    return { ok: false, error: 'Banner slug already exists' }
  }

  cms.heroBanners[index] = banner
  cms.heroBanners = sortHeroBanners(cms.heroBanners)
  return persistCms(cms, banner)
}

export async function deleteHeroBanner(slug: string): Promise<CmsActionResult> {
  const cms = await readCms()
  cms.heroBanners = cms.heroBanners.filter((b) => b.slug !== slug)
  return persistCmsOnly(cms)
}

export async function updateBrochure(brochure: BrochureFile | null): Promise<CmsActionResult<BrochureFile | null>> {
  const cms = await readCms()

  if (brochure) {
    const url = brochure.url?.trim()
    const fileName = brochure.fileName?.trim()
    if (!url || !fileName) {
      return { ok: false, error: 'Brochure file is required' }
    }
    cms.brochure = {
      url,
      fileName,
      uploadedAt: brochure.uploadedAt || new Date().toISOString(),
    }
  } else {
    cms.brochure = null
  }

  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: cms.brochure, cms }
}

export async function updateSiteSettings(settingsInput: SiteSettings): Promise<CmsActionResult<SiteSettings>> {
  const cms = await readCms()
  cms.siteSettings = normalizeSiteSettings(settingsInput)
  await writeCms(cms)
  revalidatePublicPages()
  return { ok: true, data: cms.siteSettings, cms }
}
