'use client'

import { useState } from 'react'
import type { CmsData, HeroBanner } from '@/types/cms'
import { removeHeroBannerAction, saveHeroBannerAction } from '@/app/dashboard/actions'
import { runDashboardSave } from '@/components/dashboard/dashboard-save'
import DashboardDrawer from './DashboardDrawer'
import ImageUrlField from './ImageUrlField'

const emptyBanner = (): HeroBanner => ({
  slug: '',
  position: 1,
  image: '',
  badge: '',
  title: '',
  titleAccent: '',
  subtitle: '',
})

interface HeroBannersDashboardSectionProps {
  cms: CmsData
  setCms: (cms: CmsData) => void
  refreshCms: () => Promise<void>
  showMsg: (msg: string) => void
}

export default function HeroBannersDashboardSection({
  cms,
  setCms,
  refreshCms,
  showMsg,
}: HeroBannersDashboardSectionProps) {
  const [saving, setSaving] = useState(false)
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null)
  const [originalSlug, setOriginalSlug] = useState('')

  const banners = [...(cms.heroBanners ?? [])].sort((a, b) => a.position - b.position)

  const saveBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBanner) return
    if (!editingBanner.image?.trim()) {
      showMsg('Please upload or paste a background image')
      return
    }
    if (!editingBanner.title?.trim() || !editingBanner.subtitle?.trim()) {
      showMsg('Title and subtitle are required')
      return
    }
    await runDashboardSave(
      setSaving,
      () => saveHeroBannerAction(editingBanner, originalSlug || undefined),
      {
        showMsg,
        setCms,
        refreshCms,
        onSuccess: () => {
          setEditingBanner(null)
          setOriginalSlug('')
        },
        successMessage: 'Hero banner saved',
        errorMessage: 'Failed to save banner',
      },
    )
  }

  const deleteBanner = async (slug: string) => {
    if (!confirm('Delete this hero banner?')) return
    await runDashboardSave(
      setSaving,
      () => removeHeroBannerAction(slug),
      {
        showMsg,
        setCms,
        refreshCms,
        successMessage: 'Hero banner deleted',
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
              <h2 className="dashboard-page-title">Homepage hero banners</h2>
              <p className="dashboard-page-desc">
                {banners.length} banner{banners.length === 1 ? '' : 's'} — rotating slides on the homepage hero. Buttons (Free Quote,
                View Products) stay the same on every slide.
              </p>
            </div>
            <button
              type="button"
              className="btn-primary text-sm py-2.5 px-5"
              disabled={saving}
              onClick={() => {
                const nextPosition = banners.length > 0 ? Math.max(...banners.map((b) => b.position)) + 1 : 1
                setEditingBanner({ ...emptyBanner(), position: nextPosition })
                setOriginalSlug('')
              }}
            >
              + Add banner
            </button>
          </div>
        </div>

        <div className="dashboard-table-scroll">
          <div className="dashboard-table">
            {banners.length === 0 ? (
              <p className="dashboard-empty">No hero banners yet — add your first homepage slide.</p>
            ) : (
              banners.map((banner) => (
              <div key={banner.slug} className="dashboard-table-row">
                <div className="min-w-0 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={banner.image}
                    alt=""
                    className="h-12 w-16 shrink-0 rounded object-cover border border-gray-200"
                  />
                  <div className="min-w-0">
                    <p className="dashboard-row-title truncate">
                      #{banner.position} · {banner.title} {banner.titleAccent}
                    </p>
                    <p className="dashboard-row-meta">
                      {banner.slug} · {banner.badge}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{banner.subtitle}</p>
                  </div>
                </div>
                <div className="dashboard-row-actions">
                  <button
                    type="button"
                    className="dashboard-btn-edit"
                    disabled={saving}
                    onClick={() => {
                      setEditingBanner({ ...banner })
                      setOriginalSlug(banner.slug)
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" className="dashboard-btn-delete" disabled={saving} onClick={() => void deleteBanner(banner.slug)}>
                    Delete
                  </button>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </section>

      {editingBanner && (
        <DashboardDrawer
          open
          title={originalSlug ? 'Edit hero banner' : 'New hero banner'}
          subtitle="Image, position, badge, title, and subtitle — shown on the homepage hero carousel."
          onClose={() => {
            setEditingBanner(null)
            setOriginalSlug('')
          }}
          footer={
            <>
              <button type="submit" form="dashboard-hero-banner-form" disabled={saving} className="btn-primary text-sm">
                {saving ? 'Saving…' : 'Save banner'}
              </button>
              <button
                type="button"
                className="dashboard-btn-secondary"
                onClick={() => {
                  setEditingBanner(null)
                  setOriginalSlug('')
                }}
              >
                Cancel
              </button>
            </>
          }
        >
          <form id="dashboard-hero-banner-form" onSubmit={saveBanner} className="space-y-0">
            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Slide</p>
              <div className="space-y-3">
                <Field
                  label="Position *"
                  hint="Slide order — 1 shows first, then 2, 3, and so on."
                  type="number"
                  value={String(editingBanner.position)}
                  onChange={(v) => setEditingBanner({ ...editingBanner, position: Math.max(1, Number(v) || 1) })}
                />
                <ImageUrlField
                  label="Background image *"
                  hint="Upload a photo or paste a path such as /statsic/jcb.jpg"
                  value={editingBanner.image}
                  onChange={(image) => setEditingBanner({ ...editingBanner, image })}
                />
                <Field label="Slug" value={editingBanner.slug} onChange={(v) => setEditingBanner({ ...editingBanner, slug: v })} />
              </div>
            </div>

            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Text on slide</p>
              <div className="space-y-3">
                <Field
                  label="Badge"
                  hint="Small label above the title — e.g. EST. 2024 • PROCUREMENT & TRADING"
                  value={editingBanner.badge}
                  onChange={(v) => setEditingBanner({ ...editingBanner, badge: v })}
                />
                <Field
                  label="Title *"
                  hint="First line of the headline"
                  value={editingBanner.title}
                  onChange={(v) => setEditingBanner({ ...editingBanner, title: v })}
                />
                <Field
                  label="Title highlight"
                  hint="Second line — shown in accent color, e.g. Equipment, Machinery, Parts"
                  value={editingBanner.titleAccent}
                  onChange={(v) => setEditingBanner({ ...editingBanner, titleAccent: v })}
                />
                <TextArea
                  label="Subtitle *"
                  hint="Short paragraph under the title"
                  value={editingBanner.subtitle}
                  onChange={(v) => setEditingBanner({ ...editingBanner, subtitle: v })}
                  rows={3}
                />
              </div>
            </div>
          </form>
        </DashboardDrawer>
      )}
    </>
  )
}

function Field({
  label,
  hint,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {hint && <p className="mb-1.5 text-xs text-gray-500">{hint}</p>}
      <input
        type={type}
        className="dashboard-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={type === 'number' ? 1 : undefined}
      />
    </div>
  )
}

function TextArea({
  label,
  hint,
  value,
  onChange,
  rows = 3,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {hint && <p className="mb-1.5 text-xs text-gray-500">{hint}</p>}
      <textarea className="dashboard-input resize-y" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
