'use client'

import { useState } from 'react'
import type { CmsData, CustomerReview } from '@/types/cms'
import { removeReviewAction, saveReviewAction } from '@/app/dashboard/actions'
import DashboardDrawer from './DashboardDrawer'

const emptyReview = (): CustomerReview => ({
  slug: '',
  name: '',
  role: '',
  quote: '',
  image: '',
})

interface ReviewsDashboardSectionProps {
  cms: CmsData
  loading: boolean
  setLoading: (v: boolean) => void
  setCms: (cms: CmsData) => void
  showMsg: (msg: string) => void
}

export default function ReviewsDashboardSection({
  cms,
  loading,
  setLoading,
  setCms,
  showMsg,
}: ReviewsDashboardSectionProps) {
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null)
  const [originalSlug, setOriginalSlug] = useState('')

  const saveReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingReview) return
    setLoading(true)
    const result = await saveReviewAction(editingReview, originalSlug || undefined)
    setLoading(false)
    if (!result.ok || !result.cms) {
      showMsg(result.error || 'Failed to save review')
      return
    }
    setCms(result.cms)
    setEditingReview(null)
    setOriginalSlug('')
    showMsg('Review saved')
  }

  const deleteReview = async (slug: string) => {
    if (!confirm('Delete this customer review?')) return
    setLoading(true)
    const result = await removeReviewAction(slug)
    setLoading(false)
    if (!result.ok || !result.cms) {
      showMsg(result.error || 'Failed to delete')
      return
    }
    setCms(result.cms)
    showMsg('Review deleted')
  }

  return (
    <>
      <section className="dashboard-panel">
        <div className="dashboard-panel-head">
          <div className="dashboard-page-header">
            <div>
              <h2 className="dashboard-page-title">Customer reviews</h2>
              <p className="dashboard-page-desc">
                {cms.reviews?.length ?? 0} review{(cms.reviews?.length ?? 0) === 1 ? '' : 's'} — shown in the homepage testimonials section.
              </p>
            </div>
            <button
              type="button"
              className="btn-primary text-sm py-2.5 px-5"
              onClick={() => {
                setEditingReview(emptyReview())
                setOriginalSlug('')
              }}
            >
              + Add review
            </button>
          </div>
        </div>

        <div className="dashboard-table-scroll">
          <div className="dashboard-table">
            {(cms.reviews?.length ?? 0) === 0 ? (
              <p className="dashboard-empty">No reviews yet — add customer testimonials for the homepage.</p>
            ) : (
              cms.reviews?.map((review) => (
            <div key={review.slug} className="dashboard-table-row">
              <div className="min-w-0">
                <p className="dashboard-row-title truncate">{review.name}</p>
                <p className="dashboard-row-meta">
                  {review.role} · {review.slug}
                </p>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">{review.quote}</p>
              </div>
              <div className="dashboard-row-actions">
                <button
                  type="button"
                  className="dashboard-btn-edit"
                  onClick={() => {
                    setEditingReview({ ...review })
                    setOriginalSlug(review.slug)
                  }}
                >
                  Edit
                </button>
                <button type="button" className="dashboard-btn-delete" onClick={() => deleteReview(review.slug)}>
                  Delete
                </button>
              </div>
            </div>
              ))
            )}
          </div>
        </div>
      </section>

      {editingReview && (
        <DashboardDrawer
          open
          title={originalSlug ? 'Edit review' : 'New review'}
          subtitle="Customer testimonials on the homepage — use construction machinery images for avatars if needed."
          onClose={() => {
            setEditingReview(null)
            setOriginalSlug('')
          }}
          footer={
            <>
              <button type="submit" form="dashboard-review-form" disabled={loading} className="btn-primary text-sm">
                {loading ? 'Saving…' : 'Save review'}
              </button>
              <button
                type="button"
                className="dashboard-btn-secondary"
                onClick={() => {
                  setEditingReview(null)
                  setOriginalSlug('')
                }}
              >
                Cancel
              </button>
            </>
          }
        >
          <form id="dashboard-review-form" onSubmit={saveReview} className="space-y-3">
            <Field label="Customer name *" value={editingReview.name} onChange={(v) => setEditingReview({ ...editingReview, name: v })} />
            <Field label="Slug" value={editingReview.slug} onChange={(v) => setEditingReview({ ...editingReview, slug: v })} />
            <Field label="Role / title" value={editingReview.role} onChange={(v) => setEditingReview({ ...editingReview, role: v })} />
            <Field
              label="Image URL"
              value={editingReview.image}
              onChange={(v) => setEditingReview({ ...editingReview, image: v })}
            />
            <TextArea
              label="Review text *"
              value={editingReview.quote}
              onChange={(v) => setEditingReview({ ...editingReview, quote: v })}
              rows={5}
            />
          </form>
        </DashboardDrawer>
      )}
    </>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input className="dashboard-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <textarea className="dashboard-input resize-y" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
