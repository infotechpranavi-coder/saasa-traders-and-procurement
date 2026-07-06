'use server'

import { unlink } from 'fs/promises'
import path from 'path'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { revalidatePublicPages } from '@/lib/revalidate-public'
import { ADMIN_COOKIE, isValidAdminCredentials, isAdminAuthenticated, isCmsEditorAuthenticated } from '@/lib/auth'
import { readCms, getBrochure } from '@/lib/cms'
import { getEnquiryById, listEnquiries, listNewsletterSubscribers, removeNewsletterSubscriber } from '@/lib/leads-db'
import {
  cloudinaryPublicIdFromUrl,
  cloudinaryResourceTypeFromUrl,
  deleteFromCloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
} from '@/lib/cloudinary-storage'
import {
  createCategory,
  createProduct,
  createService,
  createBlog,
  createBrand,
  createBrandCategory,
  createHeroBanner,
  createPortfolioProject,
  createReview,
  deleteCategory,
  deleteProduct,
  deleteService,
  deleteBlog,
  deleteBrand,
  deleteBrandCategory,
  deleteHeroBanner,
  deletePortfolioProject,
  deleteReview,
  updateBrochure,
  updateCategory,
  updateProduct,
  updateService,
  updateBlog,
  updateBrand,
  updateBrandCategory,
  updateHeroBanner,
  updatePortfolioProject,
  updateReview,
} from '@/lib/cms-mutations'
import type { BlogPost, Brand, BrandCategory, CategoryType, CmsData, CustomerReview, HeroBanner, PortfolioProject, Product, Service, BrochureFile } from '@/types/cms'
import type { EnquiryRecord, NewsletterSubscriber } from '@/types/leads'
import { sendBrochureEmail, sendEnquiryNotification } from '@/lib/email/resend-mail'

async function requireAdmin(): Promise<boolean> {
  return isCmsEditorAuthenticated()
}

export async function getDashboardData(): Promise<{ authenticated: boolean; cms: CmsData | null }> {
  const authenticated = await isAdminAuthenticated()
  if (!authenticated) {
    return { authenticated: false, cms: null }
  }
  const cms = await readCms()
  return { authenticated: true, cms }
}

export async function loginAction(
  username: string,
  password: string,
): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!isValidAdminCredentials(username.trim(), password)) {
    return { ok: false, error: 'Invalid username or password' }
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  const cms = await readCms()
  revalidatePath('/dashboard')
  return { ok: true, cms }
}

export async function logoutAction(): Promise<{ ok: boolean }> {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  revalidatePath('/dashboard')
  return { ok: true }
}

export async function saveProductAction(
  product: Product,
  originalSlug?: string,
  linkedBrandSlugs?: string[],
): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = originalSlug
    ? await updateProduct(originalSlug, product, linkedBrandSlugs)
    : await createProduct(product, linkedBrandSlugs)

  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function removeProductAction(slug: string): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = await deleteProduct(slug)
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function saveServiceAction(
  service: Service,
  originalSlug?: string
): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = originalSlug
    ? await updateService(originalSlug, service)
    : await createService(service)

  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function removeServiceAction(slug: string): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = await deleteService(slug)
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function saveCategoryAction(input: {
  id: string
  name: string
  type: CategoryType
  description?: string
  image?: string
  showInFooter?: boolean
  isEdit?: boolean
}): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const payload = {
    id: input.id,
    name: input.name,
    type: input.type,
    description: input.description,
    image: input.image,
    showInFooter: input.showInFooter,
  }
  const result = input.isEdit ? await updateCategory(payload) : await createCategory(payload)

  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function removeCategoryAction(id: string): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = await deleteCategory(id)
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function saveBlogAction(
  blog: BlogPost,
  originalSlug?: string
): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  try {
    const result = originalSlug ? await updateBlog(originalSlug, blog) : await createBlog(blog)
    if (!result.ok) return { ok: false, error: result.error }
    return { ok: true, cms: result.cms }
  } catch {
    return { ok: false, error: 'Failed to save blog post' }
  }
}

export async function removeBlogAction(slug: string): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = await deleteBlog(slug)
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function saveBrandCategoryAction(input: {
  id: string
  name: string
  isEdit?: boolean
}): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = input.isEdit
    ? await updateBrandCategory({ id: input.id, name: input.name })
    : await createBrandCategory({ id: input.id?.trim() || undefined, name: input.name })

  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function removeBrandCategoryAction(id: string): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = await deleteBrandCategory(id)
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function saveBrandAction(
  brand: Brand,
  originalSlug?: string,
): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = originalSlug ? await updateBrand(originalSlug, brand) : await createBrand(brand)
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function removeBrandAction(slug: string): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = await deleteBrand(slug)
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function savePortfolioAction(
  project: PortfolioProject,
  originalSlug?: string,
): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  try {
    const result = originalSlug
      ? await updatePortfolioProject(originalSlug, project)
      : await createPortfolioProject(project)

    if (!result.ok) return { ok: false, error: result.error }
    return { ok: true, cms: result.cms }
  } catch {
    return { ok: false, error: 'Failed to save project' }
  }
}

export async function removePortfolioAction(
  slug: string,
): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = await deletePortfolioProject(slug)
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function saveReviewAction(
  review: CustomerReview,
  originalSlug?: string,
): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  try {
    const result = originalSlug ? await updateReview(originalSlug, review) : await createReview(review)
    if (!result.ok) return { ok: false, error: result.error }
    return { ok: true, cms: result.cms }
  } catch {
    return { ok: false, error: 'Failed to save review' }
  }
}

export async function removeReviewAction(slug: string): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = await deleteReview(slug)
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function saveHeroBannerAction(
  banner: HeroBanner,
  originalSlug?: string,
): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  try {
    const result = originalSlug ? await updateHeroBanner(originalSlug, banner) : await createHeroBanner(banner)
    if (!result.ok) return { ok: false, error: result.error }
    return { ok: true, cms: result.cms }
  } catch {
    return { ok: false, error: 'Failed to save hero banner' }
  }
}

export async function removeHeroBannerAction(slug: string): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = await deleteHeroBanner(slug)
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function saveBrochureAction(
  brochure: BrochureFile,
): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = await updateBrochure(brochure)
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

async function deleteBrochureAsset(brochure: { url?: string; publicId?: string } | null | undefined) {
  if (!brochure) return

  if (brochure.publicId || brochure.url?.includes('res.cloudinary.com')) {
    const publicId = brochure.publicId ?? cloudinaryPublicIdFromUrl(brochure.url) ?? undefined
    const resourceType = brochure.url ? cloudinaryResourceTypeFromUrl(brochure.url) : 'raw'
    await deleteFromCloudinary(publicId, resourceType)
    return
  }

  if (brochure.url?.startsWith('/uploads/brochures/')) {
    const filePath = path.join(process.cwd(), 'public', brochure.url.replace(/^\//, ''))
    try {
      await unlink(filePath)
    } catch {
      // File may already be missing.
    }
  }
}

export async function removeBrochureAction(): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const cms = await readCms()
  const oldBrochure = cms.brochure

  const result = await updateBrochure(null)
  if (!result.ok) return { ok: false, error: result.error }

  await deleteBrochureAsset(oldBrochure)
  revalidatePublicPages()
  return { ok: true, cms: result.cms }
}

export async function uploadBrochureFormAction(
  formData: FormData,
): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return { ok: false, error: 'No file selected' }
  }

  const ext = path.extname(file.name).toLowerCase()
  const isPdf =
    ext === '.pdf' ||
    file.type === 'application/pdf' ||
    file.type === 'application/x-pdf' ||
    (file.type === 'application/octet-stream' && ext === '.pdf')

  if (!isPdf) {
    return { ok: false, error: 'Please upload a PDF file (.pdf)' }
  }

  if (file.size > 15 * 1024 * 1024) {
    return { ok: false, error: 'Catalog PDF must be 15 MB or smaller' }
  }

  if (!isCloudinaryConfigured()) {
    return { ok: false, error: 'Cloudinary is not configured in .env' }
  }

  try {
    const cms = await readCms()
    const oldBrochure = cms.brochure
    const buffer = Buffer.from(await file.arrayBuffer())

    const uploaded = await uploadToCloudinary(buffer, {
      originalName: file.name,
      resourceType: 'raw',
      subfolder: 'catalogs',
    })

    const result = await updateBrochure({
      url: uploaded.url,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      publicId: uploaded.publicId,
    })

    if (!result.ok) return { ok: false, error: result.error }

    if (oldBrochure && oldBrochure.url !== uploaded.url) {
      await deleteBrochureAsset(oldBrochure)
    }

    revalidatePublicPages()
    return { ok: true, cms: result.cms }
  } catch {
    return { ok: false, error: 'Failed to save brochure file' }
  }
}

export async function getEnquiriesAction(): Promise<{ ok: boolean; error?: string; enquiries?: EnquiryRecord[] }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  try {
    const enquiries = await listEnquiries()
    return { ok: true, enquiries }
  } catch {
    return { ok: false, error: 'Failed to load enquiries' }
  }
}

export async function getNewsletterSubscribersAction(): Promise<{
  ok: boolean
  error?: string
  subscribers?: NewsletterSubscriber[]
}> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  try {
    const subscribers = await listNewsletterSubscribers()
    return { ok: true, subscribers }
  } catch {
    return { ok: false, error: 'Failed to load newsletter subscribers' }
  }
}

export async function removeNewsletterSubscriberAction(
  email: string,
): Promise<{ ok: boolean; error?: string; subscribers?: NewsletterSubscriber[] }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  try {
    const removed = await removeNewsletterSubscriber(email)
    if (!removed) return { ok: false, error: 'Subscriber not found' }
    const subscribers = await listNewsletterSubscribers()
    return { ok: true, subscribers }
  } catch {
    return { ok: false, error: 'Failed to remove subscriber' }
  }
}

export async function resendBrochureToCustomerAction(
  enquiryId: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const enquiry = await getEnquiryById(enquiryId)
  if (!enquiry || enquiry.type !== 'brochure') {
    return { ok: false, error: 'Brochure enquiry not found' }
  }
  if (!enquiry.email?.trim()) {
    return { ok: false, error: 'This enquiry has no customer email' }
  }

  const brochure = await getBrochure()
  if (!brochure?.url) return { ok: false, error: 'Catalog PDF is not configured' }

  try {
    const sent = await sendBrochureEmail({
      to: enquiry.email,
      name: enquiry.name,
      brochure,
    })
    return sent ? { ok: true } : { ok: false, error: 'Failed to send catalog email' }
  } catch {
    return { ok: false, error: 'Failed to send catalog email' }
  }
}

export async function resendBrochureAdminNotifyAction(
  enquiryId: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const enquiry = await getEnquiryById(enquiryId)
  if (!enquiry || enquiry.type !== 'brochure') {
    return { ok: false, error: 'Brochure enquiry not found' }
  }

  try {
    const sent = await sendEnquiryNotification(enquiry)
    return sent ? { ok: true } : { ok: false, error: 'Failed to notify admin' }
  } catch {
    return { ok: false, error: 'Failed to notify admin' }
  }
}
