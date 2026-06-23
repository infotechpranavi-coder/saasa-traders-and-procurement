import CmsImage from './CmsImage'
import Link from 'next/link'
import type { Service } from '@/types/cms'

interface ServiceGridProps {
  services: Service[]
  emptyMessage?: string
  emptyCtaHref?: string
  emptyCtaLabel?: string
}

export default function ServiceGrid({
  services,
  emptyMessage = 'No services in this category yet.',
  emptyCtaHref = '/contact',
  emptyCtaLabel = 'Contact Us',
}: ServiceGridProps) {
  if (services.length === 0) {
    return (
      <div className="category-empty-state">
        <p className="hp-subtitle mb-2">{emptyMessage}</p>
        {emptyCtaHref && (
          <Link href={emptyCtaHref} className="btn-primary mt-2 inline-flex text-sm">
            {emptyCtaLabel}
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="product-grid">
      {services.map((service) => (
        <Link key={service.slug} href={`/services/${service.slug}`} className="product-card group">
          <article>
            <div className="product-card-media">
              <CmsImage
                src={service.image}
                alt={service.title}
                fill
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="product-card-media-overlay" />
            </div>
            <div className="product-card-body">
              <h3 className="product-card-title">{service.title}</h3>
              {service.summary && <p className="product-card-desc">{service.summary}</p>}
              <span className="product-card-cta">
                View Details
                <span aria-hidden>→</span>
              </span>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}
