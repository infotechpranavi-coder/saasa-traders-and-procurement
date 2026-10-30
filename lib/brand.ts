export const COMPANY_NAME = 'SAASA B2E TRADES'
export const COMPANY_LEGAL_NAME = 'SAASA B2E TRADES PVT. LTD.'
export const COMPANY_SHORT = 'SAASA B2E'
export const COMPANY_TAGLINE = 'Procurement & Trading for Industry'
export const COMPANY_DESCRIPTION =
  'SAASA B2E TRADES is the trading and procurement division of SAASA B2E Group, a business consulting and international trade company with offices in India, the UAE, and Cameroon. We supply FMCG products, commercial and passenger vehicles, heavy machinery, pharmaceutical manufacturing machines, and IT equipment across Africa and the Middle East.'
/** Full square asset (large transparent padding — avoid in navbar) */
export const LOGO_SRC = '/images/saasa_trades_slogo-removebg-preview.png'
/** Trimmed horizontal mark for navbar / footer */
export const LOGO_NAV_SRC = '/images/saasa-logo-nav.png'
export const LOGO_ALT = `${COMPANY_NAME} logo`

export const COMPANY_ADDRESS = 'Hisar, Haryana, India'
export const SITE_URL = 'https://trades.saasab2e.com'
export const SITE_DOMAIN = 'trades.saasab2e.com'

export interface OfficeLocation {
  name: string
  city: string
  address: string
  email: string
  phone?: string
  phoneTel?: string
  additionalPhone?: string
  additionalPhoneTel?: string
  additionalPhones?: { display: string; tel: string }[]
}

export const OFFICES: OfficeLocation[] = [
  {
    name: 'India Office',
    city: 'Hisar, Haryana',
    address: 'Hisar, Haryana, India',
    email: 'daanish@saasab2e.com',
    phone: '+91 94676 94449',
    phoneTel: '+919467694449',
    additionalPhone: '+91 90346 13782',
    additionalPhoneTel: '+919034613782',
    additionalPhones: [
      { display: '+91 90346 13782', tel: '+919034613782' },
      { display: '+91 70819 79741', tel: '+917081979741' },
    ],
  },
  {
    name: 'UAE Trade Base',
    city: 'Dubai',
    address: 'Dubai, United Arab Emirates',
    email: 'daanish@saasab2e.com',
  },
  {
    name: 'Cameroon Office',
    city: 'Yaoundé',
    address: 'Yaoundé, Cameroon',
    email: 'daanish@saasab2e.com',
    phone: '+237 6 83 57 76 76',
    phoneTel: '+237683577676',
  },
]

export const INDIA_OFFICE = OFFICES[0]
export const UAE_OFFICE = OFFICES[1]
export const CAMEROON_OFFICE = OFFICES[2]

export const COMPANY_EMAILS = ['daanish@saasab2e.com'] as const
export const COMPANY_EMAIL = COMPANY_EMAILS[0]

export const COMPANY_PHONES = [
  { display: '+91 94676 94449', tel: '+919467694449' },
  { display: '+91 90346 13782', tel: '+919034613782' },
  { display: '+91 70819 79741', tel: '+917081979741' },
  { display: '+237 6 83 57 76 76', tel: '+237683577676' },
] as const

export const COMPANY_PHONE = COMPANY_PHONES[0].display
export const COMPANY_PHONE_TEL = COMPANY_PHONES[0].tel

/** Dedicated WhatsApp lead redirect phone number */
export const WHATSAPP_PHONE = '+91 90346 13782'
export const WHATSAPP_PHONE_TEL = '+919034613782'
export const WHATSAPP_NUMBER = '919034613782'

/** Standardized company opening hours */
export const OPENING_HOURS = 'Mon to Sat, 9AM to 7PM'

export const SOCIAL_LINKS = [
  {
    name: 'facebook' as const,
    href: 'https://www.facebook.com/share/1J9WJ2MZJw/',
    label: 'Facebook',
  },
  {
    name: 'instagram' as const,
    href: 'https://www.instagram.com/saasab2e_trades/',
    label: 'Instagram',
  },
  {
    name: 'linkedin' as const,
    href: 'https://www.linkedin.com/company/saasab2e-trades/',
    label: 'LinkedIn',
  },
  {
    name: 'gmb' as const,
    href: 'https://share.google/LLuqSYEWz0JUVQGiI',
    label: 'Google Business',
  },
]

/** Parent company website — consulting, HR, import/export, and group services */
export const MAIN_SAASA_SITE_URL = 'https://saasab2e.com/'
export const MAIN_SAASA_SITE_LABEL = 'SAASA B2E Group'

export const CMS_DEFAULT_AUTHOR = 'SAASA B2E TRADES'
