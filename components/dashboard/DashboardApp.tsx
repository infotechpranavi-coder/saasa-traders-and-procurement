'use client'

import { useState } from 'react'
import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'
import BrandsDashboardSection from '@/components/dashboard/BrandsDashboardSection'
import DashboardDrawer from '@/components/dashboard/DashboardDrawer'
import PointListEditor from '@/components/dashboard/PointListEditor'
import ProductCompaniesEditor from '@/components/dashboard/ProductCompaniesEditor'
import ReviewsDashboardSection from '@/components/dashboard/ReviewsDashboardSection'
import { CMS_DEFAULT_AUTHOR, COMPANY_NAME } from '@/lib/brand'
import type { BlogPost, Category, CategoryType, CmsData, PortfolioProject, Product, Service } from '@/types/cms'
import { slugify } from '@/lib/slugify'
import { parseLines } from '@/lib/utils'
import { normalizeProductCompanies } from '@/lib/product-companies'
import {
  getDashboardData,
  loginAction,
  logoutAction,
  removeBlogAction,
  removeCategoryAction,
  removePortfolioAction,
  removeProductAction,
  removeServiceAction,
  saveBlogAction,
  saveCategoryAction,
  savePortfolioAction,
  saveProductAction,
  saveServiceAction,
} from '@/app/dashboard/actions'

type Tab = 'products' | 'services' | 'categories' | 'brands' | 'blogs' | 'portfolio' | 'reviews'

const NAV_TABS: { id: Tab; label: string }[] = [
  { id: 'products', label: 'Products' },
  { id: 'services', label: 'Services' },
  { id: 'categories', label: 'Categories' },
  { id: 'brands', label: 'Strong brands' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'blogs', label: 'Blogs' },
  { id: 'portfolio', label: 'Recent work' },
]

const emptyProduct = (): Product => ({
  slug: '',
  title: '',
  label: '',
  image: '/statsic/jcb.jpg',
  desc: '',
  specs: [],
  overview: [],
  features: [],
  applications: [],
  companies: [],
  showOnHomepage: false,
})

const emptyService = (): Service => ({
  slug: '',
  title: '',
  image: '/statsic/jcb.jpg',
  summary: '',
  overview: [''],
  capabilities: [''],
  industries: [''],
  showOnHomepage: false,
})

const emptyBlog = (): BlogPost => ({
  slug: '',
  title: '',
  image: '/images/blog/featured-air.jpg',
  date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  author: CMS_DEFAULT_AUTHOR,
  cat: 'Logistics',
  excerpt: '',
  body: [''],
  featured: false,
  highlight: false,
})

const emptyPortfolio = (): PortfolioProject => ({
  slug: '',
  title: '',
  label: '',
  image: '/images/services/road.jpg',
  excerpt: '',
  body: [''],
  client: '',
  location: '',
  year: '',
})

export default function DashboardApp({
  initialAuthenticated,
  initialCms,
}: {
  initialAuthenticated: boolean
  initialCms: CmsData | null
}) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<Tab>('products')
  const [cms, setCms] = useState<CmsData | null>(initialCms)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioProject | null>(null)
  const [originalSlug, setOriginalSlug] = useState('')
  const [categoryForm, setCategoryForm] = useState<{
    id: string
    name: string
    type: CategoryType
    description: string
    image: string
  }>({
    id: '',
    name: '',
    type: 'product',
    description: '',
    image: '',
  })
  const [productCategoryFilter, setProductCategoryFilter] = useState('')
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)

  const closeDrawer = () => {
    setEditingProduct(null)
    setEditingService(null)
    setEditingBlog(null)
    setEditingPortfolio(null)
    setCategoryDrawerOpen(false)
    setCategoryForm({ id: '', name: '', type: 'product', description: '', image: '' })
    setOriginalSlug('')
  }

  const refreshCms = async () => {
    const data = await getDashboardData()
    if (data.cms) setCms(data.cms)
  }

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const result = await loginAction(password)
    if (!result.ok) {
      setLoginError(result.error || 'Invalid password')
      return
    }
    setAuthenticated(true)
    if (result.cms) setCms(result.cms)
    setPassword('')
  }

  const logout = async () => {
    await logoutAction()
    setAuthenticated(false)
    setCms(null)
  }

  const showMsg = (text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    if (!editingProduct.categoryId) {
      showMsg('Please select a product category')
      return
    }
    setLoading(true)
    const payload: Product = {
      ...editingProduct,
      overview: editingProduct.overview.map((s) => s.trim()).filter(Boolean),
      features: editingProduct.features.map((s) => s.trim()).filter(Boolean),
      applications: editingProduct.applications.map((s) => s.trim()).filter(Boolean),
      companies: normalizeProductCompanies(editingProduct.companies),
    }
    const result = await saveProductAction(payload, originalSlug || undefined)
    setLoading(false)
    if (!result.ok) {
      showMsg(result.error || 'Failed to save product')
      return
    }
    setEditingProduct(null)
    setOriginalSlug('')
    if (result.cms) setCms(result.cms)
    else await refreshCms()
    showMsg('Product saved')
  }

  const saveService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingService) return
    setLoading(true)
    const result = await saveServiceAction(editingService, originalSlug || undefined)
    setLoading(false)
    if (!result.ok) {
      showMsg(result.error || 'Failed to save service')
      return
    }
    setEditingService(null)
    setOriginalSlug('')
    if (result.cms) setCms(result.cms)
    else await refreshCms()
    showMsg('Service saved')
  }

  const deleteProduct = async (slug: string) => {
    if (!confirm('Delete this product?')) return
    const result = await removeProductAction(slug)
    if (result.cms) setCms(result.cms)
    else await refreshCms()
    showMsg('Product deleted')
  }

  const deleteService = async (slug: string) => {
    if (!confirm('Delete this service?')) return
    const result = await removeServiceAction(slug)
    if (result.cms) setCms(result.cms)
    else await refreshCms()
    showMsg('Service deleted')
  }

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const isEdit = Boolean(categoryForm.id && cms?.categories.some((c) => c.id === categoryForm.id))
    const result = await saveCategoryAction({ ...categoryForm, isEdit })
    setLoading(false)
    if (!result.ok) {
      showMsg(result.error || 'Failed to save category')
      return
    }
    setCategoryDrawerOpen(false)
    setCategoryForm({ id: '', name: '', type: 'product', description: '', image: '' })
    if (result.cms) setCms(result.cms)
    else await refreshCms()
    showMsg('Category saved')
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return
    const result = await removeCategoryAction(id)
    if (result.cms) setCms(result.cms)
    else await refreshCms()
    showMsg('Category deleted')
  }

  const saveBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBlog) return
    setLoading(true)
    const result = await saveBlogAction(editingBlog, originalSlug || undefined)
    setLoading(false)
    if (!result.ok) {
      showMsg(result.error || 'Failed to save blog')
      return
    }
    setEditingBlog(null)
    setOriginalSlug('')
    if (result.cms) setCms(result.cms)
    else await refreshCms()
    showMsg('Blog post saved')
  }

  const deleteBlog = async (slug: string) => {
    if (!confirm('Delete this blog post?')) return
    const result = await removeBlogAction(slug)
    if (result.cms) setCms(result.cms)
    else await refreshCms()
    showMsg('Blog post deleted')
  }

  const savePortfolio = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPortfolio) return
    setLoading(true)
    const result = await savePortfolioAction(editingPortfolio, originalSlug || undefined)
    setLoading(false)
    if (!result.ok) {
      showMsg(result.error || 'Failed to save project')
      return
    }
    setEditingPortfolio(null)
    setOriginalSlug('')
    if (result.cms) setCms(result.cms)
    else await refreshCms()
    showMsg('Project saved')
  }

  const deletePortfolio = async (slug: string) => {
    if (!confirm('Delete this project?')) return
    const result = await removePortfolioAction(slug)
    if (result.cms) setCms(result.cms)
    else await refreshCms()
    showMsg('Project deleted')
  }

  if (!authenticated) {
    return (
      <div className="dashboard-shell site-typography flex min-h-screen items-center justify-center px-4">
        <form onSubmit={login} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-5 flex justify-center">
            <BrandLogo className="brand-logo brand-logo--nav mx-auto" />
          </div>
          <h1 className="hp-title text-2xl mb-1 text-center">{COMPANY_NAME} Admin</h1>
          <p className="hp-body text-sm mb-6">Sign in to manage products, services, categories, blog posts, and recent work.</p>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="dashboard-input mb-4"
            placeholder="Admin password"
            required
          />
          {loginError && <p className="text-sm text-red-600 mb-3">{loginError}</p>}
          <button type="submit" className="btn-primary w-full justify-center">
            Sign In
          </button>
          <p className="mt-4 text-xs text-gray-400 text-center">
            Default password: <code className="text-gray-600">transhub2024</code> — set <code>ADMIN_PASSWORD</code> in .env
          </p>
        </form>
      </div>
    )
  }

  const productCategories = cms?.categories.filter((c) => c.type === 'product' || c.type === 'both') ?? []
  const serviceCategories = cms?.categories.filter((c) => c.type === 'service' || c.type === 'both') ?? []
  const categoryNameById = Object.fromEntries((cms?.categories ?? []).map((c) => [c.id, c.name]))
  const filteredDashboardProducts =
    cms?.products.filter((p) => !productCategoryFilter || p.categoryId === productCategoryFilter) ?? []

  return (
    <div className="dashboard-shell site-typography min-h-screen">
      <header className="dashboard-header">
        <div className="flex items-center gap-3">
          <BrandLogo className="brand-logo brand-logo--dashboard" />
          <span className="site-logo-text text-xl text-white">{COMPANY_NAME} Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-white/80 hover:text-white">
            View site
          </Link>
          <button type="button" onClick={logout} className="dashboard-btn-ghost">
            Logout
          </button>
        </div>
      </header>

      {message && <div className="dashboard-toast">{message}</div>}

      <div className="mx-auto flex max-w-[1600px] gap-0 px-4 py-6 lg:px-6">
        <aside className="dashboard-sidebar hidden w-52 shrink-0 lg:block">
          {NAV_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id)
                closeDrawer()
              }}
              className={`dashboard-nav-item w-full text-left ${tab === id ? 'dashboard-nav-item--active' : ''}`}
            >
              {label}
            </button>
          ))}
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex gap-2 lg:hidden">
            {NAV_TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setTab(id)
                  closeDrawer()
                }}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                  tab === id ? 'bg-primary text-white' : 'bg-white text-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'products' && cms && (
            <section className="dashboard-panel">
              <div className="dashboard-page-header">
                <div>
                  <h2 className="dashboard-page-title">Products</h2>
                  <p className="dashboard-page-desc">
                    {cms.products.length} item{cms.products.length === 1 ? '' : 's'} — assign a category so they appear in the public catalog filters.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary text-sm py-2.5 px-5"
                  onClick={() => {
                    setEditingProduct(emptyProduct())
                    setOriginalSlug('')
                  }}
                >
                  + Add product
                </button>
              </div>
              <div className="dashboard-toolbar">
                <label className="text-xs font-semibold text-gray-600">Filter by category</label>
                <select
                  className="dashboard-input max-w-xs"
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                >
                  <option value="">All categories</option>
                  {productCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="dashboard-table max-h-[70vh] overflow-y-auto">
                {filteredDashboardProducts.map((p) => (
                  <div key={p.slug} className="dashboard-table-row">
                    <div className="min-w-0">
                      <p className="dashboard-row-title truncate">{p.title}</p>
                      <p className="dashboard-row-meta">
                        {p.slug}
                        {p.categoryId ? ` · ${categoryNameById[p.categoryId] ?? p.categoryId}` : ' · No category'}
                      </p>
                    </div>
                    <div className="dashboard-row-actions">
                      <button
                        type="button"
                        className="dashboard-btn-edit"
                        onClick={() => {
                          setEditingProduct({ ...p })
                          setOriginalSlug(p.slug)
                        }}
                      >
                        Edit
                      </button>
                      <button type="button" className="dashboard-btn-delete" onClick={() => deleteProduct(p.slug)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'services' && cms && (
            <section className="dashboard-panel">
              <div className="dashboard-page-header">
                <div>
                  <h2 className="dashboard-page-title">Services</h2>
                  <p className="dashboard-page-desc">
                    {cms.services.length} service{cms.services.length === 1 ? '' : 's'} shown on the public services pages.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary text-sm py-2.5 px-5"
                  onClick={() => {
                    setEditingService(emptyService())
                    setOriginalSlug('')
                  }}
                >
                  + Add service
                </button>
              </div>
              <div className="dashboard-table max-h-[70vh] overflow-y-auto">
                {cms.services.map((s) => (
                  <div key={s.slug} className="dashboard-table-row">
                    <div className="min-w-0">
                      <p className="dashboard-row-title truncate">{s.title}</p>
                      <p className="dashboard-row-meta">
                        {s.slug}
                        {s.categoryId ? ` · ${categoryNameById[s.categoryId] ?? s.categoryId}` : ' · No category'}
                      </p>
                    </div>
                    <div className="dashboard-row-actions">
                      <button
                        type="button"
                        className="dashboard-btn-edit"
                        onClick={() => {
                          setEditingService({ ...s })
                          setOriginalSlug(s.slug)
                        }}
                      >
                        Edit
                      </button>
                      <button type="button" className="dashboard-btn-delete" onClick={() => deleteService(s.slug)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'categories' && cms && (
            <section className="dashboard-panel">
              <div className="dashboard-page-header">
                <div>
                  <h2 className="dashboard-page-title">Categories</h2>
                  <p className="dashboard-page-desc">
                    {cms.categories.length} categor{cms.categories.length === 1 ? 'y' : 'ies'} — categories appear as navbar sub-tabs under Products and Services.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary text-sm py-2.5 px-5"
                  onClick={() => {
                    setCategoryForm({ id: '', name: '', type: 'product', description: '', image: '' })
                    setCategoryDrawerOpen(true)
                  }}
                >
                  + Add category
                </button>
              </div>
              <div className="dashboard-table">
                {cms.categories.map((c) => {
                  const productCount = cms.products.filter((p) => p.categoryId === c.id).length
                  const serviceCount = cms.services.filter((s) => s.categoryId === c.id).length
                  return (
                    <div key={c.id} className="dashboard-table-row">
                      <div className="min-w-0">
                        <p className="dashboard-row-title">{c.name}</p>
                        <p className="dashboard-row-meta">
                          {c.id} · {c.type}
                          {(c.type === 'product' || c.type === 'both') && ` · ${productCount} product${productCount === 1 ? '' : 's'}`}
                          {(c.type === 'service' || c.type === 'both') && ` · ${serviceCount} service${serviceCount === 1 ? '' : 's'}`}
                        </p>
                      </div>
                      <div className="dashboard-row-actions">
                        <button
                          type="button"
                          className="dashboard-btn-edit"
                          onClick={() => {
                            setCategoryForm({
                              id: c.id,
                              name: c.name,
                              type: c.type,
                              description: c.description || '',
                              image: c.image || '',
                            })
                            setCategoryDrawerOpen(true)
                          }}
                        >
                          Edit
                        </button>
                        <button type="button" className="dashboard-btn-delete" onClick={() => deleteCategory(c.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {tab === 'brands' && cms && (
            <BrandsDashboardSection
              cms={cms}
              loading={loading}
              setLoading={setLoading}
              setCms={setCms}
              showMsg={showMsg}
            />
          )}

          {tab === 'reviews' && cms && (
            <ReviewsDashboardSection
              cms={cms}
              loading={loading}
              setLoading={setLoading}
              setCms={setCms}
              showMsg={showMsg}
            />
          )}

          {tab === 'blogs' && cms && (
            <section className="dashboard-panel">
              <div className="dashboard-page-header">
                <div>
                  <h2 className="dashboard-page-title">Blog posts</h2>
                  <p className="dashboard-page-desc">
                    {cms.blogs?.length ?? 0} post{(cms.blogs?.length ?? 0) === 1 ? '' : 's'} — manage articles shown on the blog and homepage.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary text-sm py-2.5 px-5"
                  onClick={() => {
                    setEditingBlog(emptyBlog())
                    setOriginalSlug('')
                  }}
                >
                  + Add post
                </button>
              </div>
              <div className="dashboard-table max-h-[70vh] overflow-y-auto">
                {cms.blogs?.map((post) => (
                  <div key={post.slug} className="dashboard-table-row">
                    <div className="min-w-0">
                      <p className="dashboard-row-title truncate">{post.title}</p>
                      <p className="dashboard-row-meta">
                        {post.slug} · {post.cat}
                        {post.featured ? ' · Featured' : ''}
                      </p>
                    </div>
                    <div className="dashboard-row-actions">
                      <button
                        type="button"
                        className="dashboard-btn-edit"
                        onClick={() => {
                          setEditingBlog({ ...post })
                          setOriginalSlug(post.slug)
                        }}
                      >
                        Edit
                      </button>
                      <button type="button" className="dashboard-btn-delete" onClick={() => deleteBlog(post.slug)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === 'portfolio' && cms && (
            <section className="dashboard-panel">
              <div className="dashboard-page-header">
                <div>
                  <h2 className="dashboard-page-title">Recent work</h2>
                  <p className="dashboard-page-desc">
                    {cms.portfolio?.length ?? 0} project{(cms.portfolio?.length ?? 0) === 1 ? '' : 's'} — cards in the homepage “Explore Our Recent Work” slider.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary text-sm py-2.5 px-5"
                  onClick={() => {
                    setEditingPortfolio(emptyPortfolio())
                    setOriginalSlug('')
                  }}
                >
                  + Add project
                </button>
              </div>
              <div className="dashboard-table max-h-[70vh] overflow-y-auto">
                {cms.portfolio?.map((project) => (
                  <div key={project.slug} className="dashboard-table-row">
                    <div className="min-w-0">
                      <p className="dashboard-row-title truncate">{project.title}</p>
                      <p className="dashboard-row-meta">
                        {project.slug} · {project.label || 'No label'}
                      </p>
                    </div>
                    <div className="dashboard-row-actions">
                      <button
                        type="button"
                        className="dashboard-btn-edit"
                        onClick={() => {
                          setEditingPortfolio({ ...project })
                          setOriginalSlug(project.slug)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="dashboard-btn-delete"
                        onClick={() => deletePortfolio(project.slug)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {editingProduct && cms && (
        <DashboardDrawer
          open
          title={originalSlug ? 'Edit product' : 'New product'}
          subtitle="Fields match what visitors see on the product detail page."
          onClose={closeDrawer}
          footer={
            <>
              <button type="submit" form="dashboard-product-form" disabled={loading} className="btn-primary text-sm">
                {loading ? 'Saving…' : 'Save product'}
              </button>
              <button type="button" className="dashboard-btn-secondary" onClick={closeDrawer}>
                Cancel
              </button>
            </>
          }
        >
          <form id="dashboard-product-form" onSubmit={saveProduct} className="space-y-0">
            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Product page</p>
              <p className="mb-3 text-xs text-gray-500">Title, label, image, and category — shown at the top of the detail page.</p>
              <div className="space-y-3">
                <Field label="Title *" value={editingProduct.title} onChange={(v) => setEditingProduct({ ...editingProduct, title: v })} />
                <Field
                  label="Label"
                  hint="Short tag under the title — e.g. Heavy Equipment, Road Machinery"
                  value={editingProduct.label}
                  onChange={(v) => setEditingProduct({ ...editingProduct, label: v })}
                />
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
                  <select
                    className="dashboard-input"
                    value={editingProduct.categoryId || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value || undefined })}
                    required
                  >
                    <option value="">Select category…</option>
                    {productCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Field label="Image URL" value={editingProduct.image} onChange={(v) => setEditingProduct({ ...editingProduct, image: v })} />
                <Field label="Slug" value={editingProduct.slug} onChange={(v) => setEditingProduct({ ...editingProduct, slug: v })} />
              </div>
            </div>

            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Catalog listing</p>
              <div className="space-y-3">
                <TextArea
                  label="Short description"
                  hint="Shown on product cards in the catalog grid."
                  value={editingProduct.desc}
                  onChange={(v) => setEditingProduct({ ...editingProduct, desc: v })}
                  rows={2}
                />
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={Boolean(editingProduct.showOnHomepage)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, showOnHomepage: e.target.checked })}
                  />
                  Show in homepage expertise section
                </label>
              </div>
            </div>

            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Overview</p>
              <PointListEditor
                label="Paragraphs"
                hint="Each point is a paragraph on the product page."
                items={editingProduct.overview}
                onChange={(overview) => setEditingProduct({ ...editingProduct, overview })}
                addLabel="Add paragraph"
                placeholder="Describe this product…"
              />
            </div>

            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Key features</p>
              <PointListEditor
                label="Features"
                hint="Shown in the sidebar on the product detail page."
                items={editingProduct.features}
                onChange={(features) => setEditingProduct({ ...editingProduct, features })}
                addLabel="Add feature"
                placeholder="e.g. High output capacity"
              />
            </div>

            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Applications</p>
              <PointListEditor
                label="Use cases"
                hint="Shown as tags under overview on the product page."
                items={editingProduct.applications}
                onChange={(applications) => setEditingProduct({ ...editingProduct, applications })}
                addLabel="Add application"
                placeholder="e.g. Highway construction"
              />
            </div>

            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Companies & equipment we supply</p>
              <ProductCompaniesEditor
                companies={editingProduct.companies ?? []}
                onChange={(companies) => setEditingProduct({ ...editingProduct, companies })}
              />
            </div>
          </form>
        </DashboardDrawer>
      )}

      {editingService && (
        <DashboardDrawer
          open
          title={originalSlug ? 'Edit service' : 'New service'}
          subtitle="Describe the service shown on your public services pages."
          onClose={closeDrawer}
          footer={
            <>
              <button type="submit" form="dashboard-service-form" disabled={loading} className="btn-primary text-sm">
                {loading ? 'Saving…' : 'Save service'}
              </button>
              <button type="button" className="dashboard-btn-secondary" onClick={closeDrawer}>
                Cancel
              </button>
            </>
          }
        >
          <form id="dashboard-service-form" onSubmit={saveService} className="space-y-0">
            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Basic info</p>
              <div className="space-y-3">
                <Field label="Title" value={editingService.title} onChange={(v) => setEditingService({ ...editingService, title: v })} />
                <Field label="Slug" value={editingService.slug} onChange={(v) => setEditingService({ ...editingService, slug: v })} />
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                  <select
                    className="dashboard-input"
                    value={editingService.categoryId || ''}
                    onChange={(e) => setEditingService({ ...editingService, categoryId: e.target.value || undefined })}
                  >
                    <option value="">Select category…</option>
                    {serviceCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Field label="Image URL" value={editingService.image} onChange={(v) => setEditingService({ ...editingService, image: v })} />
                <TextArea label="Summary" value={editingService.summary} onChange={(v) => setEditingService({ ...editingService, summary: v })} rows={2} />
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={Boolean(editingService.showOnHomepage)}
                    onChange={(e) => setEditingService({ ...editingService, showOnHomepage: e.target.checked })}
                  />
                  Show in homepage expertise section
                </label>
              </div>
            </div>
            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Page content</p>
              <div className="space-y-3">
                <TextArea
                  label="Overview (one paragraph per line)"
                  value={editingService.overview.join('\n')}
                  onChange={(v) => setEditingService({ ...editingService, overview: parseLines(v) })}
                  rows={3}
                />
                <TextArea
                  label="Capabilities (one per line)"
                  value={editingService.capabilities.join('\n')}
                  onChange={(v) => setEditingService({ ...editingService, capabilities: parseLines(v) })}
                  rows={3}
                />
                <TextArea
                  label="Industries (one per line)"
                  value={editingService.industries.join('\n')}
                  onChange={(v) => setEditingService({ ...editingService, industries: parseLines(v) })}
                  rows={3}
                />
              </div>
            </div>
          </form>
        </DashboardDrawer>
      )}

      {categoryDrawerOpen && cms && (
        <DashboardDrawer
          open
          title={categoryForm.id && cms.categories.some((c) => c.id === categoryForm.id) ? 'Edit category' : 'New category'}
          subtitle="Shown on the category details page, navbar menu, and product/service listings."
          onClose={closeDrawer}
          footer={
            <>
              <button type="submit" form="dashboard-category-form" disabled={loading} className="btn-primary text-sm">
                {loading ? 'Saving…' : 'Save category'}
              </button>
              <button type="button" className="dashboard-btn-secondary" onClick={closeDrawer}>
                Cancel
              </button>
            </>
          }
        >
          <form id="dashboard-category-form" onSubmit={saveCategory} className="space-y-3">
            <Field
              label="Name"
              value={categoryForm.name}
              onChange={(v) => {
                const isNew = !categoryForm.id || !cms.categories.some((c) => c.id === categoryForm.id)
                setCategoryForm({
                  ...categoryForm,
                  name: v,
                  id: isNew ? slugify(v) : categoryForm.id,
                })
              }}
            />
            <Field label="ID (slug)" value={categoryForm.id} onChange={(v) => setCategoryForm({ ...categoryForm, id: v })} />
            <TextArea
              label="Description (shown on category page)"
              value={categoryForm.description}
              onChange={(v) => setCategoryForm({ ...categoryForm, description: v })}
              rows={3}
            />
            <Field
              label="Image URL (category page hero)"
              value={categoryForm.image}
              onChange={(v) => setCategoryForm({ ...categoryForm, image: v })}
            />
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
              <select
                className="dashboard-input"
                value={categoryForm.type}
                onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value as CategoryType })}
              >
                <option value="product">Product</option>
                <option value="service">Service</option>
                <option value="both">Both</option>
              </select>
            </div>
          </form>
        </DashboardDrawer>
      )}

      {editingBlog && (
        <DashboardDrawer
          open
          title={originalSlug ? 'Edit blog post' : 'New blog post'}
          subtitle="Publish articles to the blog and optionally feature them on the homepage."
          onClose={closeDrawer}
          footer={
            <>
              <button type="submit" form="dashboard-blog-form" disabled={loading} className="btn-primary text-sm">
                {loading ? 'Saving…' : 'Save post'}
              </button>
              <button type="button" className="dashboard-btn-secondary" onClick={closeDrawer}>
                Cancel
              </button>
            </>
          }
        >
          <form id="dashboard-blog-form" onSubmit={saveBlog} className="space-y-0">
            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Basic info</p>
              <div className="space-y-3">
                <Field label="Title" value={editingBlog.title} onChange={(v) => setEditingBlog({ ...editingBlog, title: v })} />
                <Field label="Slug" value={editingBlog.slug} onChange={(v) => setEditingBlog({ ...editingBlog, slug: v })} />
                <Field label="Image URL" value={editingBlog.image} onChange={(v) => setEditingBlog({ ...editingBlog, image: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Author" value={editingBlog.author} onChange={(v) => setEditingBlog({ ...editingBlog, author: v })} />
                  <Field label="Date" value={editingBlog.date} onChange={(v) => setEditingBlog({ ...editingBlog, date: v })} />
                </div>
                <Field label="Category tag" value={editingBlog.cat} onChange={(v) => setEditingBlog({ ...editingBlog, cat: v })} />
              </div>
            </div>
            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Content</p>
              <div className="space-y-3">
                <TextArea label="Excerpt" value={editingBlog.excerpt || ''} onChange={(v) => setEditingBlog({ ...editingBlog, excerpt: v })} rows={2} />
                <TextArea
                  label="Body (one paragraph per line)"
                  value={editingBlog.body.join('\n')}
                  onChange={(v) => setEditingBlog({ ...editingBlog, body: parseLines(v) })}
                  rows={6}
                />
              </div>
            </div>
            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Visibility</p>
              <div className="flex flex-col gap-3 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(editingBlog.featured)}
                    onChange={(e) => setEditingBlog({ ...editingBlog, featured: e.target.checked })}
                  />
                  Featured on homepage
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(editingBlog.highlight)}
                    onChange={(e) => setEditingBlog({ ...editingBlog, highlight: e.target.checked })}
                  />
                  Highlight in sidebar
                </label>
              </div>
            </div>
          </form>
        </DashboardDrawer>
      )}

      {editingPortfolio && (
        <DashboardDrawer
          open
          title={originalSlug ? 'Edit project' : 'New project'}
          subtitle="Shown as a card in the homepage “Explore Our Recent Work” section. Clicking opens the project detail page."
          onClose={closeDrawer}
          footer={
            <>
              <button type="submit" form="dashboard-portfolio-form" disabled={loading} className="btn-primary text-sm">
                {loading ? 'Saving…' : 'Save project'}
              </button>
              <button type="button" className="dashboard-btn-secondary" onClick={closeDrawer}>
                Cancel
              </button>
            </>
          }
        >
          <form id="dashboard-portfolio-form" onSubmit={savePortfolio} className="space-y-0">
            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Card</p>
              <div className="space-y-3">
                <Field
                  label="Title"
                  value={editingPortfolio.title}
                  onChange={(v) => setEditingPortfolio({ ...editingPortfolio, title: v })}
                />
                <Field
                  label="Slug"
                  value={editingPortfolio.slug}
                  onChange={(v) => setEditingPortfolio({ ...editingPortfolio, slug: v })}
                />
                <Field
                  label="Label (e.g. Road Transport)"
                  value={editingPortfolio.label}
                  onChange={(v) => setEditingPortfolio({ ...editingPortfolio, label: v })}
                />
                <Field
                  label="Image URL"
                  value={editingPortfolio.image}
                  onChange={(v) => setEditingPortfolio({ ...editingPortfolio, image: v })}
                />
              </div>
            </div>
            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Detail page</p>
              <div className="space-y-3">
                <TextArea
                  label="Excerpt"
                  value={editingPortfolio.excerpt || ''}
                  onChange={(v) => setEditingPortfolio({ ...editingPortfolio, excerpt: v })}
                  rows={2}
                />
                <TextArea
                  label="Body (one paragraph per line)"
                  value={editingPortfolio.body.join('\n')}
                  onChange={(v) => setEditingPortfolio({ ...editingPortfolio, body: parseLines(v) })}
                  rows={6}
                />
                <div className="grid grid-cols-3 gap-3">
                  <Field
                    label="Client"
                    value={editingPortfolio.client || ''}
                    onChange={(v) => setEditingPortfolio({ ...editingPortfolio, client: v })}
                  />
                  <Field
                    label="Location"
                    value={editingPortfolio.location || ''}
                    onChange={(v) => setEditingPortfolio({ ...editingPortfolio, location: v })}
                  />
                  <Field
                    label="Year"
                    value={editingPortfolio.year || ''}
                    onChange={(v) => setEditingPortfolio({ ...editingPortfolio, year: v })}
                  />
                </div>
              </div>
            </div>
          </form>
        </DashboardDrawer>
      )}
    </div>
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
