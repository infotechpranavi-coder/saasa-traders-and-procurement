'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, FileDown, Mail, MessageCircle } from 'lucide-react'
import { SectionLabelIcon } from '@/components/icons/LogisticsIcons'
import { brochurePage } from '@/lib/brochure-content'
import { COMPANY_PHONE_TEL } from '@/lib/brand'
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
    <section className="py-16 lg:py-20 bg-[#f4f5f7]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="section-label justify-center mb-3">
            <SectionLabelIcon className="text-primary" />
            {brochurePage.eyebrow}
          </div>
          <h2 className="hp-title mb-4">{brochurePage.title}</h2>
          <p className="hp-body">{brochurePage.lead}</p>
        </div>

        <div id="download" className="max-w-xl mx-auto scroll-mt-28">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            {!success ? (
              <>
                <h3 className="hp-card-title mb-1">{brochurePage.formTitle}</h3>
                <p className="hp-body text-sm mb-6">{brochurePage.formDescription}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                      {brochurePage.fields.name} *
                    </label>
                    <input
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      maxLength={120}
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                      {brochurePage.fields.email} *
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      autoComplete="email"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                      {brochurePage.fields.company}
                    </label>
                    <input
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      maxLength={200}
                      autoComplete="organization"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">
                      {brochurePage.fields.phone}
                    </label>
                    <input
                      type="tel"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      maxLength={40}
                      autoComplete="tel"
                    />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <button type="submit" className="btn-primary w-full justify-center" disabled={submitting}>
                    {submitting ? 'Sending email & preparing download…' : brochurePage.submitLabel}
                    <FileDown className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FileDown className="h-7 w-7" strokeWidth={2} />
                </div>
                <h3 className="hp-card-title mb-2">{brochurePage.successTitle}</h3>
                {success.emailSent ? (
                  <p className="hp-body text-sm mb-4 inline-flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    {brochurePage.successEmailNote}
                    <span className="font-semibold text-gray-800">{success.email}</span>
                  </p>
                ) : (
                  <p className="hp-body text-sm mb-4 text-amber-700">{brochurePage.successEmailFailed}</p>
                )}
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button type="button" className="btn-primary justify-center" onClick={() => triggerDownload()}>
                    {brochurePage.successManual}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {brochurePage.successWhatsapp}
                  </a>
                </div>
                <button type="button" className="mt-5 text-sm font-semibold text-primary hover:underline" onClick={resetForm}>
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
