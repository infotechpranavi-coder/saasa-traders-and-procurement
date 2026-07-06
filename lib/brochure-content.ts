import { COMPANY_NAME } from '@/lib/brand'

export const brochurePage = {
  eyebrow: 'Product catalog',
  title: 'Download our company catalog',
  lead: `Get the full ${COMPANY_NAME} product and services catalog. Fill in the short form below — your download starts right away, and we keep a copy of your request for follow-up.`,
  formTitle: 'Request catalog download',
  formDescription: 'Name and phone are required. Add your email if you want the PDF sent to your inbox.',
  fields: {
    name: 'Full name',
    company: 'Company (optional)',
    email: 'Email (optional)',
    phone: 'Phone / WhatsApp',
  },
  submitLabel: 'Download catalog',
  successTitle: 'Thank you. Your catalog is downloading.',
  successEmailNote: 'A copy has also been sent to your email.',
  successManual: 'Download PDF',
  successWhatsapp: 'Chat on WhatsApp',
  successAnother: 'Submit another request',
} as const
