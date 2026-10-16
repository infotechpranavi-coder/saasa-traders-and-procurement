/** Local construction machinery photos in /public/statsic */
import { STATIC_MACHINERY_IMAGES } from '@/lib/static-machinery-images'

export { STATIC_MACHINERY_IMAGES }

/** Static homepage section images — your local machinery and FMCG photos */
export const SITE_IMAGES = {
  hero: {
    equipment: STATIC_MACHINERY_IMAGES.batchMix,
    machinery: STATIC_MACHINERY_IMAGES.jcb,
    parts: STATIC_MACHINERY_IMAGES.roadRoller,
    fmcg: STATIC_MACHINERY_IMAGES.fmcgWholesale,
  },
  about: {
    main: STATIC_MACHINERY_IMAGES.jcb,
    secondary: STATIC_MACHINERY_IMAGES.roadRoller,
    accent: STATIC_MACHINERY_IMAGES.drumMix,
    tab: STATIC_MACHINERY_IMAGES.bitumenSpreader,
    fmcg: STATIC_MACHINERY_IMAGES.fmcgWholesale,
    fmcgProducts: STATIC_MACHINERY_IMAGES.fmcgProducts,
  },
  stats: STATIC_MACHINERY_IMAGES.batchMix,
  solutions: {
    primary: STATIC_MACHINERY_IMAGES.fmcgProducts,
    secondary: STATIC_MACHINERY_IMAGES.jcb,
    machinery: STATIC_MACHINERY_IMAGES.drumMix,
    fmcg: STATIC_MACHINERY_IMAGES.fmcgProducts,
  },
  fmcg: {
    wholesale: STATIC_MACHINERY_IMAGES.fmcgWholesale,
    products: STATIC_MACHINERY_IMAGES.fmcgProducts,
  },
} as const

export const FOOTER_QUICK_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Strong Brands', href: '/products/brands' },
  { label: 'Our Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'SAASA B2E Group', href: 'https://saasab2e.com/', external: true },
  { label: 'Contact Us', href: '/contact' },
] as const

export const FOOTER_SERVICES = [
  { label: 'Construction Equipment', href: '/services' },
  { label: 'Heavy Machinery Parts', href: '/products' },
  { label: 'FMCG & Consumer Goods', href: '/products' },
  { label: 'Trucks & Fleet Supply', href: '/services' },
  { label: 'Buses & Passenger Transport', href: '/services' },
  { label: 'Mining & Quarry Equipment', href: '/services' },
] as const

export const CONTACT_SERVICE_OPTIONS = [
  'Construction Equipment Procurement',
  'Heavy Machinery Parts',
  'FMCG & Consumer Goods Trading',
  'Trucks & Buses',
  'Mining & Quarry Equipment',
  'Engines & Power Systems',
  'General Trading Inquiry',
] as const
