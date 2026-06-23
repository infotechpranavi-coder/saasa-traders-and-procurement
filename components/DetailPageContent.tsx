import Link from 'next/link'
import CmsImage from './CmsImage'
import type { ProductCompany } from '@/types/cms'

interface DetailPageContentProps {
  image: string
  title: string
  label: string
  overview: string[]
  listTitle: string
  listItems: string[]
  secondaryTitle: string
  secondaryItems: string[]
  companies?: ProductCompany[]
  backHref: string
  backLabel: string
}

export default function DetailPageContent({
  image,
  title,
  label,
  overview,
  listTitle,
  listItems,
  secondaryTitle,
  secondaryItems,
  companies = [],
}: DetailPageContentProps) {
  return (
    <article className="product-detail-article">
      <div className="product-detail-sheet">
        <header className="product-detail-header">
          <h1 className="product-detail-title">{title}</h1>
          <span className="product-detail-label">{label}</span>
        </header>

        <div className="product-detail-grid">
          <div className="product-detail-main">
            <div className="product-detail-media">
              <CmsImage src={image} alt={title} fill priority />
            </div>

            <div className="product-detail-overview">
              {overview.map((paragraph) => (
                <p key={paragraph} className="product-detail-text">
                  {paragraph}
                </p>
              ))}
            </div>

            {secondaryItems.length > 0 && (
              <div className="product-detail-applications">
                <h2 className="product-detail-section-title">{secondaryTitle}</h2>
                <ul className="product-detail-tags">
                  {secondaryItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {companies.length > 0 && (
              <div className="product-detail-companies">
                <h2 className="product-detail-section-title">Companies & equipment we supply</h2>
                <ul className="product-detail-company-list">
                  {companies.map((company) => (
                    <li key={company.name} className="product-detail-company-card">
                      <p className="product-detail-company-name">{company.name}</p>
                      {company.items.length > 0 && (
                        <ul className="product-detail-tags">
                          {company.items.map((item) => (
                            <li key={`${company.name}-${item}`}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="product-detail-actions">
              <Link href="/contact" className="btn-primary inline-flex text-sm">
                Request Quote
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </Link>
            </div>
          </div>

          {listItems.length > 0 && (
            <aside className="product-detail-features">
              <h2 className="product-detail-section-title">{listTitle}</h2>
              <ul className="product-detail-feature-list">
                {listItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </article>
  )
}
