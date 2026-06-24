'use client'

import type { ReactNode } from 'react'
import { Handshake } from 'lucide-react'
import CmsImage from './CmsImage'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { LogisticsIcon, type LogisticsIconName } from './icons/LogisticsIcons'
import { SITE_IMAGES } from '@/lib/site-content'

const features: { icon: LogisticsIconName; title: string; desc: string }[] = [
  { icon: 'package', title: 'Equipment Procurement', desc: 'Source construction, mining, and industrial machinery from verified global suppliers.' },
  { icon: 'cargo', title: 'Parts & Components', desc: 'Genuine and aftermarket parts for excavators, loaders, cranes, and road equipment.' },
  { icon: 'globe', title: 'Global Sourcing', desc: 'Cross-border trading with documentation, compliance, and delivery coordination.' },
  { icon: 'refresh', title: 'Repeat Supply', desc: 'Ongoing procurement support so your fleets and projects stay supplied.' },
]

function TradeBadge() {
  return (
    <div className="relative w-[148px] rotate-[-8deg] drop-shadow-[0_18px_32px_rgba(0,0,0,0.28)] sm:w-[168px]">
      <div className="relative aspect-[5/3.5] overflow-hidden rounded-[5px] border border-[#e85a20]/40 bg-[#ff6633]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff7849] via-[#ff6633] to-[#e64a19]" />
        <div className="absolute inset-y-1.5 left-[12%] w-[3px] bg-[#ff9966]/55" />
        <div className="absolute inset-y-1.5 right-[12%] w-[3px] bg-[#d44a15]/45" />
        <div className="absolute inset-x-2 top-[36%] h-[2px] bg-[#ffaa77]/35" />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center font-black leading-tight text-white"
          style={{ fontFamily: 'Barlow, sans-serif' }}
        >
          <span className="text-[0.82rem] tracking-[0.14em] sm:text-[0.92rem]">PROCUREMENT</span>
          <span className="mt-0.5 text-[0.62rem] tracking-[0.18em] text-white/95 sm:text-[0.7rem]">&amp; TRADING</span>
        </div>
      </div>
      <div className="mx-auto h-2 w-[92%] rounded-b-sm bg-[#c4521f]" />
    </div>
  )
}

function SolutionCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`solution-card ${className}`}>
      <svg
        className="solution-card-shape absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M 9 0 L 91 0 L 100 50 L 91 100 L 9 100 L 0 50 Z"
          fill="#f4f7f6"
          stroke="#dde2e6"
          strokeWidth="0.75"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative z-[1] px-5 py-5 pl-9 pr-11 sm:px-6 sm:py-6 sm:pl-10 sm:pr-12">{children}</div>
    </div>
  )
}

function SolutionsVisual() {
  return (
    <div className="relative mx-auto h-[400px] w-full max-w-[460px] sm:h-[430px] lg:max-w-none">
      {/* Orange rounded frame behind images */}
      <div className="solution-frame" aria-hidden />

      {/* Port / ship — top left */}
      <div className="absolute left-0 top-0 z-[2] h-[52%] w-[64%] overflow-hidden rounded-[18px] shadow-[0_14px_36px_rgba(0,0,0,0.14)]">
        <CmsImage
          src={SITE_IMAGES.solutions.primary}
          alt="Drum mix plant equipment"
          fill
          className="object-cover object-center"
          sizes="300px"
        />
      </div>

      {/* Truck — bottom right, overlapping */}
      <div className="absolute bottom-0 right-0 z-[3] h-[70%] w-[50%] overflow-hidden rounded-[18px] border-[5px] border-white shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
        <CmsImage
          src={SITE_IMAGES.solutions.secondary}
          alt="JCB construction machinery"
          fill
          className="object-cover object-center"
          sizes="240px"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff6633]/25 via-transparent to-[#001a33]/15" />
      </div>

      {/* Partnership badge — overlap center */}
      <div
        className="absolute left-[50%] top-[47%] z-[4] flex h-[62px] w-[62px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
        aria-hidden
      >
        <Handshake className="h-7 w-7 text-[#ff6633]" strokeWidth={2} />
      </div>

      {/* Trade badge — bottom left foreground */}
      <div className="absolute bottom-1 left-0 z-[5] sm:bottom-2 sm:-left-2">
        <TradeBadge />
      </div>
    </div>
  )
}

export default function Solutions() {
  const { ref } = useScrollReveal()

  return (
    <section ref={ref} className="overflow-hidden bg-[#f4f7f9] py-20 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="reveal-left">
            <SolutionsVisual />
          </div>

          <div className="reveal-right">
            <h2 className="hp-title mb-8">
              Why businesses choose SAASA B2E for procurement &amp; trading
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-2 sm:gap-y-4">
              {features.map((f, i) => (
                <SolutionCard key={f.title} className={`reveal delay-${(i + 1) * 100}`}>
                  <div className="mb-3">
                    <LogisticsIcon name={f.icon} size={30} className="text-[#FF5733]" strokeWidth={1.6} />
                  </div>
                  <h4 className="hp-card-title mb-2">{f.title}</h4>
                  <p className="hp-body text-[0.8125rem] leading-relaxed sm:text-sm">{f.desc}</p>
                </SolutionCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
