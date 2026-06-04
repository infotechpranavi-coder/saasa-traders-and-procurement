import { cookies } from 'next/headers'
import { ADMIN_COOKIE } from '@/lib/auth'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return Response.json({ ok: true })
}
