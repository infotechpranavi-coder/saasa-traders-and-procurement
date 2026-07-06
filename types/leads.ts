export type EnquirySource = 'contact-form' | 'brochure-form'
export type EnquiryType = 'contact' | 'brochure'

export interface EnquiryRecord {
  id?: string
  name: string
  email: string
  phone?: string
  service?: string
  message?: string
  company?: string
  type: EnquiryType
  createdAt: string
  source: EnquirySource
}

export interface NewsletterSubscriber {
  email: string
  name?: string
  subscribedAt: string
  active: boolean
}

export type NewsletterContentKind = 'product' | 'service' | 'blog'

export interface NewsletterContentAlert {
  kind: NewsletterContentKind
  title: string
  slug: string
}
