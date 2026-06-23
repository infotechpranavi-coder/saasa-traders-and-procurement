import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { isAdminAuthenticated } from '@/lib/auth'

const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-')
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return Response.json({ ok: false, error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return Response.json({ ok: false, error: 'Only JPEG, PNG, WebP, or GIF images are allowed' }, { status: 400 })
    }

    if (file.size > MAX_BYTES) {
      return Response.json({ ok: false, error: 'Image must be 8 MB or smaller' }, { status: 400 })
    }

    const ext = path.extname(file.name) || '.jpg'
    const base = safeName(path.basename(file.name, ext)) || 'upload'
    const filename = `${Date.now()}-${base}${ext}`
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(uploadsDir, filename), buffer)

    return Response.json({ ok: true, url: `/uploads/${filename}` })
  } catch {
    return Response.json({ ok: false, error: 'Upload failed' }, { status: 500 })
  }
}
