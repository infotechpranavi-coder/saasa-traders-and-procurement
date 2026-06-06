export interface ExpertiseService {
  slug: string
  title: string
  image: string
  summary: string
  overview: string[]
  capabilities: string[]
  industries: string[]
}

export const expertiseServices: ExpertiseService[] = [
  {
    slug: 'construction-equipment',
    title: 'Construction equipment, Earthmoving, Industrial, and Port',
    image: '/images/services/construction-equipment.jpg',
    summary:
      'Supply, sourcing, and logistics for excavators, loaders, dozers, and port-handling equipment used on major construction and industrial projects.',
    overview: [
      'SAASA B2E TRADES supports contractors, rental fleets, and industrial operators with construction equipment supply and spare parts logistics across earthmoving, industrial, and port applications.',
      'From yellow machines on civil sites to material handlers at port terminals, we connect you with the right equipment and components through a global supplier network.',
    ],
    capabilities: [
      'Excavators, loaders, and dozers',
      'Port cranes and material handlers',
      'OEM and aftermarket spare parts',
      'Cross-border shipping and customs support',
      'Fleet procurement consulting',
    ],
    industries: ['Civil construction', 'Industrial plants', 'Port terminals', 'Infrastructure projects'],
  },
  {
    slug: 'trucks-transport',
    title: 'Trucks for Transport and Distribution of Materials',
    image: '/images/services/trucks.jpg',
    summary:
      'Heavy-duty trucks and distribution fleets for moving construction materials, aggregates, and bulk goods across regional and international routes.',
    overview: [
      'We help material producers and logistics companies source trucks built for transport and distribution of construction materials, aggregates, and bulk cargo.',
      'SAASA B2E TRADES coordinates vehicle procurement, parts supply, and delivery logistics so your distribution network stays reliable and cost-effective.',
    ],
    capabilities: [
      'Semi-trucks and rigid haulers',
      'Tipper and bulk material bodies',
      'Fleet parts and maintenance supply',
      'Route-ready export documentation',
      'Dealer and manufacturer sourcing',
    ],
    industries: ['Aggregate distribution', 'Building materials', 'Bulk cargo', 'Regional freight'],
  },
  {
    slug: 'buses-transport',
    title: 'Buses for people transport companies',
    image: '/images/services/buses.jpg',
    summary:
      'Coach and transit buses for passenger transport operators, including procurement support and aftermarket parts for fleet maintenance.',
    overview: [
      'SAASA B2E TRADES works with people transport companies to source modern coach and transit buses suited to intercity, tourism, and corporate shuttle operations.',
      'We also supply maintenance parts and fleet support services to keep passenger operations safe, compliant, and on schedule.',
    ],
    capabilities: [
      'Intercity and tourism coaches',
      'Transit and shuttle bus sourcing',
      'Fleet maintenance parts supply',
      'Operator procurement advisory',
      'International delivery coordination',
    ],
    industries: ['Public transport', 'Tourism operators', 'Corporate shuttles', 'Private charter fleets'],
  },
  {
    slug: 'energy-engines-generators',
    title: 'Energy | Engines and Generators',
    image: '/images/services/engines.jpg',
    summary:
      'Industrial engines, generator sets, and power system components for construction sites, mines, and remote operations.',
    overview: [
      'Our energy division covers industrial diesel engines, generator sets, and supporting components for construction sites, mining camps, and remote power needs.',
      'SAASA B2E TRADES sources new and remanufactured power units with the parts and service support required for continuous operation in harsh environments.',
    ],
    capabilities: [
      'Diesel generator sets',
      'Industrial engine platforms',
      'Overhaul and service parts',
      'Mobile power for job sites',
      'Backup power solutions',
    ],
    industries: ['Construction sites', 'Mining operations', 'Remote facilities', 'Industrial backup power'],
  },
  {
    slug: 'mining-quarrying',
    title: 'Mining and Quarrying equipment',
    image: '/images/services/mining.jpg',
    summary:
      'Heavy mining trucks, excavators, and wear parts for open-pit mining and quarry extraction operations worldwide.',
    overview: [
      'SAASA B2E TRADES supplies mining and quarrying equipment including ultra-class haul trucks, large excavators, and high-wear components for extraction operations.',
      'We understand the uptime demands of open-pit mines and aggregate quarries and deliver parts and machinery through resilient global logistics channels.',
    ],
    capabilities: [
      'Mining haul trucks and excavators',
      'High-wear ground engaging tools',
      'Undercarriage and powertrain parts',
      'Quarry plant equipment sourcing',
      'Critical spares expediting',
    ],
    industries: ['Open-pit mining', 'Aggregate quarries', 'Mineral extraction', 'Bulk material processing'],
  },
]

export function getServiceBySlug(slug: string): ExpertiseService | undefined {
  return expertiseServices.find((s) => s.slug === slug)
}

export function getAllServiceSlugs(): string[] {
  return expertiseServices.map((s) => s.slug)
}
