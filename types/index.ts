export type SocialName = 'facebook' | 'twitter' | 'instagram' | 'linkedin'

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
}
