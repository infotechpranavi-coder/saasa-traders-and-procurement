export type BulkImportKind = 'categories' | 'products' | 'services'

export interface BulkImportResult {
  added: number
  updated: number
  skipped: number
  errors: string[]
}

export function normalizeHeader(key: string): string {
  return key.trim().toLowerCase().replace(/\s+/g, '_')
}

export function cellString(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

/** Split list cells by | or ; or newline */
export function splitList(value: unknown): string[] {
  const raw = cellString(value)
  if (!raw) return []
  return raw
    .split(/\||;|\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function parseYesNo(value: unknown): boolean {
  const v = cellString(value).toLowerCase()
  return v === 'yes' || v === 'true' || v === '1' || v === 'y'
}

export function normalizeRowKeys(row: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(row)) {
    out[normalizeHeader(key)] = cellString(value)
  }
  return out
}
