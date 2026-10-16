export type SocialName = 'facebook' | 'instagram' | 'linkedin' | 'gmb'

export type NavbarVariant = 'default' | 'hero'

export interface NavSubItem {
  label: string
  href: string
  image?: string
  description?: string
  badge?: string
  children?: NavSubItem[]
}

export interface NavItem {
  label: string
  href: string
  hasDropdown: boolean
  children?: NavSubItem[]
  external?: boolean
}
