'use client'

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
  Layers,
  Sparkles,
  Target,
  Eye,
  History,
  Compass,
  Handshake,
} from 'lucide-react'
import { COMPANY_NAME } from '@/lib/brand'

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
    image: '/static/pharmaceutical-machine.jpg',
    badge: 'cGMP Machinery',
    href: '/services/pharmaceutical-machines',
    target: 'Pharma Manufacturers & Packaging Units',
  },
  {
    title: 'IT Equipment',
    desc: 'Laptops, desktops, servers, networking hardware, printers, and peripherals for offices, schools, hospitals, and government institutions.',
    image: '/static/it-equipment.jpg',
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
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2 mb-2">
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

            {/* Right: Premium Trust & Logistics Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-gradient-to-br from-[#0d1b2a] to-[#1b263b] p-7 sm:p-9 text-white shadow-xl overflow-hidden border border-gray-800">
                <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden mb-6 shadow-inner">
                  <Image
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
                    alt="International shipping and global trade corridor"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 450px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a]/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                    Global Trade Corridor
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Handshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Trusted Cross-Border Execution</h3>
                    <p className="text-xs text-gray-400">India · United Arab Emirates · Cameroon</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm text-gray-300 mb-6">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Direct relationships with certified manufacturers</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>100% pre-shipment quality &amp; spec audits</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>End-to-end maritime freight &amp; customs clearance</span>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="btn-primary w-full text-center inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold shadow-lg"
                >
                  <span>Request Sourcing Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dedicated Section: Our Vision, Mission & History */}
      <section className="py-20 bg-gradient-to-b from-[#f8fafc] via-white to-[#f8fafc] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="section-label justify-center mb-3">
              <Compass className="h-4 w-4 text-primary" />
              <span>OUR GUIDING PRINCIPLES &amp; HERITAGE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[#0d1b2a] tracking-tight">
              Our Vision, Mission &amp; History
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mt-3">
              The foundational values that guide our global operations, the standards we uphold, and our journey from regional consulting to a multi-sector international trading leader.
            </p>
          </div>

          {/* Cards for Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Mission Card */}
            <div className="relative rounded-3xl bg-white border border-gray-200/80 p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-primary flex items-center justify-center">
                    <Target className="w-7 h-7" strokeWidth={2.2} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
                    Our Mission
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-[#0d1b2a] mb-4">
                  Delivering Reliability in Global Trade
                </h3>

                <p className="text-gray-700 text-base leading-relaxed mb-6 font-medium">
                  To connect businesses across Africa and the Middle East with quality products, reliable machinery, and dependable trading support that helps them grow, operate efficiently, and meet their commitments on time.
                </p>

                <div className="space-y-3.5 pt-5 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      <strong className="text-gray-900">Direct Sourcing:</strong> Sourcing directly from verified manufacturers in India and international equipment hubs to ensure transparent, competitive pricing.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      <strong className="text-gray-900">Quality First:</strong> Independent third-party pre-shipment inspections ensuring zero discrepancies upon arrival.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      <strong className="text-gray-900">Doorstep Delivery:</strong> End-to-end maritime logistics, customs clearance, and lifecycle spares replenishment.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="relative rounded-3xl bg-white border border-gray-200/80 p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-primary flex items-center justify-center">
                    <Eye className="w-7 h-7 text-primary" strokeWidth={2.2} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
                    Our Vision
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-[#0d1b2a] mb-4">
                  The Most Trusted Trade Partner
                </h3>

                <p className="text-gray-700 text-base leading-relaxed mb-6 font-medium">
                  To become the most trusted multi-sector trading partner for Africa and the Middle East, recognised for transparent dealing, product quality, and service that businesses can rely on year after year.
                </p>

                <div className="space-y-3.5 pt-5 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      <strong className="text-gray-900">Catalyzing Growth:</strong> Enabling regional distributors, contractors, and industries with continuous, resilient material supply.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      <strong className="text-gray-900">Cross-Border Stability:</strong> Bridging the manufacturing corridors of India and Dubai with emerging African seaports.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      <strong className="text-gray-900">Long-Term Value:</strong> Building enduring business relationships rooted in transparency, compliance, and shared prosperity.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History & Journey Timeline Card */}
          <div className="rounded-3xl bg-white border border-gray-200/80 p-8 sm:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full mb-3">
                  <History className="w-3.5 h-3.5" />
                  <span>Our Heritage &amp; Evolution</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0d1b2a]">
                  Our History &amp; Growth Story
                </h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-base max-w-xl leading-relaxed">
                SAASA B2E Group began with a focus on business consulting, recruitment, and company formation. Over more than 7 years, we recognized that clients struggled to source quality products and machinery at fair prices with dependable delivery. SAASA B2E Trades was founded to bridge this gap.
              </p>
            </div>

            {/* Milestones Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Milestone 1 */}
              <div className="relative p-6 rounded-2xl bg-[#f8fafc] border border-gray-100 flex flex-col justify-between hover:border-orange-200 transition-all">
                <div>
                  <span className="text-3xl font-black text-primary mb-2 block">2019</span>
                  <h4 className="text-base font-bold text-[#0d1b2a] mb-2">Founding &amp; UAE Trade Desk</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Established in India and Dubai, setting up global trade facilitation and connecting Asian manufacturers with emerging regional buyers.
                  </p>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="relative p-6 rounded-2xl bg-[#f8fafc] border border-gray-100 flex flex-col justify-between hover:border-orange-200 transition-all">
                <div>
                  <span className="text-3xl font-black text-primary mb-2 block">2021</span>
                  <h4 className="text-base font-bold text-[#0d1b2a] mb-2">Heavy Machinery Procurement</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Expanded into construction equipment, asphalt plants, batch mix equipment, and genuine OEM spare parts for major infrastructure contractors.
                  </p>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="relative p-6 rounded-2xl bg-[#f8fafc] border border-gray-100 flex flex-col justify-between hover:border-orange-200 transition-all">
                <div>
                  <span className="text-3xl font-black text-primary mb-2 block">2023</span>
                  <h4 className="text-base font-bold text-[#0d1b2a] mb-2">Cameroon African Office</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Opened registered office in Yaoundé, Cameroon, enabling on-ground CEMAC trade coordination, rapid customs clearance, and direct local support.
                  </p>
                </div>
              </div>

              {/* Milestone 4 */}
              <div className="relative p-6 rounded-2xl bg-[#f8fafc] border border-gray-100 flex flex-col justify-between hover:border-orange-200 transition-all">
                <div>
                  <span className="text-3xl font-black text-primary mb-2 block">Today</span>
                  <h4 className="text-base font-bold text-[#0d1b2a] mb-2">Multi-Sector Powerhouse</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Supplying FMCG commodities, commercial vehicles, heavy machinery, pharmaceutical processing equipment, and IT hardware across 15+ markets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What We Supply (Catalogue Pictures & 5 Pillars) */}
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

      {/* 4. Why Choose SAASA B2E Trades */}
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
    </div>
  )
}
