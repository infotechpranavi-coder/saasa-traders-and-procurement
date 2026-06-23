'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Phone } from 'lucide-react'
import CmsImage from './CmsImage'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SectionLabelIcon } from './icons/LogisticsIcons'
import { COMPANY_PHONE, COMPANY_PHONE_TEL } from '@/lib/brand'
import { SITE_IMAGES } from '@/lib/site-content'

const tabs = ['Our Mission', 'Our Vision', 'Our History'] as const
type TabKey = (typeof tabs)[number]

const tabContent: Record<TabKey, string> = {
  'Our Mission':
    'To connect contractors, miners, fleet operators, and industrial businesses with reliable equipment, genuine parts, and trading partners — delivering procurement solutions that keep projects moving.',
  'Our Vision':
    'To be Africa’s most trusted B2E procurement and trading company for construction machinery, vehicles, mining equipment, and industrial products.',
  'Our History':
    'SAASA B2E TRADES has grown from a regional trading firm into a procurement partner serving construction, mining, transport, and energy sectors with equipment supply and parts sourcing across global markets.',
}

function ExperienceRibbon() {
  return (
    <div className="about-ribbon absolute left-0 top-5 z-20 sm:top-6">
      <div className="about-ribbon-fold" aria-hidden />
      <div className="about-ribbon-body">25+ Years Experience</div>
    </div>
  )
}

function BestServicesSeal() {
  return (
    <div className="about-seal-glass">
      <svg viewBox="0 0 118 118" className="absolute inset-0 z-[1] h-full w-full" aria-hidden>
        <defs>
          <path id="aboutSealTop" d="M 22,59 A 37,37 0 0,1 96,59" />
          <path id="aboutSealBottom" d="M 96,59 A 37,37 0 0,1 22,59" />
        </defs>
        <text fill="#fff" fontSize="8.5" fontWeight="700" letterSpacing="1.1">
          <textPath href="#aboutSealTop" startOffset="50%" textAnchor="middle">
            Best Procurement
          </textPath>
        </text>
        <text fill="#fff" fontSize="8.5" fontWeight="700" letterSpacing="1.1">
          <textPath href="#aboutSealBottom" startOffset="50%" textAnchor="middle">
            & Trading
          </textPath>
        </text>
      </svg>
      <div className="relative z-[2] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#ff6633] shadow-[0_6px_18px_rgba(255,102,51,0.45)]">
        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
      </div>
    </div>
  )
}

function AboutCollage() {
  return (
    <div className="about-collage reveal-left">
      <div className="about-collage-rays" aria-hidden />

      {/* Bottom-left — truck / transport scene */}
      <div className="absolute bottom-0 left-0 z-[1] h-[46%] w-[78%] overflow-hidden rounded-[28px] shadow-[0_16px_40px_rgba(0,0,0,0.14)]">
        <CmsImage
          src={SITE_IMAGES.about.secondary}
          alt="Road roller on construction site"
          fill
          className="object-cover object-center"
          sizes="420px"
        />
      </div>

      {/* Foreground orange container — bottom-left overlap */}
      <div className="absolute bottom-[6%] left-[2%] z-[4] w-[34%] max-w-[150px] drop-shadow-[0_14px_28px_rgba(0,0,0,0.22)]">
        <div className="relative aspect-[5/4] overflow-hidden rounded-[6px] border border-[#e85a20]/30 bg-[#ff6633] shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff7849] via-[#ff6633] to-[#e64a19]" />
          <div className="absolute inset-y-2 left-[14%] w-[3px] bg-[#ff8844]/60" />
          <div className="absolute inset-y-2 right-[14%] w-[3px] bg-[#d44a15]/50" />
          <div className="absolute inset-x-3 top-[38%] h-[2px] bg-[#ff9966]/40" />
          <div className="absolute bottom-2 left-3 text-[9px] font-bold tracking-wider text-white/80">CARGO</div>
        </div>
      </div>

      {/* Top-right — main portrait */}
      <div className="absolute right-0 top-0 z-[2] h-[74%] w-[58%] overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.16)]">
        <CmsImage
          src={SITE_IMAGES.about.main}
          alt="JCB excavator and earthmoving equipment"
          fill
          className="object-cover object-center"
          sizes="320px"
        />
        <ExperienceRibbon />
      </div>

      {/* Bottom-right — circular port inset */}
      <div className="absolute bottom-[4%] right-0 z-[3] h-[128px] w-[128px] overflow-hidden rounded-full border-[6px] border-white shadow-[0_14px_36px_rgba(0,0,0,0.16)] sm:h-[138px] sm:w-[138px]">
        <CmsImage
          src={SITE_IMAGES.about.accent}
          alt="Drum mix asphalt plant"
          fill
          className="object-cover"
          sizes="138px"
        />
      </div>

      {/* Center seal — glass badge at intersection */}
      <div className="absolute left-[46%] top-[50%] z-[5] -translate-x-1/2 -translate-y-1/2">
        <BestServicesSeal />
      </div>
    </div>
  )
}

export default function About() {
  const [activeTab, setActiveTab] = useState<TabKey>('Our Mission')
  const { ref } = useScrollReveal()

  return (
    <section ref={ref} className="about-section-bg overflow-hidden py-20 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[44%_56%] lg:gap-14 xl:gap-16">
          <AboutCollage />

          {/* Right — content */}
          <div className="reveal-right">
            <div className="section-label mb-4">
              <SectionLabelIcon className="text-[#ff6633]" />
              ABOUT OUR COMPANY
            </div>

            <h2 className="hp-title mb-5 max-w-[560px]">
              Your partner for equipment procurement and industrial trading.
            </h2>

            <p className="hp-lead mb-7 max-w-[560px]">
              From construction machinery and spare parts to trucks, buses, mining equipment, and power systems —
              we source, trade, and deliver the products your operation depends on.
            </p>

            <div className="mb-7 flex flex-wrap gap-2.5">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`about-tab ${activeTab === tab ? 'about-tab-active' : 'about-tab-inactive'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mb-6 flex gap-4 border-t border-gray-200 pt-6">
              <div className="relative h-[88px] w-[130px] shrink-0 overflow-hidden rounded-[14px] shadow-md sm:h-[92px] sm:w-[140px]">
                <CmsImage src={SITE_IMAGES.about.tab} alt="Bitumen spreader" fill className="object-cover" sizes="140px" />
              </div>
              <p className="hp-body">{tabContent[activeTab]}</p>
            </div>

            <p className="hp-emphasis mb-8">
              We manage supplier selection, import coordination, and delivery so your team can focus on the project.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff5a1f] px-7 py-3.5 text-[0.9375rem] font-semibold text-white shadow-[0_8px_22px_rgba(255,90,31,0.35)] transition hover:bg-[#e64a19] hover:-translate-y-0.5"
              >
                About Us
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#001a33] shadow-md">
                  <Phone className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="hp-label-sm">Call Us Any Time:</p>
                  <a href={`tel:${COMPANY_PHONE_TEL}`} className="hp-subtitle text-[#ff5a1f] hover:underline">
                    {COMPANY_PHONE}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
