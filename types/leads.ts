export interface EnquiryRecord {
  id?: string
  name: string
  email: string
  phone?: string
  service?: string
  message?: string
  createdAt: string
  source: 'contact-form'
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
