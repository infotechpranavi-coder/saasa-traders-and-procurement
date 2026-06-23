import type { CustomerReview } from '@/types/cms'

export const seedReviews: CustomerReview[] = [
  {
    slug: 'sarah-williams',
    name: 'Sarah Williams',
    role: 'Procurement Manager',
    quote:
      'SAASA B2E TRADES sourced excavator hydraulic parts and undercarriage components for our fleet faster than our previous suppliers. Quotations were clear and deliveries arrived as promised.',
    image: '/images/products/hydraulic-pump.jpg',
  },
  {
    slug: 'bessie-cooper',
    name: 'Bessie Cooper',
    role: 'Fleet Operations Director',
    quote:
      'We needed trucks and buses for a municipal rollout — their team handled supplier selection, import paperwork, and staged delivery across multiple depots professionally.',
    image: '/images/services/trucks.jpg',
  },
  {
    slug: 'jacob-jones',
    name: 'Jacob Jones',
    role: 'Project Director',
    quote:
      'From mining equipment inquiries to repeat parts orders, SAASA B2E has become our go-to trading partner. Responsive support and reliable sourcing across categories.',
    image: '/images/services/mining.jpg',
  },
  {
    slug: 'amadou-diallo',
    name: 'Amadou Diallo',
    role: 'Construction Site Manager',
    quote:
      'They supplied concrete mixers, road rollers, and spare parts for our highway project with consistent lead times. A dependable procurement partner for heavy machinery.',
    image: '/images/products/concrete-mixer.jpg',
  },
  {
    slug: 'grace-mbeki',
    name: 'Grace Mbeki',
    role: 'Plant Superintendent',
    quote:
      'Crane parts, gearbox assemblies, and engine components were sourced to OEM specifications. Their team understands construction machinery requirements very well.',
    image: '/images/products/crane-parts.jpg',
  },
  {
    slug: 'pierre-nguemba',
    name: 'Pierre Nguemba',
    role: 'Quarry Operations Lead',
    quote:
      'Bucket teeth, track chains, and compactor spares keep our quarry running. SAASA B2E coordinates suppliers and shipping so we spend less time chasing orders.',
    image: '/images/products/bucket-teeth.jpg',
  },
]
