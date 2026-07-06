'use server'

import { isCmsEditorAuthenticated } from '@/lib/auth'
import { processCmsFileUpload } from '@/lib/cms-file-upload'

export async function uploadCmsFileAction(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!(await isCmsEditorAuthenticated())) {
    return { ok: false, error: 'Unauthorized' }
  }

  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return { ok: false, error: 'No file provided' }
  }

  try {
    const result = await processCmsFileUpload(file)
    if (!result.ok) return result
    return { ok: true, url: result.url }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return { ok: false, error: message }
  }
}
