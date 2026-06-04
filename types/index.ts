export type SocialName = 'facebook' | 'twitter' | 'instagram' | 'linkedin'

export type NavbarVariant = 'default' | 'hero'

export interface NavItem {
  label: string
  href: string
  hasDropdown: boolean
}
