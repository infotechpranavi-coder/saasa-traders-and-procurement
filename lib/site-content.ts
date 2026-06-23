/** Local construction machinery photos in /public/statsic */
import { STATIC_MACHINERY_IMAGES } from '@/lib/static-machinery-images'

export { STATIC_MACHINERY_IMAGES }

/** Static homepage section images — your local machinery photos */
export const SITE_IMAGES = {
  hero: {
    equipment: STATIC_MACHINERY_IMAGES.batchMix,
    machinery: STATIC_MACHINERY_IMAGES.jcb,
    parts: STATIC_MACHINERY_IMAGES.roadRoller,
  },
  about: {
    main: STATIC_MACHINERY_IMAGES.jcb,
    secondary: STATIC_MACHINERY_IMAGES.roadRoller,
    accent: STATIC_MACHINERY_IMAGES.drumMix,
    tab: STATIC_MACHINERY_IMAGES.bitumenSpreader,
  },
  stats: STATIC_MACHINERY_IMAGES.batchMix,
  solutions: {
    primary: STATIC_MACHINERY_IMAGES.drumMix,
    secondary: STATIC_MACHINERY_IMAGES.jcb,
  },
} as const

export const FOOTER_QUICK_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Our Services', href: '/services' },
  { label: 'Strong Brands', href: '/products/brands' },
  { label: 'Our Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
] as const

export const FOOTER_SERVICES = [
  { label: 'Construction Equipment', href: '/services' },
  { label: 'Heavy Machinery Parts', href: '/products' },
  { label: 'Trucks & Fleet Supply', href: '/services' },
  { label: 'Buses & Passenger Transport', href: '/services' },
  { label: 'Mining & Quarry Equipment', href: '/services' },
  { label: 'Engines & Power Systems', href: '/services' },
] as const

export const CONTACT_SERVICE_OPTIONS = [
  'Construction Equipment Procurement',
  'Heavy Machinery Parts',
  'Trucks & Buses',
  'Mining & Quarry Equipment',
  'Engines & Power Systems',
  'General Trading Inquiry',
] as const
