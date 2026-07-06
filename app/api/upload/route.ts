import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary-storage'
import path from 'path'
import fs from 'fs/promises'
import { randomUUID } from 'crypto'
import { isCmsEditorAuthenticated } from '@/lib/auth'

const IMAGE_MAX_BYTES = 25 * 1024 * 1024
const VIDEO_MAX_BYTES = 50 * 1024 * 1024

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'])

type CloudinaryResourceType = 'image' | 'video'

function detectResourceType(file: File): CloudinaryResourceType | null {
  if (IMAGE_TYPES.has(file.type)) return 'image'
  if (VIDEO_TYPES.has(file.type)) return 'video'

  const ext = path.extname(file.name).toLowerCase()
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) return 'image'
  if (['.mp4', '.webm', '.mov', '.avi'].includes(ext)) return 'video'

  return null
}

async function saveToLocalUploads(
  buffer: Buffer,
  originalName: string,
  resourceType: CloudinaryResourceType,
): Promise<string> {
  const ext = path.extname(originalName).toLowerCase() || (resourceType === 'image' ? '.jpg' : '.mp4')
  const subfolder = resourceType === 'video' ? 'videos' : 'images'
  const filename = `${randomUUID()}${ext}`
  const dir = path.join(process.cwd(), 'public', 'uploads', subfolder)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, filename), buffer)
  return `/uploads/${subfolder}/${filename}`
}

export async function POST(request: Request) {
  if (!(await isCmsEditorAuthenticated())) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return Response.json({ ok: false, error: 'No file provided' }, { status: 400 })
    }

    const resourceType = detectResourceType(file)
    if (!resourceType) {
      return Response.json(
        { ok: false, error: 'Only JPEG, PNG, WebP, GIF images or MP4/WebM/MOV videos are allowed' },
        { status: 400 },
      )
    }

    const maxBytes = resourceType === 'video' ? VIDEO_MAX_BYTES : IMAGE_MAX_BYTES
    if (file.size > maxBytes) {
      return Response.json(
        {
          ok: false,
          error: resourceType === 'video' ? 'Video must be 50 MB or smaller' : 'Image must be 25 MB or smaller',
        },
        { status: 400 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    if (isCloudinaryConfigured()) {
      const uploaded = await uploadToCloudinary(buffer, {
        originalName: file.name,
        resourceType,
        subfolder: resourceType === 'video' ? 'videos' : 'images',
      })

      return Response.json({
        ok: true,
        url: uploaded.url,
        publicId: uploaded.publicId,
        resourceType: uploaded.resourceType,
      })
    }

    const localUrl = await saveToLocalUploads(buffer, file.name, resourceType)
    return Response.json({
      ok: true,
      url: localUrl,
      resourceType,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return Response.json({ ok: false, error: message }, { status: 500 })
  }
}
