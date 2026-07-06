import { COMPANY_NAME } from '@/lib/brand'

export const brochurePage = {
  eyebrow: 'Product catalog',
  title: 'Download our company catalog',
  lead: `Get the full ${COMPANY_NAME} product and services catalog. Enter your email — the PDF downloads instantly on this page and we email you a copy for your inbox.`,
  formTitle: 'Request catalog download',
  formDescription: 'Your email is required so we can send the catalog to your inbox. Name is required; company and phone are optional.',
  fields: {
    name: 'Full name',
    email: 'Email',
    company: 'Company (optional)',
    phone: 'Phone / WhatsApp (optional)',
  },
  submitLabel: 'Download catalog & email PDF',
  successTitle: 'Your catalog is downloading',
  successEmailNote: 'We have also emailed the PDF to your inbox.',
  successEmailFailed: 'Your download started, but we could not send the email. Use the button below to download again or contact us.',
  successManual: 'Download PDF again',
  successWhatsapp: 'Chat on WhatsApp',
  successAnother: 'Submit another request',
} as const
