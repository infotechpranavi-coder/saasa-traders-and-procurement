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
