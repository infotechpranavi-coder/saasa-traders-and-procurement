'use client'

import { useCallback, useEffect, useState } from 'react'
import type { EnquiryRecord } from '@/types/leads'
import { getEnquiriesAction } from '@/app/dashboard/actions'
import type { ShowDashboardMsg } from '@/components/dashboard/useDashboardToast'

function formatWhen(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

interface EnquiriesDashboardSectionProps {
  showMsg: ShowDashboardMsg
}

export default function EnquiriesDashboardSection({ showMsg }: EnquiriesDashboardSectionProps) {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getEnquiriesAction()
      if (!result.ok) {
        showMsg(result.error || 'Failed to load enquiries', 'error')
        return
      }
      setEnquiries(result.enquiries ?? [])
    } catch {
      showMsg('Failed to load enquiries', 'error')
    } finally {
      setLoading(false)
    }
  }, [showMsg])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-head">
        <div className="dashboard-page-header">
          <div>
            <h2 className="dashboard-page-title">Contact enquiries</h2>
            <p className="dashboard-page-desc">
              {enquiries.length} enquiry{enquiries.length === 1 ? '' : 'ies'} from the contact form — newest first.
            </p>
          </div>
          <button type="button" className="dashboard-btn-secondary text-sm" onClick={() => void load()} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {loading && enquiries.length === 0 ? (
        <p className="px-4 py-8 text-sm text-gray-500">Loading enquiries…</p>
      ) : enquiries.length === 0 ? (
        <p className="px-4 py-8 text-sm text-gray-500">No enquiries yet. Submissions from /contact will appear here.</p>
      ) : (
        <div className="dashboard-table-scroll">
          <div className="dashboard-table">
            {enquiries.map((item) => (
              <div key={item.id ?? `${item.email}-${item.createdAt}`} className="dashboard-table-row dashboard-table-row--stack">
                <div className="min-w-0 flex-1">
                  <p className="dashboard-row-title">{item.name}</p>
                  <p className="dashboard-row-meta">
                    <a href={`mailto:${item.email}`} className="text-primary hover:underline">
                      {item.email}
                    </a>
                    {item.phone ? ` · ${item.phone}` : ''}
                    {item.service ? ` · ${item.service}` : ''}
                  </p>
                  {item.message ? (
                    <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{item.message}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-gray-400">{formatWhen(item.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
