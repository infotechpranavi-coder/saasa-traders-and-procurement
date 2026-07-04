import path from 'path'
import { isCmsEditorAuthenticated } from '@/lib/auth'
import { isCloudinaryConfigured, uploadToCloudinary } from '@/lib/cloudinary-storage'

const MAX_BYTES = 15 * 1024 * 1024

function isPdf(file: File) {
  const ext = path.extname(file.name).toLowerCase()
  return (
    ext === '.pdf' ||
    file.type === 'application/pdf' ||
    file.type === 'application/x-pdf' ||
    (file.type === 'application/octet-stream' && ext === '.pdf')
  )
}

export async function POST(request: Request) {
  if (!(await isCmsEditorAuthenticated())) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  if (!isCloudinaryConfigured()) {
    return Response.json({ ok: false, error: 'Cloudinary is not configured in .env' }, { status: 503 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return Response.json({ ok: false, error: 'No file provided' }, { status: 400 })
    }

    if (!isPdf(file)) {
      return Response.json({ ok: false, error: 'Only PDF catalogs are allowed' }, { status: 400 })
    }

    if (file.size > MAX_BYTES) {
      return Response.json({ ok: false, error: 'Catalog PDF must be 15 MB or smaller' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const uploaded = await uploadToCloudinary(buffer, {
      originalName: file.name,
      resourceType: 'raw',
      subfolder: 'catalogs',
    })

    return Response.json({
      ok: true,
      url: uploaded.url,
      fileName: file.name,
      publicId: uploaded.publicId,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return Response.json({ ok: false, error: message }, { status: 500 })
  }
}
