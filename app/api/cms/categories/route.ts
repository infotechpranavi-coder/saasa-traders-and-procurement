import { isAdminAuthenticated } from '@/lib/auth'
import { unauthorizedResponse } from '@/lib/api-auth'
import { createCategory, deleteCategory, updateCategory } from '@/lib/cms-mutations'
import type { CategoryType } from '@/types/cms'

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const body = await request.json()
  const name = typeof body.name === 'string' ? body.name : ''
  const type = (body.type as CategoryType) || 'product'
  const id = typeof body.id === 'string' ? body.id : undefined

  const result = await createCategory({ id, name, type })
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.error.includes('exists') ? 409 : 400 })
  }
  return Response.json({ category: result.data })
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const body = await request.json()
  const id = typeof body.id === 'string' ? body.id : ''
  const name = typeof body.name === 'string' ? body.name : ''
  const type = (body.type as CategoryType) || 'product'

  const result = await updateCategory({ id, name, type })
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.error === 'Category not found' ? 404 : 400 })
  }
  return Response.json({ category: result.data })
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const id = new URL(request.url).searchParams.get('id')
  if (!id) return Response.json({ error: 'Id is required' }, { status: 400 })

  const result = await deleteCategory(id)
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 })
  return Response.json({ ok: true })
}
