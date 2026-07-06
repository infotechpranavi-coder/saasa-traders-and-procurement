import type { BrochureFile } from '@/types/cms'

export function brochureDownloadFilename(brochure: BrochureFile): string {
  const name = brochure.fileName?.trim()
  if (name) return name.endsWith('.pdf') ? name : `${name}.pdf`
  return 'SAASA-B2E-Catalog.pdf'
}
