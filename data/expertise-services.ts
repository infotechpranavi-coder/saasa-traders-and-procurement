import { DEMO_SERVICE_IMAGES } from '@/lib/static-machinery-images'

export interface ExpertiseService {
  slug: string
  title: string
  categoryId?: string
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
    categoryId: 'construction',
    image: DEMO_SERVICE_IMAGES['construction-equipment'],
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
    categoryId: 'transport',
    image: DEMO_SERVICE_IMAGES['trucks-transport'],
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
    categoryId: 'transport',
    image: DEMO_SERVICE_IMAGES['buses-transport'],
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
    categoryId: 'energy',
    image: DEMO_SERVICE_IMAGES['energy-engines-generators'],
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
    categoryId: 'mining',
    image: DEMO_SERVICE_IMAGES['mining-quarrying'],
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
  // FMCG Products
  {
    slug: 'packaged-foods-beverages-supply',
    title: 'Packaged Foods & Beverages Supply',
    categoryId: 'fmcg-products',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Bulk procurement and container-load supply of branded packaged foods, beverages, canned goods, and confectionery for wholesale distributors.',
    overview: [
      'SAASA B2E TRADES coordinates multi-container procurement and international shipping of high-demand consumer packaged foods, carbonated & non-carbonated beverages, biscuits, and canned provisions.',
      'We link commercial supermarkets, institutional importers, and regional wholesalers with certified global manufacturers, ensuring batch inspection, long shelf lives, and seamless import clearance.',
    ],
    capabilities: [
      'Full container-load (FCL) packaged food supply',
      'Branded and private-label beverage sourcing',
      'Batch testing and expiry verification',
      'Port-to-warehouse multi-modal transit',
      'Phytosanitary & import documentation support',
    ],
    industries: ['Retail Supermarkets', 'Wholesale Distributors', 'Hospitality & Hotels', 'Food Service Operators'],
  },
  {
    slug: 'bulk-commodities-cooking-oils',
    title: 'Bulk Agricultural Commodities & Cooking Oils',
    categoryId: 'fmcg-products',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Import and export of bulk refined cooking oils, edible vegetable oils, rice, sugar, wheat flour, and essential food commodities.',
    overview: [
      'We specialize in high-volume trading of agricultural staples and refined edible oils (palm oil, sunflower oil, soybean oil) packaged in drums, flexitanks, and retail-ready consumer tins.',
      'Our team manages mill-to-port logistics, quality sampling, weight certificates, and maritime freight to deliver stable commodity flows across emerging and established international markets.',
    ],
    capabilities: [
      'Bulk refined edible oil in flexitanks & drums',
      'Long-grain rice, cane sugar & refined flour',
      'SGS/Bureau Veritas quality inspections',
      'CIF & FOB commercial maritime contracts',
      'Customs clearance & tariff optimization',
    ],
    industries: ['Food Processing Plants', 'National Food Distributors', 'Institutional Caterers', 'Government Procurement'],
  },
  {
    slug: 'personal-care-hygiene-cleaning',
    title: 'Personal Care, Hygiene & Cleaning Products',
    categoryId: 'fmcg-products',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Procurement of institutional and consumer personal hygiene goods, detergents, soaps, disinfectants, and sanitization products.',
    overview: [
      'SAASA B2E TRADES supplies commercial distributors and healthcare networks with personal hygiene essentials, antibacterial soaps, laundry detergents, surface disinfectants, and paper products.',
      'We contract directly with certified personal care manufacturers, guaranteeing stringent formulation compliance, competitive wholesale pricing, and consolidated container dispatch.',
    ],
    capabilities: [
      'Institutional cleaning chemical procurement',
      'Consumer soaps, detergents & toiletries',
      'Consolidated multi-SKU container loading',
      'MSDS and chemical compliance verification',
      'Regular replenishment scheduling',
    ],
    industries: ['Healthcare Facilities', 'Hospitality Chains', 'Commercial Retailers', 'Facility Management Companies'],
  },
  // Textile
  {
    slug: 'fabric-sourcing-industrial-textiles',
    title: 'Fabric Sourcing & Industrial Textiles',
    categoryId: 'textile',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Global procurement of raw cotton, synthetic yarns, blended fabrics, denim, canvas, and heavy-duty industrial technical textiles.',
    overview: [
      'Our textile procurement division connects fabric converters, garment manufacturers, and industrial users with premier weaving and spinning mills across India and global production hubs.',
      'From fine cotton poplin and denim to high-tensile technical canvas and geotextiles, we ensure consistent GSM, colorfastness, and weave density across all production runs.',
    ],
    capabilities: [
      'Raw cotton, poly-cotton blends & specialty weaves',
      'Industrial heavy canvas and geotextiles',
      'Lab-dip approval and colorfastness testing',
      'Mill-direct pricing and containerized roll shipping',
      'Batch traceability and tensile certification',
    ],
    industries: ['Garment Manufacturing', 'Upholstery & Furnishing', 'Industrial Filtration', 'Packaging & Tarpaulins'],
  },
  {
    slug: 'ready-made-garments-uniforms',
    title: 'Ready-Made Garments & Uniforms Trading',
    categoryId: 'textile',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Bulk sourcing of corporate workwear, industrial safety uniforms, high-visibility apparel, casual apparel, and institutional clothing.',
    overview: [
      'SAASA B2E TRADES provides complete turnkey manufacturing and procurement for enterprise workwear, flame-retardant coveralls, high-visibility construction clothing, and corporate staff uniforms.',
      'We handle pattern making, sample approvals, custom embroidery, heavy-duty stitching inspection, and containerized dispatch directly to your operational hubs.',
    ],
    capabilities: [
      'High-visibility and fire-retardant workwear (PPE)',
      'Corporate uniforms, shirts & formal trousers',
      'Custom branding, embroidery & reflective tapes',
      'Strict size-run quality assurance',
      'Direct-to-enterprise bulk container delivery',
    ],
    industries: ['Mining & Construction Contractors', 'Transport & Logistics Fleets', 'Corporate Organizations', 'Security & Hospitality'],
  },
  {
    slug: 'yarn-home-textiles-supply',
    title: 'Yarn & Home Textiles Supply',
    categoryId: 'textile',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Sourcing cotton yarn, polyester filaments, bed linens, towels, and institutional hospitality textiles for commercial buyers.',
    overview: [
      'We supply commercial hospitality projects, hospitals, and retail brands with premium combed cotton yarns, institutional bed linens, bath towels, and thermal blankets.',
      'Our products meet rigorous commercial laundering standards, maintaining softness, dimensional stability, and fiber durability across extended wash cycles.',
    ],
    capabilities: [
      'Carded, combed & blended knitting/weaving yarn',
      'Institutional 200–400 thread-count bed linens',
      'High-absorbency ring-spun terry towels',
      'Hypoallergenic commercial bedding accessories',
      'Export palletizing & moisture-proof wrapping',
    ],
    industries: ['Hotels & Luxury Resorts', 'Hospital Networks', 'Textile Converters', 'Home Goods Retailers'],
  },
  // Pharmaceutical Machines
  {
    slug: 'tablet-capsule-processing-machinery',
    title: 'Tablet & Capsule Processing Machinery',
    categoryId: 'pharmaceutical-machines',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Sourcing rotary tablet presses, capsule filling machines, fluid bed dryers, granulators, and coating equipment for pharmaceutical labs.',
    overview: [
      'SAASA B2E TRADES procures certified cGMP pharmaceutical manufacturing machinery including rotary tablet compression machines, automatic hard gelatin capsule fillers, and high-shear granulators.',
      'We collaborate with precision engineering manufacturers in India and worldwide, delivering robust stainless steel (SS 316L) machinery with full qualification documentation (FAT, SAT, IQ, OQ).',
    ],
    capabilities: [
      'High-speed rotary tablet presses & multi-tooling',
      'Automatic capsule filling & powder dosing lines',
      'Fluid bed processors (FBP) & rapid mixer granulators',
      'Auto-coater machines with perforated pans',
      'Complete IQ/OQ/PQ validation protocol support',
    ],
    industries: ['Pharmaceutical Formulations', 'Nutraceutical Production', 'Research & Development Labs', 'Contract Manufacturing Organizations (CMO)'],
  },
  {
    slug: 'blister-packing-secondary-packaging',
    title: 'Blister Packing & Secondary Packaging Lines',
    categoryId: 'pharmaceutical-machines',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Automatic ALU-ALU / PVC blister packaging machines, cartoning machines, induction sealers, and serialization track-and-trace lines.',
    overview: [
      'We supply complete turnkey packaging lines engineered for pharmaceutical solid dosage forms, including rotary thermoforming blister machines, cold-forming ALU-ALU equipment, and continuous-motion cartoners.',
      'Every line is designed for rapid changeovers, integrated optical vision inspection, and pharmaceutical serialization for regulatory tracking.',
    ],
    capabilities: [
      'Rotary blister packing (ALU-ALU & PVC-PVDC)',
      'Automatic horizontal cartoning machines with leaflet feeders',
      'Optical vision inspection for missing or damaged pills',
      'Track-and-trace 2D barcode serialization systems',
      'End-of-line case packing & palletizing',
    ],
    industries: ['Pharmaceutical Packaging', 'Medical Device Manufacturing', 'Nutraceutical Packagers', 'Export Packaging Facilities'],
  },
  {
    slug: 'liquid-filling-cleanroom-systems',
    title: 'Liquid Filling, Bottling & Cleanroom Systems',
    categoryId: 'pharmaceutical-machines',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Sterile vial filling, syrup bottling lines, ampoule sealing machines, and modular cleanroom HVAC and laminar flow filtration units.',
    overview: [
      'Our pharmaceutical engineering portfolio covers aseptic liquid filling systems, ultrasonic bottle washing machines, rotary capping units, and modular cleanroom wall/ceiling partitions.',
      'We assist manufacturers with ISO Class 5 to Class 8 cleanroom infrastructure, laminar air flow (LAF) hoods, and HEPA HVAC equipment engineered for zero-contamination sterile operations.',
    ],
    capabilities: [
      'Sterile vial & ampoule washing, filling & sealing lines',
      'Oral liquid & syrup bottling, measuring cup placing & capping',
      'Modular cleanroom sandwich panels & flush doors',
      'HVAC air handling units (AHU) with HEPA filtration',
      'Purified water generation & WFI distribution components',
    ],
    industries: ['Sterile Injectables Manufacturing', 'Syrup & Suspension Plants', 'Biotechnology Labs', 'Hospital Cleanrooms'],
  },
  // IT Equipment
  {
    slug: 'it-enterprise-computing',
    title: 'Enterprise Laptops, Desktops & Server Hardware',
    categoryId: 'it-equipment',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Laptops, desktops, workstations, and high-performance server hardware for corporate offices, schools, hospitals, and government institutions.',
    overview: [
      'SAASA B2E TRADES handles bulk procurement and international shipping of tier-1 branded laptops, desktop computers, workstations, and enterprise rack servers.',
      'We work directly with authorized distributors and manufacturers, coordinating warranty coverage, hardware pre-configurations, OS licensing, and secure palletized delivery across Africa and the Middle East.',
    ],
    capabilities: [
      'Commercial laptops, business ultrabooks & rugged PCs',
      'Enterprise 1U/2U/4U rack & blade server platforms',
      'Institutional bulk procurement for schools & hospitals',
      'Pre-shipment hardware diagnostic testing & packaging',
      'Air and maritime consolidated container transport',
    ],
    industries: ['Corporate Enterprises', 'Educational Institutions', 'Hospital Networks', 'Government Agencies'],
  },
  {
    slug: 'it-networking-infrastructure',
    title: 'Networking Hardware, Data Center & Structured Cabling',
    categoryId: 'it-equipment',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Enterprise network switches, core routers, unified firewalls, server racks, and structured fiber/copper cabling components.',
    overview: [
      'We supply complete network infrastructure hardware engineered for reliable corporate connectivity, campus networks, data centers, and multi-branch enterprises.',
      'Our catalog includes managed PoE switches, high-throughput gateway routers, next-generation firewalls, server cabinets, and certified Cat6/fiber optical cabling.',
    ],
    capabilities: [
      'Managed Layer-2 / Layer-3 enterprise switches',
      'Enterprise edge routers & cybersecurity firewalls',
      'Server racks, PDU units & uninterruptible power supplies (UPS)',
      'Fiber optic patch cords & bulk structured cabling',
      'Turnkey institutional procurement bills of materials (BOM)',
    ],
    industries: ['Telecommunications & ISPs', 'Banking & Financial Institutions', 'Data Centers', 'Smart Building Projects'],
  },
  {
    slug: 'it-office-printers-peripherals',
    title: 'Office Printers, Scanners & Institutional Peripherals',
    categoryId: 'it-equipment',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Multi-function laser printers, heavy-duty document scanners, barcode scanners, genuine consumables, and IT peripherals.',
    overview: [
      'From departmental laser multi-function printers and high-speed document scanners to point-of-sale peripherals and monitors, we supply all institutional computing peripherals.',
      'We ensure continuous supply contracts for genuine replacement toners, imaging drums, and essential peripherals to keep office workflows uninterrupted.',
    ],
    capabilities: [
      'Heavy-duty multi-function network printers & copiers',
      'High-speed batch document & flatbed scanners',
      'Industrial barcode scanners & thermal label printers',
      'OEM toner cartridges & consumable replenishments',
      'Monitors, docking stations & ergonomic peripherals',
    ],
    industries: ['Office Headquarters', 'Healthcare Records', 'Logistics Warehouses', 'Financial Institutions'],
  },
  // Commercial Pickups & Fleet Vehicles
  {
    slug: 'pickups-passenger-vehicles',
    title: 'Pickups, 4x4 Fleet & Passenger Vehicles',
    categoryId: 'transport',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    summary:
      'Double-cabin pickups, rugged 4x4 work trucks, and commercial passenger vehicles for logistics operators and corporate fleets.',
    overview: [
      'SAASA B2E TRADES coordinates fleet procurement for commercial double-cab pickups, off-road 4x4 exploration vehicles, utility vans, and corporate passenger transport.',
      'We handle tropicalized specifications, heavy-duty suspension packages, vehicle export documentation, and roll-on/roll-off (RoRo) or containerized maritime shipping.',
    ],
    capabilities: [
      'Single & double-cabin 4x4 diesel pickups',
      'Corporate passenger utility vehicles & SUVs',
      'Mining & field-duty tropicalized vehicle packages',
      'RoRo & containerized vehicle export clearance',
      'Fleet spare parts kits & maintenance consumables',
    ],
    industries: ['Mining & Exploration Sites', 'Construction Contractors', 'Field Logistics & Security', 'Corporate Fleets'],
  },
]

export function getServiceBySlug(slug: string): ExpertiseService | undefined {
  return expertiseServices.find((s) => s.slug === slug)
}

export function getAllServiceSlugs(): string[] {
  return expertiseServices.map((s) => s.slug)
}
