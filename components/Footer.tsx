'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, MapPin, Phone, Mail } from 'lucide-react'
import BrandLogo from './BrandLogo'
import { COMPANY_NAME, COMPANY_ADDRESS, COMPANY_EMAILS, COMPANY_PHONES, COMPANY_DESCRIPTION, SOCIAL_LINKS } from '@/lib/brand'
import { FOOTER_QUICK_LINKS, FOOTER_SERVICES } from '@/lib/site-content'
import BrochureDownloadButton from './BrochureDownloadButton'
import { useScrollReveal } from '../hooks/useScrollReveal'
import type { CmsData } from '@/types/cms'
import type { SocialName } from '@/types'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [subscribeFeedback, setSubscribeFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  )
  const [cms, setCms] = useState<CmsData | null>(null)
  const { ref } = useScrollReveal()

  useEffect(() => {
    let active = true
    fetch('/api/cms')
      .then(async (res) => (res.ok ? ((await res.json()) as CmsData) : null))
      .then((data) => {
        if (active && data) setCms(data)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const footerServices =
    cms?.services
      .filter((s) => s.showInFooter)
      .map((s) => ({ label: s.title, href: `/services/${s.slug}` })) ?? []

  const footerProductCategories =
    cms?.categories
      .filter((c) => c.showInFooter && (c.type === 'product' || c.type === 'both'))
      .map((c) => ({ label: c.name, href: `/products/category/${c.id}` })) ?? []

  const serviceLinks = footerServices.length > 0 ? footerServices : FOOTER_SERVICES

  const subscribeNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setSubscribing(true)
    setSubscribeFeedback(null)

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string }

      if (!res.ok || !data.ok) {
        setSubscribeFeedback({ type: 'error', text: data.error || 'Subscription failed. Please try again.' })
        return
      }

      setSubscribeFeedback({
        type: 'success',
        text: data.message || 'You are subscribed!',
      })
      setEmail('')
      setName('')
    } catch {
      setSubscribeFeedback({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <footer ref={ref} style={{ background: '#0D1B2A', position: 'relative', overflow: 'hidden' }}>
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative border-b border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h3 className="shrink-0 text-white">
            Subscribe Our
            <br />
            Newsletter
          </h3>
          <form onSubmit={subscribeNewsletter} className="footer-newsletter-form w-full md:max-w-3xl">
            <div className="footer-newsletter-row">
              <label className="footer-newsletter-field footer-newsletter-field--name">
                <span className="sr-only">Name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (subscribeFeedback) setSubscribeFeedback(null)
                  }}
                  disabled={subscribing}
                  className="footer-newsletter-input"
                />
              </label>
              <label className="footer-newsletter-field footer-newsletter-field--email">
                <span className="sr-only">Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (subscribeFeedback) setSubscribeFeedback(null)
                  }}
                  required
                  disabled={subscribing}
                  className="footer-newsletter-input"
                />
              </label>
              <button
                type="submit"
                disabled={subscribing}
                className="btn-primary footer-newsletter-submit text-sm disabled:opacity-60"
              >
                {subscribing ? '…' : 'Subscribe'}
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.2} />
              </button>
            </div>
            {subscribeFeedback && (
              <p
                className={`footer-newsletter-feedback ${subscribeFeedback.type === 'success' ? 'footer-newsletter-feedback--success' : 'footer-newsletter-feedback--error'}`}
                role="status"
              >
                {subscribeFeedback.text}
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="reveal">
              <Link href="/" className="flex flex-col items-start gap-2 mb-5">
                <BrandLogo className="brand-logo brand-logo--nav" />
                <span className="footer-brand-name text-white">{COMPANY_NAME}</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{COMPANY_DESCRIPTION}</p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"
                  >
                    <SocialIcon name={social.name} />
                  </a>
                ))}
              </div>
            </div>

            <div className="reveal delay-100">
              <h4 className="mb-2">Quick Links</h4>
              <div className="w-8 h-1 bg-primary mb-5" />
              {FOOTER_QUICK_LINKS.map((item) =>
                'external' in item && item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-primary text-sm py-1.5 hover:translate-x-1 transition-all"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block text-gray-400 hover:text-primary text-sm py-1.5 hover:translate-x-1 transition-all"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>

            <div className="reveal delay-200">
              <h4 className="mb-2">Our Services</h4>
              <div className="w-8 h-1 bg-primary mb-5" />
              {serviceLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-gray-400 hover:text-primary text-sm py-1.5 hover:translate-x-1 transition-all"
                >
                  {item.label}
                </Link>
              ))}

              {footerProductCategories.length > 0 && (
                <>
                  <h4 className="mb-2 mt-8">Product Categories</h4>
                  <div className="w-8 h-1 bg-primary mb-5" />
                  {footerProductCategories.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-gray-400 hover:text-primary text-sm py-1.5 hover:translate-x-1 transition-all"
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              )}
            </div>

            <div className="reveal delay-300">
              <h4 className="mb-2">Contact Us</h4>
              <div className="w-8 h-1 bg-primary mb-5" />
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
                  <span>{COMPANY_ADDRESS}</span>
                </div>
                {COMPANY_EMAILS.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
                    <span>{email}</span>
                  </a>
                ))}
                {COMPANY_PHONES.map((phone) => (
                  <a
                    key={phone.tel}
                    href={`tel:${phone.tel}`}
                    className="flex items-center gap-3 text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
                    <span>{phone.display}</span>
                  </a>
                ))}
              </div>
              <BrochureDownloadButton brochure={cms?.brochure} variant="inline" className="mt-6 w-full justify-center border-white/20 bg-white/5 text-white hover:bg-white hover:text-[#0d1b2a]" />
              <Link
                href="/contact"
                className="mt-3 inline-flex w-full items-center justify-center bg-white text-dark font-bold text-sm px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            Copyright © 2026 <span className="text-primary font-bold">{COMPANY_NAME}</span> All Rights Reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ name }: { name: SocialName }) {
  const icons: Record<SocialName, JSX.Element> = {
    facebook: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
    gmb: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
      </svg>
    ),
    instagram: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    linkedin: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  }
  return icons[name]
}
