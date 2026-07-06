'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { EnquiryRecord } from '@/types/leads'
import {
  getEnquiriesAction,
  resendBrochureAdminNotifyAction,
  resendBrochureToCustomerAction,
} from '@/app/dashboard/actions'
import type { ShowDashboardMsg } from '@/components/dashboard/useDashboardToast'

type EnquiryFilter = 'all' | 'contact' | 'brochure'

function formatWhen(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function enquiryTypeLabel(item: EnquiryRecord) {
  if (item.type === 'brochure' || item.source === 'brochure-form') return 'Brochure'
  return 'Contact'
}

interface EnquiriesDashboardSectionProps {
  showMsg: ShowDashboardMsg
}

export default function EnquiriesDashboardSection({ showMsg }: EnquiriesDashboardSectionProps) {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<EnquiryFilter>('all')
  const [resendingId, setResendingId] = useState<string | null>(null)

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

  const filtered = useMemo(() => {
    if (filter === 'all') return enquiries
    if (filter === 'brochure') {
      return enquiries.filter((item) => item.type === 'brochure' || item.source === 'brochure-form')
    }
    return enquiries.filter((item) => item.type !== 'brochure' && item.source !== 'brochure-form')
  }, [enquiries, filter])

  const resendToCustomer = async (id: string) => {
    setResendingId(id)
    try {
      const result = await resendBrochureToCustomerAction(id)
      showMsg(result.ok ? 'Catalog email sent to customer' : result.error || 'Resend failed', result.ok ? 'success' : 'error')
    } finally {
      setResendingId(null)
    }
  }

  const resendToAdmin = async (id: string) => {
    setResendingId(id)
    try {
      const result = await resendBrochureAdminNotifyAction(id)
      showMsg(result.ok ? 'Admin notification sent' : result.error || 'Resend failed', result.ok ? 'success' : 'error')
    } finally {
      setResendingId(null)
    }
  }

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-head">
        <div className="dashboard-page-header">
          <div>
            <h2 className="dashboard-page-title">Enquiries</h2>
            <p className="dashboard-page-desc">
              {enquiries.length} submission{enquiries.length === 1 ? '' : 's'} from contact and catalog download forms.
            </p>
          </div>
          <button type="button" className="dashboard-btn-secondary text-sm" onClick={() => void load()} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
        <div className="dashboard-toolbar flex flex-wrap gap-2">
          {(
            [
              ['all', 'All'],
              ['contact', 'Contact'],
              ['brochure', 'Brochure'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`dashboard-btn-secondary text-xs ${filter === id ? 'ring-2 ring-primary/40' : ''}`}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && enquiries.length === 0 ? (
        <p className="px-4 py-8 text-sm text-gray-500">Loading enquiries…</p>
      ) : filtered.length === 0 ? (
        <p className="px-4 py-8 text-sm text-gray-500">
          No {filter === 'all' ? '' : `${filter} `}enquiries yet.
        </p>
      ) : (
        <div className="dashboard-table-scroll">
          <div className="dashboard-table">
            {filtered.map((item) => {
              const isBrochure = item.type === 'brochure' || item.source === 'brochure-form'
              const busy = resendingId === item.id

              return (
                <div key={item.id ?? `${item.email}-${item.createdAt}`} className="dashboard-table-row dashboard-table-row--stack">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="dashboard-row-title">{item.name}</p>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-600">
                        {enquiryTypeLabel(item)}
                      </span>
                    </div>
                    <p className="dashboard-row-meta">
                      {item.email ? (
                        <a href={`mailto:${item.email}`} className="text-primary hover:underline">
                          {item.email}
                        </a>
                      ) : (
                        <span className="text-gray-500">No email provided</span>
                      )}
                      {item.phone ? ` · ${item.phone}` : ''}
                      {item.company ? ` · ${item.company}` : ''}
                      {item.service && !isBrochure ? ` · ${item.service}` : ''}
                    </p>
                    {item.message ? (
                      <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{item.message}</p>
                    ) : null}
                    <p className="mt-2 text-xs text-gray-400">{formatWhen(item.createdAt)}</p>

                    {isBrochure && item.id && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="dashboard-btn-secondary text-xs"
                          disabled={busy || !item.email}
                          onClick={() => void resendToCustomer(item.id!)}
                        >
                          Resend PDF to customer
                        </button>
                        <button
                          type="button"
                          className="dashboard-btn-secondary text-xs"
                          disabled={busy}
                          onClick={() => void resendToAdmin(item.id!)}
                        >
                          Resend admin alert
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
