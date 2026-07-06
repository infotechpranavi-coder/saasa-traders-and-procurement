import { isCmsEditorAuthenticated } from '@/lib/auth'
import { processCmsFileUpload } from '@/lib/cms-file-upload'

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

    const result = await processCmsFileUpload(file)
    if (!result.ok) {
      return Response.json({ ok: false, error: result.error }, { status: 400 })
    }

    return Response.json({
      ok: true,
      url: result.url,
      publicId: result.publicId,
      resourceType: result.resourceType,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return Response.json({ ok: false, error: message }, { status: 500 })
  }
}
