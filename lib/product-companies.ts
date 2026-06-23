import type { ProductCompany } from '@/types/cms'

/** Parse dashboard lines: `Lovol | Trucks, Buses` */
export function parseProductCompanies(value: string): ProductCompany[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const pipeIndex = line.indexOf('|')
      if (pipeIndex === -1) {
        return { name: line.trim(), items: [] as string[] }
      }

      const name = line.slice(0, pipeIndex).trim()
      const items = line
        .slice(pipeIndex + 1)
        .split(/[,;]/)
        .map((item) => item.trim())
        .filter(Boolean)

      return { name, items }
    })
    .filter((company) => company.name)
}

export function formatProductCompanies(companies: ProductCompany[] = []): string {
  return companies
    .map((company) =>
      company.items.length > 0 ? `${company.name} | ${company.items.join(', ')}` : company.name,
    )
    .join('\n')
}

export function normalizeProductCompanies(companies?: ProductCompany[]): ProductCompany[] {
  if (!companies?.length) return []

  return companies
    .map((company) => ({
      name: company.name?.trim() || '',
      items: (company.items ?? []).map((item) => item.trim()).filter(Boolean),
    }))
    .filter((company) => company.name)
}
