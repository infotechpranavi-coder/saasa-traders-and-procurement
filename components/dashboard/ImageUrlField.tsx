'use client'

import { useState } from 'react'

interface ImageUrlFieldProps {
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  /** When true, only image files (no video). Default false. */
  imagesOnly?: boolean
}

export default function ImageUrlField({
  label,
  hint,
  value,
  onChange,
  imagesOnly = false,
}: ImageUrlFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const defaultHint =
    'Paste an image URL or path (e.g. https://… or /statsic/jcb.jpg), or upload a file from your computer.'

  const uploadFile = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = (await res.json()) as { ok?: boolean; url?: string; error?: string }
      if (!res.ok || !data.url) {
        setError(data.error || 'Upload failed')
        return
      }
      onChange(data.url)
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const accept = imagesOnly
    ? 'image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif'
    : 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,.mov'

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      <p className="mb-1.5 text-xs text-gray-500">{hint ?? defaultHint}</p>
      <input
        className="dashboard-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://… or /statsic/jcb.jpg"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <label className="dashboard-btn-secondary cursor-pointer text-xs">
          {uploading ? 'Uploading…' : 'Upload from computer'}
          <input
            type="file"
            accept={accept}
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void uploadFile(file)
              e.target.value = ''
            }}
          />
        </label>
        {value && (
          <button type="button" className="dashboard-btn-secondary text-xs" onClick={() => onChange('')}>
            Clear
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-2 h-24 w-auto max-w-full rounded-lg border border-gray-200 object-cover" />
      )}
    </div>
  )
}
