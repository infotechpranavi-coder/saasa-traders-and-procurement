import { COMPANY_NAME } from '@/lib/brand'

export const brochurePage = {
  eyebrow: 'Product catalog',
  title: 'Download our company catalog',
  lead: `Get the full ${COMPANY_NAME} product and services range in one PDF — equipment, parts, trucks, and industrial supply.`,
  highlights: [
    'Full product and equipment range in one PDF',
    'Instant download on this page',
    'Copy emailed to your inbox',
  ],
  formTitle: 'Get the catalog',
  formDescription: 'Enter your details below. Email is required so we can send the PDF to you.',
  fields: {
    name: 'Full name',
    email: 'Email',
    company: 'Company (optional)',
    phone: 'Phone / WhatsApp (optional)',
  },
  submitLabel: 'Download catalog & email PDF',
  successTitle: 'Your catalog is downloading',
  successEmailNote: 'We have also emailed the PDF to your inbox.',
  successEmailFailed:
    'Your download started, but we could not send the email. Use the button below to download again or contact us.',
  successManual: 'Download PDF again',
  successWhatsapp: 'Chat on WhatsApp',
  successAnother: 'Submit another request',
} as const
