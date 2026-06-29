'use client'

import { useState } from 'react'
import type { CmsData } from '@/types/cms'
import { removeBrochureAction, uploadBrochureFormAction } from '@/app/dashboard/actions'

interface BrochureDashboardSectionProps {
  cms: CmsData
  loading: boolean
  setLoading: (v: boolean) => void
  setCms: (cms: CmsData) => void
  showMsg: (msg: string) => void
}

export default function BrochureDashboardSection({
  cms,
  loading,
  setLoading,
  setCms,
  showMsg,
}: BrochureDashboardSectionProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const brochure = cms.brochure

  const uploadBrochure = async (file: File) => {
    setUploading(true)
    setError('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await uploadBrochureFormAction(formData)

      if (!result.ok || !result.cms) {
        setError(result.error || 'Upload failed')
        showMsg(result.error || 'Failed to upload brochure')
        return
      }

      setCms(result.cms)
      showMsg('Brochure saved — download buttons are now live on the site')
    } catch {
      setError('Upload failed')
      showMsg('Upload failed')
    } finally {
      setUploading(false)
      setLoading(false)
    }
  }

  const removeBrochure = async () => {
    if (!confirm('Remove the company brochure? Download buttons will be hidden until you upload a new file.')) return
    setLoading(true)
    const result = await removeBrochureAction()
    setLoading(false)
    if (!result.ok || !result.cms) {
      showMsg(result.error || 'Failed to remove brochure')
      return
    }
    setCms(result.cms)
    showMsg('Brochure removed')
  }

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-head">
        <div className="dashboard-page-header">
          <div>
            <h2 className="dashboard-page-title">Company brochure</h2>
            <p className="dashboard-page-desc">
              Upload a PDF brochure. After saving, <strong>Download Brochure</strong> appears in the navbar (top right),
              floating buttons (bottom-right), mobile menu, and footer contact column.
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-form-section max-w-2xl">
        {brochure ? (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="dashboard-row-title">{brochure.fileName}</p>
            <p className="dashboard-row-meta mt-1">{brochure.url}</p>
            {brochure.uploadedAt && (
              <p className="mt-2 text-xs text-gray-500">
                Uploaded {new Date(brochure.uploadedAt).toLocaleString()}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={brochure.url}
                target="_blank"
                rel="noopener noreferrer"
                download={brochure.fileName}
                className="dashboard-btn-secondary text-sm"
              >
                Preview / download
              </a>
              <label className="dashboard-btn-secondary cursor-pointer text-sm">
                {uploading ? 'Uploading…' : 'Replace PDF'}
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="sr-only"
                  disabled={uploading || loading}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void uploadBrochure(file)
                    e.target.value = ''
                  }}
                />
              </label>
              <button type="button" className="dashboard-btn-delete" disabled={loading} onClick={() => void removeBrochure()}>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-sm text-gray-600 mb-4">No brochure uploaded yet. Add a PDF to enable download buttons on the site.</p>
            <label className="btn-primary inline-flex cursor-pointer text-sm py-2.5 px-5">
              {uploading ? 'Uploading…' : 'Upload brochure PDF'}
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="sr-only"
                disabled={uploading || loading}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void uploadBrochure(file)
                  e.target.value = ''
                }}
              />
            </label>
          </div>
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <p className="mt-4 text-xs text-gray-500">PDF only, max 15 MB.</p>
      </div>
    </section>
  )
}
