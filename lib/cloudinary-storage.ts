import path from 'path'
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'

export type CloudinaryResourceType = 'image' | 'video' | 'raw'

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  )
}

function ensureCloudinaryConfig() {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured')
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

function folderPrefix() {
  return (process.env.CLOUDINARY_FOLDER || 'transhub').replace(/^\/+|\/+$/g, '')
}

function safePublicId(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-')
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    originalName: string
    resourceType: CloudinaryResourceType
    subfolder?: string
  },
): Promise<{ url: string; publicId: string; resourceType: CloudinaryResourceType }> {
  ensureCloudinaryConfig()

  const ext = path.extname(options.originalName) || ''
  const base = safePublicId(path.basename(options.originalName, ext)) || 'upload'
  const folder = [folderPrefix(), options.subfolder].filter(Boolean).join('/')
  const publicId = `${Date.now()}-${base}`

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: options.resourceType,
        overwrite: false,
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error('Cloudinary upload failed'))
          return
        }
        resolve(uploadResult)
      },
    )
    stream.end(buffer)
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: options.resourceType,
  }
}

export async function uploadUrlToCloudinary(
  sourceUrl: string,
  options: {
    resourceType: CloudinaryResourceType
    subfolder?: string
    name: string
  },
): Promise<{ url: string; publicId: string }> {
  ensureCloudinaryConfig()

  const folder = [folderPrefix(), options.subfolder].filter(Boolean).join('/')
  const base = safePublicId(options.name) || 'asset'

  const result = await cloudinary.uploader.upload(sourceUrl, {
    folder,
    public_id: `${Date.now()}-${base}`,
    resource_type: options.resourceType,
    overwrite: false,
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

export async function deleteFromCloudinary(
  publicId: string | undefined,
  resourceType: CloudinaryResourceType = 'image',
) {
  if (!publicId || !isCloudinaryConfigured()) return

  ensureCloudinaryConfig()
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  } catch {
    // Asset may already be removed.
  }
}

export function cloudinaryPublicIdFromUrl(url: string | undefined): string | null {
  if (!url?.includes('res.cloudinary.com')) return null

  const parts = url.split('/upload/')
  if (parts.length < 2) return null

  const pathAfterUpload = parts[1].replace(/^v\d+\//, '')
  return pathAfterUpload.replace(/\.[a-zA-Z0-9]+$/, '') || null
}

export function cloudinaryResourceTypeFromUrl(url: string): CloudinaryResourceType {
  if (url.includes('/video/upload/')) return 'video'
  if (url.includes('/raw/upload/')) return 'raw'
  return 'image'
}

export function createCloudinaryUploadSignature(options: {
  originalName: string
  resourceType: Extract<CloudinaryResourceType, 'image' | 'video'>
  subfolder?: string
}): {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
  publicId: string
  resourceType: Extract<CloudinaryResourceType, 'image' | 'video'>
} {
  ensureCloudinaryConfig()

  const ext = path.extname(options.originalName) || ''
  const base = safePublicId(path.basename(options.originalName, ext)) || 'upload'
  const folder = [folderPrefix(), options.subfolder].filter(Boolean).join('/')
  const publicId = `${Date.now()}-${base}`
  const timestamp = Math.round(Date.now() / 1000)

  const paramsToSign = {
    timestamp,
    folder,
    public_id: publicId,
  }

  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET!)

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    timestamp,
    signature,
    folder,
    publicId,
    resourceType: options.resourceType,
  }
}
