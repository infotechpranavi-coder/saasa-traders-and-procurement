import type { CmsData } from '@/types/cms'

/** Local construction machinery photos in /public/statsic */
export const STATIC_MACHINERY_IMAGES = {
  batchMix: '/statsic/batchmix.jpeg',
  bitumenSpreader: '/statsic/bitumen soreder.jpg',
  drumMix: '/statsic/drum mix.jpeg',
  jcb: '/statsic/jcb.jpg',
  roadRoller: '/statsic/road roller.jpg',
} as const

/** Demo catalog product images */
export const DEMO_PRODUCT_IMAGES: Record<string, string> = {
  'hydraulic-pump-assemblies': STATIC_MACHINERY_IMAGES.jcb,
  'undercarriage-track-chains': STATIC_MACHINERY_IMAGES.jcb,
  'loader-bucket-teeth-adapters': STATIC_MACHINERY_IMAGES.jcb,
  'crane-wire-rope-sheaves': STATIC_MACHINERY_IMAGES.drumMix,
  'diesel-engine-overhaul-kits': STATIC_MACHINERY_IMAGES.batchMix,
  'hydraulic-cylinder-seal-kits': STATIC_MACHINERY_IMAGES.bitumenSpreader,
  'concrete-mixer-drum-liners': STATIC_MACHINERY_IMAGES.batchMix,
  'road-roller-drum-kits': STATIC_MACHINERY_IMAGES.roadRoller,
  'transmission-gearbox-parts': STATIC_MACHINERY_IMAGES.drumMix,
}

/** Demo service images */
export const DEMO_SERVICE_IMAGES: Record<string, string> = {
  'construction-equipment': STATIC_MACHINERY_IMAGES.jcb,
  'trucks-transport': STATIC_MACHINERY_IMAGES.batchMix,
  'buses-transport': STATIC_MACHINERY_IMAGES.roadRoller,
  'energy-engines-generators': STATIC_MACHINERY_IMAGES.drumMix,
  'mining-quarrying': STATIC_MACHINERY_IMAGES.bitumenSpreader,
}

/** Force demo seed products/services to /statsic photos and homepage expertise visibility. */
export function applyDemoProductServiceSeed<T extends Pick<CmsData, 'products' | 'services'>>(data: T): T {
  return {
    ...data,
    products: data.products.map((product) => ({
      ...product,
      image: DEMO_PRODUCT_IMAGES[product.slug] ?? product.image,
      showOnHomepage: true,
    })),
    services: data.services.map((service) => ({
      ...service,
      image: DEMO_SERVICE_IMAGES[service.slug] ?? service.image,
      showOnHomepage: true,
    })),
  }
}

export function isStatsicImagePath(path: string): boolean {
  return path.startsWith('/statsic/')
}
