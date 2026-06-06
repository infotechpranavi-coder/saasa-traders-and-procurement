'use client'

import { useState } from 'react'
import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'
import { CMS_DEFAULT_AUTHOR, COMPANY_NAME } from '@/lib/brand'
import type { BlogPost, Category, CategoryType, CmsData, Product, Service } from '@/types/cms'
import { parseLines } from '@/lib/utils'
import {
  getDashboardData,
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

type Tab = 'products' | 'services' | 'categories' | 'blogs'

const emptyProduct = (): Product => ({
  slug: '',
  title: '',
  label: '',
  image: '/images/products/hydraulic-pump.jpg',
  desc: '',
  specs: [],
  overview: [''],
  features: [''],
  applications: [''],
})

const emptyService = (): Service => ({
  slug: '',
  title: '',
  image: '/images/services/construction-equipment.jpg',
  summary: '',
  overview: [''],
  capabilities: [''],
  industries: [''],
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
  const [originalSlug, setOriginalSlug] = useState('')
  const [categoryForm, setCategoryForm] = useState<{ id: string; name: string; type: CategoryType }>({
    id: '',
    name: '',
    type: 'product',
  })

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
    setLoading(true)
    const result = await saveProductAction(editingProduct, originalSlug || undefined)
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
    setCategoryForm({ id: '', name: '', type: 'product' })
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

  if (!authenticated) {
    return (
      <div className="dashboard-shell site-typography flex min-h-screen items-center justify-center px-4">
        <form onSubmit={login} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-5 flex justify-center">
            <BrandLogo className="brand-logo brand-logo--nav mx-auto" />
          </div>
          <h1 className="hp-title text-2xl mb-1 text-center">{COMPANY_NAME} Admin</h1>
          <p className="hp-body text-sm mb-6">Sign in to manage products, services, categories, and blog posts.</p>
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
          {(['products', 'services', 'categories', 'blogs'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t)
                setEditingProduct(null)
                setEditingService(null)
                setEditingBlog(null)
              }}
              className={`dashboard-nav-item w-full text-left capitalize ${tab === t ? 'dashboard-nav-item--active' : ''}`}
            >
              {t}
            </button>
          ))}
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex gap-2 lg:hidden">
            {(['products', 'services', 'categories', 'blogs'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize ${
                  tab === t ? 'bg-primary text-white' : 'bg-white text-gray-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'products' && cms && (
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="dashboard-panel">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="hp-subtitle text-lg">Products ({cms.products.length})</h2>
                  <button
                    type="button"
                    className="btn-primary text-sm py-2 px-4"
                    onClick={() => {
                      setEditingProduct(emptyProduct())
                      setOriginalSlug('')
                    }}
                  >
                    + Add
                  </button>
                </div>
                <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {cms.products.map((p) => (
                    <li key={p.slug} className="dashboard-list-item">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.slug}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          className="text-xs text-primary font-semibold"
                          onClick={() => {
                            setEditingProduct({ ...p })
                            setOriginalSlug(p.slug)
                          }}
                        >
                          Edit
                        </button>
                        <button type="button" className="text-xs text-red-600" onClick={() => deleteProduct(p.slug)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {editingProduct && (
                <section className="dashboard-panel">
                  <h2 className="hp-subtitle text-lg mb-4">
                    {originalSlug ? 'Edit Product' : 'New Product'}
                  </h2>
                  <form onSubmit={saveProduct} className="space-y-3">
                    <Field label="Title" value={editingProduct.title} onChange={(v) => setEditingProduct({ ...editingProduct, title: v })} />
                    <Field label="Slug" value={editingProduct.slug} onChange={(v) => setEditingProduct({ ...editingProduct, slug: v })} />
                    <Field label="Label" value={editingProduct.label} onChange={(v) => setEditingProduct({ ...editingProduct, label: v })} />
                    <Field label="Image URL" value={editingProduct.image} onChange={(v) => setEditingProduct({ ...editingProduct, image: v })} />
                    <label className="block text-xs font-semibold text-gray-600">Category</label>
                    <select
                      className="dashboard-input"
                      value={editingProduct.categoryId || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value || undefined })}
                    >
                      <option value="">None</option>
                      {productCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <TextArea label="Short description" value={editingProduct.desc} onChange={(v) => setEditingProduct({ ...editingProduct, desc: v })} rows={2} />
                    <TextArea
                      label="Specs (one per line)"
                      value={editingProduct.specs.join('\n')}
                      onChange={(v) => setEditingProduct({ ...editingProduct, specs: parseLines(v) })}
                      rows={2}
                    />
                    <TextArea
                      label="Overview (one paragraph per line)"
                      value={editingProduct.overview.join('\n')}
                      onChange={(v) => setEditingProduct({ ...editingProduct, overview: parseLines(v) })}
                      rows={3}
                    />
                    <TextArea
                      label="Features (one per line)"
                      value={editingProduct.features.join('\n')}
                      onChange={(v) => setEditingProduct({ ...editingProduct, features: parseLines(v) })}
                      rows={3}
                    />
                    <TextArea
                      label="Applications (one per line)"
                      value={editingProduct.applications.join('\n')}
                      onChange={(v) => setEditingProduct({ ...editingProduct, applications: parseLines(v) })}
                      rows={3}
                    />
                    <div className="flex gap-2 pt-2">
                      <button type="submit" disabled={loading} className="btn-primary text-sm">
                        {loading ? 'Saving…' : 'Save Product'}
                      </button>
                      <button
                        type="button"
                        className="dashboard-btn-secondary"
                        onClick={() => {
                          setEditingProduct(null)
                          setOriginalSlug('')
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </section>
              )}
            </div>
          )}

          {tab === 'services' && cms && (
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="dashboard-panel">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="hp-subtitle text-lg">Services ({cms.services.length})</h2>
                  <button
                    type="button"
                    className="btn-primary text-sm py-2 px-4"
                    onClick={() => {
                      setEditingService(emptyService())
                      setOriginalSlug('')
                    }}
                  >
                    + Add
                  </button>
                </div>
                <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {cms.services.map((s) => (
                    <li key={s.slug} className="dashboard-list-item">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{s.title}</p>
                        <p className="text-xs text-gray-400">{s.slug}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          className="text-xs text-primary font-semibold"
                          onClick={() => {
                            setEditingService({ ...s })
                            setOriginalSlug(s.slug)
                          }}
                        >
                          Edit
                        </button>
                        <button type="button" className="text-xs text-red-600" onClick={() => deleteService(s.slug)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {editingService && (
                <section className="dashboard-panel">
                  <h2 className="hp-subtitle text-lg mb-4">
                    {originalSlug ? 'Edit Service' : 'New Service'}
                  </h2>
                  <form onSubmit={saveService} className="space-y-3">
                    <Field label="Title" value={editingService.title} onChange={(v) => setEditingService({ ...editingService, title: v })} />
                    <Field label="Slug" value={editingService.slug} onChange={(v) => setEditingService({ ...editingService, slug: v })} />
                    <Field label="Image URL" value={editingService.image} onChange={(v) => setEditingService({ ...editingService, image: v })} />
                    <TextArea label="Summary" value={editingService.summary} onChange={(v) => setEditingService({ ...editingService, summary: v })} rows={2} />
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
                    <div className="flex gap-2 pt-2">
                      <button type="submit" disabled={loading} className="btn-primary text-sm">
                        {loading ? 'Saving…' : 'Save Service'}
                      </button>
                      <button
                        type="button"
                        className="dashboard-btn-secondary"
                        onClick={() => {
                          setEditingService(null)
                          setOriginalSlug('')
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </section>
              )}
            </div>
          )}

          {tab === 'categories' && cms && (
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="dashboard-panel">
                <h2 className="hp-subtitle text-lg mb-4">Categories ({cms.categories.length})</h2>
                <ul className="space-y-2">
                  {cms.categories.map((c) => (
                    <li key={c.id} className="dashboard-list-item">
                      <div>
                        <p className="font-semibold text-sm">{c.name}</p>
                        <p className="text-xs text-gray-400">
                          {c.id} · {c.type}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="text-xs text-primary font-semibold"
                          onClick={() => setCategoryForm({ id: c.id, name: c.name, type: c.type })}
                        >
                          Edit
                        </button>
                        <button type="button" className="text-xs text-red-600" onClick={() => deleteCategory(c.id)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="dashboard-panel">
                <h2 className="hp-subtitle text-lg mb-4">
                  {categoryForm.id && cms.categories.some((c) => c.id === categoryForm.id) ? 'Edit Category' : 'New Category'}
                </h2>
                <form onSubmit={saveCategory} className="space-y-3">
                  <Field label="Name" value={categoryForm.name} onChange={(v) => setCategoryForm({ ...categoryForm, name: v })} />
                  <Field
                    label="ID (slug)"
                    value={categoryForm.id}
                    onChange={(v) => setCategoryForm({ ...categoryForm, id: v })}
                  />
                  <label className="block text-xs font-semibold text-gray-600">Type</label>
                  <select
                    className="dashboard-input"
                    value={categoryForm.type}
                    onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value as CategoryType })}
                  >
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                    <option value="both">Both</option>
                  </select>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" disabled={loading} className="btn-primary text-sm">
                      Save Category
                    </button>
                    <button
                      type="button"
                      className="dashboard-btn-secondary"
                      onClick={() => setCategoryForm({ id: '', name: '', type: 'product' })}
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}

          {tab === 'blogs' && cms && (
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="dashboard-panel">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="hp-subtitle text-lg">Blog posts ({cms.blogs?.length ?? 0})</h2>
                  <button
                    type="button"
                    className="btn-primary text-sm py-2 px-4"
                    onClick={() => {
                      setEditingBlog(emptyBlog())
                      setOriginalSlug('')
                    }}
                  >
                    + Add
                  </button>
                </div>
                <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {cms.blogs?.map((post) => (
                    <li key={post.slug} className="dashboard-list-item">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{post.title}</p>
                        <p className="text-xs text-gray-400">
                          {post.slug} · {post.cat}
                          {post.featured ? ' · Featured' : ''}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          className="text-xs text-primary font-semibold"
                          onClick={() => {
                            setEditingBlog({ ...post })
                            setOriginalSlug(post.slug)
                          }}
                        >
                          Edit
                        </button>
                        <button type="button" className="text-xs text-red-600" onClick={() => deleteBlog(post.slug)}>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {editingBlog && (
                <section className="dashboard-panel">
                  <h2 className="hp-subtitle text-lg mb-4">
                    {originalSlug ? 'Edit Blog Post' : 'New Blog Post'}
                  </h2>
                  <form onSubmit={saveBlog} className="space-y-3">
                    <Field label="Title" value={editingBlog.title} onChange={(v) => setEditingBlog({ ...editingBlog, title: v })} />
                    <Field label="Slug" value={editingBlog.slug} onChange={(v) => setEditingBlog({ ...editingBlog, slug: v })} />
                    <Field label="Image URL" value={editingBlog.image} onChange={(v) => setEditingBlog({ ...editingBlog, image: v })} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Author" value={editingBlog.author} onChange={(v) => setEditingBlog({ ...editingBlog, author: v })} />
                      <Field label="Date" value={editingBlog.date} onChange={(v) => setEditingBlog({ ...editingBlog, date: v })} />
                    </div>
                    <Field label="Category tag" value={editingBlog.cat} onChange={(v) => setEditingBlog({ ...editingBlog, cat: v })} />
                    <TextArea label="Excerpt" value={editingBlog.excerpt || ''} onChange={(v) => setEditingBlog({ ...editingBlog, excerpt: v })} rows={2} />
                    <TextArea
                      label="Body (one paragraph per line)"
                      value={editingBlog.body.join('\n')}
                      onChange={(v) => setEditingBlog({ ...editingBlog, body: parseLines(v) })}
                      rows={6}
                    />
                    <div className="flex flex-wrap gap-4 text-sm">
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
                    <div className="flex gap-2 pt-2">
                      <button type="submit" disabled={loading} className="btn-primary text-sm">
                        {loading ? 'Saving…' : 'Save Blog Post'}
                      </button>
                      <button
                        type="button"
                        className="dashboard-btn-secondary"
                        onClick={() => {
                          setEditingBlog(null)
                          setOriginalSlug('')
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
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
