import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'transhub_admin'

export function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME || 'admin'
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'admin123'
}

export function isValidAdminCredentials(username: string, password: string): boolean {
  return username === getAdminUsername() && password === getAdminPassword()
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE)?.value === 'ok'
}
