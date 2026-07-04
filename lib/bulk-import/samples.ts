import * as XLSX from 'xlsx'
import type { BulkImportKind } from '@/lib/bulk-import/helpers'

const CATEGORY_SAMPLE = [
  {
    id: 'excavators',
    name: 'Excavators',
    type: 'product',
    description: 'Excavator parts and equipment',
    image: 'https://example.com/image.jpg',
    show_in_footer: 'no',
  },
]

const PRODUCT_SAMPLE = [
  {
    slug: 'hydraulic-pump-assemblies',
    title: 'Hydraulic Pump Assemblies',
    label: 'Excavator Parts',
    category_id: 'excavators',
    image: 'https://example.com/jcb.jpg',
    desc: 'Short catalog description for the product card.',
    specs: 'CAT · Komatsu | OEM & aftermarket',
    overview: 'First overview paragraph | Second overview paragraph',
    features: 'Feature one | Feature two',
    applications: 'Earthmoving | Demolition',
    show_on_homepage: 'yes',
  },
]

const SERVICE_SAMPLE = [
  {
    slug: 'construction-equipment',
    title: 'Construction Equipment Supply',
    category_id: 'construction',
    image: 'https://example.com/service.jpg',
    summary: 'Short summary for service cards.',
    overview: 'Overview paragraph one | Overview paragraph two',
    capabilities: 'Excavators | Loaders | Spare parts',
    industries: 'Civil construction | Mining',
    show_on_homepage: 'yes',
    show_in_footer: 'no',
  },
]

const SHEET_DATA: Record<BulkImportKind, Record<string, string>[]> = {
  categories: CATEGORY_SAMPLE,
  products: PRODUCT_SAMPLE,
  services: SERVICE_SAMPLE,
}

const INSTRUCTIONS: Record<BulkImportKind, string[][]> = {
  categories: [
    ['Column', 'Required', 'Notes'],
    ['id', 'yes', 'Unique id (or leave blank to auto from name)'],
    ['name', 'yes', 'Display name'],
    ['type', 'yes', 'product | service | both'],
    ['description', 'no', 'Optional text'],
    ['image', 'no', 'Image URL or /statsic/jcb.jpg — leave blank to add later in dashboard'],
    ['show_in_footer', 'no', 'yes or no'],
  ],
  products: [
    ['Column', 'Required', 'Notes'],
    ['slug', 'no', 'URL slug — auto from title if blank'],
    ['title', 'yes', 'Product name'],
    ['label', 'no', 'Badge label on detail page'],
    ['category_id', 'no', 'Must match a category id'],
    ['image', 'no', 'Image URL or path — leave blank to upload later'],
    ['desc', 'no', 'Short description for catalog grid'],
    ['specs', 'no', 'Separate items with |'],
    ['overview', 'no', 'Paragraphs separated by |'],
    ['features', 'no', 'Items separated by |'],
    ['applications', 'no', 'Items separated by |'],
    ['show_on_homepage', 'no', 'yes or no'],
  ],
  services: [
    ['Column', 'Required', 'Notes'],
    ['slug', 'no', 'URL slug — auto from title if blank'],
    ['title', 'yes', 'Service name'],
    ['category_id', 'no', 'Must match a category id'],
    ['image', 'no', 'Image URL or path — leave blank to upload later'],
    ['summary', 'no', 'Short summary'],
    ['overview', 'no', 'Paragraphs separated by |'],
    ['capabilities', 'no', 'Items separated by |'],
    ['industries', 'no', 'Items separated by |'],
    ['show_on_homepage', 'no', 'yes or no'],
    ['show_in_footer', 'no', 'yes or no'],
  ],
}

export function buildSampleWorkbook(kind: BulkImportKind): Buffer {
  const wb = XLSX.utils.book_new()
  const dataSheet = XLSX.utils.json_to_sheet(SHEET_DATA[kind])
  XLSX.utils.book_append_sheet(wb, dataSheet, 'Data')
  const helpSheet = XLSX.utils.aoa_to_sheet(INSTRUCTIONS[kind])
  XLSX.utils.book_append_sheet(wb, helpSheet, 'Instructions')
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}

export function sampleFileName(kind: BulkImportKind): string {
  return `saasa-b2e-${kind}-import-sample.xlsx`
}
