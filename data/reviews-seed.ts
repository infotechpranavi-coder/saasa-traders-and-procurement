import type { CustomerReview } from '@/types/cms'

export const seedReviews: CustomerReview[] = [
  {
    slug: 'sarah-williams',
    name: 'Sarah Williams',
    role: 'Procurement Director, Infrastructure Group',
    quote:
      'SAASA B2E TRADES streamlined our equipment procurement with top-tier excavators, road pavers, and OEM spare parts. Their trade coordination, import clearance, and technical compliance gave our highway projects zero downtime.',
    image: '/images/testimonials/sarah.jpg',
  },
  {
    slug: 'tariq-al-mansoor',
    name: 'Tariq Al-Mansoor',
    role: 'Managing Director, Saharan FMCG Distribution',
    quote:
      'We partner with SAASA B2E TRADES for bulk container shipments of refined edible oils, grains, and packaged consumer goods. Their export logistics, batch documentation, and trade reliability across African sea ports are exceptional.',
    image: '/images/testimonials/tariq.jpg',
  },
  {
    slug: 'jacob-jones',
    name: 'Jacob Jones',
    role: 'Director of Fleet & Mining Operations',
    quote:
      'Whether we require heavy commercial transport trucks, quarry crushing assets, or recurring spares, SAASA B2E TRADES delivers genuine cross-border trading value with transparent landed pricing and end-to-end delivery.',
    image: '/images/testimonials/jacob.jpg',
  },
]
