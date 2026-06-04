'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { ADMIN_COOKIE, getAdminPassword, isAdminAuthenticated } from '@/lib/auth'
import { readCms } from '@/lib/cms'
import {
  createCategory,
  createProduct,
  createService,
  createBlog,
  deleteCategory,
  deleteProduct,
  deleteService,
  deleteBlog,
  updateCategory,
  updateProduct,
  updateService,
  updateBlog,
} from '@/lib/cms-mutations'
import type { BlogPost, CategoryType, CmsData, Product, Service } from '@/types/cms'

async function requireAdmin(): Promise<boolean> {
  return isAdminAuthenticated()
}

export async function getDashboardData(): Promise<{ authenticated: boolean; cms: CmsData | null }> {
  const authenticated = await isAdminAuthenticated()
  if (!authenticated) {
    return { authenticated: false, cms: null }
  }
  const cms = await readCms()
  return { authenticated: true, cms }
}

export async function loginAction(password: string): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (password !== getAdminPassword()) {
    return { ok: false, error: 'Invalid password' }
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
  originalSlug?: string
): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = originalSlug
    ? await updateProduct(originalSlug, product)
    : await createProduct(product)

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
  isEdit?: boolean
}): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const cms = await readCms()
  const exists = cms.categories.some((c) => c.id === input.id)
  const result =
    input.isEdit && exists
      ? await updateCategory({ id: input.id, name: input.name, type: input.type })
      : await createCategory({ id: input.id, name: input.name, type: input.type })

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

  const result = originalSlug ? await updateBlog(originalSlug, blog) : await createBlog(blog)
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}

export async function removeBlogAction(slug: string): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await requireAdmin())) return { ok: false, error: 'Unauthorized' }

  const result = await deleteBlog(slug)
  if (!result.ok) return { ok: false, error: result.error }
  return { ok: true, cms: result.cms }
}
