'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { ArrowUpRight, Clock, MapPin } from 'lucide-react'
import {
  COMPANY_ADDRESS,
  COMPANY_EMAILS,
  COMPANY_LEGAL_NAME,
  COMPANY_PHONES,
} from '@/lib/brand'
import { CONTACT_SERVICE_OPTIONS } from '@/lib/site-content'
import { SectionLabelIcon } from './icons/LogisticsIcons'

interface ContactFormFields {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormFields>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (feedback) setFeedback(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string }

      if (!res.ok || !data.ok) {
        setFeedback({ type: 'error', text: data.error || 'Failed to send enquiry. Please try again.' })
        return
      }

      setFeedback({
        type: 'success',
        text: data.message || 'Thank you! We will contact you soon.',
      })
      setForm({ name: '', email: '', phone: '', service: '', message: '' })
    } catch {
      setFeedback({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const info = [{ icon: Clock, title: 'Working Hours', desc: 'Mon - Sat: 9AM - 7PM' }]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="section-label mb-3">
              <SectionLabelIcon className="text-primary" />
              GET IN TOUCH
            </div>
            <h2 className="hp-title mb-6">We&apos;d Love to Hear From You</h2>
            <p className="hp-lead mb-10">
              Need construction equipment, machinery parts, trucks, or industrial products sourced and delivered?
              Our procurement team is ready to quote your requirements.
            </p>

            <div className="contact-address-card mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-primary">
                <MapPin className="h-5 w-5" strokeWidth={2} />
              </div>
              <p className="hp-subtitle text-lg text-[#0d1b2a]">{COMPANY_LEGAL_NAME}</p>
              <p className="hp-body mt-1 text-sm text-gray-600">{COMPANY_ADDRESS}</p>
              <div className="mt-4 space-y-1.5">
                {COMPANY_EMAILS.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="block text-sm text-gray-600 transition-colors hover:text-primary"
                  >
                    {email}
                  </a>
                ))}
              </div>
              <div className="mt-4 space-y-1.5">
                {COMPANY_PHONES.map((phone) => (
                  <a
                    key={phone.tel}
                    href={`tel:${phone.tel}`}
                    className="block text-sm font-semibold text-[#0d1b2a] transition-colors hover:text-primary"
                  >
                    {phone.display}
                  </a>
                ))}
              </div>
            </div>

            {info.map((item) => (
              <div key={item.title} className="flex gap-4 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary">
                  <item.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <div className="hp-subtitle text-sm">{item.title}</div>
                  <div className="hp-body text-sm">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[22px] bg-[#f4f5f7] p-8">
            <h3 className="hp-subtitle text-2xl mb-6">Get a Free Quote</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  disabled={submitting}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none disabled:opacity-60"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  disabled={submitting}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none disabled:opacity-60"
                />
              </div>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                disabled={submitting}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none disabled:opacity-60"
              />
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                disabled={submitting}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 transition-colors focus:border-primary focus:outline-none disabled:opacity-60"
              >
                <option value="">Select requirement</option>
                {CONTACT_SERVICE_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={5}
                disabled={submitting}
                className="resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none disabled:opacity-60"
              />
              {feedback && (
                <p
                  className={`rounded-xl px-4 py-3 text-sm ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                  role="status"
                >
                  {feedback.text}
                </p>
              )}
              <button type="submit" disabled={submitting} className="btn-primary justify-center py-4 text-base disabled:opacity-60">
                {submitting ? 'Sending…' : 'Send Message'}
                <ArrowUpRight className="h-5 w-5" strokeWidth={2.2} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
