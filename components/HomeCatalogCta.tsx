'use client'

import { SectionLabelIcon } from '@/components/icons/LogisticsIcons'
import BrochureDownloadButton from '@/components/BrochureDownloadButton'
import { useBrochureContext } from '@/components/BrochureProvider'
import { COMPANY_NAME } from '@/lib/brand'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HomeCatalogCta() {
  const brochure = useBrochureContext()
  const { ref } = useScrollReveal()

  if (!brochure?.url) return null

  return (
    <section ref={ref} className="home-catalog-cta" aria-labelledby="home-catalog-cta-title">
      <div className="max-w-7xl mx-auto px-4">
        <div className="home-catalog-cta__inner reveal">
          <div className="home-catalog-cta__copy">
            <div className="section-label mb-3">
              <SectionLabelIcon className="text-primary" />
              PRODUCT CATALOG
            </div>
            <h2 id="home-catalog-cta-title" className="hp-title home-catalog-cta__title">
              Download our full product catalogue
            </h2>
            <p className="hp-body home-catalog-cta__text">
              Browse equipment, parts, and trading ranges from {COMPANY_NAME}. Enter your email on
              the next step — the PDF downloads instantly and we send a copy to your inbox.
            </p>
          </div>

          <div className="home-catalog-cta__actions">
            <BrochureDownloadButton variant="cta" />
          </div>
        </div>
      </div>
    </section>
  )
}
