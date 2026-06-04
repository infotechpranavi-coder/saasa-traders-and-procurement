import { cookies } from 'next/headers'
import { ADMIN_COOKIE, getAdminPassword } from '@/lib/auth'
import { readCms } from '@/lib/cms'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const password = typeof body.password === 'string' ? body.password : ''

  if (password !== getAdminPassword()) {
    return Response.json({ error: 'Invalid password' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  const cms = await readCms()
  return Response.json({ ok: true, cms })
}
