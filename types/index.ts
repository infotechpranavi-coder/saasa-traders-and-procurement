export type SocialName = 'facebook' | 'instagram' | 'linkedin' | 'gmb'

export type NavbarVariant = 'default' | 'hero'

export interface NavSubItem {
  label: string
  href: string
  children?: NavSubItem[]
}

export interface NavItem {
  label: string
  href: string
  hasDropdown: boolean
  children?: NavSubItem[]
  external?: boolean
}
