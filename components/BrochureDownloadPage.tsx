'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, FileDown, Mail, MessageCircle } from 'lucide-react'
import { SectionLabelIcon } from '@/components/icons/LogisticsIcons'
import { brochurePage } from '@/lib/brochure-content'
import { COMPANY_NAME, COMPANY_PHONE_TEL } from '@/lib/brand'
import { brochureDownloadFilename } from '@/lib/brochure-filename'
import type { BrochureFile } from '@/types/cms'

const WHATSAPP_URL = `https://wa.me/${COMPANY_PHONE_TEL.replace(/\D/g, '')}?text=${encodeURIComponent(
  'Hello, I just downloaded your product catalog and have a question.',
)}`

interface BrochureDownloadPageProps {
  brochure: BrochureFile
}

interface FormState {
  name: string
  company: string
  email: string
  phone: string
}

const emptyForm = (): FormState => ({
  name: '',
  company: '',
  email: '',
  phone: '',
})

async function downloadBrochureFile(url: string, filename: string) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('fetch failed')
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = blobUrl
    anchor.download = filename
    anchor.rel = 'noopener'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(blobUrl)
    return
  } catch {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }
}

export default function BrochureDownloadPage({ brochure }: BrochureDownloadPageProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ emailSent: boolean; email: string } | null>(null)
  const downloadRef = useRef<HTMLAnchorElement>(null)

  const downloadName = brochureDownloadFilename(brochure)

  useEffect(() => {
    if (window.location.hash === '#download') {
      window.setTimeout(() => {
        document.getElementById('download')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [])

  const triggerDownload = (url = brochure.url) => {
    void downloadBrochureFile(url, downloadName)
    downloadRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/brochure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json()) as {
        ok?: boolean
        error?: string
        emailSent?: boolean
        downloadUrl?: string
      }

      if (!res.ok || !data.ok) {
        setError(data.error || 'Failed to submit. Please try again.')
        return
      }

      const submittedEmail = form.email.trim()
      setSuccess({ emailSent: Boolean(data.emailSent), email: submittedEmail })
      setForm(emptyForm())
      window.setTimeout(() => triggerDownload(data.downloadUrl || brochure.url), 150)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSuccess(null)
    setError('')
    setForm(emptyForm())
  }

  return (
    <section className="brochure-page">
      <div className="max-w-7xl mx-auto px-4">
        <div id="download" className="brochure-layout scroll-mt-28">
          <aside className="brochure-intro">
            <div className="section-label mb-4">
              <SectionLabelIcon className="text-primary" />
              {brochurePage.eyebrow}
            </div>

            <h2 className="brochure-intro__title">{brochurePage.title}</h2>
            <p className="brochure-intro__lead">{brochurePage.lead}</p>

            <ul className="brochure-intro__list">
              {brochurePage.highlights.map((item) => (
                <li key={item} className="brochure-intro__item">
                  <span className="brochure-intro__check" aria-hidden>
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="brochure-file-chip">
              <span className="brochure-file-chip__icon" aria-hidden>
                <FileDown className="h-5 w-5" strokeWidth={2.1} />
              </span>
              <p className="brochure-file-chip__label">Ready to download</p>
            </div>

            <p className="brochure-intro__note">
              Trusted procurement & trading catalog from {COMPANY_NAME}.
            </p>
          </aside>

          <div className="brochure-form-panel">
            {!success ? (
              <>
                <h3 className="brochure-form-panel__title">{brochurePage.formTitle}</h3>
                <p className="brochure-form-panel__desc">{brochurePage.formDescription}</p>

                <form onSubmit={handleSubmit} className="brochure-form">
                  <div className="brochure-field">
                    <label htmlFor="brochure-name">
                      {brochurePage.fields.name} <span aria-hidden>*</span>
                    </label>
                    <input
                      id="brochure-name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      maxLength={120}
                      autoComplete="name"
                    />
                  </div>

                  <div className="brochure-field">
                    <label htmlFor="brochure-email">
                      {brochurePage.fields.email} <span aria-hidden>*</span>
                    </label>
                    <input
                      id="brochure-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      autoComplete="email"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div className="brochure-field">
                    <label htmlFor="brochure-company">{brochurePage.fields.company}</label>
                    <input
                      id="brochure-company"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      maxLength={200}
                      autoComplete="organization"
                    />
                  </div>

                  <div className="brochure-field">
                    <label htmlFor="brochure-phone">{brochurePage.fields.phone}</label>
                    <input
                      id="brochure-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      maxLength={40}
                      autoComplete="tel"
                    />
                  </div>

                  {error && <p className="brochure-form__error">{error}</p>}

                  <button type="submit" className="btn-primary brochure-form__submit" disabled={submitting}>
                    {submitting ? 'Sending email & preparing download…' : brochurePage.submitLabel}
                    <FileDown className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                </form>
              </>
            ) : (
              <div className="brochure-success">
                <div className="brochure-success__icon" aria-hidden>
                  <FileDown className="h-7 w-7" strokeWidth={2} />
                </div>
                <h3 className="brochure-success__title">{brochurePage.successTitle}</h3>
                {success.emailSent ? (
                  <p className="brochure-success__note">
                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                    <span>
                      {brochurePage.successEmailNote}{' '}
                      <strong>{success.email}</strong>
                    </span>
                  </p>
                ) : (
                  <p className="brochure-success__warn">{brochurePage.successEmailFailed}</p>
                )}
                <div className="brochure-success__actions">
                  <button type="button" className="btn-primary justify-center" onClick={() => triggerDownload()}>
                    {brochurePage.successManual}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brochure-success__whatsapp"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {brochurePage.successWhatsapp}
                  </a>
                </div>
                <button type="button" className="brochure-success__again" onClick={resetForm}>
                  {brochurePage.successAnother}
                </button>
              </div>
            )}
          </div>
        </div>

        <a
          ref={downloadRef}
          href={brochure.url}
          download={downloadName}
          target="_blank"
          rel="noopener noreferrer"
          className="sr-only"
          aria-hidden
        >
          Download catalog
        </a>
      </div>
    </section>
  )
}
