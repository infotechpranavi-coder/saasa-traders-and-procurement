import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { isAdminAuthenticated } from '@/lib/auth'

const MAX_BYTES = 15 * 1024 * 1024
const ALLOWED_TYPES = new Set(['application/pdf'])

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
      const ext = path.extname(file.name).toLowerCase()
      if (ext !== '.pdf' && file.type !== 'application/octet-stream') {
        return Response.json({ ok: false, error: 'Only PDF brochures are allowed' }, { status: 400 })
      }
    }

    if (file.size > MAX_BYTES) {
      return Response.json({ ok: false, error: 'Brochure must be 15 MB or smaller' }, { status: 400 })
    }

    const ext = path.extname(file.name).toLowerCase() || '.pdf'
    const base = safeName(path.basename(file.name, ext)) || 'brochure'
    const filename = `${Date.now()}-${base}${ext}`
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'brochures')
    await mkdir(uploadsDir, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(uploadsDir, filename), buffer)

    return Response.json({
      ok: true,
      url: `/uploads/brochures/${filename}`,
      fileName: file.name,
    })
  } catch {
    return Response.json({ ok: false, error: 'Upload failed' }, { status: 500 })
  }
}
