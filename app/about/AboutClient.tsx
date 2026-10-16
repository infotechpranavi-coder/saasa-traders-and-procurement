'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle2,
  ShieldCheck,
  Building2,
  Globe2,
  Truck,
  Wrench,
  ArrowRight,
  Package,
  Cpu,
  Layers,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react'
import {
  COMPANY_NAME,
  OFFICES,
  INDIA_OFFICE,
  UAE_OFFICE,
  CAMEROON_OFFICE,
  COMPANY_PHONE_TEL,
  COMPANY_PHONE,
} from '@/lib/brand'

const tabs = ['Our Mission', 'Our Vision', 'Our History'] as const
type TabKey = (typeof tabs)[number]

const tabContent: Record<TabKey, { text: string; image: string; alt: string }> = {
  'Our Mission': {
    text: 'To connect businesses across Africa and the Middle East with quality products, reliable machinery, and dependable trading support that helps them grow, operate efficiently, and meet their commitments on time.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Global logistics and trade connection across Africa and Middle East',
  },
  'Our Vision': {
    text: 'To become the most trusted multi-sector trading partner for Africa and the Middle East, recognised for transparent dealing, product quality, and service that businesses can rely on year after year.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Multi-sector trading partner for Africa and Middle East',
  },
  'Our History': {
    text: 'SAASA B2E Group began with a focus on business consulting, recruitment, and company formation services for clients across Africa and the Middle East. Over more than seven years of working closely with businesses in these markets, we saw a common challenge: companies found it difficult to source quality products and equipment at fair prices with reliable delivery. SAASA B2E Trades was established to solve this, drawing on our supplier network in India, our trade base in Dubai, and our registered office in Yaoundé, Cameroon.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    alt: 'Dubai trade base and global international commerce',
  },
}

const supplyPillars = [
  {
    title: 'FMCG Products',
    desc: 'Food, beverages, personal care, household, and packaged consumer goods for distributors, wholesalers, and retail chains.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    badge: 'Consumer Goods',
    href: '/services/fmcg-products',
    target: 'Distributors, Wholesalers & Retail Chains',
  },
  {
    title: 'Vehicles',
    desc: 'Trucks, buses, pickups, and passenger vehicles for logistics companies, fleet operators, and corporate buyers.',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    badge: 'Commercial & Fleet',
    href: '/services/transport',
    target: 'Logistics, Fleet Operators & Corporate Buyers',
  },
  {
    title: 'Heavy Machinery',
    desc: 'Asphalt, bitumen, and wet mix plants, earthmoving equipment, mining machinery, power systems, and genuine spare parts for infrastructure and industrial projects.',
    image: 'https://res.cloudinary.com/dd8otkf7f/image/upload/v1784113336/traders_website/images/1784113336117-DX225-LC-2-.jpg',
    badge: 'Industrial & Earthmoving',
    href: '/products',
    target: 'Contractors & Infrastructure Projects',
  },
  {
    title: 'Pharmaceutical Machines',
    desc: 'Tablet presses, capsule filling machines, blister packing lines, liquid filling systems, and allied processing equipment for pharmaceutical manufacturers and packaging units.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    badge: 'cGMP Machinery',
    href: '/services/pharmaceutical-machines',
    target: 'Pharma Manufacturers & Packaging Units',
  },
  {
    title: 'IT Equipment',
    desc: 'Laptops, desktops, servers, networking hardware, printers, and peripherals for offices, schools, hospitals, and government institutions.',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
    badge: 'Enterprise Technology',
    href: '/contact',
    target: 'Offices, Schools, Hospitals & Institutions',
  },
]

const whyChooseItems = [
  {
    icon: Layers,
    title: 'One Partner for Multiple Categories',
    desc: 'One trading partner for multiple product categories, from consumer goods to industrial machinery.',
  },
  {
    icon: Building2,
    title: 'Direct Manufacturer Partnerships',
    desc: 'Direct manufacturer and supplier partnerships that keep pricing competitive and quality assured.',
  },
  {
    icon: Globe2,
    title: 'Offices in India, UAE & Cameroon',
    desc: 'Local offices in India, UAE, and Cameroon for faster communication and on-ground support.',
  },
  {
    icon: Truck,
    title: 'Complete Handling of Documentation & Shipping',
    desc: 'Complete handling of documentation, export clearance, ocean/air shipping, and customs clearance.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Checks Before Dispatch',
    desc: 'Quality checks before dispatch so you receive exactly what you ordered, on spec and intact.',
  },
  {
    icon: Wrench,
    title: 'After-Sales Assistance & Genuine Spares',
    desc: 'After-sales assistance, installation coordination support, and ongoing access to genuine spare parts.',
  },
]

export default function AboutClient() {
  const [activeTab, setActiveTab] = useState<TabKey>('Our Mission')

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Main Overview & Story Section */}
      <section className="overflow-hidden pt-16 lg:pt-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="section-label mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>ABOUT SAASA B2E TRADES</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#0d1b2a] tracking-tight leading-tight mb-6">
                Trading &amp; Procurement Division of SAASA B2E Group
              </h1>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 font-medium">
                SAASA B2E Trades is the trading and procurement division of SAASA B2E Group, a business consulting and international trade company with offices in India, the UAE, and Cameroon. We supply FMCG products, commercial and passenger vehicles, heavy machinery, pharmaceutical manufacturing machines, and IT equipment to businesses, distributors, contractors, and institutions across Africa and the Middle East. Our role is to find the right products, verify their quality, and deliver them to your doorstep with complete documentation and support.
              </p>

              {/* 3 Quick Stat Highlights */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2 mb-8">
                <div className="rounded-2xl bg-[#f8fafc] border border-gray-100 p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary">7+</div>
                  <div className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">Years Experience</div>
                </div>
                <div className="rounded-2xl bg-[#f8fafc] border border-gray-100 p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary">3</div>
                  <div className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">Global Offices</div>
                </div>
                <div className="rounded-2xl bg-[#f8fafc] border border-gray-100 p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-primary">5+</div>
                  <div className="text-xs font-semibold text-gray-600 mt-1 uppercase tracking-wider">Trading Sectors</div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Mission / Vision / History Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#f8fafc] rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm relative overflow-hidden">
                <div className="flex gap-2 p-1.5 bg-gray-200/70 rounded-2xl mb-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        activeTab === tab
                          ? 'bg-white text-[#0d1b2a] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden mb-5">
                  <Image
                    src={tabContent[activeTab].image}
                    alt={tabContent[activeTab].alt}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white uppercase tracking-wider bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    {activeTab}
                  </span>
                </div>

                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {tabContent[activeTab].text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What We Supply (Catalogue Pictures & 5 Pillars) */}
      <section className="py-16 bg-[#f8fafc] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="section-label justify-center mb-3">
              <Package className="h-4 w-4 text-primary" />
              <span>CORE DIVISIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d1b2a] tracking-tight">
              What We Supply
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mt-3">
              A comprehensive procurement portfolio serving distributors, contractors, fleet owners, and industrial enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {supplyPillars.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200/70 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider text-white bg-primary/90 px-3 py-1 rounded-full shadow">
                    {item.badge}
                  </span>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[11px] font-medium text-orange-200 uppercase tracking-wide">
                      Target Audience: {item.target}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#0d1b2a] mb-2.5 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>

                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-orange-700 transition-colors pt-2 border-t border-gray-100"
                  >
                    <span>Explore {item.title} Range</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Choose SAASA B2E Trades */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="section-label justify-center mb-3">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>THE SAASA ADVANTAGE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d1b2a] tracking-tight">
              Why Choose SAASA B2E Trades
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mt-3">
              Built on transparency, local execution, and end-to-end supply chain reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {whyChooseItems.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="p-6 sm:p-7 rounded-3xl bg-[#f8fafc] border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-orange-100/70 text-primary flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" strokeWidth={2.2} />
                    </div>
                    <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                      Reason 0{index + 1}
                    </div>
                    <h3 className="text-lg font-bold text-[#0d1b2a] mb-2.5">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. Global Offices & Direct Regional Desks */}
      <section className="py-16 bg-[#0F1419] text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-10 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-gray-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Global Presence</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Our Regional Trade Desks
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-xl">
                On-the-ground support across India, the United Arab Emirates, and Cameroon for rapid trade coordination.
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-primary shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl"
            >
              Contact Our Trade Desk
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OFFICES.map((office) => (
              <div
                key={office.name}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-primary/20 px-3 py-1 rounded-full mb-3">
                  {office.name}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{office.city}</h3>
                <p className="text-sm text-gray-400 mb-4">{office.address}</p>

                <div className="space-y-2 pt-3 border-t border-white/10 text-xs sm:text-sm">
                  <a
                    href={`tel:${office.phoneTel}`}
                    className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{office.phone}</span>
                  </a>
                  <a
                    href={`mailto:${office.email}`}
                    className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors truncate"
                  >
                    <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{office.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
