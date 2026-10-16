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

const tabImages: Record<TabKey, { src: string; alt: string }> = {
  'Our Mission': { src: SITE_IMAGES.about.tab, alt: 'Heavy machinery and equipment procurement' },
  'Our Vision': { src: SITE_IMAGES.about.fmcgProducts, alt: 'FMCG and consumer goods trading' },
  'Our History': { src: SITE_IMAGES.about.fmcg, alt: 'Global trading and commodity supply chain' },
}

const tabContent: Record<TabKey, string> = {
  'Our Mission':
    'To connect businesses across Africa and the Middle East with quality products, reliable machinery, and dependable trading support that helps them grow, operate efficiently, and meet their commitments on time.',
  'Our Vision':
    'To become the most trusted multi-sector trading partner for Africa and the Middle East, recognised for transparent dealing, product quality, and service that businesses can rely on year after year.',
  'Our History':
    'SAASA B2E Group began with a focus on business consulting, recruitment, and company formation services for clients across Africa and the Middle East. Over more than seven years of working closely with businesses in these markets, we saw a common challenge: companies found it difficult to source quality products and equipment at fair prices with reliable delivery. SAASA B2E Trades was established to solve this, drawing on our supplier network in India, our trade base in Dubai, and our registered office in Yaoundé, Cameroon.',
}

function ExperienceRibbon() {
  return (
    <div className="about-ribbon absolute left-0 top-5 z-20 sm:top-6">
      <div className="about-ribbon-fold" aria-hidden />
      <div className="about-ribbon-body">7+ Years Experience</div>
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
      <div className="about-seal-core relative z-[2] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#ff6633] shadow-[0_6px_18px_rgba(255,102,51,0.45)]">
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

      {/* Bottom-left — FMCG wholesale trading & packaged goods scene */}
      <div className="absolute bottom-0 left-0 z-[1] h-[48%] w-[78%] overflow-hidden rounded-[28px] shadow-[0_16px_40px_rgba(0,0,0,0.14)] group">
        <CmsImage
          src={SITE_IMAGES.about.fmcg}
          alt="Wholesale FMCG products and food commodities"
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="420px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-4 text-[10px] font-bold uppercase tracking-wider text-white bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/20">
          FMCG &amp; Commodities
        </span>
      </div>

      {/* Foreground orange container — bottom-left overlap */}
      <div className="absolute bottom-[6%] left-[2%] z-[4] w-[34%] max-w-[150px] drop-shadow-[0_14px_28px_rgba(0,0,0,0.22)]">
        <div className="relative aspect-[5/4] overflow-hidden rounded-[6px] border border-[#e85a20]/30 bg-[#ff6633] shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff7849] via-[#ff6633] to-[#e64a19]" />
          <div className="absolute inset-y-2 left-[14%] w-[3px] bg-[#ff8844]/60" />
          <div className="absolute inset-y-2 right-[14%] w-[3px] bg-[#d44a15]/50" />
          <div className="absolute inset-x-3 top-[38%] h-[2px] bg-[#ff9966]/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-1 text-center font-bold leading-tight text-white/95">
            <span className="text-[7px] tracking-[0.12em] sm:text-[8px]">PROCUREMENT</span>
            <span className="text-[6px] tracking-[0.14em] text-white/85 sm:text-[7px]">&amp; TRADING</span>
          </div>
        </div>
      </div>

      {/* Top-right — main portrait: Construction & Earthmoving Machinery */}
      <div className="absolute right-0 top-0 z-[2] h-[74%] w-[58%] overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.16)] group">
        <CmsImage
          src={SITE_IMAGES.about.main}
          alt="JCB excavator and earthmoving equipment"
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <span className="absolute bottom-3 right-4 text-[10px] font-bold uppercase tracking-wider text-white bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/20">
          Heavy Machinery
        </span>
        <ExperienceRibbon />
      </div>

      {/* Bottom-right — circular inset: Packaged FMCG consumer goods */}
      <div className="absolute bottom-[4%] right-0 z-[3] h-[112px] w-[112px] overflow-hidden rounded-full border-[5px] border-white shadow-[0_14px_36px_rgba(0,0,0,0.16)] sm:h-[128px] sm:w-[128px] lg:h-[118px] lg:w-[118px] xl:h-[138px] xl:w-[138px] group">
        <CmsImage
          src={SITE_IMAGES.about.fmcgProducts}
          alt="Packaged FMCG consumer goods"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
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
        <div className="grid min-w-0 items-center gap-12 lg:grid-cols-[minmax(0,44%)_minmax(0,56%)] lg:gap-10 xl:gap-14">
          <div className="min-w-0">
            <AboutCollage />
          </div>

          {/* Right — content */}
          <div className="reveal-right min-w-0">
            <div className="section-label mb-4">
              <SectionLabelIcon className="shrink-0 text-[#ff6633]" />
              <span className="min-w-0">ABOUT OUR COMPANY</span>
            </div>

            <h2 className="hp-title mb-5 max-w-[560px] break-words">
              Trading &amp; Procurement Division of SAASA B2E Group
            </h2>

            <p className="hp-lead mb-7 max-w-[560px] break-words">
              SAASA B2E Trades is the trading and procurement division of SAASA B2E Group, a business consulting and international trade company with offices in India, the UAE, and Cameroon. We supply FMCG products, commercial and passenger vehicles, heavy machinery, pharmaceutical manufacturing machines, and IT equipment to businesses, distributors, contractors, and institutions across Africa and the Middle East. Our role is to find the right products, verify their quality, and deliver them to your doorstep with complete documentation and support.
            </p>

            <div className="mb-7 flex min-w-0 flex-wrap gap-2 sm:gap-2.5">
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

            <div className="mb-6 flex min-w-0 gap-3 border-t border-gray-200 pt-6 sm:gap-4">
              <div className="relative h-[80px] w-[112px] shrink-0 overflow-hidden rounded-[14px] shadow-md sm:h-[92px] sm:w-[140px]">
                <CmsImage
                  src={tabImages[activeTab].src}
                  alt={tabImages[activeTab].alt}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="140px"
                />
              </div>
              <p className="hp-body min-w-0 flex-1">{tabContent[activeTab]}</p>
            </div>

            <p className="hp-emphasis mb-8 break-words">
              Every order follows a clear process: sourcing from verified manufacturers, pre-dispatch quality checks, export documentation, shipping, customs clearance, and after-sales support.
            </p>

            <div className="flex min-w-0 flex-wrap items-center gap-4 sm:gap-5">
              <Link
                href="/about"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#ff5a1f] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(255,90,31,0.35)] transition hover:bg-[#e64a19] hover:-translate-y-0.5 sm:px-7 sm:py-3.5 sm:text-[0.9375rem]"
              >
                About Us
                <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={2.5} />
              </Link>

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#001a33] shadow-md sm:h-[52px] sm:w-[52px]">
                  <Phone className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="hp-label-sm">Call Us Any Time:</p>
                  <a
                    href={`tel:${COMPANY_PHONE_TEL}`}
                    className="hp-subtitle block truncate text-[#ff5a1f] hover:underline sm:whitespace-normal"
                  >
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
