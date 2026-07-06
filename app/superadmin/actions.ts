'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
  SUPERADMIN_COOKIE,
  isSuperAdminAuthenticated,
  isValidSuperAdminCredentials,
} from '@/lib/auth'
import { readCms } from '@/lib/cms'
import type { BulkImportKind } from '@/lib/bulk-import/helpers'
import { importCmsFromExcel } from '@/lib/bulk-import/import-cms'
import { buildSampleWorkbook, sampleFileName } from '@/lib/bulk-import/samples'
import { updateSiteSettings } from '@/lib/cms-mutations'
import type { CmsData, SiteSettings } from '@/types/cms'

export async function getSuperAdminData(): Promise<{ authenticated: boolean; cms: CmsData | null }> {
  const authenticated = await isSuperAdminAuthenticated()
  if (!authenticated) {
    return { authenticated: false, cms: null }
  }
  const cms = await readCms()
  return { authenticated: true, cms }
}

export async function loginSuperAdminAction(
  username: string,
  password: string,
): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!isValidSuperAdminCredentials(username.trim(), password)) {
    return { ok: false, error: 'Invalid superadmin credentials' }
  }

  const cookieStore = await cookies()
  cookieStore.set(SUPERADMIN_COOKIE, 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  const cms = await readCms()
  revalidatePath('/superadmin')
  return { ok: true, cms }
}

export async function logoutSuperAdminAction(): Promise<{ ok: boolean }> {
  const cookieStore = await cookies()
  cookieStore.set(SUPERADMIN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  revalidatePath('/superadmin')
  return { ok: true }
}

export async function downloadSampleExcelAction(
  kind: BulkImportKind,
): Promise<{ ok: boolean; error?: string; base64?: string; fileName?: string }> {
  if (!(await isSuperAdminAuthenticated())) {
    return { ok: false, error: 'Unauthorized' }
  }

  try {
    const buffer = buildSampleWorkbook(kind)
    return {
      ok: true,
      base64: buffer.toString('base64'),
      fileName: sampleFileName(kind),
    }
  } catch {
    return { ok: false, error: 'Failed to generate sample file' }
  }
}

export async function importBulkExcelAction(
  kind: BulkImportKind,
  formData: FormData,
): Promise<{
  ok: boolean
  error?: string
  cms?: CmsData
  added?: number
  updated?: number
  skipped?: number
  errors?: string[]
}> {
  if (!(await isSuperAdminAuthenticated())) {
    return { ok: false, error: 'Unauthorized' }
  }

  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return { ok: false, error: 'No Excel file selected' }
  }

  const name = file.name.toLowerCase()
  if (!name.endsWith('.xlsx') && !name.endsWith('.xls')) {
    return { ok: false, error: 'Please upload an Excel file (.xlsx or .xls)' }
  }

  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: 'File must be 5 MB or smaller' }
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const { cms, result } = await importCmsFromExcel(kind, buffer)
    return {
      ok: true,
      cms,
      added: result.added,
      updated: result.updated,
      skipped: result.skipped,
      errors: result.errors.slice(0, 20),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Import failed'
    return { ok: false, error: message }
  }
}

export async function saveSiteSettingsAction(
  settings: SiteSettings,
): Promise<{ ok: boolean; error?: string; cms?: CmsData }> {
  if (!(await isSuperAdminAuthenticated())) {
    return { ok: false, error: 'Unauthorized' }
  }

  const result = await updateSiteSettings(settings)
  if (!result.ok) return { ok: false, error: result.error }
  revalidatePath('/')
  revalidatePath('/superadmin')
  return { ok: true, cms: result.cms }
}
