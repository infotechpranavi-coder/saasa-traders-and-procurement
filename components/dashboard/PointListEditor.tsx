'use client'

interface PointListEditorProps {
  label: string
  hint?: string
  items: string[]
  onChange: (items: string[]) => void
  addLabel?: string
  placeholder?: string
}

export default function PointListEditor({
  label,
  hint,
  items,
  onChange,
  addLabel = 'Add point',
  placeholder,
}: PointListEditorProps) {
  const rows = items.length > 0 ? items : []

  const updateAt = (index: number, value: string) => {
    const next = [...rows]
    next[index] = value
    onChange(next)
  }

  const removeAt = (index: number) => {
    onChange(rows.filter((_, i) => i !== index))
  }

  const addPoint = () => {
    onChange([...rows, ''])
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {hint && <p className="mb-1.5 text-xs text-gray-500">{hint}</p>}
      {rows.length > 0 && (
        <div className="space-y-2 mb-2">
          {rows.map((item, index) => (
            <div key={index} className="flex gap-2 items-start">
              <input
                className="dashboard-input flex-1"
                value={item}
                onChange={(e) => updateAt(index, e.target.value)}
                placeholder={placeholder}
              />
              <button
                type="button"
                className="dashboard-btn-secondary shrink-0 px-2.5 py-2 text-xs"
                onClick={() => removeAt(index)}
                aria-label={`Remove ${label} ${index + 1}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      <button type="button" className="dashboard-btn-secondary text-xs" onClick={addPoint}>
        + {addLabel}
      </button>
    </div>
  )
}
