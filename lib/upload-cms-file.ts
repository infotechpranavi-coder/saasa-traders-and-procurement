export async function uploadCmsFile(
  file: File,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = (await res.json()) as { ok?: boolean; url?: string; error?: string }
    if (!res.ok || !data.url) {
      return { ok: false, error: data.error || 'Upload failed' }
    }
    return { ok: true, url: data.url }
  } catch {
    return { ok: false, error: 'Upload failed' }
  }
}

export const CMS_IMAGE_ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif'
