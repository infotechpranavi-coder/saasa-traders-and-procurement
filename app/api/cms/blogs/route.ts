import { isAdminAuthenticated } from '@/lib/auth'
import { unauthorizedResponse } from '@/lib/api-auth'
import { createBlog, deleteBlog, updateBlog } from '@/lib/cms-mutations'
import type { BlogPost } from '@/types/cms'

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const body = (await request.json()) as BlogPost
  const result = await createBlog(body)
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.error.includes('exists') ? 409 : 400 })
  }
  return Response.json({ blog: result.data })
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const body = await request.json()
  const originalSlug = typeof body.originalSlug === 'string' ? body.originalSlug : ''
  const result = await updateBlog(originalSlug, body as BlogPost)
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.error === 'Blog not found' ? 404 : 400 })
  }
  return Response.json({ blog: result.data })
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const slug = new URL(request.url).searchParams.get('slug')
  if (!slug) return Response.json({ error: 'Slug is required' }, { status: 400 })

  const result = await deleteBlog(slug)
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 })
  return Response.json({ ok: true })
}
