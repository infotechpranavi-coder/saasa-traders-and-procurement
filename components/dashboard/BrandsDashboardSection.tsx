'use client'

import { useState } from 'react'
import type { Brand, CmsData } from '@/types/cms'
import { parseLines } from '@/lib/utils'
import { brandBelongsToCategory, getBrandCategoryIds } from '@/lib/brand-categories'
import {
  removeBrandAction,
  removeBrandCategoryAction,
  saveBrandAction,
  saveBrandCategoryAction,
} from '@/app/dashboard/actions'
import { runDashboardSave } from '@/components/dashboard/dashboard-save'
import DashboardDrawer from './DashboardDrawer'

const emptyBrand = (): Brand => ({
  slug: '',
  name: '',
  categoryId: '',
  categoryIds: [],
  description: '',
  image: '',
  equipment: [],
  listedProducts: [],
  productSlugs: [],
})

type BrandsSubTab = 'categories' | 'companies'

import type { ShowDashboardMsg } from '@/components/dashboard/useDashboardToast'

interface BrandsDashboardSectionProps {
  cms: CmsData
  setCms: (cms: CmsData) => void
  showMsg: ShowDashboardMsg
}

export default function BrandsDashboardSection({
  cms,
  setCms,
  showMsg,
}: BrandsDashboardSectionProps) {
  const [saving, setSaving] = useState(false)
  const [subTab, setSubTab] = useState<BrandsSubTab>('companies')
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [originalSlug, setOriginalSlug] = useState('')
  const [brandCategoryForm, setBrandCategoryForm] = useState<{ id: string; name: string; isEdit: boolean } | null>(
    null,
  )

  const brandCategoryNameById = Object.fromEntries(cms.brandCategories.map((c) => [c.id, c.name]))

  const saveBrandCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!brandCategoryForm) return
    await runDashboardSave(
      setSaving,
      () =>
        saveBrandCategoryAction({
          id: brandCategoryForm.id,
          name: brandCategoryForm.name,
          isEdit: brandCategoryForm.isEdit,
        }),
      {
        showMsg,
        setCms,
        onSuccess: () => setBrandCategoryForm(null),
        successMessage: 'Brand category saved',
        errorMessage: 'Failed to save brand category',
      },
    )
  }

  const deleteBrandCategory = async (id: string) => {
    if (!confirm('Delete this brand category?')) return
    await runDashboardSave(
      setSaving,
      () => removeBrandCategoryAction(id),
      {
        showMsg,
        setCms,
        successMessage: 'Brand category deleted',
        errorMessage: 'Failed to delete',
      },
    )
  }

  const saveBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBrand) return
    if (!getBrandCategoryIds(editingBrand).length) {
      showMsg('Select at least one brand category', 'error')
      return
    }
    await runDashboardSave(
      setSaving,
      () => saveBrandAction(editingBrand, originalSlug || undefined),
      {
        showMsg,
        setCms,
        onSuccess: () => {
          setEditingBrand(null)
          setOriginalSlug('')
        },
        successMessage: 'Company saved',
        errorMessage: 'Failed to save company',
      },
    )
  }

  const deleteBrand = async (slug: string) => {
    if (!confirm('Delete this company?')) return
    await runDashboardSave(
      setSaving,
      () => removeBrandAction(slug),
      {
        showMsg,
        setCms,
        successMessage: 'Company deleted',
        errorMessage: 'Failed to delete',
      },
    )
  }

  const toggleProduct = (slug: string) => {
    if (!editingBrand) return
    const selected = new Set(editingBrand.productSlugs)
    if (selected.has(slug)) selected.delete(slug)
    else selected.add(slug)
    setEditingBrand({ ...editingBrand, productSlugs: Array.from(selected) })
  }

  const toggleBrandCategory = (categoryId: string) => {
    if (!editingBrand) return
    const selected = new Set(getBrandCategoryIds(editingBrand))
    if (selected.has(categoryId)) selected.delete(categoryId)
    else selected.add(categoryId)
    const categoryIds = Array.from(selected)
    setEditingBrand({
      ...editingBrand,
      categoryId: categoryIds[0] || '',
      categoryIds,
    })
  }

  return (
    <>
      <section className="dashboard-panel">
        <div className="dashboard-panel-head">
          <div className="dashboard-page-header">
            <div>
              <h2 className="dashboard-page-title">Strong Brands</h2>
              <p className="dashboard-page-desc">
                Manage brand categories, company names, and the products listed under each company on the Strong Brands pages. A company can appear under multiple brand categories.
              </p>
            </div>
          </div>

          <div className="dashboard-subtabs">
            <button
              type="button"
              onClick={() => setSubTab('categories')}
              className={`dashboard-subtab ${subTab === 'categories' ? 'dashboard-subtab--active' : ''}`}
            >
              Brand categories
            </button>
            <button
              type="button"
              onClick={() => setSubTab('companies')}
              className={`dashboard-subtab ${subTab === 'companies' ? 'dashboard-subtab--active' : ''}`}
            >
              Companies &amp; products
            </button>
          </div>
        </div>

        <div className="dashboard-table-scroll">
          {subTab === 'categories' && (
            <>
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  className="btn-primary text-sm py-2.5 px-5"
                  onClick={() => setBrandCategoryForm({ id: '', name: '', isEdit: false })}
                >
                  + Add category
                </button>
              </div>
              <div className="dashboard-table">
                {cms.brandCategories.length === 0 ? (
                  <p className="dashboard-empty">No categories yet — e.g. Construction Equipment, Trucks, Engines.</p>
                ) : (
                  cms.brandCategories.map((category) => (
                  <div key={category.id} className="dashboard-table-row">
                    <div className="min-w-0">
                      <p className="dashboard-row-title">{category.name}</p>
                      <p className="dashboard-row-meta">
                        {category.id} · {cms.brands.filter((brand) => brandBelongsToCategory(brand, category.id)).length} compan
                        {cms.brands.filter((brand) => brandBelongsToCategory(brand, category.id)).length === 1 ? 'y' : 'ies'}
                      </p>
                    </div>
                    <div className="dashboard-row-actions">
                      <button
                        type="button"
                        className="dashboard-btn-edit"
                        onClick={() => setBrandCategoryForm({ id: category.id, name: category.name, isEdit: true })}
                      >
                        Edit
                      </button>
                      <button type="button" className="dashboard-btn-delete" onClick={() => deleteBrandCategory(category.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
              </div>
            </>
          )}

          {subTab === 'companies' && (
            <>
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  className="btn-primary text-sm py-2.5 px-5"
                  onClick={() => {
                    setEditingBrand(emptyBrand())
                    setOriginalSlug('')
                  }}
                >
                  + Add company
                </button>
              </div>
              <div className="dashboard-table">
                {cms.brands.length === 0 ? (
                  <p className="dashboard-empty">No companies yet — add a company name and list the products supplied under it.</p>
                ) : (
                  cms.brands.map((brand) => {
                    const listedCount = (brand.listedProducts?.length ?? 0) + brand.productSlugs.length
                    return (
                      <div key={brand.slug} className="dashboard-table-row">
                        <div className="min-w-0">
                          <p className="dashboard-row-title">{brand.name}</p>
                          <p className="dashboard-row-meta">
                            {brand.slug} · {getBrandCategoryIds(brand)
                              .map((categoryId) => brandCategoryNameById[categoryId] ?? categoryId)
                              .join(', ')} · {listedCount}{' '}
                            product{listedCount === 1 ? '' : 's'}
                          </p>
                        </div>
                        <div className="dashboard-row-actions">
                          <button
                            type="button"
                            className="dashboard-btn-edit"
                            onClick={() => {
                              const categoryIds = getBrandCategoryIds(brand)
                              setEditingBrand({
                                ...brand,
                                listedProducts: brand.listedProducts ?? [],
                                categoryIds,
                                categoryId: categoryIds[0] || brand.categoryId,
                              })
                              setOriginalSlug(brand.slug)
                            }}
                          >
                            Edit
                          </button>
                          <button type="button" className="dashboard-btn-delete" onClick={() => deleteBrand(brand.slug)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {brandCategoryForm && (
        <DashboardDrawer
          open
          title={brandCategoryForm.isEdit ? 'Edit brand category' : 'New brand category'}
          subtitle="e.g. Construction Equipment, Trucks, Bus & Coach, Engines"
          onClose={() => setBrandCategoryForm(null)}
          footer={
            <>
              <button type="submit" form="dashboard-brand-category-form" disabled={saving} className="btn-primary text-sm">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" className="dashboard-btn-secondary" onClick={() => setBrandCategoryForm(null)}>
                Cancel
              </button>
            </>
          }
        >
          <form id="dashboard-brand-category-form" onSubmit={saveBrandCategory} className="space-y-3">
            <Field
              label="Category name"
              value={brandCategoryForm.name}
              onChange={(v) => setBrandCategoryForm({ ...brandCategoryForm, name: v })}
            />
            {!brandCategoryForm.isEdit && (
              <Field
                label="ID (optional)"
                value={brandCategoryForm.id}
                onChange={(v) => setBrandCategoryForm({ ...brandCategoryForm, id: v })}
              />
            )}
          </form>
        </DashboardDrawer>
      )}

      {editingBrand && (
        <DashboardDrawer
          open
          title={originalSlug ? 'Edit company' : 'New company'}
          subtitle="Company appears on Strong Brands. Pick one or more categories, then add product names and/or link catalog items."
          onClose={() => {
            setEditingBrand(null)
            setOriginalSlug('')
          }}
          footer={
            <>
              <button type="submit" form="dashboard-brand-form" disabled={saving} className="btn-primary text-sm">
                {saving ? 'Saving…' : 'Save company'}
              </button>
              <button
                type="button"
                className="dashboard-btn-secondary"
                onClick={() => {
                  setEditingBrand(null)
                  setOriginalSlug('')
                }}
              >
                Cancel
              </button>
            </>
          }
        >
          <form id="dashboard-brand-form" onSubmit={saveBrand} className="space-y-0">
            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Company</p>
              <div className="space-y-3">
                <Field
                  label="Company name *"
                  value={editingBrand.name}
                  onChange={(v) => setEditingBrand({ ...editingBrand, name: v })}
                />
                <Field label="Slug" value={editingBrand.slug} onChange={(v) => setEditingBrand({ ...editingBrand, slug: v })} />
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Brand categories *</label>
                  <p className="mb-2 text-xs text-gray-500">
                    Select every category where this company should appear.
                  </p>
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
                    {cms.brandCategories.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-gray-500">Create a brand category first.</p>
                    ) : (
                      cms.brandCategories.map((category) => (
                        <label
                          key={category.id}
                          className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={getBrandCategoryIds(editingBrand).includes(category.id)}
                            onChange={() => toggleBrandCategory(category.id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="font-medium text-gray-800">{category.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <Field
                  label="Image URL"
                  value={editingBrand.image || ''}
                  onChange={(v) => setEditingBrand({ ...editingBrand, image: v })}
                />
                <TextArea
                  label="Description"
                  value={editingBrand.description || ''}
                  onChange={(v) => setEditingBrand({ ...editingBrand, description: v })}
                  rows={3}
                />
                <TextArea
                  label="Equipment types (one per line)"
                  hint="Tags on company page — e.g. Excavators, Wheel loaders"
                  value={(editingBrand.equipment ?? []).join('\n')}
                  onChange={(v) => setEditingBrand({ ...editingBrand, equipment: parseLines(v) })}
                  rows={3}
                />
              </div>
            </div>

            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Products under this company</p>
              <p className="mb-3 text-xs text-gray-500">
                Add product names as text and/or link items from your product catalog. Both appear on the company page at{' '}
                <code className="text-gray-600">/products/brands/[slug]</code>.
              </p>
              <TextArea
                label="Product names (one per line)"
                hint="Quick list — e.g. Hydraulic pumps, Track chains, Bucket teeth, Mobile wet mix plant"
                value={(editingBrand.listedProducts ?? []).join('\n')}
                onChange={(v) => setEditingBrand({ ...editingBrand, listedProducts: parseLines(v) })}
                rows={5}
              />
            </div>

            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Link catalog products</p>
              <p className="text-xs text-gray-500 mb-3">
                Tick products already created under the <strong>Products</strong> tab to show them as catalog cards on this brand page.
              </p>
              <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
                {cms.products.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-gray-500">
                    No catalog products yet. Go to <strong>Products</strong> → Add product, then return here to link them.
                  </p>
                ) : (
                  cms.products.map((product) => {
                  const checked = editingBrand.productSlugs.includes(product.slug)
                  return (
                    <label
                      key={product.slug}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleProduct(product.slug)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="font-medium text-gray-800">{product.title}</span>
                      <span className="text-xs text-gray-400 ml-auto">{product.slug}</span>
                    </label>
                  )
                })
                )}
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
