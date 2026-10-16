import Link from 'next/link'
import ProductImageGallery from './ProductImageGallery'
import type { ProductCompany, ProductSpecItem } from '@/types/cms'

interface DetailPageContentProps {
  image: string
  images?: string[]
  title: string
  label: string
  overview: string[]
  listTitle: string
  listItems: string[]
  secondaryTitle: string
  secondaryItems: string[]
  companies?: ProductCompany[]
  specs?: string[]
  specifications?: ProductSpecItem[]
  backHref: string
  backLabel: string
}

export default function DetailPageContent({
  image,
  images,
  title,
  label,
  overview,
  listTitle,
  listItems,
  secondaryTitle,
  secondaryItems,
  companies = [],
  specs = [],
  specifications = [],
}: DetailPageContentProps) {
  const galleryImages =
    images && images.length > 0 ? images : image.trim() ? [image] : []

  // Resolve structured specifications (prioritizing named key-value specifications, fallback to legacy parsed specs)
  const resolvedSpecs: ProductSpecItem[] =
    specifications && specifications.length > 0
      ? specifications.filter((s) => (s?.name && s.name.trim()) || (s?.value && s.value.trim()))
      : specs && specs.length > 0
        ? specs
            .map((item, index) => {
              const colonIndex = item.indexOf(':')
              if (colonIndex > 0) {
                return {
                  name: item.slice(0, colonIndex).trim(),
                  value: item.slice(colonIndex + 1).trim(),
                }
              }
              return {
                name: `Parameter ${index + 1}`,
                value: item.trim(),
              }
            })
            .filter((s) => s.value.length > 0)
        : []

  return (
    <article className="product-detail-article">
      <div className="product-detail-sheet">
        <header className="product-detail-header">
          <h1 className="product-detail-title">{title}</h1>
          <span className="product-detail-label">{label}</span>
        </header>

        <div className="product-detail-grid">
          <div className="product-detail-main">
            {galleryImages.length > 0 && (
              <ProductImageGallery images={galleryImages} title={title} />
            )}

            <div className="product-detail-overview">
              {overview.map((paragraph) => (
                <p key={paragraph} className="product-detail-text">
                  {paragraph}
                </p>
              ))}
            </div>

            {resolvedSpecs.length > 0 && (
              <div className="product-detail-specs-section">
                <div className="product-detail-specs-header">
                  <div className="product-detail-specs-icon" aria-hidden="true">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="product-detail-section-title" style={{ margin: 0 }}>
                      Technical Specifications
                    </h2>
                    <p className="product-detail-specs-subtitle">
                      Verified parameters, dimensions & operating specifications
                    </p>
                  </div>
                </div>

                <div className="product-specs-table-wrapper">
                  <table className="product-specs-table">
                    <tbody>
                      {resolvedSpecs.map((spec, idx) => (
                        <tr key={`${spec.name}-${idx}`} className="product-specs-row">
                          <th scope="row" className="product-specs-name">
                            {spec.name || 'Specification'}
                          </th>
                          <td className="product-specs-value">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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
