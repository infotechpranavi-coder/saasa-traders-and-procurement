'use client'

import Link from 'next/link'
import CmsImage from './CmsImage'
import { SectionLabelIcon } from './icons/LogisticsIcons'
import { useScrollReveal } from '../hooks/useScrollReveal'
import type { HomepageExpertiseItem } from '@/types/cms'

interface HomeExpertiseProps {
  items: HomepageExpertiseItem[]
}

export default function HomeExpertise({ items }: HomeExpertiseProps) {
  const { ref } = useScrollReveal()

  return (
    <section ref={ref} className="home-expertise">
      <div className="home-expertise-container">
        <div className="home-expertise-header reveal">
          <div className="section-label mb-3">
            <SectionLabelIcon className="text-primary" />
            PRODUCTS & SERVICES
          </div>
          <h2 className="hp-title">Our area of expertise</h2>
        </div>

        <div className="home-expertise-grid">
          {items.map((item) => (
            <Link
              key={`${item.kind}-${item.slug}`}
              href={item.href}
              className="home-expertise-card group reveal"
              aria-label={item.title}
            >
              <div className="home-expertise-card-media">
                <CmsImage
                  src={item.image}
                  alt={item.title}
                  fill
                  className="transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="home-expertise-card-fade" aria-hidden />
                <div className="home-expertise-card-foot">
                  <h3 className="home-expertise-card-title">{item.title}</h3>
                  <span className="expertise-card-arrow home-expertise-card-arrow" aria-hidden>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
