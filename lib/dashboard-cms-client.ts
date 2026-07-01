import type { CmsData } from '@/types/cms'

export async function fetchCmsClient(): Promise<CmsData> {
  const response = await fetch('/api/cms', {
    method: 'GET',
    cache: 'no-store',
    credentials: 'same-origin',
  })

  if (!response.ok) {
    throw new Error('Failed to load CMS data')
  }

  return response.json() as Promise<CmsData>
}
