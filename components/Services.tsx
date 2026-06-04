'use client'

import { useScrollReveal } from '../hooks/useScrollReveal'
import ExpertiseServicesGrid from './ExpertiseServicesGrid'
import type { Service } from '@/types/cms'

interface ServicesProps {
  services: Service[]
}

export default function Services({ services }: ServicesProps) {
  const { ref } = useScrollReveal()

  return (
    <section ref={ref} className="overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">
        <ExpertiseServicesGrid services={services} reveal />
      </div>
    </section>
  )
}
