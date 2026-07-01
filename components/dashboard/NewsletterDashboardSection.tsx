'use client'

import { useCallback, useEffect, useState } from 'react'
import type { NewsletterSubscriber } from '@/types/leads'
import { getNewsletterSubscribersAction, removeNewsletterSubscriberAction } from '@/app/dashboard/actions'
import type { ShowDashboardMsg } from '@/components/dashboard/useDashboardToast'

function formatWhen(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

interface NewsletterDashboardSectionProps {
  showMsg: ShowDashboardMsg
}

export default function NewsletterDashboardSection({ showMsg }: NewsletterDashboardSectionProps) {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [removingEmail, setRemovingEmail] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getNewsletterSubscribersAction()
      if (!result.ok) {
        showMsg(result.error || 'Failed to load subscribers', 'error')
        return
      }
      setSubscribers(result.subscribers ?? [])
    } catch {
      showMsg('Failed to load subscribers', 'error')
    } finally {
      setLoading(false)
    }
  }, [showMsg])

  useEffect(() => {
    void load()
  }, [load])

  const removeSubscriber = async (email: string) => {
    if (!confirm(`Remove ${email} from the newsletter list?`)) return

    setRemovingEmail(email)
    try {
      const result = await removeNewsletterSubscriberAction(email)
      if (!result.ok) {
        showMsg(result.error || 'Failed to remove subscriber', 'error')
        return
      }
      setSubscribers(result.subscribers ?? [])
      showMsg('Subscriber removed', 'success')
    } catch {
      showMsg('Failed to remove subscriber', 'error')
    } finally {
      setRemovingEmail(null)
    }
  }

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-head">
        <div className="dashboard-page-header">
          <div>
            <h2 className="dashboard-page-title">Newsletter subscribers</h2>
            <p className="dashboard-page-desc">
              {subscribers.length} active subscriber{subscribers.length === 1 ? '' : 's'} — they receive updates when
              you add products, services, or blog posts.
            </p>
          </div>
          <button type="button" className="dashboard-btn-secondary text-sm" onClick={() => void load()} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {loading && subscribers.length === 0 ? (
        <p className="px-4 py-8 text-sm text-gray-500">Loading subscribers…</p>
      ) : subscribers.length === 0 ? (
        <p className="px-4 py-8 text-sm text-gray-500">No subscribers yet. Footer sign-ups will appear here.</p>
      ) : (
        <div className="dashboard-table-scroll">
          <div className="dashboard-table">
            {subscribers.map((item) => (
              <div key={item.email} className="dashboard-table-row">
                <div className="min-w-0 flex-1">
                  <p className="dashboard-row-title truncate">{item.name?.trim() || '—'}</p>
                  <p className="dashboard-row-meta">
                    <a href={`mailto:${item.email}`} className="text-primary hover:underline">
                      {item.email}
                    </a>
                    {' · '}
                    Subscribed {formatWhen(item.subscribedAt)}
                  </p>
                </div>
                <div className="dashboard-row-actions">
                  <button
                    type="button"
                    className="dashboard-btn-delete"
                    disabled={removingEmail === item.email}
                    onClick={() => void removeSubscriber(item.email)}
                  >
                    {removingEmail === item.email ? 'Removing…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
