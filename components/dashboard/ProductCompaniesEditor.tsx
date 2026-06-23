'use client'

import type { ProductCompany } from '@/types/cms'
import PointListEditor from './PointListEditor'

interface ProductCompaniesEditorProps {
  companies: ProductCompany[]
  onChange: (companies: ProductCompany[]) => void
}

export default function ProductCompaniesEditor({ companies, onChange }: ProductCompaniesEditorProps) {
  const updateCompany = (index: number, patch: Partial<ProductCompany>) => {
    const next = [...companies]
    next[index] = { ...next[index], ...patch }
    onChange(next)
  }

  const removeCompany = (index: number) => {
    onChange(companies.filter((_, i) => i !== index))
  }

  const addCompany = () => {
    onChange([...companies, { name: '', items: [] }])
  }

  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-gray-600">Companies</p>
      <p className="mb-3 text-xs text-gray-500">
        Each company appears as a card on the product page. The company name is the bold title (e.g. Lovol); equipment
        names show as tags underneath.
      </p>
      {companies.length > 0 && (
        <div className="mb-3 space-y-4">
          {companies.map((company, index) => (
            <div key={index} className="space-y-3 rounded-lg border border-gray-200 p-3">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Company name</label>
                  <input
                    className="dashboard-input"
                    value={company.name}
                    onChange={(e) => updateCompany(index, { name: e.target.value })}
                    placeholder="e.g. Lovol, Caterpillar"
                  />
                </div>
                <button
                  type="button"
                  className="dashboard-btn-secondary mt-5 shrink-0 px-2.5 py-2 text-xs"
                  onClick={() => removeCompany(index)}
                >
                  Remove
                </button>
              </div>
              <PointListEditor
                label="Equipment from this company"
                items={company.items}
                onChange={(items) => updateCompany(index, { items })}
                addLabel="Add equipment"
                placeholder="e.g. Wheel loaders"
              />
            </div>
          ))}
        </div>
      )}
      <button type="button" className="dashboard-btn-secondary text-xs" onClick={addCompany}>
        + Add company
      </button>
    </div>
  )
}
