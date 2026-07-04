'use client'

import { useState } from 'react'
import { uploadCmsFile, CMS_IMAGE_ACCEPT } from '@/lib/upload-cms-file'

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
    const result = await uploadCmsFile(file)
    if (result.ok) onChange(result.url)
    else setError(result.error)
    setUploading(false)
  }

  const accept = imagesOnly
    ? CMS_IMAGE_ACCEPT
    : `${CMS_IMAGE_ACCEPT},video/mp4,video/webm,video/quicktime,.mov`

  return (
    <div>
      {label ? (
        <>
          <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
          <p className="mb-1.5 text-xs text-gray-500">{hint ?? defaultHint}</p>
        </>
      ) : null}
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
