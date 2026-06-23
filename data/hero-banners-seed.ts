import type { HeroBanner } from '@/types/cms'
import { SITE_IMAGES } from '@/lib/site-content'

export const seedHeroBanners: HeroBanner[] = [
  {
    slug: 'heavy-equipment',
    position: 1,
    image: SITE_IMAGES.hero.equipment,
    badge: 'EST. 2024 • PROCUREMENT & TRADING',
    title: 'Heavy',
    titleAccent: 'Equipment',
    subtitle:
      'Source construction machinery, earthmoving equipment, and industrial assets through a trusted B2E trading partner.',
  },
  {
    slug: 'earthmoving-machinery',
    position: 2,
    image: SITE_IMAGES.hero.machinery,
    badge: 'EST. 2024 • FLEET SUPPLY',
    title: 'Earthmoving',
    titleAccent: 'Machinery',
    subtitle:
      'Procure excavators, loaders, dozers, cranes, and road-building equipment through a trusted B2E trading partner.',
  },
  {
    slug: 'machinery-parts',
    position: 3,
    image: SITE_IMAGES.hero.parts,
    badge: 'EST. 2024 • GENUINE PARTS',
    title: 'Machinery',
    titleAccent: 'Parts',
    subtitle:
      'Genuine and aftermarket parts for excavators, loaders, cranes, and road-building equipment — supplied on time.',
  },
]
