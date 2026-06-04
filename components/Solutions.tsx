'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { LogisticsIcon, type LogisticsIconName } from './icons/LogisticsIcons'

const features: { icon: LogisticsIconName; title: string; desc: string }[] = [
  { icon: 'ship', title: 'Shipping Services', desc: 'Save money by optimizing your shipments.' },
  { icon: 'map', title: 'distributions Plan', desc: 'Save money by optimizing your shipments.' },
  { icon: 'location', title: 'GPS tracking', desc: 'Save money by optimizing your shipments.' },
  { icon: 'refresh', title: 'Flexible Shipment', desc: 'Save money by optimizing your shipments.' },
]

function CargoContainer() {
  return (
    <div className="relative w-[148px] rotate-[-8deg] drop-shadow-[0_18px_32px_rgba(0,0,0,0.28)] sm:w-[168px]">
      <div className="relative aspect-[5/3.5] overflow-hidden rounded-[5px] border border-[#e85a20]/40 bg-[#ff6633]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff7849] via-[#ff6633] to-[#e64a19]" />
        <div className="absolute inset-y-1.5 left-[12%] w-[3px] bg-[#ff9966]/55" />
        <div className="absolute inset-y-1.5 right-[12%] w-[3px] bg-[#d44a15]/45" />
        <div className="absolute inset-x-2 top-[36%] h-[2px] bg-[#ffaa77]/35" />
        <div
          className="absolute inset-0 flex items-center justify-center text-[1.65rem] font-black tracking-[0.18em] text-white sm:text-[1.85rem]"
          style={{ fontFamily: 'Barlow, sans-serif' }}
        >
          CARGO
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
        <Image
          src="/images/solutions/port.jpg"
          alt="Cargo ship at port with cranes"
          fill
          className="object-cover object-center"
          sizes="300px"
        />
      </div>

      {/* Truck — bottom right, overlapping */}
      <div className="absolute bottom-0 right-0 z-[3] h-[70%] w-[50%] overflow-hidden rounded-[18px] border-[5px] border-white shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
        <Image
          src="/images/solutions/truck.jpg"
          alt="Semi truck on highway"
          fill
          className="object-cover object-[18%_center]"
          sizes="240px"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff6633]/25 via-transparent to-[#001a33]/15" />
      </div>

      {/* Play button — overlap center */}
      <button
        type="button"
        className="absolute left-[50%] top-[47%] z-[4] flex h-[62px] w-[62px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition hover:scale-105"
        aria-label="Play video"
      >
        <Play className="ml-1 h-6 w-6 fill-[#ff6633] text-[#ff6633]" strokeWidth={0} />
      </button>

      {/* CARGO container — bottom left foreground */}
      <div className="absolute bottom-1 left-0 z-[5] sm:bottom-2 sm:-left-2">
        <CargoContainer />
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
              Logistics service outsourcing&apos;s advantages in 2025
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
