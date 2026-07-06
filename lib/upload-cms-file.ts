import { uploadCmsFileAction } from '@/app/upload/actions'

type CloudinarySignatureResponse =
  | { ok: true; mode: 'cloudinary'; cloudName: string; apiKey: string; timestamp: number; signature: string; folder: string; publicId: string; resourceType: 'image' | 'video' }
  | { ok: true; mode: 'local' }
  | { ok: false; error?: string }

async function uploadViaCloudinaryDirect(file: File): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const sigRes = await fetch('/api/upload/signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originalName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    }),
  })

  if (sigRes.status === 413) {
    return { ok: false, error: 'File is too large for the server upload limit. Try a smaller image or contact support.' }
  }

  let sigData: CloudinarySignatureResponse
  try {
    sigData = (await sigRes.json()) as CloudinarySignatureResponse
  } catch {
    return { ok: false, error: 'Upload failed' }
  }

  if (!sigRes.ok || !sigData.ok) {
    return { ok: false, error: sigData.ok === false ? sigData.error || 'Upload failed' : 'Upload failed' }
  }

  if (sigData.mode === 'local') {
    return uploadViaServerAction(file)
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', sigData.apiKey)
  formData.append('timestamp', String(sigData.timestamp))
  formData.append('signature', sigData.signature)
  formData.append('folder', sigData.folder)
  formData.append('public_id', sigData.publicId)

  const cloudRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sigData.cloudName}/${sigData.resourceType}/upload`,
    { method: 'POST', body: formData },
  )

  const cloudData = (await cloudRes.json()) as { secure_url?: string; error?: { message?: string } }
  if (!cloudRes.ok || !cloudData.secure_url) {
    return { ok: false, error: cloudData.error?.message || 'Cloudinary upload failed' }
  }

  return { ok: true, url: cloudData.secure_url }
}

async function uploadViaServerAction(file: File): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const result = await uploadCmsFileAction(formData)
  if (!result.ok) {
    if (result.error.toLowerCase().includes('body exceeded')) {
      return { ok: false, error: 'File is too large for server upload (max 25 MB). Configure Cloudinary in .env for larger files.' }
    }
    return result
  }
  return result
}

export async function uploadCmsFile(
  file: File,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    return await uploadViaCloudinaryDirect(file)
  } catch {
    return { ok: false, error: 'Upload failed' }
  }
}

export const CMS_IMAGE_ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif'
