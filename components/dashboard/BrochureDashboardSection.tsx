'use client'

import { useRef, useState } from 'react'
import { CheckCircle2, FileText, Trash2, Upload } from 'lucide-react'
import type { CmsData } from '@/types/cms'
import { removeBrochureAction, uploadBrochureFormAction } from '@/app/dashboard/actions'
import { runDashboardSave } from '@/components/dashboard/dashboard-save'

import type { ShowDashboardMsg } from '@/components/dashboard/useDashboardToast'

interface BrochureDashboardSectionProps {
  cms: CmsData
  setCms: (cms: CmsData) => void
  showMsg: ShowDashboardMsg
}

const CATALOG_PLACEMENTS = [
  { label: 'Navbar', detail: 'Catalog button → /brochure lead form, then PDF download' },
  { label: 'Homepage CTA', detail: 'Catalog download section → /brochure form (same as floating button)' },
  { label: 'Floating buttons', detail: 'PDF icon → /brochure download form' },
  { label: 'Mobile menu', detail: 'Inside the hamburger navigation drawer' },
  { label: 'Footer', detail: 'Contact column catalog link' },
] as const

function formatUploadedAt(value?: string) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function BrochureDashboardSection({
  cms,
  setCms,
  showMsg,
}: BrochureDashboardSectionProps) {
  const [saving, setSaving] = useState(false)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const catalog = cms.brochure
  const uploadedLabel = formatUploadedAt(catalog?.uploadedAt)

  const uploadCatalog = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    await runDashboardSave(
      setSaving,
      () => uploadBrochureFormAction(formData),
      {
        showMsg,
        setCms,
        successMessage: catalog
          ? 'Catalog updated — download buttons now use the new file'
          : 'Catalog saved — download buttons are now live on the site',
        errorMessage: 'Failed to upload catalog',
      },
    )
  }

  const deleteCatalog = async () => {
    if (
      !confirm(
        'Delete the current catalog PDF? Download Catalog buttons will be hidden until you upload a new file.',
      )
    ) {
      return
    }

    await runDashboardSave(
      setSaving,
      () => removeBrochureAction(),
      {
        showMsg,
        setCms,
        successMessage: 'Catalog deleted',
        errorMessage: 'Failed to delete catalog',
      },
    )
  }

  const onFileSelected = (file: File | undefined) => {
    if (file) void uploadCatalog(file)
    if (uploadInputRef.current) uploadInputRef.current.value = ''
  }

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-head">
        <div className="dashboard-page-header">
          <div>
            <h2 className="dashboard-page-title">Company catalog</h2>
            <p className="dashboard-page-desc">
              Upload one PDF catalog for visitors to download. It powers every Download Catalog button on the public
              site.
            </p>
          </div>
          <span
            className={`dashboard-brochure-status ${catalog ? 'dashboard-brochure-status--live' : 'dashboard-brochure-status--empty'}`}
          >
            {catalog ? 'Live on site' : 'Not published'}
          </span>
        </div>
      </div>

      <div className="dashboard-table-scroll">
        <div className="dashboard-brochure-layout">
          <div className="dashboard-brochure-main space-y-5">
            {catalog ? (
              <>
                <div>
                  <p className="dashboard-form-section-title">Current catalog</p>
                  <div className="dashboard-brochure-file-card">
                    <div className="dashboard-brochure-file-icon" aria-hidden>
                      <FileText className="h-7 w-7" />
                    </div>
                    <div className="dashboard-brochure-file-body min-w-0">
                      <p className="dashboard-row-title truncate">{catalog.fileName}</p>
                      <p className="dashboard-row-meta mt-1 truncate">{catalog.url}</p>
                      {uploadedLabel && <p className="dashboard-brochure-file-meta">Uploaded {uploadedLabel}</p>}
                    </div>
                    <div className="dashboard-brochure-file-actions">
                      <a
                        href={catalog.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={catalog.fileName}
                        className="dashboard-btn-secondary text-sm"
                      >
                        Preview PDF
                      </a>
                      <button
                        type="button"
                        className="dashboard-btn-delete text-sm"
                        disabled={saving}
                        onClick={() => void deleteCatalog()}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                        Delete current file
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="dashboard-form-section-title">Upload new catalog</p>
                  <div className="dashboard-brochure-replace">
                    <p className="dashboard-brochure-replace-desc">
                      Choose a new PDF to replace the current catalog. The old file will be removed automatically after
                      the new one is saved.
                    </p>
                    <button
                      type="button"
                      className="btn-primary text-sm py-2.5 px-5"
                      disabled={saving}
                      onClick={() => uploadInputRef.current?.click()}
                    >
                      {saving ? 'Uploading…' : 'Choose new PDF'}
                    </button>
                    <p className="dashboard-brochure-upload-hint">PDF only · max 15 MB</p>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <p className="dashboard-form-section-title">Catalog file</p>
                <div className="dashboard-brochure-upload">
                  <div className="dashboard-brochure-upload-icon" aria-hidden>
                    <Upload className="h-8 w-8" />
                  </div>
                  <p className="dashboard-brochure-upload-title">No catalog uploaded yet</p>
                  <p className="dashboard-brochure-upload-desc">
                    Upload your company catalog PDF to turn on Download Catalog buttons across the navbar, footer, and
                    floating contact actions.
                  </p>
                  <button
                    type="button"
                    className="btn-primary text-sm py-2.5 px-5"
                    disabled={saving}
                    onClick={() => uploadInputRef.current?.click()}
                  >
                    {saving ? 'Uploading…' : 'Upload catalog PDF'}
                  </button>
                  <p className="dashboard-brochure-upload-hint">PDF only · max 15 MB</p>
                </div>
              </div>
            )}

            <input
              ref={uploadInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="sr-only"
              disabled={saving}
              onChange={(e) => onFileSelected(e.target.files?.[0])}
            />
          </div>

          <aside className="dashboard-brochure-aside">
            <p className="dashboard-form-section-title">Where visitors see it</p>
            <ul className="dashboard-brochure-placements">
              {CATALOG_PLACEMENTS.map((placement) => (
                <li key={placement.label} className="dashboard-brochure-placement">
                  <CheckCircle2
                    className={`dashboard-brochure-placement-icon ${catalog ? 'dashboard-brochure-placement-icon--on' : ''}`}
                    aria-hidden
                  />
                  <div>
                    <p className="dashboard-brochure-placement-label">{placement.label}</p>
                    <p className="dashboard-brochure-placement-detail">{placement.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="dashboard-brochure-note">
              <p className="dashboard-brochure-note-title">Tip</p>
              <p className="dashboard-brochure-note-text">
                Keep one up-to-date catalog PDF. Uploading a new file replaces the old one everywhere instantly. Delete
                the current file if you want to hide all download buttons.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
