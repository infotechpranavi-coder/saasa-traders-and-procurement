'use client'

import { useState } from 'react'
import type { CmsData } from '@/types/cms'
import { removeBrochureAction, uploadBrochureFormAction } from '@/app/dashboard/actions'
import { runDashboardSave } from '@/components/dashboard/dashboard-save'

interface BrochureDashboardSectionProps {
  cms: CmsData
  setCms: (cms: CmsData) => void
  refreshCms: () => Promise<void>
  showMsg: (msg: string) => void
}

export default function BrochureDashboardSection({
  cms,
  setCms,
  refreshCms,
  showMsg,
}: BrochureDashboardSectionProps) {
  const [saving, setSaving] = useState(false)
  const brochure = cms.brochure

  const uploadBrochure = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    await runDashboardSave(
      setSaving,
      () => uploadBrochureFormAction(formData),
      {
        showMsg,
        setCms,
        refreshCms,
        successMessage: 'Brochure saved — download buttons are now live on the site',
        errorMessage: 'Failed to upload brochure',
      },
    )
  }

  const removeBrochure = async () => {
    if (!confirm('Remove the company brochure? Download buttons will be hidden until you upload a new file.')) return
    await runDashboardSave(
      setSaving,
      () => removeBrochureAction(),
      {
        showMsg,
        setCms,
        refreshCms,
        successMessage: 'Brochure removed',
        errorMessage: 'Failed to remove brochure',
      },
    )
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
              <label className={`dashboard-btn-secondary text-sm ${saving ? 'pointer-events-none opacity-60' : 'cursor-pointer'}`}>
                {saving ? 'Uploading…' : 'Replace PDF'}
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="sr-only"
                  disabled={saving}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void uploadBrochure(file)
                    e.target.value = ''
                  }}
                />
              </label>
              <button type="button" className="dashboard-btn-delete" disabled={saving} onClick={() => void removeBrochure()}>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-sm text-gray-600 mb-4">No brochure uploaded yet. Add a PDF to enable download buttons on the site.</p>
            <label className={`btn-primary inline-flex text-sm py-2.5 px-5 ${saving ? 'pointer-events-none opacity-60' : 'cursor-pointer'}`}>
              {saving ? 'Uploading…' : 'Upload brochure PDF'}
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="sr-only"
                disabled={saving}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void uploadBrochure(file)
                  e.target.value = ''
                }}
              />
            </label>
          </div>
        )}
        <p className="mt-4 text-xs text-gray-500">PDF only, max 15 MB.</p>
      </div>
    </section>
  )
}
