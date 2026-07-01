'use client'

import { useState } from 'react'
import type { CmsData, PortfolioProject } from '@/types/cms'
import { removePortfolioAction, savePortfolioAction } from '@/app/dashboard/actions'
import { runDashboardSave } from '@/components/dashboard/dashboard-save'
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

import type { ShowDashboardMsg } from '@/components/dashboard/useDashboardToast'

interface RecentWorkDashboardSectionProps {
  cms: CmsData
  setCms: (cms: CmsData) => void
  showMsg: ShowDashboardMsg
}

export default function RecentWorkDashboardSection({
  cms,
  setCms,
  showMsg,
}: RecentWorkDashboardSectionProps) {
  const [saving, setSaving] = useState(false)
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null)
  const [originalSlug, setOriginalSlug] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const projects = cms.portfolio ?? []

  const scrollDrawerToTop = () => {
    document.getElementById('dashboard-drawer-body')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const failValidation = (msg: string) => {
    setFormError(msg)
    showMsg(msg, 'error')
    scrollDrawerToTop()
  }

  const openEditor = (project: PortfolioProject, slug: string) => {
    setFormError(null)
    setEditingProject(project)
    setOriginalSlug(slug)
  }

  const closeEditor = () => {
    setFormError(null)
    setEditingProject(null)
    setOriginalSlug('')
  }

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return
    if (!editingProject.title?.trim()) {
      failValidation('Title is required — fill it in the Slider card section at the top.')
      return
    }
    if (!editingProject.image?.trim()) {
      failValidation('Card image is required — upload an image or paste a path in the Slider card section.')
      return
    }
    setFormError(null)
    await runDashboardSave(
      setSaving,
      () =>
        savePortfolioAction(
          editingProject,
          originalSlug && projects.some((p) => p.slug === originalSlug) ? originalSlug : undefined,
        ),
      {
        showMsg,
        setCms,
        onSuccess: () => {
          closeEditor()
        },
        successMessage: 'Recent work project saved',
        errorMessage: 'Failed to save project',
      },
    )
  }

  const deleteProject = async (slug: string) => {
    if (!confirm('Delete this recent work project?')) return
    await runDashboardSave(
      setSaving,
      () => removePortfolioAction(slug),
      {
        showMsg,
        setCms,
        successMessage: 'Project deleted',
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
              <h2 className="dashboard-page-title">Recent work</h2>
              <p className="dashboard-page-desc">
                {projects.length} project{projects.length === 1 ? '' : 's'} — shown as cards in the homepage
                &ldquo;Explore Our Recent Work&rdquo; slider. Clicking a card opens the project detail page.
              </p>
            </div>
            <button
              type="button"
              className="btn-primary text-sm py-2.5 px-5"
              disabled={saving}
              onClick={() => openEditor(emptyProject(), '')}
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
                      disabled={saving}
                      onClick={() => openEditor({ ...project }, project.slug)}
                    >
                      Edit
                    </button>
                    <button type="button" className="dashboard-btn-delete" disabled={saving} onClick={() => void deleteProject(project.slug)}>
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
          footerError={formError}
          onClose={closeEditor}
          footer={
            <>
              <button type="submit" form="dashboard-recent-work-form" disabled={saving} className="btn-primary text-sm">
                {saving ? 'Saving…' : 'Save project'}
              </button>
              <button type="button" className="dashboard-btn-secondary" onClick={closeEditor}>
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
                  onChange={(v) => {
                    setFormError(null)
                    setEditingProject({ ...editingProject, title: v })
                  }}
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
                  onChange={(v) => {
                    setFormError(null)
                    setEditingProject({ ...editingProject, image: v })
                  }}
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
