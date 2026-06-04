import { ADMIN_COOKIE } from '@/lib/auth'

export function isAdminRequest(request: Request): boolean {
  const cookie = request.headers.get('cookie') || ''
  return cookie.includes(`${ADMIN_COOKIE}=ok`)
}

export function unauthorizedResponse() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
