'use client'

import { useState } from 'react'
import ImageUrlField from '@/components/dashboard/ImageUrlField'
import { CMS_IMAGE_ACCEPT, uploadCmsFile } from '@/lib/upload-cms-file'

interface MultiImageUrlFieldProps {
  label: string
  hint?: string
  images: string[]
  onChange: (images: string[]) => void
}

export default function MultiImageUrlField({ label, hint, images, onChange }: MultiImageUrlFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const updateAt = (index: number, value: string) => {
    const next = [...images]
    next[index] = value
    onChange(next)
  }

  const removeAt = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const moveAt = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= images.length) return
    const next = [...images]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const uploadFiles = async (files: FileList | File[]) => {
    setUploading(true)
    setError('')
    const added: string[] = []
    for (const file of Array.from(files)) {
      const result = await uploadCmsFile(file)
      if (result.ok) added.push(result.url)
      else setError(result.error)
    }
    if (added.length > 0) onChange([...images, ...added])
    setUploading(false)
  }

  const defaultHint =
    'First image is the cover shown in the catalog. Add more for the product gallery with thumbnails and full-size view.'

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
        <p className="text-xs text-gray-500">{hint ?? defaultHint}</p>
      </div>

      {images.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-4 text-xs text-gray-500">
          No images yet — paste a URL, upload from your computer, or add a row below.
        </p>
      )}

      {images.map((url, index) => (
        <div key={`product-image-${index}`} className="rounded-lg border border-gray-200 bg-gray-50/80 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-gray-600">
              {index === 0 ? 'Cover image' : `Gallery image ${index + 1}`}
            </span>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                className="dashboard-btn-secondary px-2 py-1 text-xs"
                disabled={index === 0}
                onClick={() => moveAt(index, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="dashboard-btn-secondary px-2 py-1 text-xs"
                disabled={index === images.length - 1}
                onClick={() => moveAt(index, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                className="dashboard-btn-secondary px-2 py-1 text-xs text-red-600"
                onClick={() => removeAt(index)}
              >
                Remove
              </button>
            </div>
          </div>
          <ImageUrlField
            label=""
            hint=""
            imagesOnly
            value={url}
            onChange={(v) => updateAt(index, v)}
          />
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="dashboard-btn-secondary text-xs"
          onClick={() => onChange([...images, ''])}
        >
          + Add image URL
        </button>
        <label className="dashboard-btn-secondary cursor-pointer text-xs">
          {uploading ? 'Uploading…' : 'Upload from computer'}
          <input
            type="file"
            accept={CMS_IMAGE_ACCEPT}
            multiple
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              const files = e.target.files
              if (files?.length) void uploadFiles(files)
              e.target.value = ''
            }}
          />
        </label>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
