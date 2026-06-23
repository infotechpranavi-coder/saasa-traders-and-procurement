/**
 * Remote image URLs for CMS paths and static site sections.
 * Local /public files are optional — these always resolve to construction machinery photos.
 */
const pexels = (id: number, w = 1400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

/** Curated construction & heavy equipment photography (Pexels). */
export const CONSTRUCTION_PHOTOS = {
  excavator: pexels(2425019),
  excavatorOrange: pexels(256395),
  bulldozer: pexels(1309836),
  crane: pexels(1105766),
  constructionSite: pexels(159358),
  constructionWorkers: pexels(159306),
  heavyMachinery: pexels(3861969),
  miningTruck: pexels(3784324),
  dumpTruck: pexels(4483610),
  wheelLoader: pexels(3861969),
} as const

export const DEFAULT_IMAGE = CONSTRUCTION_PHOTOS.excavator

const REMOTE_IMAGE_MAP: Record<string, string> = {
  '/images/products/hydraulic-pump.jpg': CONSTRUCTION_PHOTOS.excavator,
  '/images/products/track-chains.jpg': CONSTRUCTION_PHOTOS.bulldozer,
  '/images/products/bucket-teeth.jpg': CONSTRUCTION_PHOTOS.excavatorOrange,
  '/images/products/crane-parts.jpg': CONSTRUCTION_PHOTOS.crane,
  '/images/products/engine-parts.jpg': CONSTRUCTION_PHOTOS.heavyMachinery,
  '/images/products/hydraulic-seals.jpg': CONSTRUCTION_PHOTOS.wheelLoader,
  '/images/products/concrete-mixer.jpg': CONSTRUCTION_PHOTOS.constructionSite,
  '/images/products/road-roller.jpg': CONSTRUCTION_PHOTOS.constructionWorkers,
  '/images/products/gearbox-parts.jpg': CONSTRUCTION_PHOTOS.excavatorOrange,
  '/images/services/construction-equipment.jpg': CONSTRUCTION_PHOTOS.excavator,
  '/images/services/trucks.jpg': CONSTRUCTION_PHOTOS.dumpTruck,
  '/images/services/buses.jpg': CONSTRUCTION_PHOTOS.dumpTruck,
  '/images/services/engines.jpg': CONSTRUCTION_PHOTOS.heavyMachinery,
  '/images/services/mining.jpg': CONSTRUCTION_PHOTOS.miningTruck,
  '/images/services/road.jpg': CONSTRUCTION_PHOTOS.constructionSite,
  '/images/services/rail.jpg': CONSTRUCTION_PHOTOS.constructionWorkers,
  '/images/services/sea.jpg': CONSTRUCTION_PHOTOS.crane,
  '/images/blog/featured-air.jpg': CONSTRUCTION_PHOTOS.crane,
  '/images/blog/digital-supply.jpg': CONSTRUCTION_PHOTOS.excavator,
  '/images/blog/supply-chain.jpg': CONSTRUCTION_PHOTOS.bulldozer,
  // Legacy homepage paths (if still referenced anywhere)
  '/images/about/main.jpg': CONSTRUCTION_PHOTOS.excavator,
  '/images/about/truck.jpg': CONSTRUCTION_PHOTOS.bulldozer,
  '/images/about/port-circle.jpg': CONSTRUCTION_PHOTOS.crane,
  '/images/about/tab.jpg': CONSTRUCTION_PHOTOS.wheelLoader,
  '/images/solutions/port.jpg': CONSTRUCTION_PHOTOS.crane,
  '/images/solutions/truck.jpg': CONSTRUCTION_PHOTOS.excavatorOrange,
  '/images/stats-ship.jpg': CONSTRUCTION_PHOTOS.heavyMachinery,
  '/images/hero-port.jpg': CONSTRUCTION_PHOTOS.crane,
  '/images/hero-truck.jpg': CONSTRUCTION_PHOTOS.bulldozer,
  '/images/testimonials/sarah.jpg': CONSTRUCTION_PHOTOS.constructionWorkers,
  '/images/testimonials/bessie.jpg': CONSTRUCTION_PHOTOS.heavyMachinery,
  '/images/testimonials/jacob.jpg': CONSTRUCTION_PHOTOS.excavatorOrange,
}

export function resolveCmsImage(src?: string): string {
  const trimmed = src?.trim()
  if (!trimmed) return DEFAULT_IMAGE
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('/statsic/')) return encodeURI(trimmed)
  if (REMOTE_IMAGE_MAP[trimmed]) return REMOTE_IMAGE_MAP[trimmed]
  if (trimmed.startsWith('/')) return encodeURI(trimmed)
  return DEFAULT_IMAGE
}

export function getCmsImageFallback(src?: string): string {
  return resolveCmsImage(src)
}
