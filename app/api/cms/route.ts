import { readCms } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = await readCms()
  return Response.json(data, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
