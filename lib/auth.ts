import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'transhub_admin'
export const SUPERADMIN_COOKIE = 'transhub_superadmin'

export function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME || 'admin'
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'admin123'
}

export function getSuperAdminUsername(): string {
  return process.env.SUPERADMIN_USERNAME || 'superadmin'
}

export function getSuperAdminPassword(): string {
  return process.env.SUPERADMIN_PASSWORD || 'superadmin123'
}

export function isValidAdminCredentials(username: string, password: string): boolean {
  return username === getAdminUsername() && password === getAdminPassword()
}

export function isValidSuperAdminCredentials(username: string, password: string): boolean {
  return username === getSuperAdminUsername() && password === getSuperAdminPassword()
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE)?.value === 'ok'
}

export async function isSuperAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(SUPERADMIN_COOKIE)?.value === 'ok'
}

/** Admin dashboard or superadmin session (for CMS writes from superadmin page). */
export async function isCmsEditorAuthenticated(): Promise<boolean> {
  return (await isAdminAuthenticated()) || (await isSuperAdminAuthenticated())
}
