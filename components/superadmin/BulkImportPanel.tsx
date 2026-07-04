'use client'

import { useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import type { BulkImportKind } from '@/lib/bulk-import/helpers'
import { downloadSampleExcelAction, importBulkExcelAction } from '@/app/superadmin/actions'
import type { CmsData } from '@/types/cms'
import type { ShowDashboardMsg } from '@/components/dashboard/useDashboardToast'

function triggerDownload(base64: string, fileName: string) {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  const blob = new Blob([bytes], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

interface BulkImportPanelProps {
  kind: BulkImportKind
  setCms: (cms: CmsData) => void
  showMsg: ShowDashboardMsg
}

const KIND_LABEL: Record<BulkImportKind, string> = {
  categories: 'categories',
  products: 'products',
  services: 'services',
}

export default function BulkImportPanel({ kind, setCms, showMsg }: BulkImportPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState<'sample' | 'import' | null>(null)
  const [lastReport, setLastReport] = useState<string | null>(null)

  const downloadSample = async () => {
    setBusy('sample')
    try {
      const result = await downloadSampleExcelAction(kind)
      if (!result.ok || !result.base64 || !result.fileName) {
        showMsg(result.error || 'Failed to download sample', 'error')
        return
      }
      triggerDownload(result.base64, result.fileName)
      showMsg('Sample Excel downloaded — fill the Data sheet and import', 'success')
    } catch {
      showMsg('Failed to download sample', 'error')
    } finally {
      setBusy(null)
    }
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setBusy('import')
    setLastReport(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await importBulkExcelAction(kind, formData)

      if (!result.ok || !result.cms) {
        showMsg(result.error || 'Import failed', 'error')
        return
      }

      setCms(result.cms)
      const summary = `Import done: ${result.added ?? 0} added, ${result.updated ?? 0} updated, ${result.skipped ?? 0} skipped.`
      setLastReport(
        result.errors?.length
          ? `${summary} ${result.errors.length} row issue(s) — see details below.`
          : summary,
      )
      showMsg(summary, 'success')
    } catch {
      showMsg('Import failed', 'error')
    } finally {
      setBusy(null)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="bulk-import-panel">
      <div className="bulk-import-panel-head">
        <div>
          <p className="bulk-import-panel-title">Bulk Excel import</p>
          <p className="bulk-import-panel-desc">
            Download the sample format, fill rows on the <strong>Data</strong> sheet, then import. Use an{' '}
            <strong>image</strong> column for a URL or path (e.g. <code>/statsic/jcb.jpg</code>) — leave blank and
            upload images later in the editor.
          </p>
        </div>
        <div className="bulk-import-panel-actions">
          <button
            type="button"
            className="dashboard-btn-secondary text-sm"
            disabled={busy !== null}
            onClick={() => void downloadSample()}
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            {busy === 'sample' ? 'Preparing…' : 'Sample Excel'}
          </button>
          <button
            type="button"
            className="btn-primary text-sm"
            disabled={busy !== null}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" strokeWidth={2} />
            {busy === 'import' ? 'Importing…' : `Import ${KIND_LABEL[kind]}`}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            className="sr-only"
            onChange={(e) => void onFileChange(e)}
          />
        </div>
      </div>
      {lastReport ? <p className="bulk-import-panel-report">{lastReport}</p> : null}
    </div>
  )
}
