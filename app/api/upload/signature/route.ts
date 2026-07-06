import { isCmsEditorAuthenticated } from '@/lib/auth'
import {
  detectCmsUploadResourceTypeFromMeta,
  IMAGE_MAX_BYTES,
  VIDEO_MAX_BYTES,
} from '@/lib/cms-file-upload'
import { createCloudinaryUploadSignature, isCloudinaryConfigured } from '@/lib/cloudinary-storage'

export async function POST(request: Request) {
  if (!(await isCmsEditorAuthenticated())) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  if (!isCloudinaryConfigured()) {
    return Response.json({ ok: true, mode: 'local' as const })
  }

  try {
    const body = (await request.json()) as {
      originalName?: string
      fileSize?: number
      mimeType?: string
    }

    const originalName = body.originalName?.trim() || 'upload'
    const fileSize = typeof body.fileSize === 'number' ? body.fileSize : 0
    const mimeType = body.mimeType || ''

    const resourceType = detectCmsUploadResourceTypeFromMeta(originalName, mimeType)
    if (!resourceType) {
      return Response.json(
        { ok: false, error: 'Only JPEG, PNG, WebP, GIF images or MP4/WebM/MOV videos are allowed' },
        { status: 400 },
      )
    }

    const maxBytes = resourceType === 'video' ? VIDEO_MAX_BYTES : IMAGE_MAX_BYTES
    if (fileSize > maxBytes) {
      return Response.json(
        {
          ok: false,
          error: resourceType === 'video' ? 'Video must be 50 MB or smaller' : 'Image must be 25 MB or smaller',
        },
        { status: 400 },
      )
    }

    const signature = createCloudinaryUploadSignature({
      originalName,
      resourceType,
      subfolder: resourceType === 'video' ? 'videos' : 'images',
    })

    return Response.json({
      ok: true,
      mode: 'cloudinary' as const,
      ...signature,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to prepare upload'
    return Response.json({ ok: false, error: message }, { status: 500 })
  }
}
