import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'transhub_admin'

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'transhub2024'
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE)?.value === 'ok'
}
