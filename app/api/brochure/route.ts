import { getBrochure } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function GET() {
  const brochure = await getBrochure()
  return Response.json(
    { brochure },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  )
}
