'use client'

import { useState } from 'react'
import type { CmsData, CustomerReview } from '@/types/cms'
import { removeReviewAction, saveReviewAction } from '@/app/dashboard/actions'
import { runDashboardSave } from '@/components/dashboard/dashboard-save'
import DashboardDrawer from './DashboardDrawer'

const emptyReview = (): CustomerReview => ({
  slug: '',
  name: '',
  role: '',
  quote: '',
  image: '',
})

import type { ShowDashboardMsg } from '@/components/dashboard/useDashboardToast'

interface ReviewsDashboardSectionProps {
  cms: CmsData
  setCms: (cms: CmsData) => void
  showMsg: ShowDashboardMsg
}

export default function ReviewsDashboardSection({
  cms,
  setCms,
  showMsg,
}: ReviewsDashboardSectionProps) {
  const [saving, setSaving] = useState(false)
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null)
  const [originalSlug, setOriginalSlug] = useState('')

  const saveReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingReview) return
    if (!editingReview.name?.trim() || !editingReview.quote?.trim()) {
      showMsg('Customer name and review text are required', 'error')
      return
    }
    await runDashboardSave(
      setSaving,
      () =>
        saveReviewAction(
          editingReview,
          originalSlug && (cms.reviews ?? []).some((r) => r.slug === originalSlug) ? originalSlug : undefined,
        ),
      {
        showMsg,
        setCms,
        onSuccess: () => {
          setEditingReview(null)
          setOriginalSlug('')
        },
        successMessage: 'Review saved',
        errorMessage: 'Failed to save review',
      },
    )
  }

  const deleteReview = async (slug: string) => {
    if (!confirm('Delete this customer review?')) return
    await runDashboardSave(
      setSaving,
      () => removeReviewAction(slug),
      {
        showMsg,
        setCms,
        successMessage: 'Review deleted',
        errorMessage: 'Failed to delete',
      },
    )
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
              disabled={saving}
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
                  disabled={saving}
                  onClick={() => {
                    setEditingReview({ ...review })
                    setOriginalSlug(review.slug)
                  }}
                >
                  Edit
                </button>
                <button type="button" className="dashboard-btn-delete" disabled={saving} onClick={() => void deleteReview(review.slug)}>
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
          subtitle="Customer testimonials on the homepage — leave image URL empty to show a default user icon."
          onClose={() => {
            setEditingReview(null)
            setOriginalSlug('')
          }}
          footer={
            <>
              <button type="submit" form="dashboard-review-form" disabled={saving} className="btn-primary text-sm">
                {saving ? 'Saving…' : 'Save review'}
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
              label="Image URL (optional)"
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
