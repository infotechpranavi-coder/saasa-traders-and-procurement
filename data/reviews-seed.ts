import type { CustomerReview } from '@/types/cms'

export const seedReviews: CustomerReview[] = [
  {
    slug: 'jean-paul-mbarga',
    name: 'Jean-Paul Mbarga',
    role: 'Director of Procurement, BTP Infrastructure (Douala, Cameroon)',
    quote:
      'SAASA B2E TRADES streamlined our equipment procurement with top-tier excavators, road pavers, and OEM spare parts. Their trade coordination, import clearance, and technical compliance gave our highway projects zero downtime.',
    image: '/images/testimonials/sarah.jpg',
  },
  {
    slug: 'tariq-al-mansoor',
    name: 'Tariq Al-Mansoor',
    role: 'Managing Director, Saharan FMCG Distribution (Dubai, UAE)',
    quote:
      'We partner with SAASA B2E TRADES for bulk container shipments of refined edible oils, grains, and packaged consumer goods. Their export logistics, batch documentation, and trade reliability across African sea ports are exceptional.',
    image: '/images/testimonials/tariq.jpg',
  },
  {
    slug: 'ibrahim-diallo',
    name: 'Ibrahim Diallo',
    role: 'Head of Fleet & Mining Logistics, Trans-Sahel Resources',
    quote:
      'Whether we require heavy commercial transport trucks, quarry crushing assets, or recurring spares, SAASA B2E TRADES delivers genuine cross-border trading value with transparent landed pricing and end-to-end delivery.',
    image: '/images/testimonials/jacob.jpg',
  },
]
