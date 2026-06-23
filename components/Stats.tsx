'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import CmsImage from './CmsImage'
import { SITE_IMAGES } from '@/lib/site-content'

const stats = [
  { value: '150+', label: 'Products & Equipment Lines' },
  { value: '25+', label: 'Years Trading Experience' },
  { value: '40+', label: 'Procurement Categories' },
]

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  const [parallaxY, setParallaxY] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      // Slower upward drift than page scroll — depth layer beneath content
      setParallaxY(rect.top * 0.08)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="stats-section relative h-[62vh] min-h-[420px] overflow-hidden sm:h-[66vh] lg:h-[68vh]"
      aria-label="Company statistics"
    >
      {/* Parallax background — layer beneath, moves up slower on scroll */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="stats-bg-layer absolute -inset-x-[2%] -top-[22%] -bottom-[22%] will-change-transform"
          style={{ transform: `translate3d(0, ${parallaxY}px, 0)` }}
        >
          <CmsImage
            src={SITE_IMAGES.stats}
            alt="Batch mix plant at construction site"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#001a33]/10" />
        </div>
      </div>

      {/* Foreground — scrolls normally with the page */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 sm:justify-end sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-[380px] rounded-[28px] bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.16)] sm:max-w-[400px] sm:p-8 lg:max-w-[420px]">
          <div className="grid grid-cols-2 gap-x-5 gap-y-6">
            {stats.map((item) => (
              <div key={item.label}>
                <div className="hp-stat mb-1">{item.value}</div>
                <p className="hp-body text-[0.8125rem] leading-snug sm:text-sm">{item.label}</p>
              </div>
            ))}

            <div className="flex items-center justify-start sm:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff6633] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(255,102,51,0.35)] transition hover:bg-[#e64a19]"
              >
                Contact Us
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
