'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { ProductSpecItem } from '@/types/cms'

interface SpecificationsEditorProps {
  items?: ProductSpecItem[]
  onChange: (items: ProductSpecItem[]) => void
}

const COMMON_PRESETS = [
  'Operating Weight',
  'Engine Power',
  'Engine Model',
  'Bucket Capacity',
  'Dimensions',
  'Fuel Tank',
  'Max Reach / Depth',
  'Condition',
  'Warranty',
  'Origin / Make',
]

export default function SpecificationsEditor({
  items = [],
  onChange,
}: SpecificationsEditorProps) {
  const specs = Array.isArray(items) ? items : []

  const updateItem = (index: number, field: 'name' | 'value', val: string) => {
    const next = specs.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    onChange(next)
  }

  const removeItem = (index: number) => {
    onChange(specs.filter((_, i) => i !== index))
  }

  const addItem = (name = '', value = '') => {
    onChange([...specs, { name, value }])
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-700">Technical specifications</label>
        <p className="text-xs text-gray-500">
          Add named specification pairs (e.g. Operating Weight: 22,000 kg). These will be displayed in the specifications table on the product details page.
        </p>
      </div>

      {/* Preset shortcut chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-medium text-gray-400 mr-1">Quick add:</span>
        {COMMON_PRESETS.map((preset) => {
          const alreadyAdded = specs.some((s) => s.name.toLowerCase() === preset.toLowerCase())
          return (
            <button
              key={preset}
              type="button"
              disabled={alreadyAdded}
              onClick={() => addItem(preset, '')}
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                alreadyAdded
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                  : 'border-orange-200/80 bg-orange-50/60 text-primary hover:bg-orange-100 hover:border-orange-300'
              }`}
            >
              + {preset}
            </button>
          )
        })}
      </div>

      {/* Spec rows */}
      {specs.length > 0 ? (
        <div className="space-y-2 rounded-xl border border-gray-200/80 bg-slate-50/50 p-3">
          <div className="grid grid-cols-[1fr_1.2fr_36px] gap-2 px-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <span>Specification Name</span>
            <span>Value</span>
            <span className="sr-only">Actions</span>
          </div>

          {specs.map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_1.2fr_36px] gap-2 items-center">
              <input
                type="text"
                placeholder="e.g. Operating Weight"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
                className="dashboard-input text-xs !py-2"
              />
              <input
                type="text"
                placeholder="e.g. 22,000 kg"
                value={item.value}
                onChange={(e) => updateItem(index, 'value', e.target.value)}
                className="dashboard-input text-xs !py-2"
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                aria-label={`Remove ${item.name || 'specification'}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center">
          <p className="text-xs text-gray-400">No specifications added yet. Use quick add above or click below.</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => addItem('', '')}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
      >
        <Plus className="h-3.5 w-3.5 text-gray-500" />
        Add specification row
      </button>
    </div>
  )
}
