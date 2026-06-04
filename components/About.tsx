'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Phone } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SectionLabelIcon } from './icons/LogisticsIcons'

const tabs = ['Our Mission', 'Our Vision', 'Our History'] as const
type TabKey = (typeof tabs)[number]

const tabContent: Record<TabKey, string> = {
  'Our Mission':
    'Logistic & transport Group is a forward-thinking real estate consultancy and investment advisory firm with over 25 years of industry experience. We specialize in delivering strategic guidance, project development support,',
  'Our Vision':
    "Our vision is to become the world's most trusted logistics partner, leveraging cutting-edge technology and sustainable practices to connect businesses globally.",
  'Our History':
    'Founded in 1999, TransHub began as a small regional carrier and has grown into a global logistics powerhouse serving over 150 countries with a fleet of 5,000+ vehicles.',
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
            Best Logistic
          </textPath>
        </text>
        <text fill="#fff" fontSize="8.5" fontWeight="700" letterSpacing="1.1">
          <textPath href="#aboutSealBottom" startOffset="50%" textAnchor="middle">
            Services
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
        <Image
          src="/images/about/truck.jpg"
          alt="Freight truck on highway"
          fill
          className="object-cover object-center"
          sizes="420px"
        />
        {/* Small airplane accent in sky */}
        <svg
          className="absolute right-[18%] top-[8%] z-[2] h-7 w-7 text-white/90 drop-shadow-md"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
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
        <Image
          src="/images/about/main.jpg"
          alt="Logistics professional with safety gear"
          fill
          className="object-cover object-top"
          sizes="320px"
        />
        <ExperienceRibbon />
      </div>

      {/* Bottom-right — circular port inset */}
      <div className="absolute bottom-[4%] right-0 z-[3] h-[128px] w-[128px] overflow-hidden rounded-full border-[6px] border-white shadow-[0_14px_36px_rgba(0,0,0,0.16)] sm:h-[138px] sm:w-[138px]">
        <Image
          src="/images/about/port-circle.jpg"
          alt="Shipping containers at port"
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
              Our services increase the productivity of your work.
            </h2>

            <p className="hp-lead mb-7 max-w-[560px]">
              Our global logistics expertise, advanced supply chain technology &amp; customized logistics solutions
              will help you analyze, develop, and implement successful
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
                <Image src="/images/about/tab.jpg" alt="" fill className="object-cover" sizes="140px" />
              </div>
              <p className="hp-body">{tabContent[activeTab]}</p>
            </div>

            <p className="hp-emphasis mb-8">
              We specialize in delivering strategic guidance, project development support,
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
                  <p className="hp-subtitle text-[#ff5a1f]">148 359 505 285</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
