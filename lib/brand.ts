export const COMPANY_NAME = 'SAASA B2E TRADES'
export const COMPANY_LEGAL_NAME = 'SAASA B2E TRADES PVT. LTD.'
export const COMPANY_SHORT = 'SAASA B2E'
export const COMPANY_TAGLINE = 'Procurement & Trading for Industry'
export const COMPANY_DESCRIPTION =
  'SAASA B2E TRADES is a business-to-enterprise trading company specialising in procurement, sourcing, and supply of construction machinery, heavy equipment parts, trucks, buses, mining assets, and industrial products across Africa and global markets.'
/** Full square asset (large transparent padding — avoid in navbar) */
export const LOGO_SRC = '/images/saasa_trades_slogo-removebg-preview.png'
/** Trimmed horizontal mark for navbar / footer */
export const LOGO_NAV_SRC = '/images/saasa-logo-nav.png'
export const LOGO_ALT = `${COMPANY_NAME} logo`

export const COMPANY_ADDRESS = 'Hisar, Haryana, India'

export const COMPANY_EMAILS = ['info@saasab2e.com', 'daanish@sasab2e.com'] as const
export const COMPANY_EMAIL = COMPANY_EMAILS[0]

export const COMPANY_PHONES = [
  { display: '+91 94676 94449', tel: '+919467694449' },
  { display: '+91 70819 79741', tel: '+917081979741' },
] as const

export const COMPANY_PHONE = COMPANY_PHONES[0].display
export const COMPANY_PHONE_TEL = COMPANY_PHONES[0].tel

export const SOCIAL_LINKS = [
  {
    name: 'facebook' as const,
    href: 'https://www.facebook.com/SAASAB2ETrades',
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

export const CMS_DEFAULT_AUTHOR = `${COMPANY_SHORT} Team`
