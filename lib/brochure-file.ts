import { promises as fs } from 'fs'
import path from 'path'
import type { BrochureFile } from '@/types/cms'

export class BrochureFileMissingError extends Error {
  constructor(message = 'Catalog PDF is not available on the server') {
    super(message)
    this.name = 'BrochureFileMissingError'
  }
}

/** Read catalog PDF bytes for email attachment. */
export async function readBrochurePdfBuffer(brochure: BrochureFile): Promise<Buffer> {
  const url = brochure.url?.trim()
  if (!url) throw new BrochureFileMissingError()

  if (url.startsWith('/')) {
    const filePath = path.join(process.cwd(), 'public', url.replace(/^\//, '').split('?')[0])
    try {
      return await fs.readFile(filePath)
    } catch {
      throw new BrochureFileMissingError()
    }
  }

  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) throw new BrochureFileMissingError()
    const arrayBuffer = await res.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    if (error instanceof BrochureFileMissingError) throw error
    throw new BrochureFileMissingError()
  }
}
