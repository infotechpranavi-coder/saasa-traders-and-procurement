import { readCms } from '@/lib/cms'

export async function GET() {
  const data = await readCms()
  return Response.json(data)
}
