export interface Product {
  slug: string
  title: string
  label: string
  categoryId?: string
  image: string
  desc: string
  specs: string[]
  overview: string[]
  features: string[]
  applications: string[]
}

export const productCategories = [
  'Excavators',
  'Bulldozers',
  'Wheel Loaders',
  'Cranes',
  'Concrete Mixers',
  'Road Rollers',
  'Dump Trucks',
  'Compactors',
  'Engine Parts',
  'Powertrain & Hydraulics',
]

/** Maps product slug → category id for seed/CMS migration */
export const productCategoryMap: Record<string, string> = {
  'hydraulic-pump-assemblies': 'excavators',
  'undercarriage-track-chains': 'bulldozers',
  'loader-bucket-teeth-adapters': 'wheel-loaders',
  'crane-wire-rope-sheaves': 'cranes',
  'diesel-engine-overhaul-kits': 'engine-parts',
  'hydraulic-cylinder-seal-kits': 'powertrain-hydraulics',
  'concrete-mixer-drum-liners': 'concrete-mixers',
  'road-roller-drum-kits': 'road-rollers',
  'transmission-gearbox-parts': 'powertrain-hydraulics',
}

export const products: Product[] = [
  {
    slug: 'hydraulic-pump-assemblies',
    title: 'Hydraulic Pump Assemblies',
    label: 'Excavator Parts',
    categoryId: 'excavators',
    image: '/statsic/jcb.jpg',
    desc: 'High-pressure hydraulic pumps and valve blocks for excavators and backhoes. Engineered for long duty cycles on heavy construction sites.',
    specs: ['CAT · Komatsu · JCB', 'OEM & aftermarket'],
    overview: [
      'SAASA B2E TRADES supplies complete hydraulic pump assemblies and valve blocks for excavators, backhoes, and tracked loaders used on demanding construction sites.',
      'Our parts are sourced from certified manufacturers and tested to meet OEM pressure ratings, ensuring reliable boom, arm, and swing circuit performance.',
    ],
    features: [
      'High-pressure rated for continuous duty cycles',
      'Compatible with major excavator brands',
      'OEM and cost-effective aftermarket options',
      'Pre-shipment pressure testing available',
      'Export documentation and packaging support',
    ],
    applications: ['Earthmoving', 'Demolition', 'Utility trenching', 'Port handling'],
  },
  {
    slug: 'undercarriage-track-chains',
    title: 'Undercarriage Track Chains',
    label: 'Bulldozer Parts',
    categoryId: 'bulldozers',
    image: '/statsic/jcb.jpg',
    desc: 'Track chains, sprockets, idlers, and rollers for bulldozers and tracked excavators. Heat-treated steel for abrasion resistance.',
    specs: ['D6 · D8 · PC200 series', 'Export-ready packaging'],
    overview: [
      'We provide full undercarriage solutions including track chains, sprockets, idlers, and bottom rollers for bulldozers and tracked excavators.',
      'Components are heat-treated for abrasion resistance in quarry, mining, and heavy civil environments where downtime is costly.',
    ],
    features: [
      'Forged link pins and bushings',
      'Matched sprocket and idler sets',
      'Extended wear life in abrasive soils',
      'Bulk supply for fleet operators',
      'Model-specific fitment support',
    ],
    applications: ['Bulldozing', 'Site grading', 'Quarry extraction', 'Land reclamation'],
  },
  {
    slug: 'loader-bucket-teeth-adapters',
    title: 'Loader Bucket Teeth & Adapters',
    label: 'Wheel Loader Parts',
    categoryId: 'wheel-loaders',
    image: '/statsic/jcb.jpg',
    desc: 'Replaceable bucket teeth, adapters, and cutting edges for wheel loaders and front-end loaders used in quarry and site work.',
    specs: ['Forged alloy steel', 'Quick-fit adapters'],
    overview: [
      'Replaceable bucket teeth, adapters, and cutting edges keep wheel loaders productive in quarry, aggregate, and construction material handling.',
      'SAASA B2E TRADES stocks standard and heavy-duty profiles with quick-fit adapter systems to minimize machine downtime during change-outs.',
    ],
    features: [
      'Forged alloy steel construction',
      'Quick-change adapter systems',
      'Standard and penetration tooth profiles',
      'Cutting edges and side cutters available',
      'Volume pricing for fleet accounts',
    ],
    applications: ['Quarry loading', 'Aggregate yards', 'Material stockpiling', 'Road base handling'],
  },
  {
    slug: 'crane-wire-rope-sheaves',
    title: 'Crane Wire Rope & Sheaves',
    label: 'Crane Components',
    categoryId: 'cranes',
    image: '/statsic/drum mix.jpeg',
    desc: 'Wire ropes, hook blocks, sheave assemblies, and safety latches for tower cranes and mobile cranes on high-rise projects.',
    specs: ['Mobile & tower cranes', 'Load-tested certified'],
    overview: [
      'Our crane component range covers wire ropes, hook blocks, sheave assemblies, and safety latches for tower and mobile crane operations.',
      'All load-bearing items are supplied with traceability documentation and can be matched to your crane model and duty classification.',
    ],
    features: [
      'Rotation-resistant wire rope options',
      'Load-tested hook blocks and latches',
      'Sheave assemblies with bearing kits',
      'Compliance with site safety standards',
      'Scheduled replacement programs',
    ],
    applications: ['High-rise construction', 'Infrastructure lifting', 'Industrial plant erection', 'Port crane maintenance'],
  },
  {
    slug: 'diesel-engine-overhaul-kits',
    title: 'Diesel Engine Overhaul Kits',
    label: 'Engine Parts',
    categoryId: 'engine-parts',
    image: '/statsic/batchmix.jpeg',
    desc: 'Piston kits, gaskets, liners, and turbocharger parts for diesel engines powering excavators, loaders, and dump trucks.',
    specs: ['Cummins · Deutz · Perkins', 'Full gasket sets'],
    overview: [
      'Complete diesel engine overhaul kits including pistons, liners, gaskets, and turbocharger components for construction machinery power units.',
      'We support major engine platforms used in excavators, wheel loaders, and articulated dump trucks worldwide.',
    ],
    features: [
      'Full top-end and bottom-end kit options',
      'Genuine and premium aftermarket lines',
      'Turbocharger and fuel system parts',
      'Technical cross-reference assistance',
      'Scheduled rebuild kit bundling',
    ],
    applications: ['Fleet rebuild programs', 'Field overhauls', 'Rental fleet maintenance', 'Mining equipment rebuilds'],
  },
  {
    slug: 'hydraulic-cylinder-seal-kits',
    title: 'Hydraulic Cylinder Seal Kits',
    label: 'Hydraulic Parts',
    categoryId: 'powertrain-hydraulics',
    image: '/statsic/bitumen soreder.jpg',
    desc: 'Seal kits, rod wipers, and cylinder repair parts for boom, arm, and bucket cylinders across all major machinery brands.',
    specs: ['NBR · PU · Viton options', 'Bulk order available'],
    overview: [
      'Seal kits and cylinder repair components for boom, arm, bucket, and lift cylinders across all major heavy equipment brands.',
      'Material options include NBR, polyurethane, and Viton for standard and high-temperature hydraulic applications.',
    ],
    features: [
      'Complete rod and piston seal sets',
      'Wiper and wear ring combinations',
      'High-temperature compound options',
      'Bulk kits for workshop stock',
      'Cross-reference by cylinder part number',
    ],
    applications: ['Hydraulic rebuild workshops', 'On-site cylinder repair', 'Fleet preventive maintenance', 'Rental equipment turnaround'],
  },
  {
    slug: 'concrete-mixer-drum-liners',
    title: 'Concrete Mixer Drum Liners',
    label: 'Concrete Equipment',
    categoryId: 'concrete-mixers',
    image: '/statsic/batchmix.jpeg',
    desc: 'Wear-resistant drum liners, mixing blades, and discharge chute parts for transit mixers and stationary batch plants.',
    specs: ['Transit & stationary mixers', 'Custom fabrication'],
    overview: [
      'Wear-resistant drum liners, mixing blades, and discharge chute components for transit mixers and stationary batch plants.',
      'SAASA B2E TRADES supports ready-mix producers and equipment rebuilders with custom-fabricated liner profiles and fast replacement cycles.',
    ],
    features: [
      'Abrasion-resistant liner materials',
      'Mixing blade and fin replacements',
      'Discharge chute wear parts',
      'Custom fabrication to drum spec',
      'Scheduled wear-part supply contracts',
    ],
    applications: ['Ready-mix concrete', 'Precast batch plants', 'Infrastructure pours', 'Drum refurbishing workshops'],
  },
  {
    slug: 'road-roller-drum-kits',
    title: 'Road Roller Drum Kits',
    label: 'Compaction Parts',
    categoryId: 'road-rollers',
    image: '/statsic/road roller.jpg',
    desc: 'Vibration drum assemblies, bearing kits, and scraper blades for single and double drum rollers on road construction.',
    specs: ['Smooth & padfoot drums', 'Field service support'],
    overview: [
      'Vibration drum assemblies, bearing kits, and scraper blades for single-drum and double-drum rollers on road and site compaction work.',
      'Our parts help contractors maintain consistent compaction performance throughout long highway and infrastructure projects.',
    ],
    features: [
      'Smooth and padfoot drum components',
      'Vibration bearing and seal kits',
      'Scraper blade and mount hardware',
      'Field service parts availability',
      'Model-matched drum assemblies',
    ],
    applications: ['Highway construction', 'Airfield paving', 'Sub-base compaction', 'Site preparation'],
  },
  {
    slug: 'transmission-gearbox-parts',
    title: 'Transmission & Gearbox Parts',
    label: 'Powertrain',
    categoryId: 'powertrain-hydraulics',
    image: '/statsic/drum mix.jpeg',
    desc: 'Clutch plates, torque converters, planetary gears, and final drive components for loaders, dozers, and graders.',
    specs: ['ZF · Allison · Dana', 'Reman & new stock'],
    overview: [
      'Powertrain components including clutch plates, torque converters, planetary gears, and final drives for loaders, dozers, and motor graders.',
      'We supply remanufactured and new-stock options from leading transmission manufacturers to keep heavy fleets operational.',
    ],
    features: [
      'Torque converter and clutch kits',
      'Planetary gear and bearing sets',
      'Final drive and differential parts',
      'Remanufactured exchange units',
      'Technical fitment verification',
    ],
    applications: ['Loader powertrain rebuilds', 'Dozer drivetrain repair', 'Grader transmission service', 'Fleet exchange programs'],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getAllProductSlugs(): string[] {
  return products.map((p) => p.slug)
}
