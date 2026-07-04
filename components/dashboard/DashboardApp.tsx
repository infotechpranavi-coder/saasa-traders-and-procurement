'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import BrandLogo from '@/components/BrandLogo'
import BrochureDashboardSection from '@/components/dashboard/BrochureDashboardSection'
import BrandsDashboardSection from '@/components/dashboard/BrandsDashboardSection'
import DashboardDrawer from '@/components/dashboard/DashboardDrawer'
import HeroBannersDashboardSection from '@/components/dashboard/HeroBannersDashboardSection'
import PointListEditor from '@/components/dashboard/PointListEditor'
import ProductCompaniesEditor from '@/components/dashboard/ProductCompaniesEditor'
import EnquiriesDashboardSection from '@/components/dashboard/EnquiriesDashboardSection'
import NewsletterDashboardSection from '@/components/dashboard/NewsletterDashboardSection'
import RecentWorkDashboardSection from '@/components/dashboard/RecentWorkDashboardSection'
import ReviewsDashboardSection from '@/components/dashboard/ReviewsDashboardSection'
import { COMPANY_NAME } from '@/lib/brand'
import type { BlogPost, Category, CategoryType, CmsData, Product, Service } from '@/types/cms'
import { slugify } from '@/lib/slugify'
import { parseLines } from '@/lib/utils'
import { normalizeProductCompanies } from '@/lib/product-companies'
import { getProductImages, normalizeProductImageFields } from '@/lib/product-images'
import ImageUrlField from '@/components/dashboard/ImageUrlField'
import MultiImageUrlField from '@/components/dashboard/MultiImageUrlField'
import BulkImportPanel from '@/components/superadmin/BulkImportPanel'
import {
  loginAction,
  logoutAction,
  removeBlogAction,
  removeCategoryAction,
  removeProductAction,
  removeServiceAction,
  saveBlogAction,
  saveCategoryAction,
  saveProductAction,
  saveServiceAction,
} from '@/app/dashboard/actions'
import { loginSuperAdminAction, logoutSuperAdminAction } from '@/app/superadmin/actions'
import { runDashboardSave } from '@/components/dashboard/dashboard-save'
import DashboardToast from '@/components/dashboard/DashboardToast'
import { useDashboardToast } from '@/components/dashboard/useDashboardToast'

type Tab =
  | 'products'
  | 'services'
  | 'categories'
  | 'brands'
  | 'hero'
  | 'blogs'
  | 'portfolio'
  | 'reviews'
  | 'brochure'
  | 'enquiries'
  | 'newsletter'

const NAV_TABS: { id: Tab; label: string }[] = [
  { id: 'products', label: 'Products' },
  { id: 'services', label: 'Services' },
  { id: 'categories', label: 'Product categories' },
  { id: 'brands', label: 'Strong brands' },
  { id: 'hero', label: 'Hero banners' },
  { id: 'portfolio', label: 'Recent work' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'blogs', label: 'Blogs' },
  { id: 'brochure', label: 'Catalog' },
  { id: 'enquiries', label: 'Enquiries' },
  { id: 'newsletter', label: 'Newsletter' },
]

function isDashboardTab(value: string | null): value is Tab {
  return value !== null && NAV_TABS.some((item) => item.id === value)
}

const emptyProduct = (): Product => ({
  slug: '',
  title: '',
  label: '',
  image: '',
  images: [],
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
  image: '',
  summary: '',
  overview: [],
  capabilities: [],
  industries: [],
  showOnHomepage: false,
  showInFooter: false,
})

const emptyBlog = (): BlogPost => ({
  slug: '',
  title: '',
  image: '',
  date: '',
  author: '',
  cat: '',
  excerpt: '',
  body: [],
  featured: false,
  highlight: false,
})

export default function DashboardApp({
  initialAuthenticated,
  initialCms,
  mode = 'admin',
  enableBulkImport = false,
}: {
  initialAuthenticated: boolean
  initialCms: CmsData | null
  mode?: 'admin' | 'superadmin'
  enableBulkImport?: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [authenticated, setAuthenticated] = useState(initialAuthenticated)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<Tab>('products')
  const [cms, setCms] = useState<CmsData | null>(initialCms)
  const [saving, setSaving] = useState(false)
  const { toast, showMsg } = useDashboardToast()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [originalSlug, setOriginalSlug] = useState('')
  const [categoryForm, setCategoryForm] = useState<{
    id: string
    name: string
    type: CategoryType | ''
    description: string
    image: string
    showInFooter: boolean
  }>({
    id: '',
    name: '',
    type: '',
    description: '',
    image: '',
    showInFooter: false,
  })
  const [productCategoryFilter, setProductCategoryFilter] = useState('')
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)

  const closeDrawer = () => {
    setEditingProduct(null)
    setEditingService(null)
    setEditingBlog(null)
    setCategoryDrawerOpen(false)
    setCategoryForm({ id: '', name: '', type: '', description: '', image: '', showInFooter: false })
    setOriginalSlug('')
  }

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (isDashboardTab(tabFromUrl)) {
      setTab(tabFromUrl)
    }
  }, [searchParams])

  const selectTab = useCallback(
    (id: Tab) => {
      setTab(id)
      closeDrawer()
      const params = new URLSearchParams(searchParams.toString())
      params.set('tab', id)
      router.replace(`/dashboard?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const result =
      mode === 'superadmin'
        ? await loginSuperAdminAction(username, password)
        : await loginAction(username, password)
    if (!result.ok) {
      setLoginError(result.error || 'Invalid username or password')
      return
    }
    setAuthenticated(true)
    if (result.cms) setCms(result.cms)
    setUsername('')
    setPassword('')
  }

  const logout = async () => {
    if (mode === 'superadmin') {
      await logoutSuperAdminAction()
    } else {
      await logoutAction()
    }
    setAuthenticated(false)
    setCms(null)
  }

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    if (!editingProduct.categoryId) {
      showMsg('Please select a product category', 'error')
      return
    }
    const { image, images } = normalizeProductImageFields(
      editingProduct.image,
      editingProduct.images?.length ? editingProduct.images : getProductImages(editingProduct),
    )
    const payload: Product = {
      ...editingProduct,
      image,
      images,
      overview: editingProduct.overview.map((s) => s.trim()).filter(Boolean),
      features: editingProduct.features.map((s) => s.trim()).filter(Boolean),
      applications: editingProduct.applications.map((s) => s.trim()).filter(Boolean),
      companies: normalizeProductCompanies(editingProduct.companies),
    }
    await runDashboardSave(
      setSaving,
      () => saveProductAction(payload, originalSlug || undefined),
      {
        showMsg,
        setCms,
        onSuccess: () => {
          setEditingProduct(null)
          setOriginalSlug('')
        },
        successMessage: 'Product saved',
        errorMessage: 'Failed to save product',
      },
    )
  }

  const saveService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingService) return
    await runDashboardSave(
      setSaving,
      () => saveServiceAction(editingService, originalSlug || undefined),
      {
        showMsg,
        setCms,
        onSuccess: () => {
          setEditingService(null)
          setOriginalSlug('')
        },
        successMessage: 'Service saved',
        errorMessage: 'Failed to save service',
      },
    )
  }

  const deleteProduct = async (slug: string) => {
    if (!confirm('Delete this product?')) return
    await runDashboardSave(
      setSaving,
      () => removeProductAction(slug),
      { showMsg, setCms, successMessage: 'Product deleted', errorMessage: 'Failed to delete product' },
    )
  }

  const deleteService = async (slug: string) => {
    if (!confirm('Delete this service?')) return
    await runDashboardSave(
      setSaving,
      () => removeServiceAction(slug),
      { showMsg, setCms, successMessage: 'Service deleted', errorMessage: 'Failed to delete service' },
    )
  }

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryForm.type) {
      showMsg('Please select a category type', 'error')
      return
    }
    const isEdit = Boolean(categoryForm.id && cms?.categories.some((c) => c.id === categoryForm.id))
    await runDashboardSave(
      setSaving,
      () => saveCategoryAction({ ...categoryForm, type: categoryForm.type as CategoryType, isEdit }),
      {
        showMsg,
        setCms,
        onSuccess: () => {
          setCategoryDrawerOpen(false)
          setCategoryForm({ id: '', name: '', type: '', description: '', image: '', showInFooter: false })
        },
        successMessage: 'Category saved',
        errorMessage: 'Failed to save category',
      },
    )
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return
    await runDashboardSave(
      setSaving,
      () => removeCategoryAction(id),
      { showMsg, setCms, successMessage: 'Category deleted', errorMessage: 'Failed to delete category' },
    )
  }

  const saveBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBlog) return
    if (!editingBlog.title?.trim()) {
      showMsg('Title is required', 'error')
      return
    }
    const isEdit = Boolean(originalSlug && cms?.blogs.some((b) => b.slug === originalSlug))
    const payload: BlogPost = {
      ...editingBlog,
      body: (editingBlog.body ?? []).map((paragraph) => paragraph.trim()).filter(Boolean),
    }
    await runDashboardSave(
      setSaving,
      () => saveBlogAction(payload, isEdit ? originalSlug : undefined),
      {
        showMsg,
        setCms,
        onSuccess: () => {
          setEditingBlog(null)
          setOriginalSlug('')
        },
        successMessage: 'Blog post saved',
        errorMessage: 'Failed to save blog',
      },
    )
  }

  const deleteBlog = async (slug: string) => {
    if (!confirm('Delete this blog post?')) return
    await runDashboardSave(
      setSaving,
      () => removeBlogAction(slug),
      { showMsg, setCms, successMessage: 'Blog post deleted', errorMessage: 'Failed to delete blog post' },
    )
  }

  if (!authenticated) {
    return (
      <div className="dashboard-login-shell site-typography">
        <form onSubmit={login} className="dashboard-login-card">
          <div className="mb-5 flex justify-center">
            <BrandLogo className="brand-logo brand-logo--nav mx-auto" />
          </div>
          <h1 className="hp-title text-2xl mb-1 text-center">
            {COMPANY_NAME} {mode === 'superadmin' ? 'Super Admin' : 'Admin'}
          </h1>
          <p className="hp-body text-sm mb-6">
            {mode === 'superadmin'
              ? 'Superadmin sign-in — bulk Excel import plus full content management.'
              : 'Sign in with your admin username and password to manage site content.'}
          </p>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="dashboard-input mb-4"
            placeholder="Admin username"
            autoComplete="username"
            required
          />
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="dashboard-input mb-4"
            placeholder="Admin password"
            autoComplete="current-password"
            required
          />
          {loginError && <p className="text-sm text-red-600 mb-3">{loginError}</p>}
          <button type="submit" className="btn-primary w-full justify-center">
            Sign In
          </button>
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
    <div className="dashboard-shell site-typography">
      <header className="dashboard-header">
        <div className="flex items-center gap-3">
          <BrandLogo className="brand-logo brand-logo--dashboard" />
          <span className="site-logo-text text-xl text-white">
            {COMPANY_NAME} {mode === 'superadmin' ? 'Super Admin' : 'Dashboard'}
          </span>
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

      <DashboardToast toast={toast} />

      <div className="dashboard-body">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-inner">
            <p className="dashboard-sidebar-label">Content</p>
            {NAV_TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => selectTab(id)}
                className={`dashboard-nav-item ${tab === id ? 'dashboard-nav-item--active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-mobile-tabs lg:hidden">
            {NAV_TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => selectTab(id)}
                className={`dashboard-mobile-tab ${tab === id ? 'dashboard-mobile-tab--active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'products' && cms && (
            <section className="dashboard-panel">
              <div className="dashboard-panel-head">
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
                      closeDrawer()
                      setEditingProduct(emptyProduct())
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
              </div>
              {enableBulkImport && cms && (
                <BulkImportPanel kind="products" setCms={setCms} showMsg={showMsg} />
              )}
              <div className="dashboard-table-scroll">
                <div className="dashboard-table">
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
                          closeDrawer()
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
              </div>
            </section>
          )}

          {tab === 'services' && cms && (
            <section className="dashboard-panel">
              <div className="dashboard-panel-head">
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
                      closeDrawer()
                      setEditingService(emptyService())
                    }}
                  >
                    + Add service
                  </button>
                </div>
              </div>
              {enableBulkImport && cms && (
                <BulkImportPanel kind="services" setCms={setCms} showMsg={showMsg} />
              )}
              <div className="dashboard-table-scroll">
                <div className="dashboard-table">
                {cms.services.map((s) => (
                  <div key={s.slug} className="dashboard-table-row">
                    <div className="min-w-0">
                      <p className="dashboard-row-title truncate">{s.title}</p>
                      <p className="dashboard-row-meta">
                        {s.slug}
                        {s.categoryId ? ` · ${categoryNameById[s.categoryId] ?? s.categoryId}` : ' · No category'}
                        {s.showInFooter ? ' · Footer' : ''}
                      </p>
                    </div>
                    <div className="dashboard-row-actions">
                      <button
                        type="button"
                        className="dashboard-btn-edit"
                        onClick={() => {
                          closeDrawer()
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
              </div>
            </section>
          )}

          {tab === 'categories' && cms && (
            <section className="dashboard-panel">
              <div className="dashboard-panel-head">
                <div className="dashboard-page-header">
                  <div>
                    <h2 className="dashboard-page-title">Product categories</h2>
                    <p className="dashboard-page-desc">
                      {cms.categories.length} product categor{cms.categories.length === 1 ? 'y' : 'ies'} — used in the catalog, navbar, and optionally the site footer.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-primary text-sm py-2.5 px-5"
                    onClick={() => {
                      setCategoryForm({ id: '', name: '', type: '', description: '', image: '', showInFooter: false })
                      setCategoryDrawerOpen(true)
                    }}
                  >
                    + Add product category
                  </button>
                </div>
              </div>
              {enableBulkImport && cms && (
                <BulkImportPanel kind="categories" setCms={setCms} showMsg={showMsg} />
              )}
              <div className="dashboard-table-scroll">
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
                          {c.showInFooter ? ' · Footer' : ''}
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
                              showInFooter: Boolean(c.showInFooter),
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
              </div>
            </section>
          )}

          {tab === 'brands' && cms && (
            <BrandsDashboardSection cms={cms} setCms={setCms} showMsg={showMsg} />
          )}

          {tab === 'hero' && cms && (
            <HeroBannersDashboardSection cms={cms} setCms={setCms} showMsg={showMsg} />
          )}

          {tab === 'portfolio' && cms && (
            <RecentWorkDashboardSection cms={cms} setCms={setCms} showMsg={showMsg} />
          )}

          {tab === 'reviews' && cms && (
            <ReviewsDashboardSection cms={cms} setCms={setCms} showMsg={showMsg} />
          )}

          {tab === 'brochure' && cms && (
            <BrochureDashboardSection cms={cms} setCms={setCms} showMsg={showMsg} />
          )}

          {tab === 'enquiries' && <EnquiriesDashboardSection showMsg={showMsg} />}

          {tab === 'newsletter' && <NewsletterDashboardSection showMsg={showMsg} />}

          {tab === 'blogs' && cms && (
            <section className="dashboard-panel">
              <div className="dashboard-panel-head">
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
                      closeDrawer()
                      setEditingBlog(emptyBlog())
                    }}
                  >
                    + Add post
                  </button>
                </div>
              </div>
              <div className="dashboard-table-scroll">
                <div className="dashboard-table">
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
                          closeDrawer()
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
              <button type="submit" form="dashboard-product-form" disabled={saving} className="btn-primary text-sm">
                {saving ? 'Saving…' : 'Save product'}
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
                <MultiImageUrlField
                  label="Product images"
                  images={
                    editingProduct.images?.length
                      ? editingProduct.images
                      : getProductImages(editingProduct)
                  }
                  onChange={(images) =>
                    setEditingProduct({
                      ...editingProduct,
                      images,
                      image: images.find((s) => s.trim())?.trim() ?? '',
                    })
                  }
                />
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
              <button type="submit" form="dashboard-service-form" disabled={saving} className="btn-primary text-sm">
                {saving ? 'Saving…' : 'Save service'}
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
                <ImageUrlField
                  label="Service image"
                  imagesOnly
                  value={editingService.image}
                  onChange={(v) => setEditingService({ ...editingService, image: v })}
                />
                <TextArea label="Summary" value={editingService.summary} onChange={(v) => setEditingService({ ...editingService, summary: v })} rows={2} />
              </div>
            </div>
            <div className="dashboard-form-section">
              <p className="dashboard-form-section-title">Visibility</p>
              <p className="mb-3 text-xs text-gray-500">
                Control where this service appears on the public site. Footer only lists services with the footer option enabled.
              </p>
              <div className="flex flex-col gap-3 text-sm">
                <label className="flex items-center gap-2 font-medium text-gray-700">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={Boolean(editingService.showInFooter)}
                    onChange={(e) => setEditingService({ ...editingService, showInFooter: e.target.checked })}
                  />
                  Show in site footer
                </label>
                <label className="flex items-center gap-2 font-medium text-gray-700">
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
          title={categoryForm.id && cms.categories.some((c) => c.id === categoryForm.id) ? 'Edit product category' : 'New product category'}
          subtitle="Shown on category pages, catalog filters, navbar menus, and optionally the site footer."
          onClose={closeDrawer}
          footer={
            <>
              <button type="submit" form="dashboard-category-form" disabled={saving} className="btn-primary text-sm">
                {saving ? 'Saving…' : 'Save product category'}
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
            <ImageUrlField
              label="Category image (page hero)"
              imagesOnly
              value={categoryForm.image}
              onChange={(v) => setCategoryForm({ ...categoryForm, image: v })}
            />
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
              <select
                className="dashboard-input"
                value={categoryForm.type}
                onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value as CategoryType | '' })}
                required
              >
                <option value="">Select type…</option>
                <option value="product">Product</option>
                <option value="service">Service</option>
                <option value="both">Both</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                checked={categoryForm.showInFooter}
                onChange={(e) => setCategoryForm({ ...categoryForm, showInFooter: e.target.checked })}
              />
              Show in site footer (product categories column)
            </label>
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
              <button type="submit" form="dashboard-blog-form" disabled={saving} className="btn-primary text-sm">
                {saving ? 'Saving…' : 'Save post'}
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
                <ImageUrlField
                  label="Blog image"
                  imagesOnly
                  value={editingBlog.image}
                  onChange={(v) => setEditingBlog({ ...editingBlog, image: v })}
                />
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
