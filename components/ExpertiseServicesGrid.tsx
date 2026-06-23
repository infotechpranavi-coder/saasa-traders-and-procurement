import CmsImage from './CmsImage'
import Link from 'next/link'
import type { Service } from '@/types/cms'

function ExpertiseCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="expertise-card group block bg-white transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <CmsImage
          src={service.image}
          alt={service.title}
          fill
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="relative flex min-h-[88px] items-end justify-between gap-3 bg-white px-4 pb-4 pt-5 sm:min-h-[96px] sm:px-5 sm:pb-5">
        <h3 className="hp-card-title max-w-[calc(100%-72px)] leading-snug">
          {service.title}
        </h3>
        <span className="expertise-card-arrow shrink-0" aria-hidden>
          <svg className="h-4 w-4 text-[#0D1B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

interface ExpertiseServicesGridProps {
  services: Service[]
  className?: string
  reveal?: boolean
  hideTitle?: boolean
}

export default function ExpertiseServicesGrid({ services, className = '', reveal = false, hideTitle = false }: ExpertiseServicesGridProps) {
  return (
    <div className={className}>
      {!hideTitle && (
        <h2 className={`hp-title mb-8 ${reveal ? 'reveal' : ''}`}>
          Our area of expertise
        </h2>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 xl:gap-6">
        {services.map((service) => (
          <div key={service.slug} className={reveal ? 'reveal' : undefined}>
            <ExpertiseCard service={service} />
          </div>
        ))}
      </div>
    </div>
  )
}
