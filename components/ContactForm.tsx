'use client'

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowUpRight,
  Clock,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react'
import {
  OFFICES,
  COMPANY_LEGAL_NAME,
  SOCIAL_LINKS,
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
  const router = useRouter()
  const [form, setForm] = useState<ContactFormFields>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Thank-you confirmation popup modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [redirectSeconds, setRedirectSeconds] = useState(3)
  const [submittedName, setSubmittedName] = useState('')
  const [submittedService, setSubmittedService] = useState('')

  // Auto-redirect countdown to /thank-you upon successful submission
  useEffect(() => {
    if (!showSuccessModal) return

    if (redirectSeconds <= 0) {
      const thankYouUrl = `/thank-you?name=${encodeURIComponent(submittedName)}&service=${encodeURIComponent(submittedService)}`
      router.push(thankYouUrl)
      return
    }

    const timer = setTimeout(() => {
      setRedirectSeconds((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [showSuccessModal, redirectSeconds, submittedName, submittedService, router])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (feedback) setFeedback(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFeedback(null)

    const nameVal = form.name.trim()
    const emailVal = form.email.trim()
    const phoneVal = form.phone.trim()
    const serviceVal = form.service.trim()

    if (!phoneVal) {
      setFeedback({ type: 'error', text: 'Please enter your phone or WhatsApp number.' })
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          name: nameVal,
          email: emailVal,
          phone: phoneVal,
          service: serviceVal,
        }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string }

      if (!res.ok || !data.ok) {
        setFeedback({ type: 'error', text: data.error || 'Failed to send enquiry. Please try again.' })
        return
      }

      // Success: populate modal info and trigger thank you modal + redirect
      setSubmittedName(nameVal)
      setSubmittedService(serviceVal)
      setShowSuccessModal(true)
      setRedirectSeconds(3)
      setFeedback({
        type: 'success',
        text: data.message || 'Thank you! Your enquiry has been received. Redirecting to confirmation page...',
      })
      setForm({ name: '', email: '', phone: '', service: '', message: '' })
    } catch {
      setFeedback({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const goToThankYouPage = () => {
    const thankYouUrl = `/thank-you?name=${encodeURIComponent(submittedName)}&service=${encodeURIComponent(submittedService)}`
    router.push(thankYouUrl)
  }

  const info = [{ icon: Clock, title: 'Working Hours', desc: 'Mon - Sat: 9AM - 7PM' }]

  return (
    <section className="py-20 bg-white relative">
      {/* Success Confirmation Popup Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close confirmation dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-4 ring-8 ring-emerald-50/70">
              <CheckCircle2 className="w-9 h-9" strokeWidth={2.4} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Enquiry Submitted</span>
            </div>

            <h3 id="success-modal-title" className="text-2xl font-bold text-[#0d1b2a] mb-2">
              Thank You{submittedName ? `, ${submittedName}` : ''}!
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Your inquiry has been received. Our procurement desk will review your requirements and reach out within 24 hours.
            </p>

            {/* Countdown Badge */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl py-2 px-4 text-xs font-medium text-orange-800 mb-5">
              Redirecting to confirmation page in <span className="font-bold text-primary">{redirectSeconds}s</span>...
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={goToThankYouPage}
                className="w-full btn-primary justify-center py-3 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                View Confirmation Page Now
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-2.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                Stay on this page
              </button>
            </div>
          </div>
        </div>
      )}

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {OFFICES.map((office) => (
                <div key={office.name} className="contact-address-card p-5 rounded-2xl bg-[#f8fafc] border border-gray-100 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-primary">
                      <MapPin className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-primary bg-orange-100/70 px-2.5 py-0.5 rounded-full mb-2">
                      {office.name}
                    </span>
                    <p className="hp-subtitle text-base font-bold text-[#0d1b2a]">{office.address}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200/60 space-y-2">
                    <a
                      href={`mailto:${office.email}`}
                      className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-primary transition-colors truncate"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2} />
                      <span className="truncate">{office.email}</span>
                    </a>
                    <a
                      href={`tel:${office.phoneTel}`}
                      className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0d1b2a] hover:text-primary transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2} />
                      <span>{office.phone}</span>
                    </a>
                    {office.additionalPhone && (
                      <a
                        href={`tel:${office.additionalPhoneTel}`}
                        className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-primary transition-colors pl-5.5"
                      >
                        <span>{office.additionalPhone}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
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
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="form-name" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <input
                    id="form-name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                    disabled={submitting}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none disabled:opacity-60"
                  />
                </div>
                <div>
                  <label htmlFor="form-email" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    id="form-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. name@company.com"
                    required
                    disabled={submitting}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Requirement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="form-phone" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Phone / WhatsApp Number <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="form-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 / +237 / Phone"
                      required
                      disabled={submitting}
                      className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none disabled:opacity-60"
                    />
                    <Phone className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label htmlFor="form-service" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Requirement Category
                  </label>
                  <select
                    id="form-service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 transition-colors focus:border-primary focus:outline-none disabled:opacity-60"
                  >
                    <option value="">Select requirement</option>
                    {CONTACT_SERVICE_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Message & Specifications */}
              <div>
                <label htmlFor="form-message" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Your Message &amp; Specifications
                </label>
                <textarea
                  id="form-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe your machinery model, part numbers, required quantity, or delivery port..."
                  rows={4}
                  disabled={submitting}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none disabled:opacity-60"
                />
              </div>

              {feedback && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm flex items-center justify-between gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                  role="status"
                >
                  <span>{feedback.text}</span>
                  {feedback.type === 'success' && (
                    <button
                      type="button"
                      onClick={goToThankYouPage}
                      className="text-xs font-bold underline text-emerald-900 hover:text-emerald-700 shrink-0"
                    >
                      View confirmation &rarr;
                    </button>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary justify-center py-4 text-base disabled:opacity-60 shadow-md hover:shadow-lg transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <ArrowUpRight className="h-5 w-5" strokeWidth={2.2} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
