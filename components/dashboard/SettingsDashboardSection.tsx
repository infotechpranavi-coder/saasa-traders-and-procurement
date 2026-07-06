'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CmsData, HeroStatSetting, SiteSettings } from '@/types/cms'
import { normalizeSiteSettings, resolveHeroStats } from '@/lib/site-settings'
import { saveSiteSettingsAction } from '@/app/superadmin/actions'
import { runDashboardSave } from '@/components/dashboard/dashboard-save'
import type { ShowDashboardMsg } from '@/components/dashboard/useDashboardToast'

interface SettingsDashboardSectionProps {
  cms: CmsData
  setCms: (cms: CmsData) => void
  showMsg: ShowDashboardMsg
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-field">
      <label className="dashboard-field-label">{label}</label>
      {hint && <p className="dashboard-field-hint">{hint}</p>}
      {children}
    </div>
  )
}

export default function SettingsDashboardSection({ cms, setCms, showMsg }: SettingsDashboardSectionProps) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<SiteSettings>(() => normalizeSiteSettings(cms.siteSettings))

  useEffect(() => {
    setForm(normalizeSiteSettings(cms.siteSettings))
  }, [cms.siteSettings])

  const previewStats = useMemo(() => resolveHeroStats(form), [form])

  const updateStat = (index: 0 | 1 | 2, patch: Partial<HeroStatSetting>) => {
    setForm((current) => {
      const heroStats = [...current.heroStats] as SiteSettings['heroStats']
      heroStats[index] = { ...heroStats[index], ...patch }
      return { ...current, heroStats }
    })
  }

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    await runDashboardSave(
      setSaving,
      () => saveSiteSettingsAction(form),
      {
        showMsg,
        setCms,
        successMessage: 'Homepage hero stats updated',
        errorMessage: 'Failed to save settings',
      },
    )
  }

  return (
    <section className="dashboard-panel">
      <form className="dashboard-panel-form" onSubmit={saveSettings}>
        <div className="dashboard-panel-head dashboard-panel-head--bordered">
          <div className="dashboard-page-header">
            <div className="dashboard-page-header__copy">
              <h2 className="dashboard-page-title">Site settings</h2>
              <p className="dashboard-page-desc">
                Control the three stats at the bottom of the homepage hero. Set your establishment year so the
                years stat updates automatically (e.g. 2016 → 10+ in 2026).
              </p>
            </div>
            <button type="submit" className="btn-primary dashboard-page-header__action" disabled={saving}>
              {saving ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </div>

        <div className="dashboard-panel-body">
          <div className="dashboard-settings-help">
            <p>
              <strong>How to use:</strong> Edit the labels and values below, then click <strong>Save settings</strong>.
              Changes appear on the homepage hero immediately. Use <em>Auto years from establishment</em> for the
              middle stat so it counts from your founded year.
            </p>
          </div>

          <div className="dashboard-form-section">
            <p className="dashboard-form-section-title">Establishment year</p>
            <div className="dashboard-settings-year-row">
              <Field
                label="Year founded"
                hint="Used when a stat is set to auto-calculate years. Match EST 2016 in hero badges."
              >
                <input
                  type="number"
                  className="dashboard-input dashboard-input--compact"
                  min={1900}
                  max={new Date().getFullYear()}
                  value={form.establishedYear}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      establishedYear: Number(e.target.value) || current.establishedYear,
                    }))
                  }
                />
              </Field>
            </div>
          </div>

          <div className="dashboard-form-section dashboard-form-section--last">
            <p className="dashboard-form-section-title">Hero footer stats</p>
            <div className="dashboard-settings-stats-grid">
              {form.heroStats.map((stat, index) => (
                <div key={`hero-stat-${index}`} className="dashboard-settings-stat-card">
                  <p className="dashboard-settings-stat-card__badge">Stat {index + 1}</p>

                  <Field label="Label">
                    <input
                      className="dashboard-input"
                      value={stat.label}
                      onChange={(e) => updateStat(index as 0 | 1 | 2, { label: e.target.value })}
                      placeholder="PRODUCT LINES"
                    />
                  </Field>

                  <Field label="Display mode">
                    <select
                      className="dashboard-input"
                      value={stat.type}
                      onChange={(e) =>
                        updateStat(index as 0 | 1 | 2, {
                          type: e.target.value === 'years_since' ? 'years_since' : 'manual',
                        })
                      }
                    >
                      <option value="manual">Manual value</option>
                      <option value="years_since">Auto years from establishment</option>
                    </select>
                  </Field>

                  {stat.type === 'manual' ? (
                    <Field label="Value" hint="e.g. 150+, 2K+, 40+">
                      <input
                        className="dashboard-input"
                        value={stat.value}
                        onChange={(e) => updateStat(index as 0 | 1 | 2, { value: e.target.value })}
                        placeholder="150+"
                      />
                    </Field>
                  ) : (
                    <div className="dashboard-settings-auto-note">
                      Shows{' '}
                      <strong>{Math.max(1, new Date().getFullYear() - form.establishedYear)}+</strong> (
                      {new Date().getFullYear()} − {form.establishedYear})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-settings-preview">
            <p className="dashboard-settings-preview__label">Live preview</p>
            <div className="dashboard-settings-preview__stats">
              {previewStats.map((item) => (
                <div key={item.label} className="dashboard-settings-preview__stat">
                  <p className="dashboard-settings-preview__value">{item.value}</p>
                  <p className="dashboard-settings-preview__stat-label">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}
