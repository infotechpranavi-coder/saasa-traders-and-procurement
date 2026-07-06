import path from 'path'
import fs from 'fs/promises'
import { randomUUID } from 'crypto'
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary-storage'

export const IMAGE_MAX_BYTES = 25 * 1024 * 1024
export const VIDEO_MAX_BYTES = 50 * 1024 * 1024

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'])

export type CmsUploadResourceType = 'image' | 'video'

export function detectCmsUploadResourceType(file: File): CmsUploadResourceType | null {
  return detectCmsUploadResourceTypeFromMeta(file.name, file.type)
}

export function detectCmsUploadResourceTypeFromMeta(
  originalName: string,
  mimeType: string,
): CmsUploadResourceType | null {
  if (IMAGE_TYPES.has(mimeType)) return 'image'
  if (VIDEO_TYPES.has(mimeType)) return 'video'

  const ext = path.extname(originalName).toLowerCase()
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) return 'image'
  if (['.mp4', '.webm', '.mov', '.avi'].includes(ext)) return 'video'

  return null
}

async function saveToLocalUploads(
  buffer: Buffer,
  originalName: string,
  resourceType: CmsUploadResourceType,
): Promise<string> {
  const ext = path.extname(originalName).toLowerCase() || (resourceType === 'image' ? '.jpg' : '.mp4')
  const subfolder = resourceType === 'video' ? 'videos' : 'images'
  const filename = `${randomUUID()}${ext}`
  const dir = path.join(process.cwd(), 'public', 'uploads', subfolder)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, filename), buffer)
  return `/uploads/${subfolder}/${filename}`
}

export async function processCmsFileUpload(
  file: File,
): Promise<{ ok: true; url: string; publicId?: string; resourceType: CmsUploadResourceType } | { ok: false; error: string }> {
  const resourceType = detectCmsUploadResourceType(file)
  if (!resourceType) {
    return {
      ok: false,
      error: 'Only JPEG, PNG, WebP, GIF images or MP4/WebM/MOV videos are allowed',
    }
  }

  const maxBytes = resourceType === 'video' ? VIDEO_MAX_BYTES : IMAGE_MAX_BYTES
  if (file.size > maxBytes) {
    return {
      ok: false,
      error: resourceType === 'video' ? 'Video must be 50 MB or smaller' : 'Image must be 25 MB or smaller',
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  if (isCloudinaryConfigured()) {
    const uploaded = await uploadToCloudinary(buffer, {
      originalName: file.name,
      resourceType,
      subfolder: resourceType === 'video' ? 'videos' : 'images',
    })

    return {
      ok: true,
      url: uploaded.url,
      publicId: uploaded.publicId,
      resourceType: uploaded.resourceType as CmsUploadResourceType,
    }
  }

  const localUrl = await saveToLocalUploads(buffer, file.name, resourceType)
  return { ok: true, url: localUrl, resourceType }
}
