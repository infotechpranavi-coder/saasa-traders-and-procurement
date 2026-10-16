'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  MessageCircle,
} from 'lucide-react'
import { MetaPixelLeadTracker } from '@/components/MetaPixel'
import {
  COMPANY_NAME,
  OFFICES,
  INDIA_OFFICE,
  CAMEROON_OFFICE,
  COMPANY_PHONE_TEL,
} from '@/lib/brand'

export default function ThankYouContent() {
  const searchParams = useSearchParams()
  const name = searchParams.get('name')?.trim() || ''
  const service = searchParams.get('service')?.trim() || ''

  const whatsappPhone = COMPANY_PHONE_TEL.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello ${COMPANY_NAME}, I just submitted an enquiry on your website${name ? ` under the name ${name}` : ''}${service ? ` regarding ${service}` : ''}. Could you please follow up with me?`,
  )}`

  return (
    <div className="bg-[#f8fafc] min-h-[85vh] py-16 sm:py-24">
      {/* Fires Meta Pixel Lead conversion event */}
      <MetaPixelLeadTracker service={service || undefined} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Main Celebration Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 text-center relative overflow-hidden mb-10">
          {/* Top subtle decorative gradient banner */}
          <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-primary" />

          {/* Animated Green Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 mb-6 ring-8 ring-emerald-50/60 animate-bounce duration-1000">
            <CheckCircle2 className="w-10 h-10" strokeWidth={2.4} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enquiry Successfully Submitted</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0d1b2a] tracking-tight mb-4">
            {name ? `Thank You, ${name}!` : 'Thank You! We Have Received Your Enquiry'}
          </h1>

          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
            Your quotation request has been recorded into our procurement system. Our technical and
            commercial team will evaluate your specifications and reach out with pricing, availability,
            and shipping logistics within <strong>24 business hours</strong>.
          </p>

          {/* Enquiry summary pill if parameters exist */}
          {(name || service) && (
            <div className="bg-gray-50 border border-gray-200/70 rounded-2xl p-4 max-w-lg mx-auto mb-8 text-left text-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Submission Summary
              </div>
              <div className="space-y-1">
                {name && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact Person:</span>
                    <span className="font-semibold text-gray-900">{name}</span>
                  </div>
                )}
                {service && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Selected Requirement:</span>
                    <span className="font-semibold text-primary">{service}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Lead Status:</span>
                  <span className="font-medium text-emerald-600">Active &bull; Under Review</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp for Urgent Inquiries
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
            >
              Browse Equipment Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3 Steps: What Happens Next */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Procurement Workflow</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0d1b2a] mt-1">What Happens Next?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-primary flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-[#0d1b2a] text-base">Requirement Review</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our sourcing specialists verify machinery part numbers, equipment tonnage, and stock
                availability across our partner inventory.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-primary flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-[#0d1b2a] text-base">Pro-Forma & Quotation</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                We prepare competitive commercial quotes detailing unit rates, transit insurance, freight
                terms (CIF/FOB), and delivery timelines.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-primary flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="font-bold text-[#0d1b2a] text-base">Direct Account Contact</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                An assigned trade manager calls or WhatsApps you directly to discuss inspection, dispatch
                schedules, and customized requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Office Contact Cards & Support */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-[#0d1b2a]">Need Direct Assistance?</h3>
              <p className="text-sm text-gray-500">Reach out directly to our regional trade desks</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <Clock className="w-4 h-4 text-primary" />
              <span>Mon – Sat: 9:00 AM – 7:00 PM</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* India Desk */}
            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-orange-100/70 px-2.5 py-0.5 rounded-full inline-block mb-2">
                {INDIA_OFFICE.name}
              </span>
              <p className="text-sm font-semibold text-[#0d1b2a] mb-3">{INDIA_OFFICE.address}</p>
              <div className="space-y-1.5 text-xs sm:text-sm">
                <a
                  href={`tel:${INDIA_OFFICE.phoneTel}`}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>{INDIA_OFFICE.phone}</span>
                </a>
                <a
                  href={`mailto:${INDIA_OFFICE.email}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate">{INDIA_OFFICE.email}</span>
                </a>
              </div>
            </div>

            {/* Cameroon Desk */}
            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-orange-100/70 px-2.5 py-0.5 rounded-full inline-block mb-2">
                {CAMEROON_OFFICE.name}
              </span>
              <p className="text-sm font-semibold text-[#0d1b2a] mb-3">{CAMEROON_OFFICE.address}</p>
              <div className="space-y-1.5 text-xs sm:text-sm">
                <a
                  href={`tel:${CAMEROON_OFFICE.phoneTel}`}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>{CAMEROON_OFFICE.phone}</span>
                </a>
                <a
                  href={`mailto:${CAMEROON_OFFICE.email}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate">{CAMEROON_OFFICE.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Links */}
        <div className="text-center space-x-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-primary font-medium transition-colors">
            &larr; Return to Homepage
          </Link>
          <Link href="/services" className="text-gray-600 hover:text-primary font-medium transition-colors">
            Explore Services
          </Link>
          <Link href="/brochure" className="text-gray-600 hover:text-primary font-medium transition-colors">
            Download Catalog
          </Link>
        </div>
      </div>
    </div>
  )
}
