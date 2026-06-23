'use client'

import Link from 'next/link'
import type { Category, Service } from '@/types/cms'
import ExpertiseServicesGrid from './ExpertiseServicesGrid'

interface ServicesCatalogProps {
  services: Service[]
  categories: Category[]
}

export default function ServicesCatalog({ services, categories }: ServicesCatalogProps) {
  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/services"
          className="rounded-full border border-primary bg-primary px-4 py-1.5 text-xs font-semibold text-white transition"
        >
          All Services
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/services/category/${cat.id}`}
            className="rounded-full border border-gray-200 bg-[#f4f5f7] px-4 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-primary hover:text-primary"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-[#f8fafc] px-6 py-14 text-center">
          <p className="hp-subtitle mb-2">No services listed yet</p>
          <Link href="/contact" className="btn-primary mt-4 inline-flex text-sm">
            Contact Us
          </Link>
        </div>
      ) : (
        <ExpertiseServicesGrid services={services} />
      )}
    </>
  )
}
