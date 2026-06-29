'use client'

import { useState } from 'react'
import type { CmsData, PortfolioProject } from '@/types/cms'
import { removePortfolioAction, savePortfolioAction } from '@/app/dashboard/actions'
import { parseLines } from '@/lib/utils'
import DashboardDrawer from './DashboardDrawer'
import ImageUrlField from './ImageUrlField'

const emptyProject = (): PortfolioProject => ({
  slug: '',
  title: '',
  label: '',
  image: '',
  excerpt: '',
  body: [],
  client: '',
  location: '',
  year: '',
})

interface RecentWorkDashboardSectionProps {
  cms: CmsData
  loading: boolean
  setLoading: (v: boolean) => void
  setCms: (cms: CmsData) => void
  showMsg: (msg: string) => void
}

export default function RecentWorkDashboardSection({
  cms,
  loading,
  setLoading,
  setCms,
  showMsg,
}: RecentWorkDashboardSectionProps) {
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null)
  const [originalSlug, setOriginalSlug] = useState('')

  const projects = cms.portfolio ?? []

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return
    if (!editingProject.title?.trim()) {
      showMsg('Title is required')
      return
    }
    if (!editingProject.image?.trim()) {
      showMsg('Please upload or paste a card image')
      return
    }
    setLoading(true)
    const result = await savePortfolioAction(editingProject, originalSlug || undefined)
    setLoading(false)
    if (!result.ok || !result.cms) {
      showMsg(result.error || 'Failed to save project')
      return
    }
    setCms(result.cms)
    setEditingProject(null)
    setOriginalSlug('')
    showMsg('Recent work project saved')
  }

  const deleteProject = async (slug: string) => {
    if (!confirm('Delete this recent work project?')) return
    setLoading(true)
    const result = await removePortfolioAction(slug)
    setLoading(false)
    if (!result.ok || !result.cms) {
      showMsg(result.error || 'Failed to delete')
      return
    }
    setCms(result.cms)
    showMsg('Project deleted')
  }

  return (
    <>
      <section className="dashboard-panel">
        <div className="dashboard-panel-head">
          <div className="dashboard-page-header">
            <div>
              <h2 className="dashboard-page-title">Recent work</h2>
              <p className="dashboard-page-desc">
                {projects.length} project{projects.length === 1 ? '' : 's'} — shown as cards in the homepage
                &ldquo;Explore Our Recent Work&rdquo; slider. Clicking a card opens the project detail page.
              </p>
            </div>
            <button
              type="button"
              className="btn-primary text-sm py-2.5 px-5"
              onClick={() => {
                setEditingProject(emptyProject())
                setOriginalSlug('')
              }}
            >
              + Add project
            </button>
          </div>
        </div>

        <div className="dashboard-table-scroll">
          <div className="dashboard-table">
            {projects.length === 0 ? (
              <p className="dashboard-empty">
                No recent work yet — add projects to fill the homepage portfolio slider.
              </p>
            ) : (
              projects.map((project) => (
                <div key={project.slug} className="dashboard-table-row">
                  <div className="min-w-0 flex items-center gap-3">
                    {project.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.image}
                        alt=""
                        className="h-12 w-16 shrink-0 rounded object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="h-12 w-16 shrink-0 rounded border border-dashed border-gray-300 bg-gray-50" />
                    )}
                    <div className="min-w-0">
                      <p className="dashboard-row-title truncate">{project.title}</p>
                      <p className="dashboard-row-meta">
                        {project.slug} · {project.label || 'No label'}
                      </p>
                      {project.excerpt && (
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{project.excerpt}</p>
                      )}
                    </div>
                  </div>
                  <div className="dashboard-row-actions">
                    <button
                      type="button"
                      className="dashboard-btn-edit"
                      onClick={() => {
                        setEditingProject({ ...project })
                        setOriginalSlug(project.slug)
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="dashboard-btn-delete" onClick={() => deleteProject(project.slug)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {editingProject && (
        <DashboardDrawer
          open
          title={originalSlug ? 'Edit project' : 'New project'}
          subtitle='Card appears in the homepage "Explore Our Recent Work" section. Visitors can open a full detail page from the card.'
          onClose={() => {
            setEditingProject(null)
            setOriginalSlug('')
          }}
          footer={
            <>
              <button type="submit" form="dashboard-recent-work-form" disabled={loading} className="btn-primary text-sm">
                {loading ? 'Saving…' : 'Save project'}
              </button>
              <button
                type="button"
                className="dashboard-btn-secondary"
                onClick={() => {
                  setEditingProject(null)
                  setOriginalSlug('')
                }}
              >
                Cancel
              </button>
            </>
          }
        >
          <form id="dashboard-recent-work-form" onSubmit={saveProject} className="space-y-0">
            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Slider card</p>
              <div className="space-y-3">
                <Field
                  label="Title *"
                  value={editingProject.title}
                  onChange={(v) => setEditingProject({ ...editingProject, title: v })}
                />
                <Field
                  label="Slug"
                  hint="Leave blank to auto-generate from title"
                  value={editingProject.slug}
                  onChange={(v) => setEditingProject({ ...editingProject, slug: v })}
                />
                <Field
                  label="Label"
                  hint="Short tag on the card — e.g. Road Transport, Port Logistics"
                  value={editingProject.label}
                  onChange={(v) => setEditingProject({ ...editingProject, label: v })}
                />
                <ImageUrlField
                  label="Card image *"
                  hint="Photo shown on the homepage slider card"
                  value={editingProject.image}
                  onChange={(v) => setEditingProject({ ...editingProject, image: v })}
                />
              </div>
            </div>
            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Detail page</p>
              <div className="space-y-3">
                <TextArea
                  label="Excerpt"
                  value={editingProject.excerpt || ''}
                  onChange={(v) => setEditingProject({ ...editingProject, excerpt: v })}
                  rows={2}
                />
                <TextArea
                  label="Body (one paragraph per line)"
                  value={editingProject.body.join('\n')}
                  onChange={(v) => setEditingProject({ ...editingProject, body: parseLines(v) })}
                  rows={6}
                />
                <div className="grid grid-cols-3 gap-3">
                  <Field
                    label="Client"
                    value={editingProject.client || ''}
                    onChange={(v) => setEditingProject({ ...editingProject, client: v })}
                  />
                  <Field
                    label="Location"
                    value={editingProject.location || ''}
                    onChange={(v) => setEditingProject({ ...editingProject, location: v })}
                  />
                  <Field
                    label="Year"
                    value={editingProject.year || ''}
                    onChange={(v) => setEditingProject({ ...editingProject, year: v })}
                  />
                </div>
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
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {hint && <p className="mb-1.5 text-xs text-gray-500">{hint}</p>}
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
