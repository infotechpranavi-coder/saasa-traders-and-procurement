import * as XLSX from 'xlsx'
import { readCms, writeCms } from '@/lib/cms'
import { revalidatePublicPages } from '@/lib/revalidate-public'
import {
  type BulkImportKind,
  type BulkImportResult,
  normalizeRowKeys,
  parseYesNo,
  splitList,
} from '@/lib/bulk-import/helpers'
import { slugify } from '@/lib/slugify'
import type { Category, CategoryType, CmsData, Product, Service } from '@/types/cms'

function parseWorkbookRows(buffer: Buffer): Record<string, string>[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames.find((n) => n.toLowerCase() === 'data') ?? workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  if (!sheet) return []

  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  return raw.map(normalizeRowKeys).filter((row) => Object.values(row).some(Boolean))
}

function importCategories(cms: CmsData, rows: Record<string, string>[]): BulkImportResult {
  const result: BulkImportResult = { added: 0, updated: 0, skipped: 0, errors: [] }

  rows.forEach((row, index) => {
    const name = row.name
    if (!name) {
      result.skipped += 1
      result.errors.push(`Row ${index + 2}: name is required`)
      return
    }

    const type = (row.type || 'product') as CategoryType
    if (!['product', 'service', 'both'].includes(type)) {
      result.skipped += 1
      result.errors.push(`Row ${index + 2}: invalid type "${row.type}"`)
      return
    }

    const id = row.id ? slugify(row.id) : slugify(name)
    const category: Category = {
      id,
      name,
      type,
      description: row.description || undefined,
      image: row.image || undefined,
      showInFooter: parseYesNo(row.show_in_footer),
    }

    const existingIndex = cms.categories.findIndex((c) => c.id === id)
    if (existingIndex >= 0) {
      cms.categories[existingIndex] = { ...cms.categories[existingIndex], ...category }
      result.updated += 1
    } else {
      cms.categories.push(category)
      result.added += 1
    }
  })

  return result
}

function importProducts(cms: CmsData, rows: Record<string, string>[]): BulkImportResult {
  const result: BulkImportResult = { added: 0, updated: 0, skipped: 0, errors: [] }

  rows.forEach((row, index) => {
    const title = row.title
    if (!title) {
      result.skipped += 1
      result.errors.push(`Row ${index + 2}: title is required`)
      return
    }

    const slug = row.slug ? slugify(row.slug) : slugify(title)
    const product: Product = {
      slug,
      title,
      label: row.label || '',
      categoryId: row.category_id || undefined,
      image: row.image || '',
      desc: row.desc || '',
      specs: splitList(row.specs),
      overview: splitList(row.overview),
      features: splitList(row.features),
      applications: splitList(row.applications),
      companies: [],
      showOnHomepage: parseYesNo(row.show_on_homepage),
    }

    const existingIndex = cms.products.findIndex((p) => p.slug === slug)
    if (existingIndex >= 0) {
      const prev = cms.products[existingIndex]
      cms.products[existingIndex] = { ...prev, ...product, companies: prev.companies ?? [] }
      result.updated += 1
    } else {
      cms.products.push(product)
      result.added += 1
    }
  })

  return result
}

function importServices(cms: CmsData, rows: Record<string, string>[]): BulkImportResult {
  const result: BulkImportResult = { added: 0, updated: 0, skipped: 0, errors: [] }

  rows.forEach((row, index) => {
    const title = row.title
    if (!title) {
      result.skipped += 1
      result.errors.push(`Row ${index + 2}: title is required`)
      return
    }

    const slug = row.slug ? slugify(row.slug) : slugify(title)
    const service: Service = {
      slug,
      title,
      categoryId: row.category_id || undefined,
      image: row.image || '',
      summary: row.summary || '',
      overview: splitList(row.overview),
      capabilities: splitList(row.capabilities),
      industries: splitList(row.industries),
      showOnHomepage: parseYesNo(row.show_on_homepage),
      showInFooter: parseYesNo(row.show_in_footer),
    }

    const existingIndex = cms.services.findIndex((s) => s.slug === slug)
    if (existingIndex >= 0) {
      cms.services[existingIndex] = { ...cms.services[existingIndex], ...service }
      result.updated += 1
    } else {
      cms.services.push(service)
      result.added += 1
    }
  })

  return result
}

export async function importCmsFromExcel(
  kind: BulkImportKind,
  fileBuffer: Buffer,
): Promise<{ cms: CmsData; result: BulkImportResult }> {
  const rows = parseWorkbookRows(fileBuffer)
  if (rows.length === 0) {
    throw new Error('Excel file is empty or has no data rows on the "Data" sheet')
  }

  const cms = await readCms()
  let result: BulkImportResult

  if (kind === 'categories') result = importCategories(cms, rows)
  else if (kind === 'products') result = importProducts(cms, rows)
  else result = importServices(cms, rows)

  await writeCms(cms)
  revalidatePublicPages()

  return { cms, result }
}
